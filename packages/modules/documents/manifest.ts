import type { ModuleManifest } from '@foxeo/types'

export const manifest: ModuleManifest = {
  id: 'documents',
  name: 'Documents',
  description: 'Gestion documentaire — upload, visualisation et partage de fichiers',
  version: '1.0.0',
  targets: ['hub', 'client-lab', 'client-one'],
  navigation: {
    label: 'Documents',
    icon: 'file-text',
    position: 30,
  },
  routes: [
    { path: '/modules/documents', component: 'DocumentsPage' },
    { path: '/modules/documents/:clientId', component: 'ClientDocuments' },
  ],
  requiredTables: ['documents'],
  dependencies: [],
}
