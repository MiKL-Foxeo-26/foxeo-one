import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReminders, useCreateReminder, useToggleReminderComplete } from './use-reminders'
import type { ReactNode } from 'react'

const mockGetReminders = vi.fn()
const mockCreateReminder = vi.fn()
const mockToggleReminderComplete = vi.fn()

vi.mock('../actions/get-reminders', () => ({
  getReminders: (...args: unknown[]) => mockGetReminders(...args),
}))

vi.mock('../actions/create-reminder', () => ({
  createReminder: (...args: unknown[]) => mockCreateReminder(...args),
}))

vi.mock('../actions/toggle-reminder-complete', () => ({
  toggleReminderComplete: (...args: unknown[]) => mockToggleReminderComplete(...args),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useReminders', () => {
  it('should fetch reminders successfully', async () => {
    const mockReminders = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        operatorId: '550e8400-e29b-41d4-a716-446655440001',
        clientId: null,
        title: 'Test reminder',
        description: null,
        dueDate: '2026-02-20T10:00:00Z',
        completed: false,
        createdAt: '2026-02-15T10:00:00Z',
        updatedAt: '2026-02-15T10:00:00Z',
      },
    ]

    mockGetReminders.mockResolvedValue({
      data: mockReminders,
      error: null,
    })

    const { result } = renderHook(() => useReminders(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockReminders)
    expect(mockGetReminders).toHaveBeenCalledWith({ filter: 'all', month: undefined, year: undefined })
  })

  it('should fetch reminders with filter', async () => {
    mockGetReminders.mockResolvedValue({
      data: [],
      error: null,
    })

    const { result } = renderHook(() => useReminders({ filter: 'upcoming', month: 2, year: 2026 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetReminders).toHaveBeenCalledWith({ filter: 'upcoming', month: 2, year: 2026 })
  })
})

describe('useCreateReminder', () => {
  it('should create reminder successfully', async () => {
    const newReminder = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      operatorId: '550e8400-e29b-41d4-a716-446655440001',
      clientId: null,
      title: 'New reminder',
      description: null,
      dueDate: '2026-02-20T10:00:00Z',
      completed: false,
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-15T10:00:00Z',
    }

    mockCreateReminder.mockResolvedValue({
      data: newReminder,
      error: null,
    })

    const { result } = renderHook(() => useCreateReminder(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      title: 'New reminder',
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(mockCreateReminder).toHaveBeenCalled()
  })
})

describe('useToggleReminderComplete', () => {
  it('should toggle reminder successfully', async () => {
    const toggledReminder = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      operatorId: '550e8400-e29b-41d4-a716-446655440001',
      clientId: null,
      title: 'Test',
      description: null,
      dueDate: '2026-02-20T10:00:00Z',
      completed: true,
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-15T10:00:00Z',
    }

    mockToggleReminderComplete.mockResolvedValue({
      data: toggledReminder,
      error: null,
    })

    const { result } = renderHook(() => useToggleReminderComplete(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      reminderId: '550e8400-e29b-41d4-a716-446655440002',
    })

    expect(mockToggleReminderComplete).toHaveBeenCalled()
  })
})
