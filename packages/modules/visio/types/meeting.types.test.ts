import { describe, it, expect } from 'vitest'
import {
  CreateMeetingInput,
  StartMeetingInput,
  EndMeetingInput,
  GetMeetingsInput,
  MeetingStatusValues,
  MeetingTypeValues,
} from './meeting.types'

const VALID_UUID = '00000000-0000-0000-0000-000000000001'
const VALID_UUID_2 = '00000000-0000-0000-0000-000000000002'

describe('CreateMeetingInput', () => {
  it('parses valid input with required fields', () => {
    const result = CreateMeetingInput.safeParse({
      clientId: VALID_UUID,
      operatorId: VALID_UUID_2,
      title: 'Réunion de suivi',
    })
    expect(result.success).toBe(true)
  })

  it('parses valid input with optional fields', () => {
    const result = CreateMeetingInput.safeParse({
      clientId: VALID_UUID,
      operatorId: VALID_UUID_2,
      title: 'Réunion de suivi',
      description: 'Discussion avancement projet',
      scheduledAt: '2026-03-01T10:00:00.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const result = CreateMeetingInput.safeParse({
      clientId: VALID_UUID,
      operatorId: VALID_UUID_2,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID clientId', () => {
    const result = CreateMeetingInput.safeParse({
      clientId: 'not-a-uuid',
      operatorId: VALID_UUID_2,
      title: 'Test',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty title', () => {
    const result = CreateMeetingInput.safeParse({
      clientId: VALID_UUID,
      operatorId: VALID_UUID_2,
      title: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('StartMeetingInput', () => {
  it('parses valid meetingId', () => {
    const result = StartMeetingInput.safeParse({ meetingId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID meetingId', () => {
    const result = StartMeetingInput.safeParse({ meetingId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })
})

describe('EndMeetingInput', () => {
  it('parses valid meetingId', () => {
    const result = EndMeetingInput.safeParse({ meetingId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects missing meetingId', () => {
    const result = EndMeetingInput.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('GetMeetingsInput', () => {
  it('parses clientId filter', () => {
    const result = GetMeetingsInput.safeParse({ clientId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('parses empty object (no filters)', () => {
    const result = GetMeetingsInput.safeParse({})
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID clientId', () => {
    const result = GetMeetingsInput.safeParse({ clientId: 'bad' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = GetMeetingsInput.safeParse({ status: 'unknown_status' })
    expect(result.success).toBe(false)
  })
})

describe('MeetingStatusValues', () => {
  it('contains all expected statuses', () => {
    expect(MeetingStatusValues).toContain('scheduled')
    expect(MeetingStatusValues).toContain('in_progress')
    expect(MeetingStatusValues).toContain('completed')
    expect(MeetingStatusValues).toContain('cancelled')
  })
})

describe('MeetingTypeValues', () => {
  it('contains all expected types', () => {
    expect(MeetingTypeValues).toContain('standard')
    expect(MeetingTypeValues).toContain('prospect')
    expect(MeetingTypeValues).toContain('onboarding')
    expect(MeetingTypeValues).toContain('support')
  })
})
