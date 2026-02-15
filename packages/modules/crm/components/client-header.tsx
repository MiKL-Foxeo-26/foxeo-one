'use client'

import { Badge } from '@foxeo/ui'
import { Button } from '@foxeo/ui'
import type { Client } from '../types/crm.types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ClientHeaderProps {
  client: Client
  onEdit?: () => void
}

const clientTypeLabels: Record<string, string> = {
  'complet': 'Complet',
  'direct-one': 'Direct One',
  'ponctuel': 'Ponctuel',
}

const statusLabels: Record<string, string> = {
  'lab-actif': 'Lab actif',
  'one-actif': 'One actif',
  'inactif': 'Inactif',
  'suspendu': 'Suspendu',
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'lab-actif': 'default',
  'one-actif': 'secondary',
  'inactif': 'outline',
  'suspendu': 'destructive',
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
            <Badge variant={statusColors[client.status] || 'default'}>
              {statusLabels[client.status] || client.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Client depuis le {creationDate}
          </p>
        </div>

        <div className="flex gap-2">
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
