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

// Hooks
export { useClients } from './hooks/use-clients'
export { useClient } from './hooks/use-client'
export { useClientActivityLogs } from './hooks/use-client-activity-logs'
export { useClientDocuments } from './hooks/use-client-documents'
export { useClientExchanges } from './hooks/use-client-exchanges'

// Actions
export { getClients } from './actions/get-clients'
export { createClient } from './actions/create-client'
export { updateClient } from './actions/update-client'
export { getClient } from './actions/get-client'
export { getActivityLogs } from './actions/get-activity-logs'
export { getClientDocuments } from './actions/get-client-documents'
export { getClientExchanges } from './actions/get-client-exchanges'

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
} from './types/crm.types'
