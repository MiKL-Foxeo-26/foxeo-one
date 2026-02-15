import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTimePerClient } from './use-time-per-client'
import * as getTimePerClientModule from '../actions/get-time-per-client'

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

describe('useTimePerClient', () => {
  it('should return query state shape', () => {
    const { result } = renderHook(() => useTimePerClient(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should use initialData when provided', () => {
    const initialData = [
      {
        clientId: '550e8400-e29b-41d4-a716-446655440001',
        clientName: 'Alice',
        clientCompany: 'AliceCorp',
        clientType: 'complet' as const,
        messageCount: 10,
        validationCount: 2,
        visioSeconds: 3600,
        totalEstimatedSeconds: 5400,
        lastActivity: '2024-01-20T10:00:00Z',
      },
    ]

    const { result } = renderHook(() => useTimePerClient(initialData), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(initialData)
  })

  it('should handle server action errors', async () => {
    vi.spyOn(getTimePerClientModule, 'getTimePerClient').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR',
      },
    })

    const { result } = renderHook(() => useTimePerClient(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain('Database error')
  })

  it('should return data when successful', async () => {
    const mockData = [
      {
        clientId: '550e8400-e29b-41d4-a716-446655440001',
        clientName: 'Alice',
        clientCompany: 'AliceCorp',
        clientType: 'complet' as const,
        messageCount: 10,
        validationCount: 2,
        visioSeconds: 3600,
        totalEstimatedSeconds: 5400,
        lastActivity: '2024-01-20T10:00:00Z',
      },
    ]

    vi.spyOn(getTimePerClientModule, 'getTimePerClient').mockResolvedValue({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(() => useTimePerClient(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
  })
})
