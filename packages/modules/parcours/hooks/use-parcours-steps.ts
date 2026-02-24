'use client'

import { useQuery } from '@tanstack/react-query'
import { getParcours } from '../actions/get-parcours'
import type { ParcoursStep } from '../types/parcours.types'

/**
 * Fetches parcours steps for a given parcoursId.
 * Requires clientId to fetch the parent parcours (RLS-filtered by owner).
 */
export function useParcoursSteps(parcoursId: string, clientId: string) {
  return useQuery<ParcoursStep[]>({
    queryKey: ['parcours-steps', parcoursId],
    queryFn: async () => {
      const { data, error } = await getParcours({ clientId })
      if (error) throw new Error(error.message)
      if (!data || data.id !== parcoursId) return []
      return data.steps
    },
    enabled: Boolean(parcoursId) && Boolean(clientId),
    staleTime: 30_000,
  })
}
