import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useParcourTemplates } from './use-parcours-templates'
import * as getParcoursTemplatesModule from '../actions/get-parcours-templates'

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

describe('useParcourTemplates', () => {
  it('should return query state shape', () => {
    const { result } = renderHook(() => useParcourTemplates(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should handle server action errors', async () => {
    vi.spyOn(getParcoursTemplatesModule, 'getParcoursTemplates').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR',
      },
    })

    const { result } = renderHook(() => useParcourTemplates(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain('Database error')
  })

  it('should return data when successful', async () => {
    const now = new Date().toISOString()
    const mockData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        operatorId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Parcours Complet',
        description: 'Description',
        parcoursType: 'complet' as const,
        stages: [{ key: 'vision', name: 'Vision', description: 'Desc', order: 1 }],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]

    vi.spyOn(getParcoursTemplatesModule, 'getParcoursTemplates').mockResolvedValue({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(() => useParcourTemplates(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
  })

  it('should return empty array when no templates', async () => {
    vi.spyOn(getParcoursTemplatesModule, 'getParcoursTemplates').mockResolvedValue({
      data: [],
      error: null,
    })

    const { result } = renderHook(() => useParcourTemplates(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })
})
