'use client'

export default function ModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-lg font-semibold text-destructive">
        Erreur de chargement du module
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
      >
        Reessayer
      </button>
    </div>
  )
}
