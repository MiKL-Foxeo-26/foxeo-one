import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useUnreadCount } from './use-unread-count'

vi.mock('../actions/get-unread-count', () => ({
  getUnreadCount: vi.fn().mockResolvedValue({
    data: { count: 3 },
    error: null,
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useUnreadCount', () => {
  it('should return unread count', async () => {
    const { result } = renderHook(() => useUnreadCount('user-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBe(3)
  })

  it('should be disabled when recipientId is empty', () => {
    const { result } = renderHook(() => useUnreadCount(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })
})
