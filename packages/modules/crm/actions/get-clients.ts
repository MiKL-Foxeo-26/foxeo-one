'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { ClientListItem as ClientListItemSchema } from '../types/crm.types'
import type { ClientListItem } from '../types/crm.types'

export async function getClients(): Promise<ActionResponse<ClientListItem[]>> {
  try {
    const supabase = await createServerSupabaseClient()

    // Triple-layer security: verify authenticated user at Server Action level
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    const operatorId = user.id

    const { data, error } = await supabase
      .from('clients')
      .select(
        `
        id,
        operator_id,
        name,
        company,
        email,
        sector,
        client_type,
        status,
        created_at,
        is_pinned,
        deferred_until
      `
      )
      .eq('operator_id', operatorId)
      .order('is_pinned', { ascending: false }) // Pinned first
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('[CRM:GET_CLIENTS] Supabase error:', error)
      return errorResponse(
        'Impossible de charger les clients',
        'DATABASE_ERROR',
        error
      )
    }

    if (!data) {
      return successResponse([])
    }

    // Transform snake_case DB fields to camelCase with Zod validation at boundary
    const clients: ClientListItem[] = data.map((client) =>
      ClientListItemSchema.parse({
        id: client.id,
        name: client.name,
        company: client.company,
        email: client.email ?? undefined,
        sector: client.sector ?? undefined,
        clientType: client.client_type,
        status: client.status,
        createdAt: client.created_at,
        isPinned: client.is_pinned ?? false,
        deferredUntil: client.deferred_until ?? null,
      })
    )

    return successResponse(clients)
  } catch (error) {
    console.error('[CRM:GET_CLIENTS] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
