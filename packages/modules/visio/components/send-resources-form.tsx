'use client'

import { useState } from 'react'
import { sendProspectResources } from '../actions/send-prospect-resources'

export interface ProspectDocument {
  id: string
  name: string
}

interface SendResourcesFormProps {
  meetingId: string
  documents: ProspectDocument[]
  onSuccess: () => void
}

export function SendResourcesForm({ meetingId, documents, onSuccess }: SendResourcesFormProps) {
  const [prospectEmail, setProspectEmail] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleDocument(docId: string) {
    setSelectedIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prospectEmail || selectedIds.length === 0) {
      setError('Email et au moins un document sont requis.')
      return
    }
    setError(null)
    setIsPending(true)
    const result = await sendProspectResources({
      meetingId,
      prospectEmail,
      documentIds: selectedIds,
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
        <label htmlFor="prospect-email" className="text-sm font-medium">
          Email du prospect *
        </label>
        <input
          id="prospect-email"
          type="email"
          value={prospectEmail}
          onChange={(e) => setProspectEmail(e.target.value)}
          placeholder="prospect@email.com"
          required
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Documents à envoyer *</span>
        {documents.length === 0 ? (
          <p className="text-sm text-white/50">
            Aucun document partagé disponible dans le dossier Ressources Prospect.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {documents.map((doc) => (
              <label key={doc.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="rounded"
                />
                {doc.name}
              </label>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending || documents.length === 0}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? 'Envoi...' : 'Envoyer les ressources'}
        </button>
      </div>
    </form>
  )
}
