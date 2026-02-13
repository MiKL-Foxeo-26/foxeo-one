import { useInfiniteQuery } from '@tanstack/react-query'
import { getActivityLogs } from '../actions/get-activity-logs'

const PAGE_SIZE = 20

export function useClientActivityLogs(clientId: string) {
  return useInfiniteQuery({
    queryKey: ['activity-logs', clientId],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getActivityLogs(clientId, pageParam)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE + 1) return undefined
      return allPages.length * PAGE_SIZE
    },
    enabled: !!clientId,
  })
}
