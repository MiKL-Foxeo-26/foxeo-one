import { describe, it, expect, beforeEach } from 'vitest'
import { t, loadMessages } from './translate'
import { DEFAULT_LOCALE } from '../constants/i18n'

describe('translate', () => {
  beforeEach(() => {
    // Load test messages
    loadMessages('fr', {
      test: {
        simple: 'Valeur simple',
        nested: {
          deep: 'Valeur profonde',
        },
      },
      emptyState: {
        search: {
          title: 'Aucun résultat',
        },
      },
    })
  })

  describe('t()', () => {
    it('should return translated string for simple key', () => {
      expect(t('test.simple')).toBe('Valeur simple')
    })

    it('should return translated string for nested key', () => {
      expect(t('test.nested.deep')).toBe('Valeur profonde')
    })

    it('should support dot notation', () => {
      expect(t('emptyState.search.title')).toBe('Aucun résultat')
    })

    it('should return key if translation not found (graceful fallback)', () => {
      expect(t('missing.key')).toBe('missing.key')
    })

    it('should return key if nested path is invalid', () => {
      expect(t('test.invalid.path')).toBe('test.invalid.path')
    })

    it('should use DEFAULT_LOCALE if no locale provided', () => {
      expect(t('test.simple')).toBe('Valeur simple')
      expect(t('test.simple', DEFAULT_LOCALE)).toBe('Valeur simple')
    })

    it('should return key if value is not a string', () => {
      expect(t('test.nested')).toBe('test.nested')
    })

    it('should handle empty key', () => {
      expect(t('')).toBe('')
    })
  })

  describe('loadMessages()', () => {
    it('should load messages into cache', () => {
      loadMessages('fr', { newKey: 'Nouvelle valeur' })
      expect(t('newKey')).toBe('Nouvelle valeur')
    })

    it('should override existing messages', () => {
      loadMessages('fr', { test: { simple: 'Valeur modifiée' } })
      expect(t('test.simple')).toBe('Valeur modifiée')
    })
  })
})
