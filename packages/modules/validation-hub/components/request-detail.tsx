'use client'

import { AlertCircle } from 'lucide-react'
import { Skeleton } from '@foxeo/ui'
import { useValidationRequest } from '../hooks/use-validation-request'
import { RequestHeader } from './request-header'
import { ClientInfoCard } from './client-info-card'
import { RequestContent } from './request-content'
import { RequestHistory } from './request-history'
import { RequestExchanges } from './request-exchanges'
import { RequestActions } from './request-actions'
import type { ExchangeEntry } from './request-exchanges'

type RequestDetailProps = {
  requestId: string
}

export function RequestDetail({ requestId }: RequestDetailProps) {
  const { request, isLoading, error } = useValidationRequest(requestId)

  if (isLoading) {
    return <RequestDetailSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="p-4 rounded-full bg-red-500/10">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Impossible de charger la demande
          </p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <p className="text-lg font-medium text-foreground">
          Demande introuvable
        </p>
        <p className="text-sm text-muted-foreground">
          Cette demande n&apos;existe pas ou vous n&apos;y avez pas accès.
        </p>
      </div>
    )
  }

  // Build exchanges from reviewer_comment (needs_clarification case)
  const exchanges: ExchangeEntry[] = []
  if (request.reviewerComment && request.reviewedAt) {
    exchanges.push({
      date: request.reviewedAt,
      actor: 'MiKL',
      action: 'a demandé des précisions :',
      comment: request.reviewerComment,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Scrollable content */}
      <div className="flex-1 p-6 pb-24 space-y-6">
        {/* Section 1 — En-tête */}
        <RequestHeader
          title={request.title}
          type={request.type}
          status={request.status}
          submittedAt={request.submittedAt}
        />

        {/* Responsive layout: 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Colonne principale */}
          <div className="space-y-6">
            {/* Section 2 — Informations client */}
            <ClientInfoCard
              client={request.client}
              parcours={request.parcours}
            />

            {/* Section 3 — Contenu de la demande */}
            <RequestContent
              content={request.content}
              documents={request.documents}
            />

            {/* Section Échanges (si needs_clarification) */}
            {exchanges.length > 0 && (
              <RequestExchanges exchanges={exchanges} />
            )}
          </div>

          {/* Colonne historique */}
          <div className="space-y-6">
            {/* Section 4 — Historique pertinent */}
            <RequestHistory
              clientId={request.clientId}
              requestId={request.id}
              clientName={request.client.name}
            />
          </div>
        </div>
      </div>

      {/* Zone boutons sticky */}
      <RequestActions
        status={request.status}
        onValidate={() => {
          // Story 7.3
        }}
        onRefuse={() => {
          // Story 7.3
        }}
        onRequestClarification={() => {
          // Story 7.4
        }}
        onTreatmentAction={() => {
          // Story 7.5
        }}
      />
    </div>
  )
}

function RequestDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
        <div className="space-y-6">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
