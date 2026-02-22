import { describe, it, expect } from 'vitest'
import { toMeetingRequest } from './to-meeting-request'
import type { MeetingRequestDB } from '../types/meeting-request.types'

describe('toMeetingRequest', () => {
  it('transforms DB row to domain object', () => {
    const db: MeetingRequestDB = {
      id: 'abc-123',
      client_id: 'client-1',
      operator_id: 'op-1',
      requested_slots: ['2026-03-01T10:00:00Z', '2026-03-01T14:00:00Z'],
      selected_slot: '2026-03-01T10:00:00Z',
      status: 'accepted',
      message: 'Hello',
      meeting_id: 'meeting-1',
      created_at: '2026-02-20T10:00:00Z',
      updated_at: '2026-02-20T10:00:00Z',
    }

    const result = toMeetingRequest(db)

    expect(result).toEqual({
      id: 'abc-123',
      clientId: 'client-1',
      operatorId: 'op-1',
      requestedSlots: ['2026-03-01T10:00:00Z', '2026-03-01T14:00:00Z'],
      selectedSlot: '2026-03-01T10:00:00Z',
      status: 'accepted',
      message: 'Hello',
      meetingId: 'meeting-1',
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-02-20T10:00:00Z',
    })
  })

  it('handles nullable fields', () => {
    const db: MeetingRequestDB = {
      id: 'abc-456',
      client_id: 'client-2',
      operator_id: 'op-1',
      requested_slots: ['2026-03-01T10:00:00Z'],
      selected_slot: null,
      status: 'pending',
      message: null,
      meeting_id: null,
      created_at: '2026-02-20T10:00:00Z',
      updated_at: '2026-02-20T10:00:00Z',
    }

    const result = toMeetingRequest(db)

    expect(result.selectedSlot).toBeNull()
    expect(result.message).toBeNull()
    expect(result.meetingId).toBeNull()
  })
})
