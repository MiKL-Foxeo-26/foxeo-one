import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

const mockGetDocuments = vi.fn()
const mockUploadDocument = vi.fn()
const mockDeleteDocument = vi.fn()

vi.mock('../actions/get-documents', () => ({
  getDocuments: (...args: unknown[]) => mockGetDocuments(...args),
}))

vi.mock('../actions/upload-document', () => ({
  uploadDocument: (...args: unknown[]) => mockUploadDocument(...args),
}))

vi.mock('../actions/delete-document', () => ({
  deleteDocument: (...args: unknown[]) => mockDeleteDocument(...args),
}))

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads documents for clientId', async () => {
    mockGetDocuments.mockResolvedValue({
      data: [
        {
          id: 'doc-1',
          clientId: CLIENT_ID,
          operatorId: 'op-id',
          name: 'test.pdf',
          filePath: 'path/to/test.pdf',
          fileType: 'pdf',
          fileSize: 1024,
          folderId: null,
          tags: [],
          visibility: 'private',
          uploadedBy: 'operator',
          createdAt: '2026-02-18T10:00:00Z',
          updatedAt: '2026-02-18T10:00:00Z',
        },
      ],
      error: null,
    })

    const { useDocuments } = await import('./use-documents')
    const { result } = renderHook(() => useDocuments(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0].name).toBe('test.pdf')
  })

  it('returns empty array when no documents', async () => {
    mockGetDocuments.mockResolvedValue({ data: [], error: null })

    const { useDocuments } = await import('./use-documents')
    const { result } = renderHook(() => useDocuments(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.documents).toEqual([])
  })

  it('does not fetch when clientId is empty', async () => {
    const { useDocuments } = await import('./use-documents')
    renderHook(() => useDocuments(''), {
      wrapper: createWrapper(),
    })

    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetDocuments).not.toHaveBeenCalled()
  })

  it('throws error when getDocuments fails', async () => {
    mockGetDocuments.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'DB_ERROR' },
    })

    const { useDocuments } = await import('./use-documents')
    const { result } = renderHook(() => useDocuments(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error?.message).toBe('DB error')
  })
})
