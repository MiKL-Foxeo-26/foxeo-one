import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetUser = vi.fn()

// Select chain for finding document
const mockSelectSingle = vi.fn()
const mockSelectEq = vi.fn(() => ({ single: mockSelectSingle }))
const mockSelectAll = vi.fn(() => ({ eq: mockSelectEq }))

// Delete chain
const mockDeleteEq = vi.fn()
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }))

// Storage
const mockStorageRemove = vi.fn()

const mockFrom = vi.fn(() => ({
  select: mockSelectAll,
  delete: mockDelete,
}))

vi.mock('@foxeo/supabase', () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
    storage: {
      from: () => ({
        remove: mockStorageRemove,
      }),
    },
  })),
}))

const DOC_ID = '00000000-0000-0000-0000-000000000099'

describe('deleteDocument Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null })
    mockSelectSingle.mockResolvedValue({
      data: {
        id: DOC_ID,
        file_path: 'op-id/client-id/uuid-test.pdf',
        client_id: 'client-id',
        operator_id: 'op-id',
        name: 'test.pdf',
        file_type: 'pdf',
        file_size: 1024,
        folder_id: null,
        tags: [],
        visibility: 'private',
        uploaded_by: 'operator',
        created_at: '2026-02-18T10:00:00Z',
        updated_at: '2026-02-18T10:00:00Z',
      },
      error: null,
    })
    mockStorageRemove.mockResolvedValue({ error: null })
    mockDeleteEq.mockResolvedValue({ error: null })
  })

  it('returns UNAUTHORIZED when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Not auth' } })

    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('UNAUTHORIZED')
  })

  it('returns VALIDATION_ERROR for invalid documentId', async () => {
    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: 'not-uuid' })

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('VALIDATION_ERROR')
  })

  it('returns NOT_FOUND when document does not exist', async () => {
    mockSelectSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })

    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('NOT_FOUND')
  })

  it('deletes from storage and DB on success', async () => {
    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: DOC_ID })
    expect(mockStorageRemove).toHaveBeenCalledWith(['op-id/client-id/uuid-test.pdf'])
  })

  it('continues DB delete when storage file is already gone (Not Found)', async () => {
    mockStorageRemove.mockResolvedValue({ error: { message: 'Object not found' } })

    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.error).toBeNull()
    expect(result.data).toEqual({ id: DOC_ID })
  })

  it('returns STORAGE_ERROR when storage delete fails with non-recoverable error', async () => {
    mockStorageRemove.mockResolvedValue({ error: { message: 'Permission denied' } })

    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('STORAGE_ERROR')
  })

  it('returns DB_ERROR when delete fails', async () => {
    mockDeleteEq.mockResolvedValue({ error: { message: 'DB error' } })

    const { deleteDocument } = await import('./delete-document')
    const result = await deleteDocument({ documentId: DOC_ID })

    expect(result.data).toBeNull()
    expect(result.error?.code).toBe('DB_ERROR')
  })
})
