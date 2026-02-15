import { describe, it, expect, vi } from 'vitest'
import { getClientNotes } from './get-client-notes'

const validClientUuid = '550e8400-e29b-41d4-a716-446655440000'
const validOperatorUuid = '550e8400-e29b-41d4-a716-446655440001'

const mockOrder = vi.fn()
const mockEq = vi.fn(() => ({ eq: mockEq, order: mockOrder }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))

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

describe('getClientNotes', () => {
  it('should fetch notes successfully', async () => {
    const mockNotesDB = [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        client_id: validClientUuid,
        operator_id: validOperatorUuid,
        content: 'Note 1',
        created_at: '2026-02-15T12:00:00Z',
        updated_at: '2026-02-15T12:00:00Z',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        client_id: validClientUuid,
        operator_id: validOperatorUuid,
        content: 'Note 2',
        created_at: '2026-02-15T10:00:00Z',
        updated_at: '2026-02-15T10:00:00Z',
      },
    ]

    mockOrder.mockResolvedValue({
      data: mockNotesDB,
      error: null,
    })

    const result = await getClientNotes(validClientUuid)

    expect(result.error).toBeNull()
    expect(result.data).toHaveLength(2)
    expect(result.data?.[0]?.content).toBe('Note 1')
    expect(mockFrom).toHaveBeenCalledWith('client_notes')
  })

  it('should return empty array if no notes', async () => {
    mockOrder.mockResolvedValue({
      data: [],
      error: null,
    })

    const result = await getClientNotes(validClientUuid)

    expect(result.error).toBeNull()
    expect(result.data).toEqual([])
  })
})
