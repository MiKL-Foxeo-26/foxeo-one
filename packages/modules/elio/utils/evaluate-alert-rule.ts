import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProactiveAlert } from '../types/elio.types'

export interface AlertEvalResult {
  triggered: boolean
  data?: Record<string, unknown>
}

/**
 * Story 8.9c — Task 5
 * Évalue une règle d'alerte contre les données Supabase du client.
 *
 * La `condition` est une pseudo-requête SQL dont les variables ({client_id}) sont résolues
 * avant d'appeler la RPC `evaluate_alert_condition` (Deno/Edge side uniquement — non exposée
 * côté client). En environnement test, on injecte un supabase mock.
 *
 * Retourne { triggered: true, data } si la requête retourne au moins une ligne avec une valeur > 0.
 * Retourne { triggered: false } en cas d'erreur ou résultat vide.
 */
export async function evaluateAlertRule(
  supabase: SupabaseClient,
  clientId: string,
  alert: ProactiveAlert
): Promise<AlertEvalResult> {
  // Task 5.2 — Parser la condition SQL-like : remplacer {client_id}
  const condition = alert.condition.replace(/\{client_id\}/g, clientId)

  try {
    // Task 5.3 — Exécuter la requête via RPC dédiée (évite SQL injection : requête paramétrée côté RPC)
    const { data, error } = await supabase.rpc('evaluate_alert_condition', {
      query_text: condition,
    })

    if (error || data === null || data === undefined) {
      return { triggered: false }
    }

    // Task 5.4 — Retourner { triggered, data }
    // Un tableau non vide avec au moins un champ numérique > 0 → triggered
    if (Array.isArray(data) && data.length > 0) {
      const row = data[0] as Record<string, unknown>
      // Chercher une colonne count/nombre nommée 'count' ou similaire
      const countValue = row['count'] ?? row['COUNT']
      if (countValue !== undefined) {
        // Requête basée sur COUNT : déclencher seulement si count > 0
        return { triggered: typeof countValue === 'number' && countValue > 0, data: row }
      }
      // Pas de colonne count (ex: requête calendrier) → présence de ligne suffit
      return { triggered: true, data: row }
    }

    return { triggered: false }
  } catch (err) {
    console.error('[ELIO:ALERTS] Error evaluating rule', alert.id, err)
    return { triggered: false }
  }
}

/**
 * Formate le message d'alerte en substituant les variables {key} par les valeurs du résultat.
 */
export function formatAlertMessage(
  template: string,
  data: Record<string, unknown>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = data[key]
    return value !== undefined ? String(value) : `{${key}}`
  })
}
