'use client'

import { ErrorDisplay } from '@foxeo/ui'

export default function ChatConversationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorDisplay
      title="Erreur de la conversation"
      message={error.message}
      onRetry={reset}
    />
  )
}
