'use client'

import { useMemo, useState } from 'react'
import { useDocuments } from '../hooks/use-documents'
import { useFolders } from '../hooks/use-folders'
import { DocumentUpload } from './document-upload'
import { DocumentList } from './document-list'
import { DocumentSkeleton } from './document-skeleton'
import { FolderTree } from './folder-tree'
import { FolderTreeSkeleton } from './folder-tree-skeleton'
import { DocumentSearch } from './document-search'
import type { Document } from '../types/document.types'

interface DocumentsPageClientProps {
  clientId: string
  operatorId: string
  uploadedBy: 'client' | 'operator'
  initialDocuments: Document[]
  showVisibility?: boolean
  showBatchActions?: boolean
  viewerBaseHref?: string
  isOperator?: boolean
}

export function DocumentsPageClient({
  clientId,
  operatorId,
  uploadedBy,
  initialDocuments,
  showVisibility = true,
  showBatchActions = false,
  viewerBaseHref,
  isOperator = false,
}: DocumentsPageClientProps) {
  const {
    documents,
    isPending,
    upload,
    isUploading,
    deleteDocument,
    isDeleting,
  } = useDocuments(clientId)

  const { folders, isPending: foldersPending } = useFolders(clientId)

  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const displayDocuments = isPending ? initialDocuments : documents

  const filteredDocuments = useMemo(() => {
    let docs = displayDocuments

    // Filtre par dossier actif
    if (activeFolderId === 'uncategorized') {
      docs = docs.filter((d) => d.folderId === null)
    } else if (activeFolderId !== null) {
      docs = docs.filter((d) => d.folderId === activeFolderId)
    }

    return docs
  }, [displayDocuments, activeFolderId])

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

      <div className="flex gap-4">
        {/* Arborescence dossiers — colonne gauche */}
        <aside className="w-64 shrink-0" data-testid="folder-tree-aside">
          {foldersPending ? (
            <FolderTreeSkeleton />
          ) : (
            <FolderTree
              folders={folders}
              selectedFolderId={activeFolderId}
              onSelectFolder={setActiveFolderId}
              clientId={clientId}
              operatorId={operatorId}
              isOperator={isOperator}
            />
          )}
        </aside>

        {/* Contenu principal — colonne droite */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <DocumentSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <DocumentList
            documents={filteredDocuments}
            clientId={clientId}
            onDelete={deleteDocument}
            isDeleting={isDeleting}
            showVisibility={showVisibility}
            showBatchActions={showBatchActions}
            viewerBaseHref={viewerBaseHref}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  )
}
