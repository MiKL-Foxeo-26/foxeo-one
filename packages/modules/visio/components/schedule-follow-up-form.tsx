'use client'

import { useState } from 'react'
import { scheduleFollowUp } from '../actions/schedule-follow-up'

interface ScheduleFollowUpFormProps {
  meetingId: string
  onSuccess: () => void
}

export function ScheduleFollowUpForm({ meetingId, onSuccess }: ScheduleFollowUpFormProps) {
  const [dueDate, setDueDate] = useState('')
  const [message, setMessage] = useState('Relancer le prospect suite à la visio')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dueDate || !message.trim()) {
      setError('La date et le message sont requis.')
      return
    }
    setError(null)
    setIsPending(true)
    const result = await scheduleFollowUp({
      meetingId,
      dueDate: new Date(dueDate).toISOString(),
      message: message.trim(),
    })
    setIsPending(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="follow-up-date" className="text-sm font-medium">
          Date du rappel *
        </label>
        <input
          id="follow-up-date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="follow-up-message" className="text-sm font-medium">
          Message *
        </label>
        <textarea
          id="follow-up-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Note pour le rappel..."
          rows={3}
          required
          maxLength={500}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Création...' : 'Créer le rappel'}
        </button>
      </div>
    </form>
  )
}
