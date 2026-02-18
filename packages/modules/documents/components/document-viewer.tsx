'use client'

import { useEffect, useState } from 'react'
import { DocumentIcon } from './document-icon'
import { DocumentMetadataPreview } from './document-metadata-preview'
import { DocumentViewerSkeleton } from './document-viewer-skeleton'
import type { Document } from '../types/document.types'

const VIEWABLE_IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'svg']
const MARKDOWN_TYPES = ['md', 'markdown']
const PDF_TYPES = ['pdf']

interface DocumentViewerProps {
  document: Document | null
  contentUrl: string | null
  markdownHtml: string | null
  isPending: boolean
  onDownload: () => void
  isDownloading?: boolean
}

export function DocumentViewer({
  document,
  contentUrl,
  markdownHtml,
  isPending,
  onDownload,
  isDownloading = false,
}: DocumentViewerProps) {
  const [imageError, setImageError] = useState(false)

  // Reset image error when document changes
  useEffect(() => {
    setImageError(false)
  }, [document?.id])

  if (isPending || !document) {
    return <DocumentViewerSkeleton />
  }

  const fileType = document.fileType.toLowerCase()

  // Markdown — render HTML
  if (MARKDOWN_TYPES.includes(fileType) && markdownHtml) {
    return (
      <div data-testid="document-viewer-markdown" className="w-full">
        <div
          className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border/50 p-6"
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      </div>
    )
  }

  // PDF — iframe viewer
  if (PDF_TYPES.includes(fileType) && contentUrl) {
    return (
      <div data-testid="document-viewer-pdf" className="w-full">
        <iframe
          src={contentUrl}
          title={document.name}
          className="h-[70vh] min-h-[400px] w-full rounded-lg border border-border/50"
          data-testid="pdf-iframe"
        />
      </div>
    )
  }

  // Images — direct display
  if (VIEWABLE_IMAGE_TYPES.includes(fileType) && contentUrl && !imageError) {
    return (
      <div data-testid="document-viewer-image" className="flex w-full justify-center">
        <img
          src={contentUrl}
          alt={document.name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="max-h-[70vh] max-w-full rounded-lg border border-border/50 object-contain"
          data-testid="image-element"
        />
      </div>
    )
  }

  // Fallback — metadata preview with download button
  return (
    <DocumentMetadataPreview
      document={document}
      onDownload={onDownload}
      isDownloading={isDownloading}
    />
  )
}
