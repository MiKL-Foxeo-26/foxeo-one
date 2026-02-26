'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function CommunicationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur"
      message="Impossible de charger le profil de communication."
      onRetry={reset}
    />
  )
}
