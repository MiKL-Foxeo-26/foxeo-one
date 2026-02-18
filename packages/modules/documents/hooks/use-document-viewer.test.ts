import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

const mockGetDocumentUrl = vi.fn()

vi.mock('../actions/get-document-url', () => ({
  getDocumentUrl: (...args: unknown[]) => mockGetDocumentUrl(...args),
}))

const DOC_ID = '00000000-0000-0000-0000-000000000001'

const mockDocumentData = {
  url: 'https://storage.example.com/signed/doc.md?token=abc',
  document: {
    id: DOC_ID,
    clientId: 'client-1',
    operatorId: 'op-1',
    name: 'guide.md',
    filePath: 'op-1/client-1/guide.md',
    fileType: 'md',
    fileSize: 2048,
    folderId: null,
    tags: [],
    visibility: 'private',
    uploadedBy: 'operator',
    createdAt: '2026-02-18T10:00:00.000Z',
    updatedAt: '2026-02-18T10:00:00.000Z',
  },
}

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

describe('useDocumentViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads document and signed URL', async () => {
    mockGetDocumentUrl.mockResolvedValue({ data: mockDocumentData, error: null })

    const { useDocumentViewer } = await import('./use-document-viewer')
    const { result } = renderHook(() => useDocumentViewer(DOC_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.document?.name).toBe('guide.md')
    expect(result.current.contentUrl).toContain('signed')
  })

  it('returns null document when pending', async () => {
    mockGetDocumentUrl.mockResolvedValue({ data: mockDocumentData, error: null })

    const { useDocumentViewer } = await import('./use-document-viewer')
    const { result } = renderHook(() => useDocumentViewer(DOC_ID), {
      wrapper: createWrapper(),
    })

    // Initially pending
    expect(result.current.isPending).toBe(true)
    expect(result.current.document).toBeNull()
  })

  it('does not fetch when documentId is empty', async () => {
    const { useDocumentViewer } = await import('./use-document-viewer')
    renderHook(() => useDocumentViewer(''), {
      wrapper: createWrapper(),
    })

    await new Promise((r) => setTimeout(r, 50))
    expect(mockGetDocumentUrl).not.toHaveBeenCalled()
  })

  it('sets error when getDocumentUrl fails', async () => {
    mockGetDocumentUrl.mockResolvedValue({
      data: null,
      error: { message: 'Not found', code: 'NOT_FOUND' },
    })

    const { useDocumentViewer } = await import('./use-document-viewer')
    const { result } = renderHook(() => useDocumentViewer(DOC_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.error).not.toBeNull())
    expect(result.current.error?.message).toBe('Not found')
  })

  it('returns PDF document without markdown content', async () => {
    const pdfData = {
      url: 'https://storage.example.com/signed/rapport.pdf',
      document: { ...mockDocumentData.document, fileType: 'pdf', name: 'rapport.pdf' },
    }
    mockGetDocumentUrl.mockResolvedValue({ data: pdfData, error: null })

    const { useDocumentViewer } = await import('./use-document-viewer')
    const { result } = renderHook(() => useDocumentViewer(DOC_ID), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.document?.fileType).toBe('pdf')
    expect(result.current.markdownContent).toBeNull()
  })
})
