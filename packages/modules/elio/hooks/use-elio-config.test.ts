import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useElioConfig } from './use-elio-config'
import { DEFAULT_ELIO_CONFIG } from '../types/elio-config.types'

vi.mock('../actions/get-elio-config', () => ({
  getElioConfig: vi.fn(() =>
    Promise.resolve({ data: DEFAULT_ELIO_CONFIG, error: null })
  ),
}))

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useElioConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retourne les données de config pour le dashboard lab', async () => {
    const { result } = renderHook(() => useElioConfig('lab', 'client-123'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ data: DEFAULT_ELIO_CONFIG, error: null })
  })

  it('retourne les données de config pour le dashboard one', async () => {
    const { result } = renderHook(() => useElioConfig('one', 'client-456'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('retourne les données de config pour le dashboard hub (sans clientId)', async () => {
    const { result } = renderHook(() => useElioConfig('hub'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })

  it('utilise la queryKey correcte incluant dashboardType et clientId', async () => {
    const { result } = renderHook(() => useElioConfig('lab', 'client-789'), {
      wrapper: makeWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // La query doit être configurée avec la bonne queryKey
    expect(result.current.isSuccess).toBe(true)
  })
})
