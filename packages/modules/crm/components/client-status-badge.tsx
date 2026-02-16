'use client'

import { Badge } from '@foxeo/ui'
import type { ClientStatus } from '../types/crm.types'

interface ClientStatusBadgeProps {
  status: ClientStatus
  suspendedAt?: string | null
  archivedAt?: string | null
  className?: string
}

const statusConfig: Record<
  ClientStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
  }
> = {
  active: {
    label: 'Actif',
    variant: 'default',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  },
  suspended: {
    label: 'Suspendu',
    variant: 'secondary',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  archived: {
    label: 'Archivé',
    variant: 'outline',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  },
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ClientStatusBadge({
  status,
  suspendedAt,
  archivedAt,
  className,
}: ClientStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active

  const dateLabel =
    status === 'suspended' && suspendedAt
      ? ` depuis le ${formatDate(suspendedAt)}`
      : status === 'archived' && archivedAt
        ? ` le ${formatDate(archivedAt)}`
        : ''

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className || ''}`}
      title={dateLabel ? `${config.label}${dateLabel}` : undefined}
    >
      {config.label}
      {dateLabel && (
        <span className="ml-1 text-xs opacity-75">{dateLabel}</span>
      )}
    </Badge>
  )
}
