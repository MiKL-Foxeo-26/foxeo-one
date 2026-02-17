'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { UpgradeClientInput as UpgradeClientInputSchema } from '../types/crm.types'
import type { UpgradeClientInput } from '../types/crm.types'

export async function upgradeClient(
  input: UpgradeClientInput
): Promise<ActionResponse<{ success: true }>> {
  try {
    const supabase = await createServerSupabaseClient()

    // Auth check
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    // Server-side validation
    const parsed = UpgradeClientInputSchema.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Données invalides'
      return errorResponse(firstError, 'VALIDATION_ERROR', parsed.error.issues)
    }

    const { clientId, targetType, parcoursConfig, modules } = parsed.data

    // Get operator record
    const { data: operator, error: opError } = await supabase
      .from('operators')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (opError || !operator) {
      return errorResponse('Opérateur non trouvé', 'NOT_FOUND')
    }

    const operatorId = operator.id

    // Load client and verify ownership
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, client_type, status, operator_id')
      .eq('id', clientId)
      .eq('operator_id', operatorId)
      .single()

    if (clientError || !client) {
      console.error('[CRM:UPGRADE_CLIENT] Client lookup error:', clientError)
      return errorResponse('Client introuvable', 'NOT_FOUND')
    }

    // Only ponctuel clients can be upgraded
    if (client.client_type !== 'ponctuel') {
      return errorResponse(
        'Seuls les clients Ponctuel peuvent être upgradés',
        'VALIDATION_ERROR'
      )
    }

    // Only active clients can be upgraded
    if (client.status !== 'active') {
      return errorResponse(
        'Seuls les clients actifs peuvent être upgradés',
        'VALIDATION_ERROR'
      )
    }

    if (targetType === 'complet') {
      return await upgradeToLab({ supabase, clientId, operatorId, parcoursConfig })
    }

    return await upgradeToOne({ supabase, clientId, operatorId, modules })
  } catch (error) {
    console.error('[CRM:UPGRADE_CLIENT] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}

// ─── Internal helpers ──────────────────────────────────────────────────────

type SupabaseClient = Awaited<ReturnType<typeof import('@foxeo/supabase').createServerSupabaseClient>>

async function upgradeToLab({
  supabase,
  clientId,
  operatorId,
  parcoursConfig,
}: {
  supabase: SupabaseClient
  clientId: string
  operatorId: string
  parcoursConfig?: { templateId: string; activeStages: { key: string; active: boolean }[] }
}): Promise<ActionResponse<{ success: true }>> {
  if (!parcoursConfig?.templateId) {
    return errorResponse(
      'La configuration parcours (templateId) est requise pour upgrader vers Lab',
      'VALIDATION_ERROR'
    )
  }

  const { templateId, activeStages } = parcoursConfig

  // Check for existing active parcours (prevent duplicates)
  const { data: existingParcours } = await supabase
    .from('parcours')
    .select('id')
    .eq('client_id', clientId)
    .eq('status', 'en_cours')
    .limit(1)
    .maybeSingle()

  if (existingParcours) {
    return errorResponse(
      'Ce client a déjà un parcours en cours',
      'DUPLICATE_PARCOURS'
    )
  }

  // Validate template exists
  const { data: template, error: templateError } = await supabase
    .from('parcours_templates')
    .select('name')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    return errorResponse('Template de parcours introuvable', 'NOT_FOUND')
  }

  // 1. Update client_type
  const { error: clientUpdateError } = await supabase
    .from('clients')
    .update({ client_type: 'complet' })
    .eq('id', clientId)
    .eq('operator_id', operatorId)

  if (clientUpdateError) {
    console.error('[CRM:UPGRADE_CLIENT] client_type update error:', clientUpdateError)
    return errorResponse('Erreur lors de la mise à jour du type client', 'DATABASE_ERROR', clientUpdateError)
  }

  // 2. Insert parcours (réutilise la logique de Story 2.4)
  const activeStagesWithStatus = activeStages.map((stage) => ({
    key: stage.key,
    active: stage.active,
    status: stage.active ? 'pending' : 'skipped',
  }))

  const { data: parcours, error: parcoursError } = await supabase
    .from('parcours')
    .insert({
      client_id: clientId,
      template_id: templateId,
      operator_id: operatorId,
      active_stages: activeStagesWithStatus,
      status: 'en_cours',
    })
    .select()
    .single()

  if (parcoursError || !parcours) {
    console.error('[CRM:UPGRADE_CLIENT] parcours insert error:', parcoursError)
    return errorResponse('Erreur lors de la création du parcours', 'DATABASE_ERROR', parcoursError)
  }

  // 3. Update client_configs
  const { error: configError } = await supabase
    .from('client_configs')
    .update({
      dashboard_type: 'lab',
      parcours_config: {
        parcoursId: parcours.id,
        templateId,
        name: template.name,
      },
    })
    .eq('client_id', clientId)

  if (configError) {
    console.error('[CRM:UPGRADE_CLIENT] config update error:', configError)
    // Non-bloquant
  }

  // 4. Activity log
  await supabase.from('activity_logs').insert({
    actor_type: 'operator',
    actor_id: operatorId,
    action: 'client_upgraded',
    entity_type: 'client',
    entity_id: clientId,
    metadata: { targetType: 'complet', templateId },
  })

  revalidatePath('/crm')
  revalidatePath(`/crm/clients/${clientId}`)

  return successResponse({ success: true })
}

async function upgradeToOne({
  supabase,
  clientId,
  operatorId,
  modules,
}: {
  supabase: SupabaseClient
  clientId: string
  operatorId: string
  modules?: string[]
}): Promise<ActionResponse<{ success: true }>> {
  const activeModules = modules && modules.length > 0 ? modules : ['core-dashboard']

  // 1. Update client_type
  const { error: clientUpdateError } = await supabase
    .from('clients')
    .update({ client_type: 'direct_one' })
    .eq('id', clientId)
    .eq('operator_id', operatorId)

  if (clientUpdateError) {
    console.error('[CRM:UPGRADE_CLIENT] client_type update error:', clientUpdateError)
    return errorResponse('Erreur lors de la mise à jour du type client', 'DATABASE_ERROR', clientUpdateError)
  }

  // 2. Update client_configs
  const { error: configError } = await supabase
    .from('client_configs')
    .update({
      dashboard_type: 'one',
      active_modules: activeModules,
    })
    .eq('client_id', clientId)

  if (configError) {
    console.error('[CRM:UPGRADE_CLIENT] config update error:', configError)
    // Non-bloquant
  }

  // 3. Activity log
  await supabase.from('activity_logs').insert({
    actor_type: 'operator',
    actor_id: operatorId,
    action: 'client_upgraded',
    entity_type: 'client',
    entity_id: clientId,
    metadata: { targetType: 'direct_one', activeModules },
  })

  revalidatePath('/crm')
  revalidatePath(`/crm/clients/${clientId}`)

  return successResponse({ success: true })
}
