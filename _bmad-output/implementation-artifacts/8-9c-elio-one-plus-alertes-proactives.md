# Story 8.9c: Élio One+ — Alertes proactives

Status: ready-for-dev

## Story

As a **client One+**,
I want **qu'Élio m'alerte proactivement quand quelque chose requiert mon attention**,
So that **je suis informé en temps réel sans avoir à surveiller moi-même tous mes indicateurs**.

## Acceptance Criteria

### AC1 : Système d'alertes proactives (FR50)

**Given** le système d'alertes proactives Élio One+
**When** des conditions spécifiques sont détectées
**Then** Élio One+ envoie des alertes proactives au client :

- **Alertes basées sur les données** :
  - "3 feuilles d'émargement manquent pour les cours d'hier"
  - "Vous avez 5 cotisations impayées depuis plus de 30 jours"

- **Alertes basées sur le calendrier** :
  - "Rappel : événement 'Assemblée Générale' dans 2 jours — 12 inscrits"
  - "Votre abonnement Foxeo est renouvelé dans 7 jours"

- **Alertes basées sur l'activité** :
  - "Vous n'avez pas publié de contenu depuis 2 semaines"

**And** les alertes sont implémentées via un système de règles configurables

### AC2 : Structure des règles d'alerte

**Given** la structure des règles d'alerte
**Then** chaque règle est définie par :

```typescript
type ProactiveAlert = {
  id: string
  moduleId: string
  condition: string          // SQL-like condition evaluated periodically
  message: string            // Template de message avec variables
  frequency: 'daily' | 'weekly' | 'on_event'
  lastTriggered: string | null
}
```

**And** les règles sont stockées dans `client_configs.elio_alerts_preferences`

### AC3 : Évaluation des alertes

**Given** les alertes proactives sont évaluées
**When** le cron job s'exécute (quotidien, 8h00)
**Then** pour chaque client One+ :

1. Les règles d'alerte actives sont évaluées contre les données Supabase
2. Les alertes déclenchées sont envoyées comme messages Élio + notifications
3. Le `lastTriggered` est mis à jour pour éviter les doublons

**And** le cron job est une Supabase Edge Function planifiée
**And** les alertes sont limitées à 3 par jour par client (anti-spam)

### AC4 : Désactivation d'alertes

**Given** le client One+ reçoit une alerte
**When** il veut désactiver cette alerte
**Then** il peut dire à Élio :
> "Arrête de me rappeler pour les feuilles d'émargement"

**And** Élio désactive la règle correspondante dans `client_configs.elio_alerts_preferences`
**And** la règle est marquée comme `enabled: false`

## Tasks / Subtasks

