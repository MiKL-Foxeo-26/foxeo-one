'use client'

import type { SubmissionStatus } from '../types/parcours.types'

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
  pending: {
    label: 'En attente',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
  approved: {
    label: 'Approuvé',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  rejected: {
    label: 'Refusé',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  revision_requested: {
    label: 'Révision demandée',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
}

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
