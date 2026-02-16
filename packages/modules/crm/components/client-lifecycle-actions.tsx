'use client'

import { useState, useTransition } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, showSuccess, showError } from '@foxeo/ui'
import { Pause, Play } from 'lucide-react'
import type { Client } from '../types/crm.types'
import { SuspendClientDialog } from './suspend-client-dialog'
import { reactivateClient } from '../actions/reactivate-client'

interface ClientLifecycleActionsProps {
  client: Client
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ClientLifecycleActions({
  client,
  variant = 'outline',
  size = 'default',
}: ClientLifecycleActionsProps) {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const handleReactivate = () => {
    startTransition(async () => {
      const result = await reactivateClient({ clientId: client.id })

      if (result.error) {
        showError(result.error.message)
        return
      }

      showSuccess('Client réactivé')
      await queryClient.invalidateQueries({ queryKey: ['clients'] })
      await queryClient.invalidateQueries({ queryKey: ['client', client.id] })
    })
  }

  // Only show for active or suspended clients
  if (client.status === 'archived') {
    return null
  }

  if (client.status === 'active') {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          onClick={() => setSuspendDialogOpen(true)}
          disabled={isPending}
        >
          <Pause className="h-4 w-4 mr-2" />
          Suspendre
        </Button>
        <SuspendClientDialog
          clientId={client.id}
          clientName={client.name}
          open={suspendDialogOpen}
          onOpenChange={setSuspendDialogOpen}
        />
      </>
    )
  }

  if (client.status === 'suspended') {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleReactivate}
        disabled={isPending}
      >
        <Play className="h-4 w-4 mr-2" />
        {isPending ? 'Réactivation...' : 'Réactiver'}
      </Button>
    )
  }

  return null
}
