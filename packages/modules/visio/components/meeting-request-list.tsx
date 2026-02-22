'use client'

import type { MeetingRequest } from '../types/meeting-request.types'
import { MeetingRequestCard } from './meeting-request-card'

interface MeetingRequestListProps {
  requests: MeetingRequest[]
  onAccept?: (requestId: string, selectedSlot: string) => void
  onReject?: (requestId: string, reason?: string) => void
}

export function MeetingRequestList({ requests, onAccept, onReject }: MeetingRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-8">
        <p className="text-muted-foreground">Aucune demande de visio en attente</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((request) => (
        <MeetingRequestCard
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  )
}
