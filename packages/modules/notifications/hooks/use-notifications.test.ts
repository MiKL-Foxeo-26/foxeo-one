import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useNotifications } from './use-notifications'

vi.mock('../actions/get-notifications', () => ({
  getNotifications: vi.fn().mockResolvedValue({
    data: [
      {
        id: 'n-1',
        recipientType: 'operator',
        recipientId: 'user-1',
        type: 'message',
        title: 'Test',
        body: null,
        link: null,
        readAt: null,
        createdAt: '2026-02-17T10:00:00Z',
      },
    ],
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

describe('useNotifications', () => {
  it('should return notifications data', async () => {
    const { result } = renderHook(() => useNotifications('user-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0]?.title).toBe('Test')
  })

  it('should be disabled when recipientId is empty', () => {
    const { result } = renderHook(() => useNotifications(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })
})
