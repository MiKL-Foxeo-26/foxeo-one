import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useClients } from './use-clients'
import * as getClientsModule from '../actions/get-clients'

// Create a wrapper with QueryClient
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

describe('useClients', () => {
  it('should return query state shape', () => {
    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should use initialData when provided', () => {
    const initialData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Client',
        company: 'Test Company',
        clientType: 'complet' as const,
        status: 'active' as const,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]

    const { result } = renderHook(() => useClients(undefined, initialData), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(initialData)
  })

  it('should handle server action errors', async () => {
    vi.spyOn(getClientsModule, 'getClients').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR',
      },
    })

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toContain('Database error')
  })

  it('should return data when successful', async () => {
    const mockData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Client',
        company: 'Test Company',
        clientType: 'complet' as const,
        status: 'active' as const,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]

    vi.spyOn(getClientsModule, 'getClients').mockResolvedValue({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
  })
})
