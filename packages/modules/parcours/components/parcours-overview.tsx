'use client'

import { useParcours } from '../hooks/use-parcours'
import { ParcoursProgressBar } from './parcours-progress-bar'
import { ParcoursTimeline } from './parcours-timeline'

interface ParcoursOverviewProps {
  clientId: string
}

export function ParcoursOverview({ clientId }: ParcoursOverviewProps) {
  const { data: parcours, isPending, error } = useParcours(clientId)

  if (isPending) {
    return <ParcoursOverviewSkeleton />
  }

  if (error || !parcours) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
        <p className="text-destructive text-sm">
          Impossible de charger votre parcours. Veuillez réessayer.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{parcours.name}</h1>
        {parcours.description && (
          <p className="text-muted-foreground">{parcours.description}</p>
        )}
      </div>

      {/* Progress */}
      <ParcoursProgressBar
        completedSteps={parcours.completedSteps}
        totalSteps={parcours.totalSteps}
        progressPercent={parcours.progressPercent}
      />

      {/* Timeline */}
      <ParcoursTimeline steps={parcours.steps} />
    </div>
  )
}

function ParcoursOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
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
