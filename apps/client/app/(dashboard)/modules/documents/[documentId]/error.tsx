'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function DocumentViewerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur du viewer de document"
      message={error.message}
      onRetry={reset}
    />
  )
}
