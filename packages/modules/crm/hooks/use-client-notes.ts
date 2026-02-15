import { useQuery } from '@tanstack/react-query'
import { getClientNotes } from '../actions/get-client-notes'
import type { ClientNote } from '../types/crm.types'

export function useClientNotes(clientId: string) {
  return useQuery({
    queryKey: ['client-notes', clientId],
    queryFn: async (): Promise<ClientNote[]> => {
      const result = await getClientNotes(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
    enabled: !!clientId,
  })
}
