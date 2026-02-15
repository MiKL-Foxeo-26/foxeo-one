// CRM Module - Gestion de la relation client
export { manifest } from './manifest'

// Components
export { ClientList } from './components/client-list'
export { ClientSearch } from './components/client-search'
export { ClientFiltersPanel } from './components/client-filters-panel'
export { EmptyClientList } from './components/empty-client-list'
export { ClientForm } from './components/client-form'
export { CreateClientDialog } from './components/create-client-dialog'
export { EditClientDialog } from './components/edit-client-dialog'
export { ClientHeader } from './components/client-header'
export { ClientTabs } from './components/client-tabs'
export { ClientInfoTab } from './components/client-info-tab'
export { ClientTimeline } from './components/client-timeline'
export { ClientDocumentsTab } from './components/client-documents-tab'
export { ClientExchangesTab } from './components/client-exchanges-tab'
export { ClientDetailContent } from './components/client-detail-content'
export { AssignParcoursDialog } from './components/assign-parcours-dialog'
export { ParcoursStageList } from './components/parcours-stage-list'
export { AccessToggles } from './components/access-toggles'
export { ParcoursStatusBadge } from './components/parcours-status-badge'
export { CursorButton } from './components/cursor-button'
export { ClientNotesSection } from './components/client-notes-section'
export { ClientNoteCard } from './components/client-note-card'
export { PinButton } from './components/pin-button'
export { DeferDialog } from './components/defer-dialog'

// Hooks
export { useClients } from './hooks/use-clients'
export { useClient } from './hooks/use-client'
export { useClientActivityLogs } from './hooks/use-client-activity-logs'
export { useClientDocuments } from './hooks/use-client-documents'
export { useClientExchanges } from './hooks/use-client-exchanges'
export { useParcourTemplates } from './hooks/use-parcours-templates'
export { useClientParcours } from './hooks/use-client-parcours'
export { useClientNotes } from './hooks/use-client-notes'

// Actions
export { getClients } from './actions/get-clients'
export { createClient } from './actions/create-client'
export { updateClient } from './actions/update-client'
export { getClient } from './actions/get-client'
export { getActivityLogs } from './actions/get-activity-logs'
export { getClientDocuments } from './actions/get-client-documents'
export { getClientExchanges } from './actions/get-client-exchanges'
export { getParcoursTemplates } from './actions/get-parcours-templates'
export { assignParcours } from './actions/assign-parcours'
export { getClientParcours } from './actions/get-client-parcours'
export { toggleAccess } from './actions/toggle-access'
export { suspendParcours } from './actions/suspend-parcours'
export { createClientNote } from './actions/create-client-note'
export { getClientNotes } from './actions/get-client-notes'
export { updateClientNote } from './actions/update-client-note'
export { deleteClientNote } from './actions/delete-client-note'
export { togglePinClient } from './actions/toggle-pin-client'
export { deferClient } from './actions/defer-client'

// Utils
export {
  buildClientSlug,
  buildBmadPath,
  buildCursorUrl,
  toKebabCase,
  BMAD_BASE_PATH,
} from './utils/cursor-integration'

// Types
export type {
  Client,
  ClientListItem,
  ClientFilters,
  ClientType,
  ClientStatus,
  ClientDB,
  CreateClientInput,
  UpdateClientInput,
  ActivityLog,
  ActivityLogType,
  ClientConfig,
  ClientDocument,
  ClientExchange,
  ParcoursTemplate,
  Parcours,
  ParcoursStage,
  ParcoursType,
  ParcoursStatus,
  ActiveStage,
  AssignParcoursInput,
  ToggleAccessInput,
  ParcoursTemplateDB,
  ParcoursDB,
  ClientNote,
  CreateClientNoteInput,
  UpdateClientNoteInput,
  DeferClientInput,
  ClientNoteDB,
} from './types/crm.types'
