import Link from 'next/link'
import { cn } from '@monprojetpro/utils'
import { COCKPIT_TONES, type CockpitTone } from './tones'

export interface ProjectTileProps {
  /** Libellé court de la mesure (« Messages non traités »). */
  label: string
  /**
   * Valeur mesurée. `null` signifie « non disponible » — JAMAIS « zéro ».
   * La tuile affiche alors « — » : un faux zéro ferait croire que tout va bien.
   */
  value: number | string | null
  /** Précision sous la valeur (« sur 30 jours »). */
  hint?: string
  tone?: CockpitTone
  /** Rend la tuile cliquable vers l'écran qui détaille la mesure. */
  href?: string
  /**
   * Message d'erreur si la source n'a pas répondu. Prend le pas sur `value` :
   * on montre que la mesure a échoué plutôt que d'afficher un chiffre périmé.
   */
  error?: string
  /** Met la valeur en avant (couleur du ton) — utile quand il y a à traiter. */
  emphasis?: boolean
  className?: string
}

/**
 * Tuile d'un projet suivi depuis l'accueil du Hub — une mesure, une valeur.
 *
 * Brique générique : elle ne connaît aucun projet en particulier, tout arrive
 * par les props (doctrine FORGE).
 */
export function ProjectTile({
  label,
  value,
  hint,
  tone = 'cyan',
  href,
  error,
  emphasis = false,
  className,
}: ProjectTileProps) {
  const t = COCKPIT_TONES[tone]

  const body = (
    <>
      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-gray-500">{label}</p>
      {error ? (
        <>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-600">—</p>
          <p className="mt-0.5 line-clamp-2 text-[0.65rem] text-red-400/80" title={error}>
            Mesure indisponible
          </p>
        </>
      ) : (
        <>
          <p
            className={cn(
              'mt-1 text-2xl font-semibold tabular-nums tracking-tight',
              value === null ? 'text-gray-600' : emphasis ? t.text : 'text-white',
            )}
          >
            {value === null ? '—' : typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
          {(hint || value === null) && (
            <p className="mt-0.5 text-[0.65rem] text-gray-500">
              {value === null ? 'Non disponible' : hint}
            </p>
          )}
        </>
      )}
    </>
  )

  const base = cn(
    'block rounded-xl border bg-white/[0.02] p-4 transition-colors',
    emphasis && !error ? t.softBorder : 'border-white/10',
    href && 'hover:bg-white/[0.04]',
    href && !error && t.hoverBorder,
    className,
  )

  return href ? (
    <Link href={href} className={base}>
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  )
}
