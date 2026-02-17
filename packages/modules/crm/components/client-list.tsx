'use client'

import { DataTable, type ColumnDef } from '@foxeo/ui'
import { Badge } from '@foxeo/ui'
import { CreateClientDialog } from './create-client-dialog'
import { PinButton } from './pin-button'
import { ClientStatusBadge } from './client-status-badge'
import type { ClientListItem, ClientType, ClientStatus } from '../types/crm.types'

interface ClientListProps {
  clients: ClientListItem[]
  onRowClick?: (client: ClientListItem) => void
  showCreateButton?: boolean
}

// Type badge variants and labels
const clientTypeConfig: Record<ClientType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  'complet': { label: 'Complet', variant: 'default' },
  'direct_one': { label: 'Direct One', variant: 'secondary' },
  'ponctuel': { label: 'Ponctuel', variant: 'outline' }
}

// Format date to FR locale
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Check if a client is currently deferred
const isDeferred = (client: ClientListItem): boolean =>
  !!client.deferredUntil && new Date(client.deferredUntil) > new Date()

export function ClientList({ clients, onRowClick, showCreateButton = true }: ClientListProps) {
  const columns: ColumnDef<ClientListItem>[] = [
    {
      id: 'pin',
      header: '',
      accessorKey: 'isPinned',
      cell: (client) => (
        <PinButton clientId={client.id} isPinned={client.isPinned ?? false} />
      ),
    },
    {
      id: 'name',
      header: 'Nom',
      accessorKey: 'name',
      cell: (client) => (
        <div className="flex items-center gap-2">
          <span>{client.name}</span>
          {isDeferred(client) && (
            <Badge variant="outline" className="text-xs" data-testid={`deferred-badge-${client.id}`}>
              Reporté
            </Badge>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      id: 'company',
      header: 'Entreprise',
      accessorKey: 'company',
      sortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'clientType',
      cell: (client) => {
        const config = clientTypeConfig[client.clientType]
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
      sortable: true,
    },
    {
      id: 'status',
      header: 'Statut',
      accessorKey: 'status',
      cell: (client) => (
        <ClientStatusBadge
          status={client.status}
        />
      ),
      sortable: true,
    },
    {
      id: 'createdAt',
      header: 'Créé le',
      accessorKey: 'createdAt',
      cell: (client) => formatDate(client.createdAt),
      sortable: true,
    }
  ]

  return (
    <div className="space-y-4">
      {showCreateButton && (
        <div className="flex justify-end">
          <CreateClientDialog />
        </div>
      )}
      <DataTable
        data={clients}
        columns={columns}
        emptyMessage="Aucun client trouvé"
        onRowClick={onRowClick}
        pageSize={20}
        className="data-density-compact"
      />
    </div>
  )
}

ClientList.displayName = 'ClientList'
