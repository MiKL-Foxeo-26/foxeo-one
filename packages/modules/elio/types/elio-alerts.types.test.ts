import { describe, it, expect } from 'vitest'
import { proactiveAlertSchema, elioAlertsPreferencesSchema } from './elio.types'

// ── Tests Zod schemas (Story 8.9c — Task 1.2) ────────────────────────────────

describe('proactiveAlertSchema (Story 8.9c — Task 1.2)', () => {
  const VALID_ALERT = {
    id: 'unpaid_subscriptions',
    moduleId: 'adhesions',
    condition: "SELECT COUNT(*) FROM memberships",
    message: 'Vous avez {count} cotisations impayées',
    frequency: 'weekly' as const,
    lastTriggered: null,
    enabled: true,
  }

  it('valide une alerte correcte', () => {
    const result = proactiveAlertSchema.safeParse(VALID_ALERT)
    expect(result.success).toBe(true)
  })

  it('valide toutes les fréquences possibles', () => {
    for (const frequency of ['daily', 'weekly', 'on_event'] as const) {
      const result = proactiveAlertSchema.safeParse({ ...VALID_ALERT, frequency })
      expect(result.success).toBe(true)
    }
  })

  it('valide lastTriggered null et string ISO', () => {
    const withNull = proactiveAlertSchema.safeParse({ ...VALID_ALERT, lastTriggered: null })
    expect(withNull.success).toBe(true)

    const withDate = proactiveAlertSchema.safeParse({ ...VALID_ALERT, lastTriggered: '2026-03-04T08:00:00Z' })
    expect(withDate.success).toBe(true)
  })

  it('rejette si id est vide', () => {
    const result = proactiveAlertSchema.safeParse({ ...VALID_ALERT, id: '' })
    expect(result.success).toBe(false)
  })

  it('rejette une fréquence invalide', () => {
    const result = proactiveAlertSchema.safeParse({ ...VALID_ALERT, frequency: 'monthly' })
    expect(result.success).toBe(false)
  })

  it('rejette si moduleId est vide', () => {
    const result = proactiveAlertSchema.safeParse({ ...VALID_ALERT, moduleId: '' })
    expect(result.success).toBe(false)
  })
})

describe('elioAlertsPreferencesSchema (Story 8.9c — Task 1.2)', () => {
  const VALID_PREFS = {
    alerts: [],
    max_per_day: 3,
    sent_today: 0,
    last_reset: '2026-03-04',
  }

  it('valide des prefs correctes', () => {
    const result = elioAlertsPreferencesSchema.safeParse(VALID_PREFS)
    expect(result.success).toBe(true)
  })

  it('rejette si last_reset n\'est pas YYYY-MM-DD', () => {
    const result = elioAlertsPreferencesSchema.safeParse({ ...VALID_PREFS, last_reset: '04/03/2026' })
    expect(result.success).toBe(false)
  })

  it('rejette si max_per_day < 1', () => {
    const result = elioAlertsPreferencesSchema.safeParse({ ...VALID_PREFS, max_per_day: 0 })
    expect(result.success).toBe(false)
  })

  it('rejette si sent_today < 0', () => {
    const result = elioAlertsPreferencesSchema.safeParse({ ...VALID_PREFS, sent_today: -1 })
    expect(result.success).toBe(false)
  })

  it('rejette si max_per_day > 10', () => {
    const result = elioAlertsPreferencesSchema.safeParse({ ...VALID_PREFS, max_per_day: 11 })
    expect(result.success).toBe(false)
  })
})
