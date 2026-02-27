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
export { ApproveDialog } from './components/approve-dialog'
export { RejectDialog } from './components/reject-dialog'
export { ClarificationDialog } from './components/clarification-dialog'
export { ActionPicker } from './components/action-picker'
export { PostponeDialog } from './components/postpone-dialog'
export { ValidationHubWidget } from './components/validation-hub-widget'
export type { ExchangeEntry } from './components/request-exchanges'

// Hooks
export { useValidationQueue } from './hooks/use-validation-queue'
export type { UseValidationQueueResult } from './hooks/use-validation-queue'
export { useValidationRequest } from './hooks/use-validation-request'
export type { UseValidationRequestResult } from './hooks/use-validation-request'
export { useClientHistory } from './hooks/use-client-history'
export type { UseClientHistoryResult } from './hooks/use-client-history'
export { useValidationRealtime } from './hooks/use-validation-realtime'
export { useValidationBadge } from './hooks/use-validation-badge'
export type { UseValidationBadgeResult } from './hooks/use-validation-badge'

// Actions
export { getValidationRequests } from './actions/get-validation-requests'
export { getValidationRequest } from './actions/get-validation-request'
export { getClientPreviousRequests } from './actions/get-client-previous-requests'
export { getClientRecentMessages } from './actions/get-client-recent-messages'
export { approveRequest } from './actions/approve-request'
export { rejectRequest } from './actions/reject-request'
export { requestClarification } from './actions/request-clarification'
export { resubmitRequest } from './actions/resubmit-request'
export { reactivateLab } from './actions/reactivate-lab'
export { scheduleVisio } from './actions/schedule-visio'
export type { ScheduleVisioResult } from './actions/schedule-visio'
export { startDev } from './actions/start-dev'
export type { StartDevResult } from './actions/start-dev'
export { postponeRequest } from './actions/postpone-request'

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
