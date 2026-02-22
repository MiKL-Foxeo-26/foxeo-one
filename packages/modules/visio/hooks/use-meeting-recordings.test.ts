import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const mockGetMeetingRecordings = vi.fn()

vi.mock('../actions/get-meeting-recordings', () => ({
  getMeetingRecordings: mockGetMeetingRecordings,
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'
const RECORDING_ID = '00000000-0000-0000-0000-000000000002'

const mockRecording = {
  id: RECORDING_ID,
  meetingId: MEETING_ID,
  recordingUrl: 'session-abc/rec-123.mp4',
  recordingDurationSeconds: 3600,
  fileSizeBytes: 104857600,
  transcriptUrl: null,
  transcriptionStatus: 'pending' as const,
  transcriptionLanguage: 'fr',
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-03-01T10:00:00.000Z',
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useMeetingRecordings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetMeetingRecordings.mockResolvedValue({ data: [mockRecording], error: null })
  })

  it('returns recordings list on success', async () => {
    const { useMeetingRecordings } = await import('./use-meeting-recordings')
    const { result } = renderHook(() => useMeetingRecordings(MEETING_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0]?.recordingUrl).toBe('session-abc/rec-123.mp4')
  })

  it('calls getMeetingRecordings with meetingId', async () => {
    const { useMeetingRecordings } = await import('./use-meeting-recordings')
    renderHook(() => useMeetingRecordings(MEETING_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(mockGetMeetingRecordings).toHaveBeenCalledWith({ meetingId: MEETING_ID }))
  })

  it('returns empty array when no recordings found', async () => {
    mockGetMeetingRecordings.mockResolvedValue({ data: [], error: null })

    const { useMeetingRecordings } = await import('./use-meeting-recordings')
    const { result } = renderHook(() => useMeetingRecordings(MEETING_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })

  it('returns undefined data on error', async () => {
    mockGetMeetingRecordings.mockResolvedValue({ data: null, error: { message: 'Error', code: 'DB_ERROR' } })

    const { useMeetingRecordings } = await import('./use-meeting-recordings')
    const { result } = renderHook(() => useMeetingRecordings(MEETING_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
})
