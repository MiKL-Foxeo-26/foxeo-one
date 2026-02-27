'use client'

import type { ElioError } from '../types/elio.types'

interface ElioErrorMessageProps {
  error: ElioError
  onRetry?: () => void
}

const ERROR_MESSAGES: Record<string, string> = {
  TIMEOUT: 'Élio est temporairement indisponible. Réessayez dans quelques instants.',
  NETWORK_ERROR: 'Problème de connexion. Vérifiez votre connexion internet.',
  LLM_ERROR: 'Élio est surchargé. Réessayez dans quelques minutes.',
  CONFIG_ERROR: 'Erreur de configuration. Veuillez rafraîchir la page.',
  UNKNOWN: 'Une erreur inattendue est survenue.',
}

export function ElioErrorMessage({ error, onRetry }: ElioErrorMessageProps) {
  const message = error.message || ERROR_MESSAGES[error.code] || ERROR_MESSAGES.UNKNOWN

  if (process.env.NODE_ENV !== 'production' && error.details) {
    console.error(`[ELIO:ERROR] ${error.code}: ${error.message}`, error.details)
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
    >
      <div className="flex items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 shrink-0 mt-0.5 text-destructive"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start text-xs font-medium text-destructive underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}
