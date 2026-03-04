import { describe, it, expect, vi } from 'vitest'
import { evaluateAlertRule, formatAlertMessage } from './evaluate-alert-rule'
import type { ProactiveAlert } from '../types/elio.types'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const DATA_ALERT: ProactiveAlert = {
  id: 'unpaid_subscriptions',
  moduleId: 'adhesions',
  condition: "SELECT COUNT(*) AS count FROM memberships WHERE status='unpaid'",
  message: 'Vous avez {count} cotisations impayées',
  frequency: 'weekly',
  lastTriggered: null,
  enabled: true,
}

const CALENDAR_ALERT: ProactiveAlert = {
  id: 'upcoming_event',
  moduleId: 'agenda',
  condition: "SELECT event_name, attendees_count FROM events WHERE start_date > NOW()",
  message: "Rappel : événement '{event_name}' — {attendees_count} inscrits",
  frequency: 'on_event',
  lastTriggered: null,
  enabled: true,
}

const ACTIVITY_ALERT: ProactiveAlert = {
  id: 'inactivity_warning',
  moduleId: 'core-dashboard',
  condition: "SELECT COUNT(*) AS count FROM auth.users WHERE id = '{client_id}'",
  message: "Vous n'avez pas publié de contenu depuis 2 semaines",
  frequency: 'weekly',
  lastTriggered: null,
  enabled: true,
}

function makeSupabaseMock(rpcResult: { data: unknown; error: unknown }) {
  return {
    rpc: vi.fn().mockResolvedValue(rpcResult),
  }
}

// ── Tests evaluateAlertRule ───────────────────────────────────────────────────

describe('evaluateAlertRule (Story 8.9c — Task 5)', () => {
  // Task 9.1 — données
  it('DATA — déclenche si COUNT > 0', async () => {
    const supabase = makeSupabaseMock({ data: [{ count: 5 }], error: null })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', DATA_ALERT)

    expect(result.triggered).toBe(true)
    expect(result.data).toEqual({ count: 5 })
  })

  it('DATA — ne déclenche pas si COUNT = 0', async () => {
    const supabase = makeSupabaseMock({ data: [{ count: 0 }], error: null })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', DATA_ALERT)

    // count 0 → pas de valeur positive → triggered false
    // Note: la logique détecte hasPositiveCount = false → triggered false
    expect(result.triggered).toBe(false)
  })

  // Task 9.1 — calendrier
  it('CALENDAR — déclenche si une ligne retournée', async () => {
    const supabase = makeSupabaseMock({
      data: [{ event_name: 'Assemblée Générale', attendees_count: 12 }],
      error: null,
    })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', CALENDAR_ALERT)

    expect(result.triggered).toBe(true)
    expect(result.data).toEqual({ event_name: 'Assemblée Générale', attendees_count: 12 })
  })

  it('CALENDAR — ne déclenche pas si tableau vide', async () => {
    const supabase = makeSupabaseMock({ data: [], error: null })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', CALENDAR_ALERT)

    expect(result.triggered).toBe(false)
  })

  // Task 9.1 — activité
  it('ACTIVITY — remplace {client_id} dans la condition', async () => {
    const supabase = makeSupabaseMock({ data: [{ count: 1 }], error: null })
    await evaluateAlertRule(supabase as never, 'my-client-id', ACTIVITY_ALERT)

    const calledCondition = (supabase.rpc as ReturnType<typeof vi.fn>).mock.calls[0][1].query_text
    expect(calledCondition).toContain('my-client-id')
    expect(calledCondition).not.toContain('{client_id}')
  })

  it('retourne triggered:false si erreur RPC', async () => {
    const supabase = makeSupabaseMock({ data: null, error: new Error('DB error') })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', DATA_ALERT)

    expect(result.triggered).toBe(false)
  })

  it('retourne triggered:false si data null', async () => {
    const supabase = makeSupabaseMock({ data: null, error: null })
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', DATA_ALERT)

    expect(result.triggered).toBe(false)
  })

  it('gère les exceptions sans throw', async () => {
    const supabase = {
      rpc: vi.fn().mockRejectedValue(new Error('Network error')),
    }
    const result = await evaluateAlertRule(supabase as never, 'client-uuid', DATA_ALERT)

    expect(result.triggered).toBe(false)
  })
})

// ── Tests formatAlertMessage ──────────────────────────────────────────────────

describe('formatAlertMessage (Story 8.9c)', () => {
  it('substitue les variables {key} simples', () => {
    const result = formatAlertMessage('Vous avez {count} cotisations impayées', { count: 5 })
    expect(result).toBe('Vous avez 5 cotisations impayées')
  })

  it('substitue plusieurs variables', () => {
    const result = formatAlertMessage(
      "Rappel : événement '{event_name}' — {attendees_count} inscrits",
      { event_name: 'Assemblée Générale', attendees_count: 12 }
    )
    expect(result).toBe("Rappel : événement 'Assemblée Générale' — 12 inscrits")
  })

  it('conserve le placeholder si la variable est absente', () => {
    const result = formatAlertMessage('Vous avez {count} alertes', {})
    expect(result).toBe('Vous avez {count} alertes')
  })

  it('gère un objet data vide', () => {
    const result = formatAlertMessage('Message sans variables', {})
    expect(result).toBe('Message sans variables')
  })
})
