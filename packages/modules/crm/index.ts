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

// Hooks
export { useClients } from './hooks/use-clients'

// Actions
export { getClients } from './actions/get-clients'
export { createClient } from './actions/create-client'
export { updateClient } from './actions/update-client'

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
} from './types/crm.types'
