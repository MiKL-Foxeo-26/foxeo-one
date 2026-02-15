import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createReminder } from './create-reminder'

// Mock Supabase
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  select: mockSelect,
}))

const validOperatorUuid = '550e8400-e29b-41d4-a716-446655440001'

vi.mock('@foxeo/supabase', () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: mockFrom,
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: validOperatorUuid } },
        error: null,
      })),
    },
  })),
}))

describe('createReminder', () => {
  const validClientUuid = '550e8400-e29b-41d4-a716-446655440000'
  const validReminderUuid = '550e8400-e29b-41d4-a716-446655440002'

  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ single: mockSingle })
  })

  it('should create a reminder successfully', async () => {
    const mockReminderDB = {
      id: validReminderUuid,
      operator_id: validOperatorUuid,
      client_id: validClientUuid,
      title: 'Call client',
      description: 'Discuss project',
      due_date: '2026-02-20T10:00:00Z',
      completed: false,
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    }

    mockSingle.mockResolvedValue({
      data: mockReminderDB,
      error: null,
    })

    const result = await createReminder({
      clientId: validClientUuid,
      title: 'Call client',
      description: 'Discuss project',
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(result.error).toBeNull()
    expect(result.data).toEqual({
      id: validReminderUuid,
      operatorId: validOperatorUuid,
      clientId: validClientUuid,
      title: 'Call client',
      description: 'Discuss project',
      dueDate: '2026-02-20T10:00:00Z',
      completed: false,
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-15T10:00:00Z',
    })

    expect(mockFrom).toHaveBeenCalledWith('reminders')
    expect(mockInsert).toHaveBeenCalledWith({
      operator_id: validOperatorUuid,
      client_id: validClientUuid,
      title: 'Call client',
      description: 'Discuss project',
      due_date: '2026-02-20T10:00:00Z',
      completed: false,
    })
  })

  it('should create reminder without clientId', async () => {
    const mockReminderDB = {
      id: validReminderUuid,
      operator_id: validOperatorUuid,
      client_id: null,
      title: 'General task',
      description: null,
      due_date: '2026-02-20T10:00:00Z',
      completed: false,
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T10:00:00Z',
    }

    mockSingle.mockResolvedValue({
      data: mockReminderDB,
      error: null,
    })

    const result = await createReminder({
      title: 'General task',
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(result.error).toBeNull()
    expect(result.data?.clientId).toBeNull()
    expect(mockInsert).toHaveBeenCalledWith({
      operator_id: validOperatorUuid,
      client_id: null,
      title: 'General task',
      description: null,
      due_date: '2026-02-20T10:00:00Z',
      completed: false,
    })
  })

  it('should return error if insert fails', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error', code: '500' },
    })

    const result = await createReminder({
      title: 'Test',
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
    expect(result.error?.code).toBe('CREATE_FAILED')
  })

  it('should return validation error for empty title', async () => {
    const result = await createReminder({
      title: '',
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })

  it('should return validation error for title longer than 200 chars', async () => {
    const result = await createReminder({
      title: 'a'.repeat(201),
      dueDate: '2026-02-20T10:00:00Z',
    })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })

  it('should return validation error for invalid date', async () => {
    const result = await createReminder({
      title: 'Test',
      dueDate: 'invalid-date',
    })

    expect(result.data).toBeNull()
    expect(result.error).toBeTruthy()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })
})
