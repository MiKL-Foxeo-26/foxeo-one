'use client'

import { useState, useTransition } from 'react'
import type { MeetingRequest } from '../types/meeting-request.types'
import { acceptMeetingRequest } from '../actions/accept-meeting-request'
import { rejectMeetingRequest } from '../actions/reject-meeting-request'

interface MeetingRequestCardProps {
  request: MeetingRequest
  onAccept?: (requestId: string, selectedSlot: string) => void
  onReject?: (requestId: string, reason?: string) => void
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  completed: 'Terminée',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  accepted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  completed: 'bg-blue-500/20 text-blue-400',
}

export function MeetingRequestCard({ request, onAccept, onReject }: MeetingRequestCardProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>(request.requestedSlots[0] ?? '')
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState(request.status)
  const [localSelectedSlot, setLocalSelectedSlot] = useState(request.selectedSlot)
  const [isPending, startTransition] = useTransition()

  function handleAccept() {
    if (!selectedSlot) return
    setError(null)
    startTransition(async () => {
      if (onAccept) {
        onAccept(request.id, selectedSlot)
        return
      }
      const result = await acceptMeetingRequest({ requestId: request.id, selectedSlot })
      if (result.error) {
        setError(result.error.message)
        return
      }
      setLocalStatus('accepted')
      setLocalSelectedSlot(selectedSlot)
    })
  }

  function handleReject() {
    setError(null)
    startTransition(async () => {
      if (onReject) {
        onReject(request.id, rejectReason || undefined)
        setShowRejectForm(false)
        return
      }
      const result = await rejectMeetingRequest({ requestId: request.id, reason: rejectReason || undefined })
      if (result.error) {
        setError(result.error.message)
        return
      }
      setLocalStatus('rejected')
      setShowRejectForm(false)
    })
  }

  const displayStatus = localStatus
  const displaySelectedSlot = localSelectedSlot

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Demande du {new Date(request.createdAt).toLocaleDateString('fr-FR')}
          </p>
          {request.message && (
            <p className="mt-1 text-sm">{request.message}</p>
          )}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[displayStatus] ?? ''}`}>
          {STATUS_LABELS[displayStatus] ?? displayStatus}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">Créneaux proposés :</p>
        <div className="flex flex-wrap gap-2">
          {request.requestedSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              disabled={displayStatus !== 'pending'}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedSlot === slot
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              } disabled:opacity-50`}
            >
              {new Date(slot).toLocaleString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

      {displayStatus === 'pending' && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleAccept}
            disabled={isPending || !selectedSlot}
            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? 'Acceptation...' : 'Accepter'}
          </button>
          {!showRejectForm ? (
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              disabled={isPending}
              className="rounded-md bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/30 disabled:opacity-50"
            >
              Refuser
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Raison (optionnel)..."
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-white/30"
              />
              <button
                type="button"
                onClick={handleReject}
                disabled={isPending}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirmer
              </button>
            </div>
          )}
        </div>
      )}

      {displayStatus === 'accepted' && displaySelectedSlot && (
        <div className="pt-2 border-t border-white/5">
          <p className="text-xs text-green-400">
            RDV confirmé : {new Date(displaySelectedSlot).toLocaleString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  )
}
