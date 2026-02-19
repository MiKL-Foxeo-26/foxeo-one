'use client'

import { useState } from 'react'
import { DataTable, type ColumnDef } from '@foxeo/ui'
import { Badge, Button, Checkbox } from '@foxeo/ui'
import { Trash2 } from 'lucide-react'
import { formatFileSize } from '@foxeo/utils'
import { DocumentIcon } from './document-icon'
import { DocumentShareButton } from './document-share-button'
import { useShareDocument } from '../hooks/use-share-document'
import type { Document } from '../types/document.types'

interface DocumentListProps {
  documents: Document[]
  clientId?: string
  onDelete?: (documentId: string) => void
  isDeleting?: boolean
  showVisibility?: boolean
  viewerBaseHref?: string
  showBatchActions?: boolean
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function DocumentList({
  documents,
  clientId,
  onDelete,
  isDeleting = false,
  showVisibility = true,
  viewerBaseHref,
  showBatchActions = false,
}: DocumentListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { shareBatch, isBatchSharing } = useShareDocument(clientId ?? '')

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === documents.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(documents.map((d) => d.id)))
    }
  }

  const handleBatchShare = () => {
    if (!clientId || selectedIds.size === 0) return
    shareBatch(
      { documentIds: Array.from(selectedIds), clientId },
      { onSuccess: () => setSelectedIds(new Set()) }
    )
  }

  const columns: ColumnDef<Document>[] = [
    ...(showBatchActions
      ? [
          {
            id: 'select',
            header: () => (
              <Checkbox
                checked={documents.length > 0 && selectedIds.size === documents.length}
                onCheckedChange={toggleAll}
                aria-label="Tout sélectionner"
                data-testid="select-all-checkbox"
              />
            ),
            accessorKey: 'id' as const,
            cell: (doc: Document) => (
              <Checkbox
                checked={selectedIds.has(doc.id)}
                onCheckedChange={() => toggleSelection(doc.id)}
                aria-label={`Sélectionner ${doc.name}`}
                data-testid={`select-${doc.id}`}
                onClick={(e) => e.stopPropagation()}
              />
            ),
          } satisfies ColumnDef<Document>,
        ]
      : []),
    {
      id: 'type',
      header: '',
      accessorKey: 'fileType',
      cell: (doc) => <DocumentIcon fileType={doc.fileType} />,
    },
    {
      id: 'name',
      header: 'Nom',
      accessorKey: 'name',
      cell: (doc) =>
        viewerBaseHref ? (
          <a
            href={`${viewerBaseHref}/${doc.id}`}
            className="font-medium truncate max-w-xs text-primary hover:underline"
            title={doc.name}
            data-testid={`doc-link-${doc.id}`}
          >
            {doc.name}
          </a>
        ) : (
          <span className="font-medium truncate max-w-xs" title={doc.name}>
            {doc.name}
          </span>
        ),
    },
    {
      id: 'size',
      header: 'Taille',
      accessorKey: 'fileSize',
      cell: (doc) => (
        <span className="text-muted-foreground text-sm">
          {formatFileSize(doc.fileSize)}
        </span>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'createdAt',
      cell: (doc) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(doc.createdAt)}
        </span>
      ),
    },
    ...(showVisibility
      ? [
          {
            id: 'visibility',
            header: 'Visibilité',
            accessorKey: 'visibility' as const,
            cell: (doc: Document) => (
              <Badge variant={doc.visibility === 'shared' ? 'default' : 'outline'}>
                {doc.visibility === 'shared' ? 'Partagé' : 'Privé'}
              </Badge>
            ),
          } satisfies ColumnDef<Document>,
        ]
      : []),
    ...(showBatchActions && clientId
      ? [
          {
            id: 'share',
            header: '',
            accessorKey: 'id' as const,
            cell: (doc: Document) => (
              <DocumentShareButton document={doc} clientId={clientId} />
            ),
          } satisfies ColumnDef<Document>,
        ]
      : []),
    ...(onDelete
      ? [
          {
            id: 'actions',
            header: '',
            accessorKey: 'id' as const,
            cell: (doc: Document) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(doc.id)
                }}
                disabled={isDeleting}
                aria-label={`Supprimer ${doc.name}`}
                data-testid={`delete-doc-${doc.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ),
          } satisfies ColumnDef<Document>,
        ]
      : []),
  ]

  return (
    <div data-testid="document-list">
      {showBatchActions && selectedIds.size > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2 mb-2 bg-muted rounded-md"
          data-testid="batch-actions-bar"
        >
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} document{selectedIds.size > 1 ? 's' : ''} sélectionné{selectedIds.size > 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            onClick={handleBatchShare}
            disabled={isBatchSharing}
            data-testid="batch-share-btn"
          >
            Partager la sélection ({selectedIds.size})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
            data-testid="clear-selection-btn"
          >
            Annuler
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={documents}
        emptyMessage="Aucun document"
      />
    </div>
  )
}
