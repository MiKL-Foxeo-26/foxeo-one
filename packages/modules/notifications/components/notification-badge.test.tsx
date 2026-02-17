import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { NotificationBadge } from './notification-badge'

// Mock hooks
vi.mock('../hooks/use-unread-count', () => ({
  useUnreadCount: vi.fn(() => ({ data: 5, isSuccess: true })),
}))

vi.mock('../hooks/use-notifications-realtime', () => ({
  useNotificationsRealtime: vi.fn(),
}))

vi.mock('../hooks/use-notifications', () => ({
  useNotifications: vi.fn(() => ({
    data: [],
    isPending: false,
  })),
}))

vi.mock('../actions/mark-all-as-read', () => ({
  markAllAsRead: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('NotificationBadge', () => {
  it('should render the bell button', () => {
    render(createElement(NotificationBadge, { recipientId: 'user-1' }), {
      wrapper: createWrapper(),
    })

    expect(screen.getByTestId('notification-badge-button')).toBeDefined()
  })

  it('should show unread count when > 0', () => {
    render(createElement(NotificationBadge, { recipientId: 'user-1' }), {
      wrapper: createWrapper(),
    })

    expect(screen.getByTestId('notification-badge-count')).toBeDefined()
    expect(screen.getByTestId('notification-badge-count').textContent).toBe('5')
  })

  it('should open notification center on click', async () => {
    const user = userEvent.setup()

    render(createElement(NotificationBadge, { recipientId: 'user-1' }), {
      wrapper: createWrapper(),
    })

    await user.click(screen.getByTestId('notification-badge-button'))

    expect(screen.getByTestId('notification-center')).toBeDefined()
  })
})
