import { describe, it, expect } from 'vitest'
import {
  MeetingRequestStatusValues,
  RequestMeetingInput,
  AcceptMeetingRequestInput,
  RejectMeetingRequestInput,
  GetMeetingRequestsInput,
} from './meeting-request.types'

describe('MeetingRequestStatusValues', () => {
  it('has correct values', () => {
    expect(MeetingRequestStatusValues).toEqual(['pending', 'accepted', 'rejected', 'completed'])
  })
})

describe('RequestMeetingInput schema', () => {
  it('validates correct input', () => {
    const result = RequestMeetingInput.safeParse({
      operatorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      requestedSlots: ['2026-03-01T10:00:00Z', '2026-03-01T14:00:00Z'],
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty requestedSlots', () => {
    const result = RequestMeetingInput.safeParse({
      operatorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      requestedSlots: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects more than 3 slots', () => {
    const result = RequestMeetingInput.safeParse({
      operatorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      requestedSlots: [
        '2026-03-01T10:00:00Z',
        '2026-03-01T14:00:00Z',
        '2026-03-02T09:00:00Z',
        '2026-03-02T14:00:00Z',
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid UUID', () => {
    const result = RequestMeetingInput.safeParse({
      operatorId: 'not-a-uuid',
      requestedSlots: ['2026-03-01T10:00:00Z'],
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional message', () => {
    const result = RequestMeetingInput.safeParse({
      operatorId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      requestedSlots: ['2026-03-01T10:00:00Z'],
      message: 'Besoin de discuter du projet',
    })
    expect(result.success).toBe(true)
  })
})

describe('AcceptMeetingRequestInput schema', () => {
  it('validates correct input', () => {
    const result = AcceptMeetingRequestInput.safeParse({
      requestId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      selectedSlot: '2026-03-01T10:00:00Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing selectedSlot', () => {
    const result = AcceptMeetingRequestInput.safeParse({
      requestId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    })
    expect(result.success).toBe(false)
  })
})

describe('RejectMeetingRequestInput schema', () => {
  it('validates correct input', () => {
    const result = RejectMeetingRequestInput.safeParse({
      requestId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional reason', () => {
    const result = RejectMeetingRequestInput.safeParse({
      requestId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      reason: 'Pas disponible cette semaine',
    })
    expect(result.success).toBe(true)
  })
})

describe('GetMeetingRequestsInput schema', () => {
  it('validates with no filters', () => {
    const result = GetMeetingRequestsInput.safeParse({})
    expect(result.success).toBe(true)
  })

  it('validates with status filter', () => {
    const result = GetMeetingRequestsInput.safeParse({ status: 'pending' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = GetMeetingRequestsInput.safeParse({ status: 'invalid' })
    expect(result.success).toBe(false)
  })
})
