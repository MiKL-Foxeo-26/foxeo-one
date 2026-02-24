'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function ParcoursClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur du module Parcours"
      message={error.message}
      onRetry={reset}
    />
  )
}
