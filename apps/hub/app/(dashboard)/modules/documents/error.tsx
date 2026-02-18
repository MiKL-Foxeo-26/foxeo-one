'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function DocumentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur du module Documents"
      message={error.message}
      onRetry={reset}
    />
  )
}
