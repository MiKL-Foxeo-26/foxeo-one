import { getMenuFacileHomeWidgets } from '@monprojetpro/module-menu-facile'
import type { CockpitTone } from '@monprojetpro/ui'

/**
 * Registre du coin « Mes projets » de l'accueil du Hub.
 *
 * C'est l'app qui câble : le composant d'affichage reste générique, chaque
 * module fournit ses chiffres via une Server Action, et ce fichier est le seul
 * endroit où l'on déclare « tel projet expose telles mesures ».
 *
 * Ajouter un projet = ajouter une entrée ici. Aucune migration, aucun
 * changement dans le composant.
 */

/** Une mesure affichable, telle que déclarée au registre. */
export interface ProjectWidgetDef {
  /** Clé stable stockée en base (`{projet}.{mesure}`). Ne jamais la renommer. */
  key: string
  label: string
  hint?: string
  /** Affichée par défaut tant que MiKL n'a rien décoché. */
  defaultEnabled: boolean
  /** Met la valeur en avant quand elle est > 0 (ex. « il y a à traiter »). */
  emphasizeWhenPositive?: boolean
  /** Écran vers lequel la tuile renvoie. */
  href?: string
}

/** Un projet suivi depuis l'accueil. */
export interface ProjectDef {
  key: string
  name: string
  /** Lien « voir tout » de la carte. */
  href: string
  /**
   * Couleur d'identité du projet. Avec plusieurs projets suivis, c'est ce qui
   * permet de les distinguer d'un coup d'œil — chacun garde SA couleur, à la
   * manière d'un onglet de classeur. Éviter le cyan, réservé au Hub lui-même.
   */
  tone: CockpitTone
  widgets: ProjectWidgetDef[]
  /**
   * Va chercher les valeurs. Renvoie une map `key de mesure -> valeur`, où
   * `null` signifie « non disponible » (jamais zéro), et `error` remonte une
   * source injoignable pour l'afficher comme telle.
   */
  load: () => Promise<{ values: Record<string, number | null>; error?: string }>
}

const MENU_FACILE: ProjectDef = {
  key: 'menu-facile',
  name: 'MenuFacile',
  href: '/modules/menu-facile',
  tone: 'emerald',
  widgets: [
    {
      key: 'menu-facile.contact_new',
      label: 'Messages non traités',
      defaultEnabled: true,
      emphasizeWhenPositive: true,
      href: '/modules/menu-facile',
    },
    {
      key: 'menu-facile.households_total',
      label: 'Foyers inscrits',
      hint: 'Depuis le lancement',
      defaultEnabled: true,
      href: '/modules/menu-facile',
    },
    {
      key: 'menu-facile.households_active_30d',
      label: 'Foyers actifs',
      hint: 'Sur 30 jours',
      defaultEnabled: true,
      href: '/modules/menu-facile',
    },
  ],
  load: async () => {
    const res = await getMenuFacileHomeWidgets()
    if (res.error || !res.data) {
      return {
        values: {
          'menu-facile.contact_new': null,
          'menu-facile.households_total': null,
          'menu-facile.households_active_30d': null,
        },
        error: res.error?.message ?? 'Guichet MenuFacile injoignable',
      }
    }
    return {
      values: {
        'menu-facile.contact_new': res.data.contactNew,
        'menu-facile.households_total': res.data.householdsTotal,
        'menu-facile.households_active_30d': res.data.householdsActive30d,
      },
    }
  },
}

/** Tous les projets suivis. L'ordre ici est l'ordre d'affichage. */
export const PROJECT_REGISTRY: ProjectDef[] = [MENU_FACILE]

/** Toutes les mesures du registre, à plat — pour la pop-up de configuration. */
export function allProjectWidgets(): { project: ProjectDef; widget: ProjectWidgetDef }[] {
  return PROJECT_REGISTRY.flatMap((project) =>
    project.widgets.map((widget) => ({ project, widget })),
  )
}

/**
 * Résout l'état affiché d'une mesure : une préférence enregistrée l'emporte,
 * sinon on retombe sur le défaut du registre (absence de ligne en base).
 */
export function isWidgetEnabled(
  widget: ProjectWidgetDef,
  prefs: Record<string, boolean>,
): boolean {
  return prefs[widget.key] ?? widget.defaultEnabled
}
