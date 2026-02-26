// Validation Hub Module — File d'attente des demandes de validation
export { manifest } from './manifest'

// Components
export { ValidationQueue } from './components/validation-queue'

// Hooks
export { useValidationQueue } from './hooks/use-validation-queue'
export type { UseValidationQueueResult } from './hooks/use-validation-queue'

// Actions
export { getValidationRequests } from './actions/get-validation-requests'

// Types
export type {
  ValidationRequestType,
  ValidationRequestStatus,
  ClientSummary,
  ValidationRequest,
  ValidationQueueFilters,
} from './types/validation.types'
export { DEFAULT_VALIDATION_QUEUE_FILTERS } from './types/validation.types'
