'use server'

import { type ActionResponse, successResponse, errorResponse } from '@monprojetpro/types'
import { callMenuFacileAdmin, MenuFacileAdminError } from './admin-client'
import { buildHouseholdsQuery } from '../utils/query'
import type { MenuFacileMetrics, HouseholdListItem, Paginated } from '../types'

/**
 * Les quelques chiffres que le coin « Mes projets » de l'accueil Hub affiche
 * pour MenuFacile.
 *
 * ⚠️ Convention du guichet reprise telle quelle : `null` = « non calculable »,
 * JAMAIS « zéro ». Un `?? 0` ici ferait afficher « 0 message en attente » alors
 * que le guichet n'a rien répondu — exactement le mensonge qu'on veut éviter.
 */
export interface MenuFacileHomeWidgets {
  /** Messages de la boîte Aide & Contact au statut « nouveau ». */
  contactNew: number | null
  /** Foyers inscrits, tous statuts confondus. */
  householdsTotal: number | null
  /** Foyers ayant eu une activité sur les 30 derniers jours. */
  householdsActive30d: number | null
}

/**
 * Un seul aller-retour par mesure, en parallèle. Si UNE source échoue, les
 * autres chiffres restent affichés : on renvoie `null` sur la seule mesure
 * fautive au lieu de faire tomber toute la carte.
 */
export async function getMenuFacileHomeWidgets(): Promise<ActionResponse<MenuFacileHomeWidgets>> {
  try {
    const [metrics, active30d] = await Promise.all([
      callMenuFacileAdmin<MenuFacileMetrics>('/metrics'),
      // `limit: 1` : seul le `total` de l'enveloppe paginée nous intéresse,
      // inutile de rapatrier les foyers eux-mêmes.
      callMenuFacileAdmin<Paginated<HouseholdListItem>>(
        `/households${buildHouseholdsQuery({ activity: '30d', limit: 1 })}`,
      ).catch(() => null),
    ])

    return successResponse({
      // `contact` est optionnel dans le contrat (ajouté en v6) : absent = non disponible.
      contactNew: metrics?.contact?.new ?? null,
      householdsTotal: metrics?.households?.total ?? null,
      householdsActive30d: active30d?.total ?? null,
    })
  } catch (err) {
    if (err instanceof MenuFacileAdminError) {
      return errorResponse(err.message, `MENUFACILE_HTTP_${err.status}`)
    }
    return errorResponse(
      err instanceof Error ? err.message : 'Guichet MenuFacile injoignable',
      'MENUFACILE_UNKNOWN',
    )
  }
}
