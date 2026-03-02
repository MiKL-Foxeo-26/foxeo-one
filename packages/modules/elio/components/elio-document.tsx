'use client'

import { FileText, Download, ExternalLink, Image, File } from 'lucide-react'
import { Button } from '@foxeo/ui'
import { useRouter } from 'next/navigation'

export type DocumentType = 'pdf' | 'doc' | 'image' | 'markdown'

interface ElioDocumentProps {
  documentId: string
  documentName: string
  documentType: DocumentType
  isElioGenerated?: boolean
  preview?: string
  /** @deprecated Reserved for future per-dashboard document paths */
  dashboardType?: 'hub' | 'lab' | 'one'
}

const TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  doc: <FileText className="w-5 h-5 text-blue-500" />,
  image: <Image className="w-5 h-5 text-purple-500" />,
  markdown: <File className="w-5 h-5 text-green-500" />,
}

export function ElioDocument({
  documentId,
  documentName,
  documentType,
  isElioGenerated,
  preview,
}: ElioDocumentProps) {
  const router = useRouter()

  return (
    <div
      className="border rounded-lg p-4 my-2 bg-card"
      data-testid="elio-document"
      data-document-id={documentId}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{TYPE_ICONS[documentType] ?? <FileText className="w-5 h-5" />}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm truncate">{documentName}</h4>
            {isElioGenerated && (
              <span
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0"
                data-testid="elio-generated-badge"
              >
                Brief généré par Élio
              </span>
            )}
          </div>

          {preview && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">
              {preview}
            </p>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/modules/documents/${documentId}`)}
              data-testid="view-document-btn"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Voir le document complet
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(`/api/documents/${documentId}/download`, '_blank')}
              data-testid="download-document-btn"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Télécharger
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
