import { useQuery } from '@tanstack/react-query'
import { getClient } from '../actions/get-client'
import type { Client } from '../types/crm.types'

interface UseClientOptions {
  initialData?: Client
}

export function useClient(clientId: string, options?: UseClientOptions) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const result = await getClient(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: !!clientId,
    initialData: options?.initialData,
  })
}
