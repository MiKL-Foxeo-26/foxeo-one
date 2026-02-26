// Validation Hub Module — File d'attente des demandes de validation
export { manifest } from './manifest'

// Components
export { ValidationQueue } from './components/validation-queue'
export { RequestDetail } from './components/request-detail'
export { RequestHeader } from './components/request-header'
export { ClientInfoCard } from './components/client-info-card'
export { RequestContent } from './components/request-content'
export { RequestHistory } from './components/request-history'
export { RequestExchanges } from './components/request-exchanges'
export { RequestActions } from './components/request-actions'
export type { ExchangeEntry } from './components/request-exchanges'

// Hooks
export { useValidationQueue } from './hooks/use-validation-queue'
export type { UseValidationQueueResult } from './hooks/use-validation-queue'
export { useValidationRequest } from './hooks/use-validation-request'
export type { UseValidationRequestResult } from './hooks/use-validation-request'
export { useClientHistory } from './hooks/use-client-history'
export type { UseClientHistoryResult } from './hooks/use-client-history'

// Actions
export { getValidationRequests } from './actions/get-validation-requests'
export { getValidationRequest } from './actions/get-validation-request'
export { getClientPreviousRequests } from './actions/get-client-previous-requests'
export { getClientRecentMessages } from './actions/get-client-recent-messages'

// Types
export type {
  ValidationRequestType,
  ValidationRequestStatus,
  ClientSummary,
  ClientDetail,
  ParcoursDetail,
  DocumentSummary,
  MessageSummary,
  ValidationRequestSummary,
  ValidationRequestDetail,
  ValidationRequest,
  ValidationQueueFilters,
} from './types/validation.types'
export { DEFAULT_VALIDATION_QUEUE_FILTERS } from './types/validation.types'
