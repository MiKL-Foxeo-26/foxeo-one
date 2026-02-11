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
} from './validation-schemas'
export {
  registerModule,
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
