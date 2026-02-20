import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

vi.mock('../actions/sync-documents-to-zip', () => ({
  syncDocumentsToZip: vi.fn(),
}))

import { syncDocumentsToZip } from '../actions/sync-documents-to-zip'
import { useSyncDocuments } from './use-sync-documents'

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'

const EMPTY_ZIP_BASE64 = Buffer.from([
  0x50, 0x4b, 0x05, 0x06,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00,
]).toString('base64')

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSyncDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mutation succès appelle l\'action avec le bon clientId', async () => {
    vi.mocked(syncDocumentsToZip).mockResolvedValue({
      data: { zipBase64: EMPTY_ZIP_BASE64, count: 2 },
      error: null,
    })

    const { result } = renderHook(() => useSyncDocuments(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.syncAsync(CLIENT_ID)
    })

    expect(syncDocumentsToZip).toHaveBeenCalledWith(CLIENT_ID)
    expect(syncDocumentsToZip).toHaveBeenCalledTimes(1)
  })

  it('mutation erreur : l\'action est appelée et l\'exception est propagée', async () => {
    vi.mocked(syncDocumentsToZip).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSyncDocuments(CLIENT_ID), {
      wrapper: createWrapper(),
    })

    let caughtError: unknown = null
    await act(async () => {
      try {
        await result.current.syncAsync(CLIENT_ID)
      } catch (e) {
        caughtError = e
      }
    })

    // L'action a bien été appelée
    expect(syncDocumentsToZip).toHaveBeenCalledWith(CLIENT_ID)
    // L'erreur est propagée via mutateAsync
    expect(caughtError).toBeInstanceOf(Error)
    expect((caughtError as Error).message).toBe('Network error')
  })

  it('invalide le cache documents après succès (onSuccess appelé)', async () => {
    const invalidateSpy = vi.fn().mockResolvedValue(undefined)

    vi.mocked(syncDocumentsToZip).mockResolvedValue({
      data: { zipBase64: EMPTY_ZIP_BASE64, count: 0 },
      error: null,
    })

    // Créer un wrapper avec un queryClient dont on peut spy invalidateQueries
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
    queryClient.invalidateQueries = invalidateSpy

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const { result } = renderHook(() => useSyncDocuments(CLIENT_ID), { wrapper })

    await act(async () => {
      await result.current.syncAsync(CLIENT_ID)
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['documents', CLIENT_ID] })
  })
})
