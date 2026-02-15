import { describe, it, expect, vi } from 'vitest'
import { updateClientNote } from './update-client-note'

const validNoteUuid = '550e8400-e29b-41d4-a716-446655440002'
const validOperatorUuid = '550e8400-e29b-41d4-a716-446655440001'

const mockSingle = vi.fn()
const mockSelect = vi.fn(() => ({ single: mockSingle }))
const mockEq = vi.fn(() => ({ eq: mockEq, select: mockSelect }))
const mockUpdate = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ update: mockUpdate }))

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

describe('updateClientNote', () => {
  it('should update note successfully', async () => {
    const mockNoteDB = {
      id: validNoteUuid,
      client_id: '550e8400-e29b-41d4-a716-446655440000',
      operator_id: validOperatorUuid,
      content: 'Updated content',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-15T12:00:00Z',
    }

    mockSingle.mockResolvedValue({
      data: mockNoteDB,
      error: null,
    })

    const result = await updateClientNote({
      noteId: validNoteUuid,
      content: 'Updated content',
    })

    expect(result.error).toBeNull()
    expect(result.data?.content).toBe('Updated content')
    expect(mockUpdate).toHaveBeenCalledWith({ content: 'Updated content' })
  })
})
