export default function ParcoursClientLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-md bg-muted" />
        <div className="h-4 w-96 rounded-md bg-muted" />
      </div>
      {/* Progress skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="h-2 w-full rounded-full bg-muted" />
      </div>
      {/* Timeline skeleton */}
      <div className="space-y-8 relative">
        <div className="absolute left-8 top-8 bottom-8 w-px bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
            <div className="flex-1 h-24 rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
