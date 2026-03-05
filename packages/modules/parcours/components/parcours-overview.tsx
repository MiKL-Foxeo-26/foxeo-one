'use client'

import { useState } from 'react'
import { useParcours } from '../hooks/use-parcours'
import { ParcoursProgressBar } from './parcours-progress-bar'
import { ParcoursTimeline } from './parcours-timeline'
import { AbandonParcoursDialog } from './abandon-parcours-dialog'

interface ParcoursOverviewProps {
  clientId: string
}

const ABANDONABLE_STATUSES = ['en_cours', 'in_progress', 'not_started', 'suspendu']

export function ParcoursOverview({ clientId }: ParcoursOverviewProps) {
  const { data: parcours, isPending, error } = useParcours(clientId)
  const [abandonDialogOpen, setAbandonDialogOpen] = useState(false)

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

  const isAbandoned = parcours.status === 'abandoned'
  const canAbandon = ABANDONABLE_STATUSES.includes(parcours.status)

  return (
    <div className="space-y-8">
      {/* Story 9.3 — Parcours abandonné : message pause */}
      {isAbandoned && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-6 text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            Votre parcours est en pause.
          </p>
          <p className="text-sm text-muted-foreground">
            MiKL va vous contacter pour en discuter.
          </p>
        </div>
      )}

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

      {/* Story 9.3 — Bouton abandon discret en bas de page */}
      {canAbandon && (
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => setAbandonDialogOpen(true)}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Quitter le parcours
          </button>
        </div>
      )}

      {/* Story 9.3 — Dialog abandon */}
      <AbandonParcoursDialog
        clientId={clientId}
        open={abandonDialogOpen}
        onOpenChange={setAbandonDialogOpen}
        completedSteps={parcours.completedSteps}
        totalSteps={parcours.totalSteps}
      />
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
