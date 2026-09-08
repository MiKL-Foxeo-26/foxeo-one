'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@monprojetpro/utils'
import { COCKPIT_TONES, type CockpitTone } from './tones'

export interface CockpitZoneProps {
  /** Intitulé de la zone, en toutes lettres — la couleur ne porte jamais seule le sens. */
  title: string
  /** Compteur agrégé affiché à côté du titre (masqué s'il vaut 0). */
  count?: number
  tone?: CockpitTone
  /**
   * Zone repliable. La préférence est retenue par navigateur, sous
   * `cockpit-zone:{storageKey}` — état d'interface pur, jamais de donnée serveur.
   */
  collapsible?: boolean
  storageKey?: string
  /** Ouverte au premier affichage, avant toute préférence enregistrée. */
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Enveloppe d'une zone du cockpit — bandeau de titre, liseré latéral coloré, contenu.
 *
 * Le liseré est volontairement un trait de 2px et non un fond plein : sur un fond
 * noir, trois zones à fond teinté alourdiraient la page au lieu de la ranger.
 */
export function CockpitZone({
  title,
  count,
  tone = 'gray',
  collapsible = false,
  storageKey,
  defaultOpen = true,
  children,
  className,
}: CockpitZoneProps) {
  const t = COCKPIT_TONES[tone]
  const [open, setOpen] = useState(defaultOpen)

  // Lu APRÈS le premier rendu : lire `localStorage` pendant le rendu ferait
  // diverger le HTML du serveur de celui du client (erreur d'hydratation).
  useEffect(() => {
    if (!collapsible || !storageKey) return
    try {
      const saved = window.localStorage.getItem(`cockpit-zone:${storageKey}`)
      if (saved !== null) setOpen(saved === 'open')
    } catch {
      // Stockage indisponible (navigation privée, réglage strict) : on garde le
      // défaut. Une préférence d'affichage ne doit jamais casser la page.
    }
  }, [collapsible, storageKey])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (!storageKey) return
    try {
      window.localStorage.setItem(`cockpit-zone:${storageKey}`, next ? 'open' : 'closed')
    } catch {
      // Idem : l'échec d'écriture ne doit pas empêcher le repli.
    }
  }

  const header = (
    <div className="flex items-center gap-2">
      <span className={cn('h-3.5 w-0.5 rounded-full', t.badgeBg)} aria-hidden />
      <span className={cn('text-[0.7rem] font-semibold uppercase tracking-wider', t.text)}>
        {title}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums ring-1',
            t.badgeBg,
            t.ring,
          )}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  )

  return (
    <section
      className={cn(
        'rounded-2xl border border-l-2 border-white/10 bg-white/[0.015] p-3 sm:p-4',
        tone !== 'gray' && t.softBorder,
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        {collapsible ? (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="flex items-center gap-2 rounded transition-opacity hover:opacity-80"
          >
            {header}
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-gray-500 transition-transform',
                !open && '-rotate-90',
              )}
            />
            <span className="sr-only">{open ? 'Replier la zone' : 'Déplier la zone'}</span>
          </button>
        ) : (
          header
        )}
      </div>

      {/* Toujours rendu, simplement masqué : replier une zone ne doit pas
          démonter ce qu'elle contient (on perdrait l'état des panneaux, et le
          contenu serait rechargé à chaque dépliage). */}
      <div className={cn(!open && 'hidden')}>{children}</div>
    </section>
  )
}
