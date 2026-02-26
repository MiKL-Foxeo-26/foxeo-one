import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('../actions/get-client-previous-requests', () => ({
  getClientPreviousRequests: vi.fn(),
}))

vi.mock('../actions/get-client-recent-messages', () => ({
  getClientRecentMessages: vi.fn(),
}))

const { getClientPreviousRequests } = await import(
  '../actions/get-client-previous-requests'
)
const { getClientRecentMessages } = await import(
  '../actions/get-client-recent-messages'
)
const mockGetPreviousRequests = vi.mocked(getClientPreviousRequests)
const mockGetRecentMessages = vi.mocked(getClientRecentMessages)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useClientHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return previous requests and messages when loaded', async () => {
    mockGetPreviousRequests.mockResolvedValue({
      data: [
        {
          id: 'req-0',
          title: 'Brief précédent',
          type: 'brief_lab',
          status: 'approved',
          submittedAt: '2026-01-15T10:00:00Z',
        },
      ],
      error: null,
    })
    mockGetRecentMessages.mockResolvedValue({
      data: [
        {
          id: 'msg-1',
          senderType: 'client',
          content: 'Hello',
          createdAt: '2026-02-20T09:00:00Z',
        },
      ],
      error: null,
    })

    const { useClientHistory } = await import('./use-client-history')
    const { result } = renderHook(
      () => useClientHistory('c-1', 'req-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoadingRequests).toBe(false)
      expect(result.current.isLoadingMessages).toBe(false)
    })

    expect(result.current.previousRequests).toHaveLength(1)
    expect(result.current.previousRequests[0].title).toBe('Brief précédent')
    expect(result.current.recentMessages).toHaveLength(1)
    expect(result.current.recentMessages[0].content).toBe('Hello')
  })

  it('should return empty arrays when no data', async () => {
    mockGetPreviousRequests.mockResolvedValue({
      data: [],
      error: null,
    })
    mockGetRecentMessages.mockResolvedValue({
      data: [],
      error: null,
    })

    const { useClientHistory } = await import('./use-client-history')
    const { result } = renderHook(
      () => useClientHistory('c-1', 'req-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoadingRequests).toBe(false)
    })

    expect(result.current.previousRequests).toHaveLength(0)
    expect(result.current.recentMessages).toHaveLength(0)
    expect(result.current.errorRequests).toBeNull()
    expect(result.current.errorMessages).toBeNull()
  })

  it('should not fetch when clientId is empty', async () => {
    const { useClientHistory } = await import('./use-client-history')
    const { result } = renderHook(
      () => useClientHistory('', 'req-1'),
      { wrapper: createWrapper() }
    )

    expect(result.current.previousRequests).toHaveLength(0)
    expect(result.current.recentMessages).toHaveLength(0)
    expect(mockGetPreviousRequests).not.toHaveBeenCalled()
    expect(mockGetRecentMessages).not.toHaveBeenCalled()
  })

  it('should handle error in previous requests', async () => {
    mockGetPreviousRequests.mockResolvedValue({
      data: null,
      error: { message: 'Erreur DB', code: 'DATABASE_ERROR' },
    })
    mockGetRecentMessages.mockResolvedValue({
      data: [],
      error: null,
    })

    const { useClientHistory } = await import('./use-client-history')
    const { result } = renderHook(
      () => useClientHistory('c-1', 'req-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoadingRequests).toBe(false)
    })

    expect(result.current.errorRequests).not.toBeNull()
    expect(result.current.errorRequests?.message).toBe('Erreur DB')
  })

  it('should handle error in recent messages', async () => {
    mockGetPreviousRequests.mockResolvedValue({
      data: [],
      error: null,
    })
    mockGetRecentMessages.mockResolvedValue({
      data: null,
      error: { message: 'Messages inaccessibles', code: 'DATABASE_ERROR' },
    })

    const { useClientHistory } = await import('./use-client-history')
    const { result } = renderHook(
      () => useClientHistory('c-1', 'req-1'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoadingMessages).toBe(false)
    })

    expect(result.current.errorMessages).not.toBeNull()
    expect(result.current.errorMessages?.message).toBe('Messages inaccessibles')
  })
})
