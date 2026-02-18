'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDocumentUrl } from '../actions/get-document-url'
import type { Document } from '../types/document.types'

const MARKDOWN_TYPES = ['md', 'markdown']
// Refetch before signed URL expires (30min < 1h TTL)
const SIGNED_URL_STALE_TIME = 30 * 60 * 1000

export function useDocumentViewer(documentId: string) {
  const queryClient = useQueryClient()

  // Fetch document + signed URL
  const documentQuery = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data, error } = await getDocumentUrl({ documentId })
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!documentId,
    staleTime: SIGNED_URL_STALE_TIME,
    refetchOnWindowFocus: true,
  })

  const document: Document | null = documentQuery.data?.document ?? null
  const contentUrl: string | null = documentQuery.data?.url ?? null
  const fileType = document?.fileType.toLowerCase() ?? ''

  // Fetch Markdown content when document is a Markdown file
  const markdownQuery = useQuery({
    queryKey: ['document-markdown', documentId],
    queryFn: async () => {
      if (!contentUrl) throw new Error('No content URL')
      const response = await fetch(contentUrl)
      if (!response.ok) throw new Error('Failed to fetch markdown content')
      return response.text()
    },
    enabled: !!contentUrl && MARKDOWN_TYPES.includes(fileType),
    staleTime: SIGNED_URL_STALE_TIME,
  })

  return {
    document,
    contentUrl,
    markdownContent: markdownQuery.data ?? null,
    isPending: documentQuery.isPending,
    isMarkdownLoading: markdownQuery.isPending && MARKDOWN_TYPES.includes(fileType),
    error: documentQuery.error,
    markdownError: markdownQuery.error,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] })
      queryClient.invalidateQueries({ queryKey: ['document-markdown', documentId] })
    },
  }
}
