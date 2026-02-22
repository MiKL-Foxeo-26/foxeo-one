'use client'

import { useState, useTransition } from 'react'
import { requestMeeting } from '../actions/request-meeting'

interface MeetingRequestFormProps {
  operatorId: string
  onSuccess?: () => void
}

export function MeetingRequestForm({ operatorId, onSuccess }: MeetingRequestFormProps) {
  const [slots, setSlots] = useState<string[]>(['', '', ''])
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toLocalDatetimeValue(isoString: string): string {
    if (!isoString) return ''
    const d = new Date(isoString)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  function updateSlot(index: number, value: string) {
    setSlots((prev) => {
      const updated = [...prev]
      updated[index] = value ? new Date(value).toISOString() : ''
      return updated
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validSlots = slots.filter(Boolean)
    if (validSlots.length === 0) {
      setError('Proposez au moins un créneau horaire')
      return
    }

    startTransition(async () => {
      const result = await requestMeeting({
        operatorId,
        requestedSlots: validSlots,
        message: message || undefined,
      })

      if (result.error) {
        setError(result.error.message)
        return
      }

      setSlots(['', '', ''])
      setMessage('')
      onSuccess?.()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Demander un rendez-vous</h3>

      <p className="text-sm text-muted-foreground">
        Proposez jusqu'à 3 créneaux horaires. MiKL choisira celui qui lui convient.
      </p>

      {slots.map((slot, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <label htmlFor={`slot-${index}`} className="text-sm font-medium">
            Créneau {index + 1} {index === 0 ? '*' : '(optionnel)'}
          </label>
          <input
            id={`slot-${index}`}
            type="datetime-local"
            value={toLocalDatetimeValue(slot)}
            onChange={(e) => updateSlot(index, e.target.value)}
            required={index === 0}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="request-message" className="text-sm font-medium">
          Message (optionnel)
        </label>
        <textarea
          id="request-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Motif de la demande..."
          rows={3}
          maxLength={500}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? 'Envoi en cours...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}
