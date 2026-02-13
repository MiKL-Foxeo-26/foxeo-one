/**
 * @foxeo/utils - Utilitaires partages pour Foxeo One
 */

export { cn } from './cn'
export { getRequiredEnv } from './env'
export { formatRelativeDate, formatShortDate, formatDate } from './date'
export { toCamelCase, toSnakeCase } from './case-transform'
export { formatCurrency } from './format-currency'
export {
  emailSchema,
  passwordSchema,
  uuidSchema,
  slugSchema,
  phoneSchema,
  clientTypeSchema,
  createClientSchema,
  updateClientSchema,
} from './validation-schemas'
export {
  registerModule,
  discoverModules,
  getModuleRegistry,
  getModule,
  getModulesForTarget,
  clearRegistry,
} from './module-registry'
export {
  parseUserAgent,
  maskIpAddress,
  type ParsedUserAgent,
  type DeviceType,
  type SessionInfo,
} from './parse-user-agent'
export {
  CURRENT_CGU_VERSION,
  CURRENT_IA_POLICY_VERSION,
  CGU_LAST_UPDATED,
  IA_POLICY_LAST_UPDATED,
  CONSENT_TYPES,
  type ConsentType,
} from './constants/legal-versions'
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from './constants/i18n'
export { t, loadMessages } from './i18n/translate'
