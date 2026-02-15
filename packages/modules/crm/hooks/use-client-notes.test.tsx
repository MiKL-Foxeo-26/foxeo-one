import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClientNotes } from './use-client-notes'
import type { ReactNode } from 'react'

const mockGetClientNotes = vi.fn()

vi.mock('../actions/get-client-notes', () => ({
  getClientNotes: (...args: unknown[]) => mockGetClientNotes(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useClientNotes', () => {
  it('should fetch client notes successfully', async () => {
    const mockNotes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        clientId: '550e8400-e29b-41d4-a716-446655440000',
        operatorId: '550e8400-e29b-41d4-a716-446655440001',
        content: 'Note 1',
        createdAt: '2026-02-15T10:00:00Z',
        updatedAt: '2026-02-15T10:00:00Z',
      },
    ]

    mockGetClientNotes.mockResolvedValue({
      data: mockNotes,
      error: null,
    })

    const { result } = renderHook(() => useClientNotes('550e8400-e29b-41d4-a716-446655440000'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockNotes)
  })

  it('should not fetch if clientId is empty', () => {
    const { result } = renderHook(() => useClientNotes(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.isFetching).toBe(false)
    expect(mockGetClientNotes).not.toHaveBeenCalled()
  })
})
