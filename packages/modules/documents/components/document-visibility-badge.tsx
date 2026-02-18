'use client'

import type { DocumentVisibility } from '../types/document.types'

interface DocumentVisibilityBadgeProps {
  visibility: DocumentVisibility
}

export function DocumentVisibilityBadge({ visibility }: DocumentVisibilityBadgeProps) {
  const isShared = visibility === 'shared'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isShared
          ? 'bg-green-500/10 text-green-500'
          : 'bg-muted text-muted-foreground'
      }`}
      data-testid="visibility-badge"
    >
      {isShared ? 'Visible par le client' : 'Non visible'}
    </span>
  )
}
