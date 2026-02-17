// Edge Function: check-inactivity
// Story: 2.10 — Alertes inactivité Lab & import clients CSV
// Exécution: quotidienne via pg_cron (voir documentation ci-dessous)
//
// pg_cron setup (à exécuter manuellement dans Supabase SQL Editor) :
// SELECT cron.schedule(
//   'check-inactivity-daily',
//   '0 8 * * *', -- Tous les jours à 8h
//   $$SELECT net.http_post(
//     url := '<SUPABASE_URL>/functions/v1/check-inactivity',
//     headers := '{"Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb
//   )$$
// );

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Operator {
  id: string
  inactivity_threshold_days: number
}

interface InactiveClient {
  id: string
  name: string
  email: string
  last_activity: string
}

Deno.serve(async (req) => {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[CRM:CHECK_INACTIVITY] Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Service role pour bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Récupérer tous les opérateurs avec leur threshold
    const { data: operators, error: operatorsError } = await supabase
      .from('operators')
      .select('id, inactivity_threshold_days')

    if (operatorsError) {
      console.error('[CRM:CHECK_INACTIVITY] Failed to fetch operators:', operatorsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch operators' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let totalAlerts = 0

    for (const operator of (operators as Operator[]) ?? []) {
      const threshold = operator.inactivity_threshold_days || 7
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - threshold)

      // Appel de la fonction SQL pour trouver les clients Lab inactifs
      const { data: inactiveClients, error: rpcError } = await supabase.rpc(
        'get_inactive_lab_clients',
        {
          p_operator_id: operator.id,
          p_cutoff_date: cutoffDate.toISOString(),
        }
      )

      if (rpcError) {
        console.error(
          `[CRM:CHECK_INACTIVITY] RPC error for operator ${operator.id}:`,
          rpcError
        )
        continue
      }

      for (const client of (inactiveClients as InactiveClient[]) ?? []) {
        const daysSinceActivity = Math.floor(
          (Date.now() - new Date(client.last_activity).getTime()) / (1000 * 60 * 60 * 24)
        )

        // Créer notification pour l'opérateur
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            operator_id: operator.id,
            type: 'inactivity_alert',
            title: `Client inactif : ${client.name}`,
            message: `${client.name} est inactif depuis ${daysSinceActivity} jours. Dernière activité : ${new Date(client.last_activity).toLocaleDateString('fr-FR')}.`,
            entity_type: 'client',
            entity_id: client.id,
          })

        if (notifError) {
          console.error(
            `[CRM:CHECK_INACTIVITY] Notification insert error for client ${client.id}:`,
            notifError
          )
          continue
        }

        // Marquer l'alerte comme envoyée
        const { error: flagError } = await supabase
          .from('client_configs')
          .update({ inactivity_alert_sent: true })
          .eq('client_id', client.id)

        if (flagError) {
          console.error(
            `[CRM:CHECK_INACTIVITY] Flag update error for client ${client.id}:`,
            flagError
          )
          continue
        }

        totalAlerts++
      }
    }

    console.log(`[CRM:CHECK_INACTIVITY] Completed: ${totalAlerts} alerts sent`)

    return new Response(
      JSON.stringify({ success: true, alertsSent: totalAlerts }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[CRM:CHECK_INACTIVITY] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
