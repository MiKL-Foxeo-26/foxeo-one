'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { PortfolioStats as PortfolioStatsSchema } from '../types/crm.types'
import type { PortfolioStats } from '../types/crm.types'

export async function getPortfolioStats(): Promise<ActionResponse<PortfolioStats>> {
  try {
    const supabase = await createServerSupabaseClient()

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
      .select('id, client_type, status')
      .eq('operator_id', operatorId)

    if (error) {
      console.error('[CRM:GET_STATS] Supabase error:', error)
      return errorResponse(
        'Impossible de charger les statistiques',
        'DATABASE_ERROR',
        error
      )
    }

    const clients = data ?? []

    // Aggregate by status
    const byStatus = {
      active: 0,
      inactive: 0,
      suspended: 0,
    }

    for (const client of clients) {
      if (client.status === 'lab-actif' || client.status === 'one-actif') {
        byStatus.active++
      } else if (client.status === 'inactif') {
        byStatus.inactive++
      } else if (client.status === 'suspendu') {
        byStatus.suspended++
      }
    }

    // Aggregate by type
    const byType = {
      complet: 0,
      directOne: 0,
      ponctuel: 0,
    }

    for (const client of clients) {
      if (client.client_type === 'complet') {
        byType.complet++
      } else if (client.client_type === 'direct-one') {
        byType.directOne++
      } else if (client.client_type === 'ponctuel') {
        byType.ponctuel++
      }
    }

    // Lab / One active counts
    const labActive = clients.filter(
      (c) => c.status === 'lab-actif'
    ).length

    const oneActive = clients.filter(
      (c) => c.status === 'one-actif'
    ).length

    const stats = PortfolioStatsSchema.parse({
      totalClients: clients.length,
      byStatus,
      byType,
      labActive,
      oneActive,
      mrr: { available: false, message: 'Module Facturation requis' },
    })

    return successResponse(stats)
  } catch (error) {
    console.error('[CRM:GET_STATS] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
