'use client'

import { useQuery } from '@tanstack/react-query'
import { getFolders } from '../actions/get-folders'

export function useFolders(clientId: string) {
  const foldersQuery = useQuery({
    queryKey: ['folders', clientId],
    queryFn: async () => {
      const { data, error } = await getFolders({ clientId })
      if (error) {
        const err = new Error(error.message) as Error & { code?: string; details?: unknown }
        err.code = error.code
        err.details = error.details
        throw err
      }
      return data ?? []
    },
    enabled: !!clientId,
  })

  return {
    folders: foldersQuery.data ?? [],
    isPending: foldersQuery.isPending,
    isFetching: foldersQuery.isFetching,
    error: foldersQuery.error,
  }
}
