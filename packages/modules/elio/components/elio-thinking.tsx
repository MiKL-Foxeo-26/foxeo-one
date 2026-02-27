'use client'

import type { DashboardType } from '../types/elio.types'

interface ElioThinkingProps {
  dashboardType?: DashboardType
  text?: string
}

const DEFAULT_TEXT: Record<DashboardType, string> = {
  hub: 'Élio analyse votre question...',
  lab: 'Élio réfléchit...',
  one: 'Élio réfléchit...',
}

export function ElioThinking({ dashboardType = 'lab', text }: ElioThinkingProps) {
  const displayText = text ?? DEFAULT_TEXT[dashboardType]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={displayText}
      className="flex items-center gap-2 px-4 py-3"
    >
      <div className="flex gap-1" aria-hidden="true">
        <span
          className="h-2 w-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-current animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-sm text-muted-foreground">{displayText}</span>
    </div>
  )
}
