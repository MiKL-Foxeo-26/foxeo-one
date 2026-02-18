'use client'

import { DataTable, type ColumnDef } from '@foxeo/ui'
import { Badge } from '@foxeo/ui'
import { Trash2 } from 'lucide-react'
import { Button } from '@foxeo/ui'
import { formatFileSize } from '@foxeo/utils'
import { DocumentIcon } from './document-icon'
import type { Document } from '../types/document.types'

interface DocumentListProps {
  documents: Document[]
  onDelete?: (documentId: string) => void
  isDeleting?: boolean
  showVisibility?: boolean
  viewerBaseHref?: string
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
  onDelete,
  isDeleting = false,
  showVisibility = true,
  viewerBaseHref,
}: DocumentListProps) {
  const columns: ColumnDef<Document>[] = [
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
      <DataTable
        columns={columns}
        data={documents}
        emptyMessage="Aucun document"
      />
    </div>
  )
}
