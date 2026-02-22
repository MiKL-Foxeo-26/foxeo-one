import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const mockGetOpenViduToken = vi.fn()

vi.mock('../actions/get-openvidu-token', () => ({
  getOpenViduToken: mockGetOpenViduToken,
}))

const mockSessionConnect = vi.fn()
const mockSessionDisconnect = vi.fn()
const mockSessionOn = vi.fn()
const mockSessionPublish = vi.fn()
const mockInitPublisherAsync = vi.fn()
const mockInitSession = vi.fn()

vi.mock('openvidu-browser', () => ({
  OpenVidu: vi.fn().mockImplementation(() => ({
    initSession: mockInitSession,
    initPublisherAsync: mockInitPublisherAsync,
  })),
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000003'

describe('useOpenVidu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetOpenViduToken.mockResolvedValue({
      data: { token: 'test-token', sessionId: `session-${MEETING_ID}` },
      error: null,
    })

    const mockSession = {
      connect: mockSessionConnect,
      disconnect: mockSessionDisconnect,
      on: mockSessionOn,
      publish: mockSessionPublish,
    }
    mockInitSession.mockReturnValue(mockSession)
    mockSessionConnect.mockResolvedValue(undefined)

    const mockPublisher = { stream: { streamId: 'pub-stream' } }
    mockInitPublisherAsync.mockResolvedValue(mockPublisher)
  })

  it('initializes with disconnected status', async () => {
    const { useOpenVidu } = await import('./use-openvidu')
    const { result } = renderHook(() => useOpenVidu(MEETING_ID))

    expect(result.current.status).toBe('disconnected')
    expect(result.current.session).toBeNull()
    expect(result.current.publisher).toBeNull()
    expect(result.current.subscribers).toEqual([])
  })

  it('transitions to connecting then connected on connect()', async () => {
    const { useOpenVidu } = await import('./use-openvidu')
    const { result } = renderHook(() => useOpenVidu(MEETING_ID))

    await act(async () => {
      await result.current.connect()
    })

    expect(result.current.status).toBe('connected')
    expect(result.current.session).not.toBeNull()
    expect(result.current.publisher).not.toBeNull()
  })

  it('calls getOpenViduToken with meetingId', async () => {
    const { useOpenVidu } = await import('./use-openvidu')
    const { result } = renderHook(() => useOpenVidu(MEETING_ID))

    await act(async () => {
      await result.current.connect()
    })

    expect(mockGetOpenViduToken).toHaveBeenCalledWith({ meetingId: MEETING_ID })
  })

  it('disconnects and resets state on disconnect()', async () => {
    const { useOpenVidu } = await import('./use-openvidu')
    const { result } = renderHook(() => useOpenVidu(MEETING_ID))

    await act(async () => {
      await result.current.connect()
    })

    act(() => {
      result.current.disconnect()
    })

    expect(result.current.status).toBe('disconnected')
    expect(result.current.session).toBeNull()
    expect(result.current.publisher).toBeNull()
    expect(result.current.subscribers).toEqual([])
    expect(mockSessionDisconnect).toHaveBeenCalled()
  })

  it('sets error status when token fetch fails', async () => {
    mockGetOpenViduToken.mockResolvedValue({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    })

    const { useOpenVidu } = await import('./use-openvidu')
    const { result } = renderHook(() => useOpenVidu(MEETING_ID))

    await act(async () => {
      await result.current.connect()
    })

    expect(result.current.status).toBe('error')
  })
})
