'use client'

import { Badge } from '@foxeo/ui'
import { Button } from '@foxeo/ui'
import type { Client } from '../types/crm.types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CursorButton } from './cursor-button'
import { ClientStatusBadge } from './client-status-badge'
import { ClientLifecycleActions } from './client-lifecycle-actions'

interface ClientHeaderProps {
  client: Client
  onEdit?: () => void
}

const clientTypeLabels: Record<string, string> = {
  'complet': 'Complet',
  'direct_one': 'Direct One',
  'ponctuel': 'Ponctuel',
}

export function ClientHeader({ client, onEdit }: ClientHeaderProps) {
  const creationDate = format(new Date(client.createdAt), 'd MMMM yyyy', { locale: fr })

  return (
    <div className="border-b pb-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-lg text-muted-foreground">{client.company}</p>
          <div className="flex gap-2">
            <Badge variant="outline">
              {clientTypeLabels[client.clientType] || client.clientType}
            </Badge>
            <ClientStatusBadge
              status={client.status}
              suspendedAt={client.suspendedAt}
              archivedAt={client.archivedAt}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Client depuis le {creationDate}
          </p>
        </div>

        <div className="flex gap-2">
          <CursorButton
            clientName={client.name}
            companyName={client.company || undefined}
          />
          <ClientLifecycleActions client={client} />
          {onEdit && (
            <Button onClick={onEdit} variant="outline">
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
