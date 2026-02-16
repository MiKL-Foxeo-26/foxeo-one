import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { usePortfolioStats, useGraduationRate } from './use-portfolio-stats'
import * as getPortfolioStatsModule from '../actions/get-portfolio-stats'
import * as getGraduationRateModule from '../actions/get-graduation-rate'

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

describe('usePortfolioStats', () => {
  it('should return query state shape', () => {
    const { result } = renderHook(() => usePortfolioStats(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should use initialData when provided', () => {
    const initialData = {
      totalClients: 5,
      byStatus: { active: 3, archived: 1, suspended: 1 },
      byType: { complet: 3, directOne: 1, ponctuel: 1 },
      labActive: 1,
      oneActive: 2,
      mrr: { available: false as const, message: 'Module Facturation requis' },
    }

    const { result } = renderHook(() => usePortfolioStats(initialData), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(initialData)
  })

  it('should handle server action errors', async () => {
    vi.spyOn(getPortfolioStatsModule, 'getPortfolioStats').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR',
      },
    })

    const { result } = renderHook(() => usePortfolioStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain('Database error')
  })

  it('should return data when successful', async () => {
    const mockData = {
      totalClients: 10,
      byStatus: { active: 7, archived: 2, suspended: 1 },
      byType: { complet: 5, directOne: 3, ponctuel: 2 },
      labActive: 3,
      oneActive: 4,
      mrr: { available: false as const, message: 'Module Facturation requis' },
    }

    vi.spyOn(getPortfolioStatsModule, 'getPortfolioStats').mockResolvedValue({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(() => usePortfolioStats(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
  })
})

describe('useGraduationRate', () => {
  it('should return query state shape', () => {
    const { result } = renderHook(() => useGraduationRate(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('error')
  })

  it('should use initialData when provided', () => {
    const initialData = {
      percentage: 40,
      graduated: 2,
      totalLabClients: 5,
    }

    const { result } = renderHook(() => useGraduationRate(initialData), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toEqual(initialData)
  })

  it('should handle server action errors', async () => {
    vi.spyOn(getGraduationRateModule, 'getGraduationRate').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'DATABASE_ERROR',
      },
    })

    const { result } = renderHook(() => useGraduationRate(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error?.message).toContain('Database error')
  })
})
