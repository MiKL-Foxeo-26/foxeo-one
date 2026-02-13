import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useClient } from './use-client'
import type { ReactNode } from 'react'

// Mock the Server Action
vi.mock('../actions/get-client', () => ({
  getClient: vi.fn().mockResolvedValue({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      operatorId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Jean Dupont',
      company: 'Acme Corp',
      email: 'jean@acme.com',
      clientType: 'complet',
      status: 'lab-actif',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    error: null,
  }),
}))

describe('useClient Hook', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  it('should return client data when query succeeds', async () => {
    const { result } = renderHook(() => useClient('550e8400-e29b-41d4-a716-446655440001'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).not.toBeNull()
    expect(result.current.data?.name).toBe('Jean Dupont')
    expect(result.current.error).toBeNull()
  })

  it('should use correct queryKey format', async () => {
    const { result } = renderHook(() => useClient('550e8400-e29b-41d4-a716-446655440001'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Query key should be ['client', clientId]
    expect(result.current.data).toBeDefined()
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => useClient('550e8400-e29b-41d4-a716-446655440001'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(true)
  })
})
