'use client'

import type { ElioMessage, DashboardType } from '../types/elio.types'

interface ElioMessageProps {
  message: ElioMessage
  dashboardType: DashboardType
  feedbackSlot?: React.ReactNode
}

export function ElioMessageItem({ message, dashboardType, feedbackSlot }: ElioMessageProps) {
  const isUser = message.role === 'user'

  const paletteClass = {
    hub: 'elio-palette-hub',
    lab: 'elio-palette-lab',
    one: 'elio-palette-one',
  }[dashboardType]

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
      data-role={message.role}
      data-dashboard={dashboardType}
    >
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
          paletteClass,
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm',
          message.isError ? 'border border-destructive/30 bg-destructive/10 text-destructive' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {!isUser && feedbackSlot && (
          <div className="mt-2 border-t border-current/10 pt-2">{feedbackSlot}</div>
        )}
      </div>
    </div>
  )
}
