'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@monprojetpro/supabase'
import { type ActionResponse, successResponse, errorResponse } from '@monprojetpro/types'
import { allProjectWidgets } from '../lib/project-widgets'

/**
 * Préférences d'affichage du coin « Mes projets » de l'accueil Hub.
 *
 * Une ligne n'existe que pour une mesure dont MiKL a changé l'état : l'absence
 * de ligne vaut « défaut du registre ». C'est ce qui permet d'ajouter une mesure
 * au code sans rien migrer — elle apparaît avec son défaut.
 */

/** Map `widget_key -> enabled` de l'opérateur courant. */
export async function getProjectWidgetPrefs(
  operatorId: string,
): Promise<ActionResponse<Record<string, boolean>>> {
  if (!operatorId) return successResponse({})

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('hub_project_widget_prefs')
    .select('widget_key, enabled')
    .eq('operator_id', operatorId)

  if (error) return errorResponse(error.message, 'PREFS_READ_FAILED')

  const prefs: Record<string, boolean> = {}
  for (const row of (data ?? []) as { widget_key: string; enabled: boolean }[]) {
    prefs[row.widget_key] = row.enabled
  }
  return successResponse(prefs)
}

/**
 * Enregistre l'état COMPLET des cases de la pop-up de configuration.
 * On écrit chaque clé présentée, décochée comprise : sans ligne explicite,
 * une mesure décochée retomberait sur son défaut du registre et reviendrait.
 */
export async function saveProjectWidgetPrefs(
  prefs: Record<string, boolean>,
): Promise<ActionResponse<{ saved: number }>> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return errorResponse('Session expirée', 'UNAUTHENTICATED')

  // L'opérateur se retrouve par son auth_user_id, jamais par son email
  // (leçon : un `.eq('email')` qui ne matche pas échoue en silence).
  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const operatorId = (operator as { id: string } | null)?.id
  if (!operatorId) return errorResponse('Compte opérateur requis', 'NOT_OPERATOR')

  // On ne persiste que des clés connues du registre : le corps de la requête
  // vient du navigateur, rien n'empêcherait d'y glisser des clés inventées qui
  // gonfleraient la table sans jamais être affichées.
  const known = new Set(allProjectWidgets().map(({ widget }) => widget.key))
  const rows = Object.entries(prefs)
    .filter(([widget_key]) => known.has(widget_key))
    .map(([widget_key, enabled]) => ({
      operator_id: operatorId,
      widget_key,
      enabled,
      updated_at: new Date().toISOString(),
    }))

  if (rows.length === 0) return successResponse({ saved: 0 })

  const { error } = await supabase
    .from('hub_project_widget_prefs')
    .upsert(rows, { onConflict: 'operator_id,widget_key' })

  if (error) return errorResponse(error.message, 'PREFS_WRITE_FAILED')

  // L'accueil est rendu côté serveur : sans ça, MiKL reverrait l'ancienne
  // sélection jusqu'à la prochaine navigation.
  revalidatePath('/')
  return successResponse({ saved: rows.length })
}
