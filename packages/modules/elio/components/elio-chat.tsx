'use client'

import { useRef, useEffect, useState } from 'react'
import { useElioChat } from '../hooks/use-elio-chat'
import { ElioThinking } from './elio-thinking'
import { ElioErrorMessage } from './elio-error-message'
import { ElioMessageItem } from './elio-message'
import type { DashboardType } from '../types/elio.types'

interface ElioChatProps {
  dashboardType: DashboardType
  clientId?: string
  placeholder?: string
}

const PALETTE_CLASSES: Record<DashboardType, string> = {
  hub: 'elio-palette-hub',
  lab: 'elio-palette-lab',
  one: 'elio-palette-one',
}

const PALETTE_FOCUS_RING: Record<DashboardType, string> = {
  hub: 'focus-visible:ring-[oklch(0.7_0.15_190)]',
  lab: 'focus-visible:ring-[oklch(0.6_0.2_280)]',
  one: 'focus-visible:ring-[oklch(0.7_0.2_50)]',
}

export function ElioChat({ dashboardType, clientId, placeholder = 'Écrivez un message à Élio...' }: ElioChatProps) {
  // Note: useElioConfig sera intégré ici en Story 8.2+ pour afficher
  // le statut de la config côté client. La config est déjà chargée côté
  // serveur dans sendToElio → getElioConfig.
  const { messages, isLoading, error, sendMessage, retrySend } = useElioChat({
    dashboardType,
    clientId,
  })

  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const paletteClass = PALETTE_CLASSES[dashboardType]
  const focusRing = PALETTE_FOCUS_RING[dashboardType]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const content = inputValue.trim()
    if (!content || isLoading) return
    setInputValue('')
    await sendMessage(content)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(e as unknown as React.FormEvent)
    }
    if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className={`flex flex-col h-full bg-background text-foreground ${paletteClass}`}
      data-dashboard-type={dashboardType}
    >
      {/* Zone messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation avec Élio"
      >
        {messages.map((msg) => (
          <ElioMessageItem
            key={msg.id}
            message={msg}
            dashboardType={dashboardType}
          />
        ))}
        {isLoading && <ElioThinking dashboardType={dashboardType} />}
        {error && !isLoading && (
          <ElioErrorMessage error={error} onRetry={retrySend} />
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Zone saisie */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border px-4 py-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            aria-label="Message à envoyer à Élio"
            className={[
              'flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2',
              focusRing,
            ].join(' ')}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Envoyer le message"
            className={[
              'rounded-lg px-3 py-2 text-sm font-medium',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2',
              focusRing,
            ].join(' ')}
          >
            Envoyer
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
        </p>
      </form>
    </div>
  )
}
