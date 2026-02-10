export type ModuleTarget = 'hub' | 'client-lab' | 'client-one'

export type ModuleRoute = {
  path: string
  component: string
}

export type ModuleNavigation = {
  icon: string
  label: string
  position: number
}

export type ModuleManifest = {
  id: string
  name: string
  version: string
  description: string
  navigation: ModuleNavigation
  routes: ModuleRoute[]
  apiRoutes?: Array<{
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  }>
  requiredTables: string[]
  targets: ModuleTarget[]
  dependencies: string[]
}
