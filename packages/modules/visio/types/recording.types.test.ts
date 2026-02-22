import { describe, it, expect } from 'vitest'
import {
  GetMeetingRecordingsInput,
  DownloadRecordingInput,
  DownloadTranscriptInput,
  TranscriptionStatusValues,
} from './recording.types'

const VALID_UUID = '00000000-0000-0000-0000-000000000001'

describe('GetMeetingRecordingsInput', () => {
  it('parses valid meetingId', () => {
    const result = GetMeetingRecordingsInput.safeParse({ meetingId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID meetingId', () => {
    const result = GetMeetingRecordingsInput.safeParse({ meetingId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects missing meetingId', () => {
    const result = GetMeetingRecordingsInput.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('DownloadRecordingInput', () => {
  it('parses valid recordingId', () => {
    const result = DownloadRecordingInput.safeParse({ recordingId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID recordingId', () => {
    const result = DownloadRecordingInput.safeParse({ recordingId: 'bad' })
    expect(result.success).toBe(false)
  })
})

describe('DownloadTranscriptInput', () => {
  it('parses valid recordingId', () => {
    const result = DownloadTranscriptInput.safeParse({ recordingId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID recordingId', () => {
    const result = DownloadTranscriptInput.safeParse({ recordingId: 'bad' })
    expect(result.success).toBe(false)
  })
})

describe('TranscriptionStatusValues', () => {
  it('contains all expected statuses', () => {
    expect(TranscriptionStatusValues).toContain('pending')
    expect(TranscriptionStatusValues).toContain('processing')
    expect(TranscriptionStatusValues).toContain('completed')
    expect(TranscriptionStatusValues).toContain('failed')
  })
})
