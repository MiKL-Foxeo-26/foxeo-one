import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { Message } from '../types/chat.types'

// Mock server actions
const mockGetMessages = vi.fn()
const mockSendMessage = vi.fn()

vi.mock('../actions/get-messages', () => ({
  getMessages: (...args: unknown[]) => mockGetMessages(...args),
}))

vi.mock('../actions/send-message', () => ({
  sendMessage: (...args: unknown[]) => mockSendMessage(...args),
}))

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useChatMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads messages for clientId', async () => {
    mockGetMessages.mockResolvedValue({
      data: [
        {
          id: 'msg-1',
          clientId: CLIENT_ID,
          operatorId: 'op-id',
          senderType: 'operator' as const,
          content: 'Hello',
          readAt: null,
          createdAt: '2026-02-17T10:00:00Z',
        },
      ],
      error: null,
    })

    const { useChatMessages } = await import('./use-chat-messages')
    const { result } = renderHook(() => useChatMessages(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0].content).toBe('Hello')
  })

  it('optimistic update — adds message immediately before server response', async () => {
    mockGetMessages.mockResolvedValue({ data: [], error: null })

    // sendMessage resolves after a delay
    mockSendMessage.mockImplementation(
      () =>
        new Promise<{ data: Message; error: null }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  id: 'server-id',
                  clientId: CLIENT_ID,
                  operatorId: 'op-id',
                  senderType: 'operator' as const,
                  content: 'Optimistic',
                  readAt: null,
                  createdAt: new Date().toISOString(),
                },
                error: null,
              }),
            200
          )
        )
    )

    const { useChatMessages } = await import('./use-chat-messages')
    const { result } = renderHook(() => useChatMessages(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    // Wait for initial load
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.messages).toHaveLength(0)

    // Trigger mutation
    await act(async () => {
      result.current.sendMessage({
        clientId: CLIENT_ID,
        operatorId: 'op-id',
        senderType: 'operator',
        content: 'Optimistic',
      })
    })

    // Message should be visible immediately (optimistic update is applied in onMutate)
    await waitFor(() => expect(result.current.messages.length).toBeGreaterThan(0))
    expect(result.current.messages[0].content).toBe('Optimistic')
  })

  it('rollbacks optimistic update on error', async () => {
    mockGetMessages.mockResolvedValue({ data: [], error: null })
    mockSendMessage.mockRejectedValue(new Error('Network error'))

    const { useChatMessages } = await import('./use-chat-messages')
    const { result } = renderHook(() => useChatMessages(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))

    // Trigger mutation (will fail)
    await act(async () => {
      result.current.sendMessage({
        clientId: CLIENT_ID,
        operatorId: 'op-id',
        senderType: 'operator',
        content: 'Doomed',
      })
    })

    // Wait for mutation to fail and rollback
    await waitFor(() => expect(result.current.isSending).toBe(false))
    // After rollback, messages should be back to empty
    expect(result.current.messages).toHaveLength(0)
  })

  it('does not fetch when clientId is empty', async () => {
    const { useChatMessages } = await import('./use-chat-messages')
    const { result } = renderHook(() => useChatMessages(''), {
      wrapper: createWrapper(),
    })

    // Query is disabled, stays in pending but never fires
    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetMessages).not.toHaveBeenCalled()
    expect(result.current.messages).toHaveLength(0)
  })
})
