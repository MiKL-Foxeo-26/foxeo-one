import { z } from 'zod'

// ============================================================
// Domain types (camelCase — post-boundary transformation)
// ============================================================

export const MeetingStatusValues = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const
export type MeetingStatus = typeof MeetingStatusValues[number]

export interface Meeting {
  id: string
  clientId: string
  operatorId: string
  title: string
  description: string | null
  scheduledAt: string | null
  startedAt: string | null
  endedAt: string | null
  durationSeconds: number | null
  sessionId: string | null
  status: MeetingStatus
  recordingUrl: string | null
  transcriptUrl: string | null
  createdAt: string
  updatedAt: string
}

// ============================================================
// DB types (snake_case — raw Supabase rows)
// ============================================================

export interface MeetingDB {
  id: string
  client_id: string
  operator_id: string
  title: string
  description: string | null
  scheduled_at: string | null
  started_at: string | null
  ended_at: string | null
  duration_seconds: number | null
  session_id: string | null
  status: MeetingStatus
  recording_url: string | null
  transcript_url: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Action input types & Zod schemas
// ============================================================

export const CreateMeetingInput = z.object({
  clientId: z.string().uuid('clientId invalide'),
  operatorId: z.string().uuid('operatorId invalide'),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  scheduledAt: z.string().datetime({ offset: true }).optional(),
})
export type CreateMeetingInput = z.infer<typeof CreateMeetingInput>

export const StartMeetingInput = z.object({
  meetingId: z.string().uuid('meetingId invalide'),
})
export type StartMeetingInput = z.infer<typeof StartMeetingInput>

export const EndMeetingInput = z.object({
  meetingId: z.string().uuid('meetingId invalide'),
})
export type EndMeetingInput = z.infer<typeof EndMeetingInput>

export const GetMeetingsInput = z.object({
  clientId: z.string().uuid('clientId invalide').optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
})
export type GetMeetingsInput = z.infer<typeof GetMeetingsInput>

export const GetOpenViduTokenInput = z.object({
  meetingId: z.string().uuid('meetingId invalide'),
})
export type GetOpenViduTokenInput = z.infer<typeof GetOpenViduTokenInput>

export interface OpenViduTokenResult {
  token: string
  sessionId: string
}
