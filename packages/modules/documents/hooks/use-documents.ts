'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments } from '../actions/get-documents'
import { uploadDocument } from '../actions/upload-document'
import { deleteDocument } from '../actions/delete-document'
import type { Document } from '../types/document.types'

export function useDocuments(clientId: string) {
  const queryClient = useQueryClient()

  const documentsQuery = useQuery({
    queryKey: ['documents', clientId],
    queryFn: async () => {
      const { data, error } = await getDocuments({ clientId })
      if (error) throw new Error(error.message)
      return data ?? []
    },
    enabled: !!clientId,
  })

  // No optimistic update for uploads — upload involves Storage + DB, too risky for phantom state
  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadDocument(formData),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument({ documentId }),
    onMutate: async (documentId) => {
      await queryClient.cancelQueries({ queryKey: ['documents', clientId] })
      const previous = queryClient.getQueryData<Document[]>(['documents', clientId])

      queryClient.setQueryData<Document[]>(['documents', clientId], (old) =>
        (old ?? []).filter((doc) => doc.id !== documentId)
      )

      return { previous }
    },
    onError: (_err, _documentId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['documents', clientId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', clientId] })
    },
  })

  return {
    documents: documentsQuery.data ?? [],
    isPending: documentsQuery.isPending,
    isFetching: documentsQuery.isFetching,
    error: documentsQuery.error,
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    deleteDocument: deleteMutation.mutate,
    deleteDocumentAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  }
}
