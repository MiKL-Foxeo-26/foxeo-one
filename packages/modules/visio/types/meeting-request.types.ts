import { z } from 'zod'

// ============================================================
// Domain types (camelCase — post-boundary transformation)
// ============================================================

export const MeetingRequestStatusValues = ['pending', 'accepted', 'rejected', 'completed'] as const
export type MeetingRequestStatus = typeof MeetingRequestStatusValues[number]

export interface MeetingRequest {
  id: string
  clientId: string
  operatorId: string
  requestedSlots: string[]
  selectedSlot: string | null
  status: MeetingRequestStatus
  message: string | null
  meetingId: string | null
  createdAt: string
  updatedAt: string
}

// ============================================================
// DB types (snake_case — raw Supabase rows)
// ============================================================

export interface MeetingRequestDB {
  id: string
  client_id: string
  operator_id: string
  requested_slots: string[]
  selected_slot: string | null
  status: MeetingRequestStatus
  message: string | null
  meeting_id: string | null
  created_at: string
  updated_at: string
}

// ============================================================
// Action input types & Zod schemas
// ============================================================

export const RequestMeetingInput = z.object({
  operatorId: z.string().uuid('operatorId invalide'),
  requestedSlots: z.array(z.string().datetime({ offset: true })).min(1, 'Au moins un créneau requis').max(3, 'Maximum 3 créneaux'),
  message: z.string().max(500, 'Message trop long').optional(),
})
export type RequestMeetingInput = z.infer<typeof RequestMeetingInput>

export const AcceptMeetingRequestInput = z.object({
  requestId: z.string().uuid('requestId invalide'),
  selectedSlot: z.string().datetime({ offset: true }),
})
export type AcceptMeetingRequestInput = z.infer<typeof AcceptMeetingRequestInput>

export const RejectMeetingRequestInput = z.object({
  requestId: z.string().uuid('requestId invalide'),
  reason: z.string().max(500, 'Raison trop longue').optional(),
})
export type RejectMeetingRequestInput = z.infer<typeof RejectMeetingRequestInput>

export const GetMeetingRequestsInput = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'completed']).optional(),
})
export type GetMeetingRequestsInput = z.infer<typeof GetMeetingRequestsInput>
