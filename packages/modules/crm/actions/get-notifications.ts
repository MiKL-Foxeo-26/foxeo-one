'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import type { Notification } from '../types/crm.types'

const PAGE_SIZE = 20

export async function getNotifications(
  offset: number = 0
): Promise<ActionResponse<Notification[]>> {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('id, operator_id, type, title, message, entity_type, entity_id, read, created_at')
      .eq('operator_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      console.error('[CRM:GET_NOTIFICATIONS] Supabase error:', error)
      return errorResponse(
        'Impossible de charger les notifications',
        'DATABASE_ERROR',
        error
      )
    }

    if (!data) {
      return successResponse([])
    }

    // Transform snake_case → camelCase
    const notifications: Notification[] = data.map((n) => ({
      id: n.id,
      operatorId: n.operator_id,
      type: n.type as Notification['type'],
      title: n.title,
      message: n.message,
      entityType: n.entity_type,
      entityId: n.entity_id,
      read: n.read,
      createdAt: n.created_at,
    }))

    return successResponse(notifications)
  } catch (error) {
    console.error('[CRM:GET_NOTIFICATIONS] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
