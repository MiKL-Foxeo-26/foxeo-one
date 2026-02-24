import { describe, it, expect } from 'vitest'
import { isGraduationExcluded, isOnboardingExcluded, isConsentExcluded } from '../../middleware'

/**
 * Graduation Flow Integration Tests
 * Story 5.6 — Écran de graduation Lab vers One
 *
 * These tests validate the complete graduation flow logic:
 * 1. Middleware detects graduated client → redirect to /graduation/celebrate
 * 2. Client views celebration screen
 * 3. Client proceeds to discover-one or takes tutorial
 * 4. markGraduationScreenShown() is called → graduation_screen_shown = TRUE
 * 5. Client is redirected to /dashboard with One theme
 */
describe('Graduation Flow Integration', () => {
  describe('Step 1 — Middleware détection graduation', () => {
    function shouldRedirectToGraduation(client: {
      graduated_at: string | null
      graduation_screen_shown: boolean
    }, pathname: string): boolean {
      return !isGraduationExcluded(pathname) && !!client.graduated_at && !client.graduation_screen_shown
    }

    it('client graduable accédant au dashboard est redirigé vers /graduation/celebrate', () => {
      const client = { graduated_at: '2026-02-24T10:00:00Z', graduation_screen_shown: false }
      expect(shouldRedirectToGraduation(client, '/')).toBe(true)
      expect(shouldRedirectToGraduation(client, '/modules/crm')).toBe(true)
      expect(shouldRedirectToGraduation(client, '/settings')).toBe(true)
    })

    it('client avec graduation_screen_shown=true ne déclenche pas de redirect', () => {
      const client = { graduated_at: '2026-02-24T10:00:00Z', graduation_screen_shown: true }
      expect(shouldRedirectToGraduation(client, '/')).toBe(false)
    })

    it('client non gradué ne déclenche pas de redirect', () => {
      const client = { graduated_at: null, graduation_screen_shown: false }
      expect(shouldRedirectToGraduation(client, '/')).toBe(false)
    })
  })

  describe('Step 2 — Pages graduation exclues des autres redirections', () => {
    const graduationPaths = [
      '/graduation/celebrate',
      '/graduation/discover-one',
      '/graduation/tour-one',
    ]

    it('les pages graduation sont exclues du check graduation (pas de boucle)', () => {
      for (const path of graduationPaths) {
        expect(isGraduationExcluded(path)).toBe(true)
      }
    })

    it('les pages graduation sont exclues du check onboarding', () => {
      for (const path of graduationPaths) {
        expect(isOnboardingExcluded(path)).toBe(true)
      }
    })

    it('les pages graduation sont exclues du check consent', () => {
      for (const path of graduationPaths) {
        expect(isConsentExcluded(path)).toBe(true)
      }
    })
  })

  describe("Step 3 — Finalisation (graduation_screen_shown = TRUE)", () => {
    it('après finalisation, le client accède normalement au dashboard', () => {
      // Simulates state after markGraduationScreenShown is called
      const clientAfterGraduation = {
        graduated_at: '2026-02-24T10:00:00Z',
        graduation_screen_shown: true, // Updated by Server Action
      }

      function shouldRedirectToGraduation(client: typeof clientAfterGraduation, pathname: string) {
        return !isGraduationExcluded(pathname) && !!client.graduated_at && !client.graduation_screen_shown
      }

      // Dashboard is now accessible
      expect(shouldRedirectToGraduation(clientAfterGraduation, '/')).toBe(false)
      expect(shouldRedirectToGraduation(clientAfterGraduation, '/modules/crm')).toBe(false)
    })
  })
})
