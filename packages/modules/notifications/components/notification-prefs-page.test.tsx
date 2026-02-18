import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { NotificationPrefsPage } from './notification-prefs-page'

const mockPrefs = [
  {
    id: 'pref-1',
    userType: 'client' as const,
    userId: 'user-1',
    notificationType: 'message' as const,
    channelEmail: true,
    channelInapp: true,
    operatorOverride: false,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'pref-2',
    userType: 'client' as const,
    userId: 'user-1',
    notificationType: 'system' as const,
    channelEmail: true,
    channelInapp: true,
    operatorOverride: false,
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
]

vi.mock('../hooks/use-notification-prefs', () => ({
  useNotificationPrefs: vi.fn(() => ({
    data: mockPrefs,
    isPending: false,
    isSuccess: true,
    updatePref: vi.fn(),
    isUpdating: false,
  })),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('NotificationPrefsPage', () => {
  it('renders the preferences page title', () => {
    render(createElement(NotificationPrefsPage, { userId: 'user-1', userType: 'client' }), {
      wrapper: createWrapper(),
    })

    // The h2 heading contains "Notifications"
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.textContent).toContain('Notifications')
  })

  it('renders toggle rows for loaded preferences', () => {
    render(createElement(NotificationPrefsPage, { userId: 'user-1', userType: 'client' }), {
      wrapper: createWrapper(),
    })

    // Should show rows for message and system prefs
    expect(screen.getByTestId('toggle-email-message')).toBeDefined()
    expect(screen.getByTestId('toggle-inapp-message')).toBeDefined()
  })

  it('shows skeleton when loading', async () => {
    const { useNotificationPrefs } = await import('../hooks/use-notification-prefs')
    const mocked = vi.mocked(useNotificationPrefs)
    mocked.mockReturnValueOnce({
      data: undefined,
      isPending: true,
      isSuccess: false,
      updatePref: vi.fn(),
      isUpdating: false,
    } as ReturnType<typeof useNotificationPrefs>)

    render(createElement(NotificationPrefsPage, { userId: 'user-1', userType: 'client' }), {
      wrapper: createWrapper(),
    })

    expect(screen.getByTestId('prefs-skeleton')).toBeDefined()
  })
})
