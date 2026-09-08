import { FolderKanban } from 'lucide-react'
import { ProjectTile, SectionTitle } from '@monprojetpro/ui'
import { getProjectWidgetPrefs } from '../../actions/project-widget-prefs'
import {
  PROJECT_REGISTRY,
  allProjectWidgets,
  isWidgetEnabled,
  type ProjectDef,
} from '../../lib/project-widgets'
import { ProjectCornerSettings, type WidgetChoice } from './project-corner-settings'

/**
 * Coin « Mes projets » de l'accueil du Hub — une carte par projet suivi, avec
 * les seules mesures que MiKL a choisi de voir.
 *
 * Server Component asynchrone : il interroge des guichets externes (HTTP), donc
 * la page le rend derrière un `<Suspense>` pour que le reste de l'accueil
 * s'affiche sans attendre une source lente.
 */

/** Squelette affiché pendant que les guichets répondent. */
export function ProjectCornerSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-40 animate-pulse rounded bg-white/5" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="h-[5.5rem] animate-pulse rounded-xl bg-white/5" />
        <div className="h-[5.5rem] animate-pulse rounded-xl bg-white/5" />
        <div className="h-[5.5rem] animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  )
}

async function ProjectCard({
  project,
  prefs,
}: {
  project: ProjectDef
  prefs: Record<string, boolean>
}) {
  const visible = project.widgets.filter((w) => isWidgetEnabled(w, prefs))
  // Rien de coché pour ce projet : la carte disparaît plutôt que de laisser un
  // cadre vide sur l'accueil.
  if (visible.length === 0) return null

  const { values, error } = await project.load()

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <a
          href={project.href}
          className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
        >
          {project.name}
        </a>
        {error && (
          <span className="text-[0.65rem] text-red-400/80" title={error}>
            Source injoignable
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {visible.map((w) => {
          const value = values[w.key] ?? null
          return (
            <ProjectTile
              key={w.key}
              label={w.label}
              value={value}
              hint={w.hint}
              tone={project.tone}
              href={w.href}
              error={error}
              emphasis={Boolean(w.emphasizeWhenPositive) && typeof value === 'number' && value > 0}
            />
          )
        })}
      </div>
    </div>
  )
}

export async function ProjectCorner({ operatorId }: { operatorId: string }) {
  const prefsResult = await getProjectWidgetPrefs(operatorId)
  const prefs = prefsResult.data ?? {}

  const choices: WidgetChoice[] = allProjectWidgets().map(({ project, widget }) => ({
    key: widget.key,
    label: widget.label,
    hint: widget.hint,
    projectName: project.name,
    enabled: isWidgetEnabled(widget, prefs),
  }))

  const anyVisible = choices.some((c) => c.enabled)

  return (
    <section className="space-y-3">
      <SectionTitle action={<ProjectCornerSettings choices={choices} />} className="mb-0">
        <span className="inline-flex items-center gap-1.5">
          <FolderKanban className="h-3.5 w-3.5" />
          Mes projets
        </span>
      </SectionTitle>

      {anyVisible ? (
        <div className="space-y-5">
          {PROJECT_REGISTRY.map((project) => (
            <ProjectCard key={project.key} project={project} prefs={prefs} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-center">
          <p className="text-sm text-gray-300">Aucune tuile affichée</p>
          <p className="mt-1 text-xs text-gray-500">
            Utilise « Choisir mes tuiles » pour décider de ce qui apparaît ici.
          </p>
        </div>
      )}
    </section>
  )
}
