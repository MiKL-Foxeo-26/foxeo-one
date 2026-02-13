'use client'

import { Card, CardContent, Skeleton, Button } from '@foxeo/ui'
import { useClientActivityLogs } from '../hooks/use-client-activity-logs'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ClientTimelineProps {
  clientId: string
}

const eventTypeLabels: Record<string, string> = {
  client_created: 'Client cree',
  status_changed: 'Statut modifie',
  validation_submitted: 'Brief soumis',
  validation_approved: 'Brief approuve',
  validation_rejected: 'Brief refuse',
  visio_completed: 'Visio terminee',
  graduated_to_one: 'Gradue vers One',
  document_shared: 'Document partage',
  message_sent: 'Message envoye',
}

const eventTypeIcons: Record<string, string> = {
  client_created: '🎉',
  status_changed: '🔄',
  validation_submitted: '📝',
  validation_approved: '✅',
  validation_rejected: '❌',
  visio_completed: '📹',
  graduated_to_one: '🎓',
  document_shared: '📄',
  message_sent: '💬',
}

export function ClientTimeline({ clientId }: ClientTimelineProps) {
  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useClientActivityLogs(clientId)

  if (isPending) {
    return (
      <div className="space-y-4 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-destructive">Erreur de chargement</div>
  }

  const logs = data?.pages.flat() ?? []

  if (logs.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center text-muted-foreground">
          Aucune activite enregistree
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      {logs.map((log) => {
        const timeAgo = formatDistanceToNow(new Date(log.createdAt), {
          addSuffix: true,
          locale: fr,
        })

        return (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{eventTypeIcons[log.eventType] || '📌'}</span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium">
                      {eventTypeLabels[log.eventType] || log.eventType}
                    </h4>
                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{log.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
          </Button>
        </div>
      )}
    </div>
  )
}
