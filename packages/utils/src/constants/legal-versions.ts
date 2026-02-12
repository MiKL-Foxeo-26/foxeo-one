/**
 * Legal documents version constants
 * Update these when CGU or IA policy are modified
 */

export const CURRENT_CGU_VERSION = 'v1.0' as const
export const CURRENT_IA_POLICY_VERSION = 'v1.0' as const
export const CGU_LAST_UPDATED = new Date('2026-02-01')
export const IA_POLICY_LAST_UPDATED = new Date('2026-02-01')

/**
 * Type-safe consent types
 */
export const CONSENT_TYPES = {
  CGU: 'cgu',
  IA_PROCESSING: 'ia_processing',
} as const

export type ConsentType = typeof CONSENT_TYPES[keyof typeof CONSENT_TYPES]
