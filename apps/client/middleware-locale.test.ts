import { describe, it, expect } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { detectLocale, setLocaleCookie } from './middleware-locale'

describe('middleware-locale', () => {
  describe('detectLocale', () => {
    it('should return locale from NEXT_LOCALE cookie (priority)', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      })
      request.cookies.set('NEXT_LOCALE', 'fr')

      expect(detectLocale(request)).toBe('fr')
    })

    it('should return DEFAULT_LOCALE if cookie is invalid', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        },
      })
      request.cookies.set('NEXT_LOCALE', 'invalid')

      expect(detectLocale(request)).toBe('fr')
    })

    it('should parse Accept-Language header if no cookie', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8',
        },
      })

      expect(detectLocale(request)).toBe('fr')
    })

    it('should extract language code from locale (fr-FR → fr)', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'fr-FR',
        },
      })

      expect(detectLocale(request)).toBe('fr')
    })

    it('should return DEFAULT_LOCALE if no supported language found', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'es-ES,es;q=0.9',
        },
      })

      expect(detectLocale(request)).toBe('fr')
    })

    it('should return DEFAULT_LOCALE if no Accept-Language header', () => {
      const request = new NextRequest('http://localhost:3000')

      expect(detectLocale(request)).toBe('fr')
    })

    it('should handle multiple languages in Accept-Language', () => {
      const request = new NextRequest('http://localhost:3000', {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
        },
      })

      // Should pick fr (first supported locale, even if lower priority)
      expect(detectLocale(request)).toBe('fr')
    })
  })

  describe('setLocaleCookie', () => {
    it('should set NEXT_LOCALE cookie on response', () => {
      const response = NextResponse.next()
      setLocaleCookie(response, 'fr')

      const cookie = response.cookies.get('NEXT_LOCALE')
      expect(cookie?.value).toBe('fr')
      expect(cookie?.path).toBe('/')
    })

    it('should set cookie with 1 year maxAge', () => {
      const response = NextResponse.next()
      setLocaleCookie(response, 'fr')

      const cookie = response.cookies.get('NEXT_LOCALE')
      expect(cookie?.maxAge).toBe(365 * 24 * 60 * 60)
    })
  })
})
