import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const testClientId = '550e8400-e29b-41d4-a716-446655440001'

// Mock the server action
const mockGetClientParcours = vi.fn()

vi.mock('../actions/get-client-parcours', () => ({
  getClientParcours: (...args: unknown[]) => mockGetClientParcours(...args),
}))

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

describe('useClientParcours', () => {
  it('should return query state shape', async () => {
    mockGetClientParcours.mockResolvedValue({ data: null, error: null })

    const { useClientParcours } = await import('./use-client-parcours')
    const { result } = renderHook(() => useClientParcours(testClientId), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should return null when no parcours exists', async () => {
    mockGetClientParcours.mockResolvedValue({ data: null, error: null })

    const { useClientParcours } = await import('./use-client-parcours')
    const { result } = renderHook(() => useClientParcours(testClientId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeNull()
  })

  it('should return parcours data with camelCase', async () => {
    const now = new Date().toISOString()
    mockGetClientParcours.mockResolvedValue({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        clientId: testClientId,
        templateId: '550e8400-e29b-41d4-a716-446655440002',
        operatorId: '550e8400-e29b-41d4-a716-446655440000',
        activeStages: [{ key: 'vision', active: true, status: 'pending' }],
        status: 'en_cours',
        startedAt: now,
        suspendedAt: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      },
      error: null,
    })

    const { useClientParcours } = await import('./use-client-parcours')
    const { result } = renderHook(() => useClientParcours(testClientId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).not.toBeNull()
    expect(result.current.data?.clientId).toBe(testClientId)
    expect(result.current.data?.status).toBe('en_cours')
    expect(result.current.data?.activeStages).toHaveLength(1)
  })

  it('should not fetch when clientId is empty', async () => {
    const { useClientParcours } = await import('./use-client-parcours')
    const { result } = renderHook(() => useClientParcours(''), {
      wrapper: createWrapper(),
    })

    // Should remain in pending state since query is disabled
    expect(result.current.isPending).toBe(true)
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('should handle errors', async () => {
    mockGetClientParcours.mockResolvedValue({
      data: null,
      error: { message: 'Permission denied', code: 'UNAUTHORIZED' },
    })

    const { useClientParcours } = await import('./use-client-parcours')
    const { result } = renderHook(() => useClientParcours(testClientId), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain('Permission denied')
  })
})
