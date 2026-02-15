import { describe, it, expect, vi } from 'vitest'
import { deleteClientNote } from './delete-client-note'

const validNoteUuid = '550e8400-e29b-41d4-a716-446655440002'
const validOperatorUuid = '550e8400-e29b-41d4-a716-446655440001'

const mockEq2 = vi.fn()
const mockEq1 = vi.fn(() => ({ eq: mockEq2 }))
const mockDelete = vi.fn(() => ({ eq: mockEq1 }))
const mockFrom = vi.fn(() => ({ delete: mockDelete }))

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

describe('deleteClientNote', () => {
  it('should delete note successfully', async () => {
    mockEq2.mockResolvedValueOnce({
      error: null,
    })

    const result = await deleteClientNote(validNoteUuid)

    expect(result.error).toBeNull()
    expect(result.data).toBeUndefined()
    expect(mockFrom).toHaveBeenCalledWith('client_notes')
  })

  it('should return error for invalid UUID', async () => {
    const result = await deleteClientNote('not-a-uuid')

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })
})
