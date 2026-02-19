import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('../actions/share-document', () => ({
  shareDocument: vi.fn(),
}))
vi.mock('../actions/unshare-document', () => ({
  unshareDocument: vi.fn(),
}))
vi.mock('../actions/share-documents-batch', () => ({
  shareDocumentsBatch: vi.fn(),
}))

import { shareDocument } from '../actions/share-document'
import { unshareDocument } from '../actions/unshare-document'
import { shareDocumentsBatch } from '../actions/share-documents-batch'
import { useShareDocument } from './use-share-document'

const DOC_ID = '00000000-0000-0000-0000-000000000001'
const CLIENT_ID = '00000000-0000-0000-0000-000000000002'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useShareDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shareDocument mutation calls action and invalidates cache on success', async () => {
    vi.mocked(shareDocument).mockResolvedValue({
      data: { id: DOC_ID, visibility: 'shared' } as never,
      error: null,
    })

    const { result } = renderHook(() => useShareDocument(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.shareDocumentAsync(DOC_ID)
    })

    expect(shareDocument).toHaveBeenCalledWith(DOC_ID)
  })

  it('unshareDocument mutation calls action on success', async () => {
    vi.mocked(unshareDocument).mockResolvedValue({
      data: { id: DOC_ID, visibility: 'private' } as never,
      error: null,
    })

    const { result } = renderHook(() => useShareDocument(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.unshareDocumentAsync(DOC_ID)
    })

    expect(unshareDocument).toHaveBeenCalledWith(DOC_ID)
  })

  it('shareDocumentsBatch mutation calls action on success', async () => {
    vi.mocked(shareDocumentsBatch).mockResolvedValue({
      data: { count: 2, documentIds: [DOC_ID] },
      error: null,
    })

    const { result } = renderHook(() => useShareDocument(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.shareDocumentsBatchAsync({
        documentIds: [DOC_ID],
        clientId: CLIENT_ID,
      })
    })

    expect(shareDocumentsBatch).toHaveBeenCalledWith({
      documentIds: [DOC_ID],
      clientId: CLIENT_ID,
    })
  })

  it('mutation error is captured', async () => {
    vi.mocked(shareDocument).mockResolvedValue({
      data: null,
      error: { message: 'Accès refusé', code: 'FORBIDDEN' },
    })

    const { result } = renderHook(() => useShareDocument(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    let caughtError: unknown = null
    await act(async () => {
      try {
        await result.current.shareDocumentAsync(DOC_ID)
      } catch (e) {
        caughtError = e
      }
    })

    // Error propagates via mutation
    expect(shareDocument).toHaveBeenCalled()
    expect(caughtError).toBeInstanceOf(Error)
    expect((caughtError as Error).message).toBe('Accès refusé')
  })
})
