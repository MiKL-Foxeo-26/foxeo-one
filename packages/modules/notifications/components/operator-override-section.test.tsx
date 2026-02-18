import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { OperatorOverrideSection } from './operator-override-section'

const mockPrefs = [
  {
    id: 'pref-1',
    userType: 'client' as const,
    userId: 'client-1',
    notificationType: 'message' as const,
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

vi.mock('../actions/set-operator-override', () => ({
  setOperatorOverride: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('OperatorOverrideSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the override section title', () => {
    render(
      createElement(OperatorOverrideSection, { clientId: 'client-1' }),
      { wrapper: createWrapper() }
    )

    expect(screen.getByText(/override/i)).toBeDefined()
  })

  it('renders toggle for each preference type', () => {
    render(
      createElement(OperatorOverrideSection, { clientId: 'client-1' }),
      { wrapper: createWrapper() }
    )

    expect(screen.getByTestId('override-toggle-message')).toBeDefined()
  })

  it('calls setOperatorOverride via mutation when toggle clicked', async () => {
    const user = userEvent.setup()

    render(
      createElement(OperatorOverrideSection, { clientId: 'client-1' }),
      { wrapper: createWrapper() }
    )

    await user.click(screen.getByTestId('override-toggle-message'))

    const { setOperatorOverride } = await import('../actions/set-operator-override')
    expect(vi.mocked(setOperatorOverride)).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: 'client-1',
        notificationType: 'message',
      })
    )
  })
})
