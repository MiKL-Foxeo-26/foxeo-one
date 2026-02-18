'use client'

import { useDocuments } from '../hooks/use-documents'
import { DocumentUpload } from './document-upload'
import { DocumentList } from './document-list'
import { DocumentSkeleton } from './document-skeleton'
import type { Document } from '../types/document.types'

interface DocumentsPageClientProps {
  clientId: string
  operatorId: string
  uploadedBy: 'client' | 'operator'
  initialDocuments: Document[]
  showVisibility?: boolean
  viewerBaseHref?: string
}

export function DocumentsPageClient({
  clientId,
  operatorId,
  uploadedBy,
  initialDocuments,
  showVisibility = true,
  viewerBaseHref,
}: DocumentsPageClientProps) {
  const {
    documents,
    isPending,
    upload,
    isUploading,
    deleteDocument,
    isDeleting,
  } = useDocuments(clientId)

  const displayDocuments = isPending ? initialDocuments : documents

  const handleUpload = (file: File) => {
    const formData = new FormData()
    formData.set('file', file)
    formData.set('clientId', clientId)
    formData.set('operatorId', operatorId)
    formData.set('uploadedBy', uploadedBy)
    formData.set('visibility', 'private')
    upload(formData)
  }

  if (isPending && initialDocuments.length === 0) {
    return <DocumentSkeleton />
  }

  return (
    <div className="flex flex-col gap-6 p-4" data-testid="documents-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documents</h1>
      </div>

      <DocumentUpload
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      <DocumentList
        documents={displayDocuments}
        onDelete={deleteDocument}
        isDeleting={isDeleting}
        showVisibility={showVisibility}
        viewerBaseHref={viewerBaseHref}
      />
    </div>
  )
}
