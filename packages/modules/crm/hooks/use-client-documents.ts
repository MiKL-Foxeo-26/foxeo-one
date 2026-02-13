import { useQuery } from '@tanstack/react-query'
import { getClientDocuments } from '../actions/get-client-documents'
import type { ClientDocument } from '../types/crm.types'

export function useClientDocuments(clientId: string) {
  return useQuery({
    queryKey: ['client-documents', clientId],
    queryFn: async () => {
      const result = await getClientDocuments(clientId)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: !!clientId,
  })
}
