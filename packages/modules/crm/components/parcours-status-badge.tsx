'use client'

import { Badge } from '@foxeo/ui'
import type { ParcoursStatus } from '../types/crm.types'

interface ParcoursStatusBadgeProps {
  status: ParcoursStatus
}

const statusConfig: Record<ParcoursStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  en_cours: { label: 'En cours', variant: 'default' },
  suspendu: { label: 'Suspendu', variant: 'secondary' },
  termine: { label: 'Terminé', variant: 'outline' },
}

export function ParcoursStatusBadge({ status }: ParcoursStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'outline' as const }

  return (
    <Badge variant={config.variant} data-testid="parcours-status-badge">
      {config.label}
    </Badge>
  )
}
