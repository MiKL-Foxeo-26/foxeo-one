'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClientList,
  ClientSearch,
  ClientFiltersPanel,
  EmptyClientList,
  useClients,
  type ClientFilters,
  type ClientListItem,
} from '@foxeo/modules-crm'
import { useOnlineUsers } from '@foxeo/modules-chat'

interface CRMPageClientProps {
  initialClients: ClientListItem[]
}

export function CRMPageClient({ initialClients }: CRMPageClientProps) {
  const router = useRouter()
  const onlineUserIds = useOnlineUsers()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ClientFilters>({})

  const { data: clients = [], isLoading, error } = useClients(initialClients)

  // Client-side filtering (< 500 clients)
  const filteredClients = clients.filter((client) => {
    // Search filter (nom, entreprise, email, secteur)
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        client.name.toLowerCase().includes(searchLower) ||
        client.company.toLowerCase().includes(searchLower) ||
        (client.email && client.email.toLowerCase().includes(searchLower)) ||
        (client.sector && client.sector.toLowerCase().includes(searchLower))

      if (!matchesSearch) return false
    }

    // Type filter
    if (filters.clientType && filters.clientType.length > 0) {
      if (!filters.clientType.includes(client.clientType)) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(client.status)) return false
    }

    return true
  })

  const handleRowClick = (client: ClientListItem) => {
    router.push(`/modules/crm/clients/${client.id}`)
  }

  const handleCreateClient = () => {
    router.push('/modules/crm/clients/new')
  }

  if (isLoading && initialClients.length === 0) {
    return <div className="p-8">Chargement...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        Erreur: {error.message}
      </div>
    )
  }

  // Fix: check actual filter array contents, not just key presence
  const hasFilters =
    search !== '' ||
    (filters.clientType !== undefined && filters.clientType.length > 0) ||
    (filters.status !== undefined && filters.status.length > 0) ||
    (filters.sector !== undefined && filters.sector.length > 0)

  const showEmptyState = filteredClients.length === 0

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">CRM</h1>
        <p className="text-muted-foreground">
          Gérez vos clients et suivez vos relations
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <ClientSearch onSearchChange={setSearch} />
        <ClientFiltersPanel filters={filters} onFiltersChange={setFilters} />
      </div>

      {showEmptyState ? (
        <EmptyClientList
          hasFilters={hasFilters}
          onCreateClient={handleCreateClient}
        />
      ) : (
        <ClientList clients={filteredClients} onRowClick={handleRowClick} onlineUserIds={onlineUserIds} />
      )}
    </div>
  )
}
