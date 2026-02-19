'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shareDocument } from '../actions/share-document'
import { unshareDocument } from '../actions/unshare-document'
import { shareDocumentsBatch } from '../actions/share-documents-batch'
import type { ShareDocumentsBatchInput } from '../types/document.types'

export function useShareDocument(clientId: string) {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['documents', clientId] })

  const shareMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const result = await shareDocument(documentId)
      if (result.error) throw new Error(result.error.message)
      return result
    },
    onSuccess: () => invalidate(),
  })

  const unshareMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const result = await unshareDocument(documentId)
      if (result.error) throw new Error(result.error.message)
      return result
    },
    onSuccess: () => invalidate(),
  })

  const batchMutation = useMutation({
    mutationFn: async (input: ShareDocumentsBatchInput) => {
      const result = await shareDocumentsBatch(input)
      if (result.error) throw new Error(result.error.message)
      return result
    },
    onSuccess: () => invalidate(),
  })

  return {
    // Share
    share: shareMutation.mutate,
    shareDocumentAsync: shareMutation.mutateAsync,
    isSharing: shareMutation.isPending,
    shareError: shareMutation.error,

    // Unshare
    unshare: unshareMutation.mutate,
    unshareDocumentAsync: unshareMutation.mutateAsync,
    isUnsharing: unshareMutation.isPending,
    unshareError: unshareMutation.error,

    // Batch
    shareBatch: batchMutation.mutate,
    shareDocumentsBatchAsync: batchMutation.mutateAsync,
    isBatchSharing: batchMutation.isPending,
    batchError: batchMutation.error,
  }
}
