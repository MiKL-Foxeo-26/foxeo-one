import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

const mockGetFolders = vi.fn()

vi.mock('../actions/get-folders', () => ({
  getFolders: (...args: unknown[]) => mockGetFolders(...args),
}))

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useFolders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads folders for clientId', async () => {
    mockGetFolders.mockResolvedValue({
      data: [
        {
          id: 'folder-1',
          clientId: CLIENT_ID,
          operatorId: 'op-id',
          name: 'Contrats',
          parentId: null,
          createdAt: '2026-02-20T10:00:00Z',
        },
      ],
      error: null,
    })

    const { useFolders } = await import('./use-folders')
    const { result } = renderHook(() => useFolders(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.folders).toHaveLength(1)
    expect(result.current.folders[0].name).toBe('Contrats')
  })

  it('returns empty array when no folders', async () => {
    mockGetFolders.mockResolvedValue({ data: [], error: null })

    const { useFolders } = await import('./use-folders')
    const { result } = renderHook(() => useFolders(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.folders).toEqual([])
  })

  it('does not fetch when clientId is empty', async () => {
    const { useFolders } = await import('./use-folders')
    renderHook(() => useFolders(''), { wrapper: createWrapper() })
    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetFolders).not.toHaveBeenCalled()
  })

  it('throws error when getFolders fails', async () => {
    mockGetFolders.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'DB_ERROR' },
    })

    const { useFolders } = await import('./use-folders')
    const { result } = renderHook(() => useFolders(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error?.message).toBe('DB error')
  })
})
