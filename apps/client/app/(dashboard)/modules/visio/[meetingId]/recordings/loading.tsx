export default function RecordingsLoading() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  )
}
