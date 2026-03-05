import { useQuery } from '@tanstack/react-query'
import { getClientInstance } from '../actions/get-client-instance'

export function useClientInstance(clientId: string, enabled = true) {
  return useQuery({
    queryKey: ['client-instance', clientId],
    queryFn: async () => {
      const result = await getClientInstance(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: !!clientId && enabled,
  })
}
