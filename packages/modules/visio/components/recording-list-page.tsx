'use client'

import type { MeetingRecording } from '../types/recording.types'
import { RecordingList } from './recording-list'

interface RecordingListPageProps {
  recordings: MeetingRecording[]
}

export function RecordingListPage({ recordings }: RecordingListPageProps) {
  return <RecordingList recordings={recordings} />
}
