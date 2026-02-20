'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFolder } from '../actions/create-folder'
import { renameFolder } from '../actions/rename-folder'
import { deleteFolder } from '../actions/delete-folder'
import { moveDocument } from '../actions/move-document'
import type { CreateFolderInput, RenameFolderInput, DeleteFolderInput, MoveDocumentInput } from '../types/folder.types'

export function useFolderMutations(clientId: string) {
  const queryClient = useQueryClient()

  const invalidateFolders = () =>
    queryClient.invalidateQueries({ queryKey: ['folders', clientId] })

  const invalidateDocuments = () =>
    queryClient.invalidateQueries({ queryKey: ['documents', clientId] })

  const invalidateAll = () => {
    invalidateFolders()
    invalidateDocuments()
  }

  const createMutation = useMutation({
    mutationFn: async (input: CreateFolderInput) => {
      const result = await createFolder(input)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => invalidateFolders(),
  })

  const renameMutation = useMutation({
    mutationFn: async (input: RenameFolderInput) => {
      const result = await renameFolder(input)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => invalidateFolders(),
  })

  const deleteMutation = useMutation({
    mutationFn: async (input: DeleteFolderInput) => {
      const result = await deleteFolder(input)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => invalidateAll(),
  })

  const moveMutation = useMutation({
    mutationFn: async (input: MoveDocumentInput) => {
      const result = await moveDocument(input)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => invalidateAll(),
  })

  return {
    useCreateFolder: createMutation,
    useRenameFolder: renameMutation,
    useDeleteFolder: deleteMutation,
    useMoveDocument: moveMutation,
  }
}
