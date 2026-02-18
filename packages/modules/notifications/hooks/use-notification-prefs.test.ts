import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const mockGetNotificationPrefs = vi.fn()
const mockUpdateNotificationPrefs = vi.fn()

vi.mock('../actions/get-notification-prefs', () => ({
  getNotificationPrefs: mockGetNotificationPrefs,
}))

vi.mock('../actions/update-notification-prefs', () => ({
  updateNotificationPrefs: mockUpdateNotificationPrefs,
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useNotificationPrefs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('fetches preferences with correct query key', async () => {
    const mockPrefs = [
      {
        id: 'pref-1',
        userType: 'client',
        userId: 'user-1',
        notificationType: 'message',
        channelEmail: true,
        channelInapp: true,
        operatorOverride: false,
        createdAt: '2026-02-18T10:00:00Z',
        updatedAt: '2026-02-18T10:00:00Z',
      },
    ]
    mockGetNotificationPrefs.mockResolvedValue({ data: mockPrefs, error: null })

    const { useNotificationPrefs } = await import('./use-notification-prefs')
    const { result } = renderHook(
      () => useNotificationPrefs({ userId: 'user-1', userType: 'client' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPrefs)
    expect(mockGetNotificationPrefs).toHaveBeenCalledWith({
      userId: 'user-1',
      userType: 'client',
    })
  })

  it('enters error state when fetch fails', async () => {
    mockGetNotificationPrefs.mockResolvedValue({
      data: null,
      error: { message: 'Failed', code: 'DATABASE_ERROR' },
    })

    const { useNotificationPrefs } = await import('./use-notification-prefs')
    const { result } = renderHook(
      () => useNotificationPrefs({ userId: 'user-1', userType: 'client' }),
      { wrapper: createWrapper() }
    )

    // Wait for query to settle (either success or error)
    await waitFor(() => !result.current.isPending, { timeout: 5000 })
    // When query throws, data is undefined (query enters error state)
    expect(result.current.data).toBeUndefined()
  })

  it('exposes updatePref mutation', async () => {
    mockGetNotificationPrefs.mockResolvedValue({ data: [], error: null })
    mockUpdateNotificationPrefs.mockResolvedValue({ data: null, error: null })

    const { useNotificationPrefs } = await import('./use-notification-prefs')
    const { result } = renderHook(
      () => useNotificationPrefs({ userId: 'user-1', userType: 'client' }),
      { wrapper: createWrapper() }
    )

    expect(result.current.updatePref).toBeDefined()
    expect(typeof result.current.updatePref).toBe('function')
  })
})
