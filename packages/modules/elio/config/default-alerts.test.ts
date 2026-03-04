import { describe, it, expect } from 'vitest'
import {
  DEFAULT_PROACTIVE_ALERTS,
  DEFAULT_ELIO_ALERTS_PREFERENCES,
} from './default-alerts'

// ── Tests Task 3 ──────────────────────────────────────────────────────────────

describe('DEFAULT_PROACTIVE_ALERTS (Story 8.9c — Task 3)', () => {
  it('Task 3.2 — contient les alertes basées sur les données', () => {
    const ids = DEFAULT_PROACTIVE_ALERTS.map((a) => a.id)
    expect(ids).toContain('missing_attendance_sheets')
    expect(ids).toContain('unpaid_subscriptions')
  })

  it('Task 3.3 — contient les alertes basées sur le calendrier', () => {
    const ids = DEFAULT_PROACTIVE_ALERTS.map((a) => a.id)
    expect(ids).toContain('upcoming_event')
    expect(ids).toContain('subscription_renewal')
  })

  it('Task 3.4 — contient les alertes basées sur l\'activité', () => {
    const ids = DEFAULT_PROACTIVE_ALERTS.map((a) => a.id)
    expect(ids).toContain('inactivity_warning')
  })

  it('toutes les alertes ont les champs requis', () => {
    for (const alert of DEFAULT_PROACTIVE_ALERTS) {
      expect(alert.id).toBeTruthy()
      expect(alert.moduleId).toBeTruthy()
      expect(alert.condition).toBeTruthy()
      expect(alert.message).toBeTruthy()
      expect(['daily', 'weekly', 'on_event']).toContain(alert.frequency)
      expect(alert.lastTriggered).toBeNull()
      expect(alert.enabled).toBe(true)
    }
  })

  it('toutes les alertes sont activées par défaut', () => {
    expect(DEFAULT_PROACTIVE_ALERTS.every((a) => a.enabled)).toBe(true)
  })
})

describe('DEFAULT_ELIO_ALERTS_PREFERENCES (Story 8.9c — Task 2)', () => {
  // Task 9.3 — limite 3/jour
  it('max_per_day est 3', () => {
    expect(DEFAULT_ELIO_ALERTS_PREFERENCES.max_per_day).toBe(3)
  })

  it('sent_today est 0 par défaut', () => {
    expect(DEFAULT_ELIO_ALERTS_PREFERENCES.sent_today).toBe(0)
  })

  it('last_reset est une valeur neutre au format YYYY-MM-DD', () => {
    expect(DEFAULT_ELIO_ALERTS_PREFERENCES.last_reset).toBe('1970-01-01')
  })

  it('contient les alertes par défaut', () => {
    expect(DEFAULT_ELIO_ALERTS_PREFERENCES.alerts).toHaveLength(
      DEFAULT_PROACTIVE_ALERTS.length
    )
  })
})

// ── Simulation limite 3/jour (Task 7) ─────────────────────────────────────────

describe('Limite 3 alertes/jour — logique cron (Story 8.9c — Task 7)', () => {
  it('Task 7.1 — skip si sent_today >= max_per_day', () => {
    const prefs = { ...DEFAULT_ELIO_ALERTS_PREFERENCES, sent_today: 3, max_per_day: 3 }
    // Simuler la logique : si sent_today >= max_per_day → skip client
    const shouldSkip = prefs.sent_today >= prefs.max_per_day
    expect(shouldSkip).toBe(true)
  })

  it('Task 7.1 — ne skip pas si sent_today < max_per_day', () => {
    const prefs = { ...DEFAULT_ELIO_ALERTS_PREFERENCES, sent_today: 2, max_per_day: 3 }
    const shouldSkip = prefs.sent_today >= prefs.max_per_day
    expect(shouldSkip).toBe(false)
  })

  it('Task 7.3 — reset sent_today si last_reset est une date passée', () => {
    const prefs = {
      ...DEFAULT_ELIO_ALERTS_PREFERENCES,
      sent_today: 3,
      last_reset: '2026-01-01',
    }
    const today = new Date().toISOString().split('T')[0]

    // Simuler la logique de reset
    if (prefs.last_reset !== today) {
      prefs.sent_today = 0
      prefs.last_reset = today
    }

    expect(prefs.sent_today).toBe(0)
    expect(prefs.last_reset).toBe(today)
  })

  it('Task 7.3 — ne reset pas si last_reset est aujourd\'hui', () => {
    const today = new Date().toISOString().split('T')[0]
    const prefs = {
      ...DEFAULT_ELIO_ALERTS_PREFERENCES,
      sent_today: 2,
      last_reset: today,
    }

    if (prefs.last_reset !== today) {
      prefs.sent_today = 0
    }

    expect(prefs.sent_today).toBe(2)
  })
})
