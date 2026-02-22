'use client'

import { useQuery } from '@tanstack/react-query'
import { getMeetingRecordings } from '../actions/get-meeting-recordings'
import type { MeetingRecording } from '../types/recording.types'

export function useMeetingRecordings(meetingId: string) {
  return useQuery<MeetingRecording[], Error>({
    queryKey: ['meeting-recordings', meetingId],
    queryFn: async () => {
      const result = await getMeetingRecordings({ meetingId })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
    enabled: !!meetingId,
  })
}
