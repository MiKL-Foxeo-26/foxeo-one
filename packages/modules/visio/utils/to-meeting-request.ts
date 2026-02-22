import type { MeetingRequest, MeetingRequestDB } from '../types/meeting-request.types'

export function toMeetingRequest(db: MeetingRequestDB): MeetingRequest {
  return {
    id: db.id,
    clientId: db.client_id,
    operatorId: db.operator_id,
    requestedSlots: db.requested_slots,
    selectedSlot: db.selected_slot,
    status: db.status,
    message: db.message,
    meetingId: db.meeting_id,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}
