'use client'

import { useQuery } from '@tanstack/react-query'
import { getElioConfig } from '../actions/get-elio-config'
import type { DashboardType } from '../types/elio.types'

/**
 * Hook résolution config Élio par dashboard_type.
 * - Lab : charge client_configs.elio_config (profil comm, parcours_context, custom_prompts)
 * - One : charge client_configs.elio_config + client_configs.elio_tier + docs modules actifs
 * - Hub : charge la config Hub globale (pas de profil client, config opérateur)
 *
 * Cache TanStack Query : queryKey ['elio-config', dashboardType, clientId]
 */
export function useElioConfig(dashboardType: DashboardType, clientId?: string) {
  return useQuery({
    queryKey: ['elio-config', dashboardType, clientId],
    queryFn: () => getElioConfig(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Toujours actif — Hub charge la config globale, Lab/One la config client
  })
}
