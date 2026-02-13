/**
 * Translation helper — Simple implementation for P1 (French only)
 * Messages are loaded on-demand and cached
 *
 * For P1: Only fr.json supported
 * For P3: Will be extended to support multiple locales or migrated to next-intl
 */

import type { Locale } from '../constants/i18n'
import { DEFAULT_LOCALE } from '../constants/i18n'

// Cache des messages chargés
type Messages = Record<string, unknown>
const messagesCache: Partial<Record<Locale, Messages>> = {}

/**
 * Load messages for a given locale
 * P1: Messages must be imported statically from each package
 * This function will be called with pre-loaded messages
 */
export function loadMessages(locale: Locale, messages: Messages) {
  messagesCache[locale] = messages
}

/**
 * Get messages for a locale from cache
 */
function getMessages(locale: Locale): Messages {
  return messagesCache[locale] || {}
}

/**
 * Translate a key to its localized string
 *
 * @param key - Dot-separated key (e.g., 'emptyState.search.title')
 * @param locale - Target locale (defaults to DEFAULT_LOCALE)
 * @returns Translated string or key if not found (graceful fallback)
 *
 * @example
 * t('emptyState.search.title') // "Aucun résultat trouvé"
 * t('missing.key') // "missing.key" (fallback)
 */
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  const messages = getMessages(locale)

  // Support dot notation: 'emptyState.search.title'
  const keys = key.split('.')
  let value: unknown = messages

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      // Fallback: return key if not found
      return key
    }
  }

  return typeof value === 'string' ? value : key
}
