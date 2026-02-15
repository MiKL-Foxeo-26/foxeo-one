import { describe, it, expect } from 'vitest'
import {
  toKebabCase,
  buildClientSlug,
  buildBmadPath,
  buildCursorUrl,
  BMAD_BASE_PATH,
} from './cursor-integration'

describe('cursor-integration utilities', () => {
  describe('toKebabCase', () => {
    it('should convert simple string to kebab-case', () => {
      expect(toKebabCase('Hello World')).toBe('hello-world')
    })

    it('should handle accents and diacritics', () => {
      expect(toKebabCase('Café Français')).toBe('cafe-francais')
      expect(toKebabCase('Niño José')).toBe('nino-jose')
    })

    it('should handle special characters', () => {
      expect(toKebabCase('Mon Entreprise & Co.')).toBe('mon-entreprise-co')
      expect(toKebabCase('Client #1 (Test)')).toBe('client-1-test')
    })

    it('should handle multiple spaces and hyphens', () => {
      expect(toKebabCase('Mon   Super   Client')).toBe('mon-super-client')
      expect(toKebabCase('Already-Kebab-Case')).toBe('already-kebab-case')
    })

    it('should handle underscores', () => {
      expect(toKebabCase('client_test_name')).toBe('client-test-name')
    })

    it('should trim leading and trailing spaces/hyphens', () => {
      expect(toKebabCase('  test  ')).toBe('test')
      expect(toKebabCase('--test--')).toBe('test')
    })

    it('should return empty string for empty input', () => {
      expect(toKebabCase('')).toBe('')
    })

    it('should handle mixed case and numbers', () => {
      expect(toKebabCase('Client123Test')).toBe('client123test')
    })
  })

  describe('buildClientSlug', () => {
    it('should use company name if provided', () => {
      expect(buildClientSlug('Jean Dupont', 'Acme Corp')).toBe('acme-corp')
    })

    it('should use client name if no company', () => {
      expect(buildClientSlug('Jean Dupont')).toBe('jean-dupont')
    })

    it('should handle empty company (fallback to name)', () => {
      expect(buildClientSlug('Jean Dupont', '')).toBe('jean-dupont')
    })

    it('should handle accented company names', () => {
      expect(buildClientSlug('Test', 'Société Générale')).toBe(
        'societe-generale'
      )
    })
  })

  describe('buildBmadPath', () => {
    it('should build path with default base', () => {
      const slug = 'acme-corp'
      const expected = `${BMAD_BASE_PATH}/clients/${slug}`
      expect(buildBmadPath(slug)).toBe(expected)
    })

    it('should build path with custom base', () => {
      const slug = 'test-client'
      const customBase = '/custom/path'
      expect(buildBmadPath(slug, customBase)).toBe(
        '/custom/path/clients/test-client'
      )
    })

    it('should handle slug with special chars already normalized', () => {
      expect(buildBmadPath('my-client-123')).toContain('/clients/my-client-123')
    })
  })

  describe('buildCursorUrl', () => {
    it('should generate cursor:// protocol URL', () => {
      const path = '/Users/mikl/bmad/clients/acme-corp'
      expect(buildCursorUrl(path)).toBe(`cursor://file/${path}`)
    })

    it('should handle Windows paths', () => {
      const path = 'C:/Users/mikl/bmad/clients/test'
      expect(buildCursorUrl(path)).toBe(`cursor://file/${path}`)
    })

    it('should handle relative paths', () => {
      const path = './clients/test'
      expect(buildCursorUrl(path)).toBe('cursor://file/./clients/test')
    })
  })

  describe('integration: full workflow', () => {
    it('should build complete cursor URL from client info', () => {
      const name = 'Jean Dupont'
      const company = 'Café & Restaurant Français'

      const slug = buildClientSlug(name, company)
      expect(slug).toBe('cafe-restaurant-francais')

      const path = buildBmadPath(slug)
      expect(path).toContain('/clients/cafe-restaurant-francais')

      const url = buildCursorUrl(path)
      expect(url).toMatch(/^cursor:\/\/file\//)
      expect(url).toContain('cafe-restaurant-francais')
    })
  })
})
