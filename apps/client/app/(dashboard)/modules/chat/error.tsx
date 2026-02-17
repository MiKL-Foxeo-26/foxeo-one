'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function ClientChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur du Chat"
      message={error.message}
      onRetry={reset}
    />
  )
}
