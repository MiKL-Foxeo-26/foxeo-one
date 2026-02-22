'use client'

export default function RecordingsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <p className="text-red-400">Erreur lors du chargement des enregistrements</p>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
      >
        Réessayer
      </button>
    </div>
  )
}
