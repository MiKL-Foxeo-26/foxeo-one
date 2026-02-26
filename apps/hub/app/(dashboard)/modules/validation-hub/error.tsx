'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function ValidationHubError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur du module Validation Hub"
      message={error.message}
      onRetry={reset}
    />
  )
}
