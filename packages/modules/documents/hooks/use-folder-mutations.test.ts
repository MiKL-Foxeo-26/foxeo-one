import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

const mockCreateFolder = vi.fn()
const mockRenameFolder = vi.fn()
const mockDeleteFolder = vi.fn()
const mockMoveDocument = vi.fn()

vi.mock('../actions/create-folder', () => ({ createFolder: (...args: unknown[]) => mockCreateFolder(...args) }))
vi.mock('../actions/rename-folder', () => ({ renameFolder: (...args: unknown[]) => mockRenameFolder(...args) }))
vi.mock('../actions/delete-folder', () => ({ deleteFolder: (...args: unknown[]) => mockDeleteFolder(...args) }))
vi.mock('../actions/move-document', () => ({ moveDocument: (...args: unknown[]) => mockMoveDocument(...args) }))

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'
const UUID = '00000000-0000-0000-0000-000000000001'

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

describe('useFolderMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createFolder mutation succeeds', async () => {
    mockCreateFolder.mockResolvedValue({ data: { id: UUID, name: 'Test' }, error: null })

    const { useFolderMutations } = await import('./use-folder-mutations')
    const { result } = renderHook(() => useFolderMutations(CLIENT_ID), { wrapper: createWrapper() })

    await act(async () => {
      result.current.useCreateFolder.mutate({
        clientId: CLIENT_ID,
        operatorId: UUID,
        name: 'Test',
        parentId: null,
      })
    })

    await waitFor(() => expect(result.current.useCreateFolder.isSuccess).toBe(true))
    expect(mockCreateFolder).toHaveBeenCalledOnce()
  })

  it('renameFolder mutation succeeds', async () => {
    mockRenameFolder.mockResolvedValue({ data: { id: UUID, name: 'Renomme' }, error: null })

    const { useFolderMutations } = await import('./use-folder-mutations')
    const { result } = renderHook(() => useFolderMutations(CLIENT_ID), { wrapper: createWrapper() })

    await act(async () => {
      result.current.useRenameFolder.mutate({ folderId: UUID, name: 'Renomme' })
    })

    await waitFor(() => expect(result.current.useRenameFolder.isSuccess).toBe(true))
    expect(mockRenameFolder).toHaveBeenCalledOnce()
  })

  it('moveDocument mutation succeeds', async () => {
    mockMoveDocument.mockResolvedValue({
      data: { id: UUID, folderId: UUID, name: 'doc.pdf' },
      error: null,
    })

    const { useFolderMutations } = await import('./use-folder-mutations')
    const { result } = renderHook(() => useFolderMutations(CLIENT_ID), { wrapper: createWrapper() })

    await act(async () => {
      result.current.useMoveDocument.mutate({ documentId: UUID, folderId: UUID })
    })

    await waitFor(() => expect(result.current.useMoveDocument.isSuccess).toBe(true))
    expect(mockMoveDocument).toHaveBeenCalledOnce()
  })

  it('deleteFolder mutation throws on error', async () => {
    mockDeleteFolder.mockResolvedValue({
      data: null,
      error: { message: 'Dossier non vide', code: 'FOLDER_NOT_EMPTY' },
    })

    const { useFolderMutations } = await import('./use-folder-mutations')
    const { result } = renderHook(() => useFolderMutations(CLIENT_ID), { wrapper: createWrapper() })

    await act(async () => {
      result.current.useDeleteFolder.mutate({ folderId: UUID })
    })

    await waitFor(() => expect(result.current.useDeleteFolder.isError).toBe(true))
    expect(result.current.useDeleteFolder.error?.message).toBe('Dossier non vide')
  })

  it('createFolder mutation throws on error', async () => {
    mockCreateFolder.mockResolvedValue({
      data: null,
      error: { message: 'DB error', code: 'DB_ERROR' },
    })

    const { useFolderMutations } = await import('./use-folder-mutations')
    const { result } = renderHook(() => useFolderMutations(CLIENT_ID), { wrapper: createWrapper() })

    await act(async () => {
      result.current.useCreateFolder.mutate({
        clientId: CLIENT_ID,
        operatorId: UUID,
        name: 'Test',
        parentId: null,
      })
    })

    await waitFor(() => expect(result.current.useCreateFolder.isError).toBe(true))
  })
})
