// Story 8.9c — Task 4
// Supabase Edge Function : elio-alerts-cron
// Planifiée quotidiennement à 8h00 via pg_cron ou Supabase Cron Jobs.
// Évalue les règles d'alerte proactives pour tous les clients One+.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Types locaux (pas d'import workspace en Edge Function) ────────────────────

interface ProactiveAlert {
  id: string
  moduleId: string
  condition: string
  message: string
  frequency: 'daily' | 'weekly' | 'on_event'
  lastTriggered: string | null
  enabled: boolean
}

interface ElioAlertsPreferences {
  alerts: ProactiveAlert[]
  max_per_day: number
  sent_today: number
  last_reset: string
}

interface ClientRow {
  client_id: string
  elio_tier: string
  elio_alerts_preferences: ElioAlertsPreferences | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMessage(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = data[key]
    return value !== undefined ? String(value) : `{${key}}`
  })
}

// Task 5.2-5.4 — Évaluer une règle d'alerte
async function evaluateRule(
  supabase: SupabaseClient,
  clientId: string,
  alert: ProactiveAlert
): Promise<{ triggered: boolean; data?: Record<string, unknown> }> {
  const condition = alert.condition.replace(/\{client_id\}/g, clientId)

  try {
    const { data, error } = await supabase.rpc('evaluate_alert_condition', {
      query_text: condition,
    })

    if (error || !data) {
      return { triggered: false }
    }

    if (Array.isArray(data) && data.length > 0) {
      const row = data[0] as Record<string, unknown>
      // Requête COUNT : déclencher seulement si count > 0
      const countValue = row['count'] ?? row['COUNT']
      if (countValue !== undefined) {
        return { triggered: typeof countValue === 'number' && countValue > 0, data: row }
      }
      // Pas de colonne count (ex: calendrier) → présence de ligne suffit
      return { triggered: true, data: row }
    }

    return { triggered: false }
  } catch (err) {
    console.error('[ELIO:ALERTS:CRON] evaluateRule error', alert.id, err)
    return { triggered: false }
  }
}

// Task 6.2-6.3 — Envoyer une alerte (message Élio + notification)
async function sendAlert(
  supabase: SupabaseClient,
  clientId: string,
  alert: ProactiveAlert,
  data: Record<string, unknown>
): Promise<void> {
  const formattedMessage = formatMessage(alert.message, data)
  const elioContent = `🔔 **Alerte** : ${formattedMessage}`

  // Message dans la conversation Élio active
  const { data: conversation } = await supabase
    .from('elio_conversations')
    .select('id')
    .eq('user_id', clientId)
    .eq('dashboard_type', 'one')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (conversation) {
    await supabase.from('elio_messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: elioContent,
      metadata: { proactive_alert: true, alert_id: alert.id },
    })
  }

  // Notification in-app
  await supabase.from('notifications').insert({
    user_id: clientId,
    type: 'alert',
    title: 'Alerte Élio',
    content: formattedMessage,
    link: `/modules/${alert.moduleId}`,
  })
}

// ── Main handler ──────────────────────────────────────────────────────────────

serve(async (_req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Task 4.3 — Fetch tous les clients One+ avec alertes actives
  const { data: clients, error: fetchError } = await supabase
    .from('client_configs')
    .select('client_id, elio_tier, elio_alerts_preferences')
    .eq('elio_tier', 'one_plus')

  if (fetchError || !clients) {
    console.error('[ELIO:ALERTS:CRON] Failed to fetch clients', fetchError)
    return new Response('Error fetching clients', { status: 500 })
  }

  const today = new Date().toISOString().split('T')[0]
  let totalSent = 0

  for (const client of clients as ClientRow[]) {
    const prefs = client.elio_alerts_preferences

    // Skip si pas de prefs
    if (!prefs || !Array.isArray(prefs.alerts)) {
      continue
    }

    // Task 7.1-7.3 — Reset compteur quotidien + vérifier limite
    if (prefs.last_reset !== today) {
      prefs.sent_today = 0
      prefs.last_reset = today
    }

    if (prefs.sent_today >= prefs.max_per_day) {
      continue
    }

    // Task 4.4 — Évaluer chaque règle active
    const enabledAlerts = prefs.alerts.filter((a) => a.enabled)

    for (const alert of enabledAlerts) {
      if (prefs.sent_today >= prefs.max_per_day) break

      const { triggered, data: alertData } = await evaluateRule(supabase, client.client_id, alert)

      if (triggered && alertData) {
        // Task 4.5 — Envoyer l'alerte
        await sendAlert(supabase, client.client_id, alert, alertData)

        // Task 6.4 — Mettre à jour lastTriggered
        alert.lastTriggered = new Date().toISOString()
        prefs.sent_today++
        totalSent++
      }
    }

    // Sauvegarder les prefs mises à jour
    await supabase
      .from('client_configs')
      .update({ elio_alerts_preferences: prefs })
      .eq('client_id', client.client_id)
  }

  console.info(`[ELIO:ALERTS:CRON] Processed ${clients.length} clients, sent ${totalSent} alerts`)
  return new Response(
    JSON.stringify({ processed: clients.length, sent: totalSent }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
