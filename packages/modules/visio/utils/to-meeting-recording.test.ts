import { describe, it, expect } from 'vitest'
import { toMeetingRecording } from './to-meeting-recording'
import type { MeetingRecordingDB } from '../types/recording.types'

const MEETING_ID = '00000000-0000-0000-0000-000000000001'
const RECORDING_ID = '00000000-0000-0000-0000-000000000002'

const mockDB: MeetingRecordingDB = {
  id: RECORDING_ID,
  meeting_id: MEETING_ID,
  recording_url: 'session-abc/rec-123.mp4',
  recording_duration_seconds: 3600,
  file_size_bytes: 104857600,
  transcript_url: null,
  transcription_status: 'pending',
  transcription_language: 'fr',
  created_at: '2026-03-01T10:00:00.000Z',
  updated_at: '2026-03-01T10:00:00.000Z',
}

describe('toMeetingRecording', () => {
  it('maps snake_case DB fields to camelCase domain fields', () => {
    const recording = toMeetingRecording(mockDB)
    expect(recording.id).toBe(RECORDING_ID)
    expect(recording.meetingId).toBe(MEETING_ID)
    expect(recording.recordingUrl).toBe('session-abc/rec-123.mp4')
    expect(recording.recordingDurationSeconds).toBe(3600)
    expect(recording.fileSizeBytes).toBe(104857600)
    expect(recording.transcriptUrl).toBeNull()
    expect(recording.transcriptionStatus).toBe('pending')
    expect(recording.transcriptionLanguage).toBe('fr')
    expect(recording.createdAt).toBe('2026-03-01T10:00:00.000Z')
    expect(recording.updatedAt).toBe('2026-03-01T10:00:00.000Z')
  })

  it('maps completed recording with transcript', () => {
    const completedDB: MeetingRecordingDB = {
      ...mockDB,
      transcript_url: 'rec-123.srt',
      transcription_status: 'completed',
    }
    const recording = toMeetingRecording(completedDB)
    expect(recording.transcriptUrl).toBe('rec-123.srt')
    expect(recording.transcriptionStatus).toBe('completed')
  })
})