- [ ] **Task 1** : Créer la structure `ProactiveAlert` (AC: #2)
  - [ ] 1.1 : Créer le type dans `types/elio.types.ts`
  - [ ] 1.2 : Créer le schéma Zod `proactiveAlertSchema`

- [ ] **Task 2** : Ajouter `elio_alerts_preferences` dans `client_configs`
  - [ ] 2.1 : Migration Supabase pour ajouter le champ JSONB
  - [ ] 2.2 : Structure : `{ alerts: ProactiveAlert[], max_per_day: 3 }`

- [ ] **Task 3** : Créer les règles d'alerte par défaut (AC: #1, FR50)
  - [ ] 3.1 : Créer `config/default-alerts.ts`
  - [ ] 3.2 : Règles basées sur les données (feuilles émargement, cotisations)
  - [ ] 3.3 : Règles basées sur le calendrier (événements, abonnement)
  - [ ] 3.4 : Règles basées sur l'activité (inactivité)

- [ ] **Task 4** : Créer la Supabase Edge Function cron (AC: #3)
  - [ ] 4.1 : Créer `supabase/functions/elio-alerts-cron/index.ts`
  - [ ] 4.2 : Scheduler cron (quotidien, 8h00)
  - [ ] 4.3 : Fetch tous les clients One+ avec alertes actives
  - [ ] 4.4 : Évaluer chaque règle
  - [ ] 4.5 : Envoyer alertes déclenchées

- [ ] **Task 5** : Créer l'évaluation des règles
  - [ ] 5.1 : Créer `utils/evaluate-alert-rule.ts`
  - [ ] 5.2 : Parser la condition SQL-like
  - [ ] 5.3 : Exécuter la requête Supabase
  - [ ] 5.4 : Retourner `{ triggered: boolean, data: unknown }`

- [ ] **Task 6** : Créer l'envoi d'alerte
  - [ ] 6.1 : Créer `actions/send-proactive-alert.ts`
  - [ ] 6.2 : Créer un message Élio dans la conversation active
  - [ ] 6.3 : Créer une notification in-app de type 'alert'
  - [ ] 6.4 : Mettre à jour `lastTriggered`

- [ ] **Task 7** : Limiter à 3 alertes/jour (AC: #3)
  - [ ] 7.1 : Compter les alertes envoyées aujourd'hui
  - [ ] 7.2 : Skip si >= 3 alertes déjà envoyées
  - [ ] 7.3 : Stocker le compteur dans `client_configs.elio_alerts_preferences.sent_today`

- [ ] **Task 8** : Désactivation d'alertes (AC: #4)
  - [ ] 8.1 : Créer `actions/disable-alert.ts`
  - [ ] 8.2 : Détecter intention "Arrête de me rappeler pour {sujet}"
  - [ ] 8.3 : Identifier la règle correspondante
  - [ ] 8.4 : Marquer `enabled: false` dans `elio_alerts_preferences`
  - [ ] 8.5 : Confirmer à l'utilisateur

- [ ] **Task 9** : Tests
  - [ ] 9.1 : Tester évaluation règles (données, calendrier, activité)
  - [ ] 9.2 : Tester envoi alertes (message Élio + notification)
  - [ ] 9.3 : Tester limite 3/jour
  - [ ] 9.4 : Tester désactivation

## Dev Notes

### Type ProactiveAlert

```typescript
// types/elio.types.ts
export interface ProactiveAlert {
  id: string
  moduleId: string
  condition: string          // SQL-like : "SELECT COUNT(*) FROM ... WHERE ..."
  message: string            // Template : "Vous avez {count} cotisations impayées"
  frequency: 'daily' | 'weekly' | 'on_event'
  lastTriggered: string | null
  enabled: boolean
}

export interface ElioAlertsPreferences {
  alerts: ProactiveAlert[]
  max_per_day: number
  sent_today: number
  last_reset: string          // Date du dernier reset du compteur
}
```

### Règles d'alerte par défaut

```typescript
// config/default-alerts.ts
export const DEFAULT_PROACTIVE_ALERTS: ProactiveAlert[] = [
  {
    id: 'unpaid_subscriptions',
    moduleId: 'adhesions',
    condition: "SELECT COUNT(*) FROM memberships WHERE status='unpaid' AND due_date < NOW() - INTERVAL '30 days'",
    message: 'Vous avez {count} cotisations impayées depuis plus de 30 jours',
    frequency: 'weekly',
    lastTriggered: null,
    enabled: true,
  },
  {
    id: 'missing_attendance_sheets',
    moduleId: 'presences',
    condition: "SELECT COUNT(*) FROM courses WHERE date = CURRENT_DATE - 1 AND attendance_sheet_id IS NULL",
    message: '{count} feuilles d\'émargement manquent pour les cours d\'hier',
    frequency: 'daily',
    lastTriggered: null,
    enabled: true,
  },
  {
    id: 'upcoming_event',
    moduleId: 'agenda',
    condition: "SELECT * FROM events WHERE start_date BETWEEN NOW() AND NOW() + INTERVAL '2 days'",
    message: 'Rappel : événement \'{event_name}\' dans 2 jours — {attendees_count} inscrits',
    frequency: 'on_event',
    lastTriggered: null,
    enabled: true,
  },
  {
    id: 'subscription_renewal',
    moduleId: 'facturation',
    condition: "SELECT * FROM subscriptions WHERE renewal_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'",
    message: 'Votre abonnement Foxeo est renouvelé dans 7 jours',
    frequency: 'weekly',
    lastTriggered: null,
    enabled: true,
  },
  {
    id: 'inactivity_warning',
    moduleId: 'core-dashboard',
    condition: "SELECT last_login FROM auth.users WHERE id = {client_id} AND last_login < NOW() - INTERVAL '14 days'",
    message: 'Vous n\'avez pas publié de contenu depuis 2 semaines',
    frequency: 'weekly',
    lastTriggered: null,
    enabled: true,
  },
]
```

### Edge Function cron

```typescript
// supabase/functions/elio-alerts-cron/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Fetch tous les clients One+
  const { data: clients } = await supabaseClient
    .from('client_configs')
    .select('client_id, elio_tier, elio_alerts_preferences')
    .eq('elio_tier', 'one_plus')

  if (!clients) {
    return new Response('No clients', { status: 200 })
  }

  // 2. Pour chaque client
  for (const client of clients) {
    const prefs = client.elio_alerts_preferences as ElioAlertsPreferences

    // Reset compteur quotidien si besoin
    const today = new Date().toISOString().split('T')[0]
    if (prefs.last_reset !== today) {
      prefs.sent_today = 0
      prefs.last_reset = today
    }

    // Limite 3 alertes/jour
    if (prefs.sent_today >= prefs.max_per_day) {
      continue
    }

    // 3. Évaluer chaque règle
    for (const alert of prefs.alerts.filter(a => a.enabled)) {
      const { triggered, data } = await evaluateAlertRule(supabaseClient, client.client_id, alert)

      if (triggered) {
        // Envoyer l'alerte
        await sendProactiveAlert(supabaseClient, client.client_id, alert, data)

        // Mettre à jour lastTriggered
        alert.lastTriggered = new Date().toISOString()
        prefs.sent_today++

        // Limite atteinte ?
        if (prefs.sent_today >= prefs.max_per_day) break
      }
    }

    // 4. Sauvegarder les prefs
    await supabaseClient
      .from('client_configs')
      .update({ elio_alerts_preferences: prefs })
      .eq('client_id', client.client_id)
  }

  return new Response('Alerts processed', { status: 200 })
})
```

### Évaluation règle

```typescript
// utils/evaluate-alert-rule.ts
export async function evaluateAlertRule(
  supabase: SupabaseClient,
  clientId: string,
  alert: ProactiveAlert
): Promise<{ triggered: boolean; data?: unknown }> {
  // Remplacer {client_id} dans la condition
  const condition = alert.condition.replace('{client_id}', clientId)

  try {
    // Exécuter la requête (simplifié — à adapter selon la vraie structure)
    const { data, error } = await supabase.rpc('execute_alert_condition', {
      query: condition,
    })

    if (error || !data) {
      return { triggered: false }
    }

    // Si COUNT(*) > 0 → triggered
    if (Array.isArray(data) && data.length > 0) {
      return { triggered: true, data: data[0] }
    }

    return { triggered: false }
  } catch (err) {
    console.error('[ELIO:ALERT] Error evaluating rule', err)
    return { triggered: false }
  }
}
```

### Envoi alerte

```typescript
// actions/send-proactive-alert.ts
export async function sendProactiveAlert(
  supabase: SupabaseClient,
  clientId: string,
  alert: ProactiveAlert,
  data: unknown
): Promise<void> {
  // 1. Formater le message avec les données
  let message = alert.message
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    message = message.replace(`{${key}}`, String(value))
  }

  // 2. Créer un message dans la conversation Élio active
  const { data: conversation } = await supabase
    .from('elio_conversations')
    .select('id')
    .eq('user_id', clientId)
    .eq('dashboard_type', 'one')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (conversation) {
    await supabase.from('elio_messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: `🔔 **Alerte** : ${message}`,
      metadata: { proactive_alert: true, alert_id: alert.id },
    })
  }

  // 3. Créer une notification in-app
  await supabase.from('notifications').insert({
    user_id: clientId,
    type: 'alert',
    title: 'Alerte Élio',
    content: message,
    link: `/modules/${alert.moduleId}`,
  })
}
```

### Désactivation alerte

```typescript
// actions/disable-alert.ts
'use server'

export async function disableAlert(
  clientId: string,
  alertSubject: string
): Promise<ActionResponse<boolean>> {
  const supabase = createServerClient()

  // 1. Charger les prefs
  const { data: config } = await supabase
    .from('client_configs')
    .select('elio_alerts_preferences')
    .eq('client_id', clientId)
    .single()

  if (!config) {
    return { data: null, error: { message: 'Config non trouvée', code: 'NOT_FOUND' } }
  }

  const prefs = config.elio_alerts_preferences as ElioAlertsPreferences

  // 2. Trouver la règle correspondante (fuzzy match sur le sujet)
  const alert = prefs.alerts.find(a =>
    a.message.toLowerCase().includes(alertSubject.toLowerCase())
  )

  if (!alert) {
    return { data: null, error: { message: 'Alerte non trouvée', code: 'NOT_FOUND' } }
  }

  // 3. Désactiver
  alert.enabled = false

  // 4. Sauvegarder
  const { error } = await supabase
    .from('client_configs')
    .update({ elio_alerts_preferences: prefs })
    .eq('client_id', clientId)

  if (error) {
    return { data: null, error: { message: 'Erreur sauvegarde', code: 'DB_ERROR' } }
  }

  return { data: true, error: null }
}
```

### References

- [Source: Epic 8 — Story 8.9c](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-89c)
- [Source: PRD — FR50](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.9a
**FRs couvertes** : FR50 (alertes proactives One+)
