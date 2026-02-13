'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { ActivityLog as ActivityLogSchema } from '../types/crm.types'
import type { ActivityLog } from '../types/crm.types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const PAGE_SIZE = 20

export async function getActivityLogs(
  clientId: string,
  offset: number = 0
): Promise<ActionResponse<ActivityLog[]>> {
  try {
    if (!clientId || !UUID_REGEX.test(clientId)) {
      return errorResponse('Identifiant client invalide', 'INVALID_INPUT')
    }

    const supabase = await createServerSupabaseClient()

    // Triple-layer security: verify authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .select(
        `
        id,
        client_id,
        event_type,
        event_data,
        description,
        created_at
      `
      )
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE)

    if (error) {
      console.error('[CRM:GET_ACTIVITY_LOGS] Supabase error:', error)
      return errorResponse(
        'Impossible de charger l\'historique',
        'DATABASE_ERROR',
        error
      )
    }

    if (!data) {
      return successResponse([])
    }

    // Transform snake_case DB fields to camelCase with Zod validation
    const logs: ActivityLog[] = data.map((log) =>
      ActivityLogSchema.parse({
        id: log.id,
        clientId: log.client_id,
        eventType: log.event_type,
        eventData: log.event_data ?? undefined,
        description: log.description,
        createdAt: log.created_at,
      })
    )

    return successResponse(logs)
  } catch (error) {
    console.error('[CRM:GET_ACTIVITY_LOGS] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
