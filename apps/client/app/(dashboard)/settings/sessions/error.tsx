'use client'

export default function SessionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
      <h2 className="text-base font-medium text-destructive">Erreur</h2>
      <p className="mt-2 text-sm text-destructive/80">
        Impossible de charger les sessions actives.
      </p>
      {process.env.NODE_ENV === 'development' && error.message && (
        <p className="mt-1 text-xs text-destructive/60">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Réessayer
      </button>
    </div>
  )
}
