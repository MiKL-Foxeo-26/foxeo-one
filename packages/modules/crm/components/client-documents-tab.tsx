'use client'

import { Card, CardContent, Badge } from '@foxeo/ui'
import { useClientDocuments } from '../hooks/use-client-documents'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ClientDocumentsTabProps {
  clientId: string
}

const documentTypeLabels: Record<string, string> = {
  brief: 'Brief',
  livrable: 'Livrable',
  rapport: 'Rapport',
  autre: 'Autre',
}

export function ClientDocumentsTab({ clientId }: ClientDocumentsTabProps) {
  const { data: documents, isPending, error } = useClientDocuments(clientId)

  if (isPending) {
    return <div className="p-4">Chargement des documents...</div>
  }

  if (error) {
    return <div className="p-4 text-destructive">Erreur de chargement</div>
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center text-muted-foreground">
          Aucun document partagé
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      {documents.map((doc) => {
        const uploadDate = format(new Date(doc.createdAt), 'd MMMM yyyy', { locale: fr })

        return (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{doc.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {documentTypeLabels[doc.type] || doc.type}
                    </Badge>
                    {doc.visibleToClient && (
                      <Badge variant="secondary" className="text-xs">
                        Visible client
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ajouté le {uploadDate}
                  </p>
                </div>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Voir
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
