'use client'

import { useQuery } from '@tanstack/react-query'
import { getMeetings } from '../actions/get-meetings'
import type { Meeting } from '../types/meeting.types'

interface UseMeetingsOptions {
  clientId?: string
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export function useMeetings(options: UseMeetingsOptions) {
  return useQuery<Meeting[], Error>({
    queryKey: ['meetings', options.clientId ?? 'all', options.status ?? 'all'],
    queryFn: async () => {
      const result = await getMeetings(options)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
  })
}
