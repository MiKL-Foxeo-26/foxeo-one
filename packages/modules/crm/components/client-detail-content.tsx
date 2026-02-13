'use client'

import { useState } from 'react'
import { ClientHeader } from './client-header'
import { ClientTabs } from './client-tabs'
import { EditClientDialog } from './edit-client-dialog'
import { useClient } from '../hooks/use-client'
import type { Client } from '../types/crm.types'

interface ClientDetailContentProps {
  client: Client
}

export function ClientDetailContent({ client: initialClient }: ClientDetailContentProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Use TanStack Query with initialData from Server Component
  // After edit mutation invalidates ['client', id], header auto-refreshes
  const { data: client } = useClient(initialClient.id, {
    initialData: initialClient,
  })

  const displayClient = client ?? initialClient

  return (
    <>
      <div className="container mx-auto py-6 space-y-6">
        <ClientHeader client={displayClient} onEdit={() => setIsEditDialogOpen(true)} />
        <ClientTabs clientId={displayClient.id} onEdit={() => setIsEditDialogOpen(true)} />
      </div>

      {/* Controlled Edit Dialog (no trigger, opened programmatically) */}
      <EditClientDialog
        client={displayClient}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  )
}
