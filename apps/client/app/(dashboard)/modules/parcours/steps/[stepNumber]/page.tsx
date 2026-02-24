import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { getParcours } from '@foxeo/module-parcours'
import { ParcoursStepStatusBadge } from '@foxeo/module-parcours'

interface ParcoursStepDetailPageProps {
  params: Promise<{ stepNumber: string }>
}

export default async function ParcoursStepDetailPage({ params }: ParcoursStepDetailPageProps) {
  const { stepNumber } = await params
  const stepNum = parseInt(stepNumber, 10)

  if (isNaN(stepNum) || stepNum < 1) notFound()

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!client) notFound()

  const { data: parcours } = await getParcours({ clientId: client.id })
  if (!parcours) notFound()

  const step = parcours.steps.find(s => s.stepNumber === stepNum)
  if (!step) notFound()

  const isReadOnly = step.status === 'completed' || step.status === 'skipped'

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/modules/parcours" className="hover:text-foreground transition-colors">
          Mon Parcours
        </Link>
        {' › '}
        <span className="text-foreground">Étape {stepNum}</span>
      </nav>

      {/* Header étape */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-muted-foreground/50">
            {String(stepNum).padStart(2, '0')}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{step.title}</h1>
            <ParcoursStepStatusBadge status={step.status} className="mt-1" />
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
      </div>

      {/* Lecture seule si completée/skippée */}
      {isReadOnly && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            {step.status === 'completed'
              ? `Étape complétée le ${step.completedAt ? new Date(step.completedAt).toLocaleDateString('fr-FR') : '—'}`
              : 'Cette étape a été passée.'}
          </p>
        </div>
      )}

      {/* Template brief si disponible */}
      {step.briefTemplate && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Modèle de brief
          </h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
              {step.briefTemplate}
            </pre>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        {stepNum > 1 ? (
          <Link
            href={`/modules/parcours/steps/${stepNum - 1}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Étape précédente
          </Link>
        ) : (
          <span />
        )}
        {stepNum < parcours.totalSteps ? (
          <Link
            href={`/modules/parcours/steps/${stepNum + 1}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Étape suivante →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
