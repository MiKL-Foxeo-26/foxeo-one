'use client'

import { useState } from 'react'
import { createLabOnboarding } from '../actions/create-lab-onboarding'

export interface ParcoursTemplate {
  id: string
  name: string
}

interface CreateLabFormProps {
  meetingId: string
  templates: ParcoursTemplate[]
  onSuccess: (clientId: string) => void
}

export function CreateLabForm({ meetingId, templates, onSuccess }: CreateLabFormProps) {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [parcoursTemplateId, setParcoursTemplateId] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim() || !clientEmail || !parcoursTemplateId) {
      setError('Tous les champs sont requis.')
      return
    }
    setError(null)
    setIsPending(true)
    const result = await createLabOnboarding({
      meetingId,
      clientName: clientName.trim(),
      clientEmail,
      parcoursTemplateId,
    })
    setIsPending(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    if (result.data) {
      onSuccess(result.data.clientId)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="client-name" className="text-sm font-medium">
          Nom du client *
        </label>
        <input
          id="client-name"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Prénom Nom"
          required
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="client-email" className="text-sm font-medium">
          Email *
        </label>
        <input
          id="client-email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="client@email.com"
          required
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="parcours-template" className="text-sm font-medium">
          Parcours template *
        </label>
        <select
          id="parcours-template"
          value={parcoursTemplateId}
          onChange={(e) => setParcoursTemplateId(e.target.value)}
          required
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        >
          <option value="">Sélectionner un parcours...</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || templates.length === 0}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Création...' : 'Lancer le parcours Lab'}
        </button>
      </div>
    </form>
  )
}
