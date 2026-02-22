import { z } from 'zod'

// ============================================================
// Domain types (camelCase — post-boundary transformation)
// ============================================================

export const TranscriptionStatusValues = ['pending', 'processing', 'completed', 'failed'] as const
export type TranscriptionStatus = typeof TranscriptionStatusValues[number]

export interface MeetingRecording {
  id: string
  meetingId: string
  recordingUrl: string
  recordingDurationSeconds: number
  fileSizeBytes: number
  transcriptUrl: string | null
  transcriptionStatus: TranscriptionStatus
  transcriptionLanguage: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// DB types (snake_case — raw Supabase rows)
// ============================================================

export interface MeetingRecordingDB {
  id: string
  meeting_id: string
  recording_url: string
  recording_duration_seconds: number
  file_size_bytes: number
  transcript_url: string | null
  transcription_status: TranscriptionStatus
  transcription_language: string
  created_at: string
  updated_at: string
}

// ============================================================
// Action input types & Zod schemas
// ============================================================

export const GetMeetingRecordingsInput = z.object({
  meetingId: z.string().uuid('meetingId invalide'),
})
export type GetMeetingRecordingsInput = z.infer<typeof GetMeetingRecordingsInput>

export const DownloadRecordingInput = z.object({
  recordingId: z.string().uuid('recordingId invalide'),
})
export type DownloadRecordingInput = z.infer<typeof DownloadRecordingInput>

export const DownloadTranscriptInput = z.object({
  recordingId: z.string().uuid('recordingId invalide'),
})
export type DownloadTranscriptInput = z.infer<typeof DownloadTranscriptInput>
