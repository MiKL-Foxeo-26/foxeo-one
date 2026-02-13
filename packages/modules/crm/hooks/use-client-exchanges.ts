import { useQuery } from '@tanstack/react-query'
import { getClientExchanges } from '../actions/get-client-exchanges'
import type { ClientExchange } from '../types/crm.types'

export function useClientExchanges(clientId: string) {
  return useQuery({
    queryKey: ['client-exchanges', clientId],
    queryFn: async () => {
      const result = await getClientExchanges(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: !!clientId,
  })
}
