'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { ActionResponse } from '@foxeo/types'
import type { ClientListItem } from '../types/crm.types'
import { getClients } from '../actions/get-clients'

export function useClients(
  initialData?: ClientListItem[]
): UseQueryResult<ClientListItem[], Error> {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response: ActionResponse<ClientListItem[]> = await getClients()

      if (response.error) {
        throw new Error(response.error.message)
      }

      return response.data ?? []
    },
    initialData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}
