'use client'

import { useQuery } from '@tanstack/react-query'
import { getParcours } from '../actions/get-parcours'
import type { ParcoursWithSteps } from '../types/parcours.types'

export function useParcours(clientId: string) {
  return useQuery<ParcoursWithSteps | null>({
    queryKey: ['parcours', clientId],
    queryFn: async () => {
      const { data, error } = await getParcours({ clientId })
      if (error) throw new Error(error.message)
      return data
    },
    enabled: Boolean(clientId),
    staleTime: 30_000,
  })
}
