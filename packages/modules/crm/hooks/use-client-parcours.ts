import { useQuery } from '@tanstack/react-query'
import { getClientParcours } from '../actions/get-client-parcours'
import type { Parcours } from '../types/crm.types'

export function useClientParcours(clientId: string) {
  return useQuery({
    queryKey: ['client-parcours', clientId],
    queryFn: async (): Promise<Parcours | null> => {
      const result = await getClientParcours(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? null
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}
