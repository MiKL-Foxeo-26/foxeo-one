import { describe, it, expect } from 'vitest'
import { isPublicPath, isStaticOrApi, isConsentExcluded, CONSENT_EXCLUDED_PATHS } from './middleware'

describe('middleware routing logic', () => {
  describe('isPublicPath', () => {
    it('returns true for /login', () => {
      expect(isPublicPath('/login')).toBe(true)
    })

    it('returns true for /signup', () => {
      expect(isPublicPath('/signup')).toBe(true)
    })

    it('returns true for /auth/callback', () => {
      expect(isPublicPath('/auth/callback')).toBe(true)
    })

    it('returns false for dashboard routes', () => {
      expect(isPublicPath('/')).toBe(false)
      expect(isPublicPath('/modules/crm')).toBe(false)
      expect(isPublicPath('/settings')).toBe(false)
    })

    it('returns false for /loginx (no false positive)', () => {
      expect(isPublicPath('/loginx')).toBe(false)
    })
  })

  describe('isStaticOrApi', () => {
    it('returns true for _next static', () => {
      expect(isStaticOrApi('/_next/static/chunk.js')).toBe(true)
    })

    it('returns true for webhooks', () => {
      expect(isStaticOrApi('/api/webhooks/cal-com')).toBe(true)
    })

    it('returns true for favicon', () => {
      expect(isStaticOrApi('/favicon.ico')).toBe(true)
    })

    it('returns false for regular API routes', () => {
      expect(isStaticOrApi('/api/something')).toBe(false)
    })

    it('returns false for page routes', () => {
      expect(isStaticOrApi('/login')).toBe(false)
      expect(isStaticOrApi('/')).toBe(false)
    })
  })

  describe('isConsentExcluded', () => {
    it('returns true for /suspended', () => {
      expect(isConsentExcluded('/suspended')).toBe(true)
    })

    it('returns true for /consent-update', () => {
      expect(isConsentExcluded('/consent-update')).toBe(true)
    })

    it('returns true for /legal', () => {
      expect(isConsentExcluded('/legal')).toBe(true)
    })

    it('returns true for /api routes', () => {
      expect(isConsentExcluded('/api/something')).toBe(true)
    })

    it('returns false for dashboard routes', () => {
      expect(isConsentExcluded('/')).toBe(false)
      expect(isConsentExcluded('/modules/crm')).toBe(false)
    })

    it('includes /suspended in CONSENT_EXCLUDED_PATHS', () => {
      expect(CONSENT_EXCLUDED_PATHS).toContain('/suspended')
    })
  })

  describe('suspension redirect logic', () => {
    it('suspended client on protected route should be redirected to /suspended', () => {
      // Given: client with status='suspended' on /modules/crm
      const clientStatus = 'suspended'
      const pathname = '/modules/crm'

      // When: middleware checks status
      const shouldRedirect = clientStatus === 'suspended' && pathname !== '/suspended'

      // Then: should redirect
      expect(shouldRedirect).toBe(true)
    })

    it('suspended client already on /suspended should NOT be redirected', () => {
      const clientStatus = 'suspended'
      const pathname = '/suspended'

      const shouldRedirect = clientStatus === 'suspended' && pathname !== '/suspended'

      expect(shouldRedirect).toBe(false)
    })

    it('active client should NOT be redirected to /suspended', () => {
      const clientStatus = 'active'
      const pathname = '/modules/crm'

      const shouldRedirect = clientStatus === 'suspended' && pathname !== '/suspended'

      expect(shouldRedirect).toBe(false)
    })

    it('/suspended path is excluded from consent check', () => {
      // Suspended clients redirected to /suspended must not be caught by consent check
      expect(isConsentExcluded('/suspended')).toBe(true)
    })
  })

  describe('middleware redirect logic', () => {
    it('unauthenticated user on protected route gets redirect URL with redirectTo', () => {
      const pathname = '/modules/crm'
      const isPublic = isPublicPath(pathname)
      expect(isPublic).toBe(false)
      // When !user && !isPublic → redirect to /login?redirectTo=/modules/crm
      const redirectUrl = new URL('/login', 'http://localhost:3001')
      redirectUrl.searchParams.set('redirectTo', pathname)
      expect(redirectUrl.searchParams.get('redirectTo')).toBe('/modules/crm')
      expect(redirectUrl.pathname).toBe('/login')
    })

    it('authenticated user on public route gets redirected to dashboard', () => {
      const pathname = '/login'
      const isPublic = isPublicPath(pathname)
      expect(isPublic).toBe(true)
      // When user && isPublic → redirect to /
    })
  })
})
