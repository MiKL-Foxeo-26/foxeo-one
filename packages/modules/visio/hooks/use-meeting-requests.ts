'use client'

import { useQuery } from '@tanstack/react-query'
import { getMeetingRequests } from '../actions/get-meeting-requests'
import type { MeetingRequest, MeetingRequestStatus } from '../types/meeting-request.types'

interface UseMeetingRequestsOptions {
  status?: MeetingRequestStatus
}

export function useMeetingRequests(options: UseMeetingRequestsOptions = {}) {
  return useQuery<MeetingRequest[], Error>({
    queryKey: ['meeting-requests', options.status ?? 'all'],
    queryFn: async () => {
      const result = await getMeetingRequests({ status: options.status })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
  })
}
