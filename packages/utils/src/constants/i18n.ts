/**
 * i18n Configuration Constants
 * P1: French only, P3: Multi-language support
 */

export const SUPPORTED_LOCALES = ['fr'] as const

export const DEFAULT_LOCALE = 'fr' as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]
