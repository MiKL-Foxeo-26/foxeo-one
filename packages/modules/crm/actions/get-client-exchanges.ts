'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { ClientExchange as ClientExchangeSchema } from '../types/crm.types'
import type { ClientExchange } from '../types/crm.types'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getClientExchanges(
  clientId: string
): Promise<ActionResponse<ClientExchange[]>> {
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

    // Check if messages table exists
    const { error: tableCheckError } = await supabase
      .from('messages')
      .select('id')
      .limit(1)

    // If table doesn't exist yet (Epic 3), return empty array
    if (tableCheckError && tableCheckError.code === '42P01') {
      return successResponse([])
    }

    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        client_id,
        type,
        content,
        created_at
      `
      )
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[CRM:GET_CLIENT_EXCHANGES] Supabase error:', error)
      return errorResponse(
        'Impossible de charger les échanges',
        'DATABASE_ERROR',
        error
      )
    }

    if (!data) {
      return successResponse([])
    }

    // Transform snake_case DB fields to camelCase with Zod validation
    const exchanges: ClientExchange[] = data.map((exchange) =>
      ClientExchangeSchema.parse({
        id: exchange.id,
        clientId: exchange.client_id,
        type: exchange.type,
        content: exchange.content,
        createdAt: exchange.created_at,
      })
    )

    return successResponse(exchanges)
  } catch (error) {
    console.error('[CRM:GET_CLIENT_EXCHANGES] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
