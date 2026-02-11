'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function SessionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur"
      message="Impossible de charger les sessions actives."
      onRetry={reset}
    />
  )
}
