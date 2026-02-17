import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

const mockGetConversations = vi.fn()

vi.mock('../actions/get-conversations', () => ({
  getConversations: (...args: unknown[]) => mockGetConversations(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useConversations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns conversations from server', async () => {
    mockGetConversations.mockResolvedValue({
      data: [
        {
          clientId: 'client-a',
          clientName: 'Alice',
          clientEmail: 'alice@test.com',
          lastMessage: 'Hi',
          lastMessageAt: '2026-02-17T10:00:00Z',
          unreadCount: 1,
        },
      ],
      error: null,
    })

    const { useConversations } = await import('./use-conversations')
    const { result } = renderHook(() => useConversations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].clientName).toBe('Alice')
    expect(result.current.data?.[0].unreadCount).toBe(1)
  })

  it('throws when getConversations returns an error', async () => {
    mockGetConversations.mockResolvedValue({
      data: null,
      error: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
    })

    const { useConversations } = await import('./use-conversations')
    const { result } = renderHook(() => useConversations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Unauthorized')
  })

  it('returns empty array when no conversations', async () => {
    mockGetConversations.mockResolvedValue({ data: [], error: null })

    const { useConversations } = await import('./use-conversations')
    const { result } = renderHook(() => useConversations(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})
