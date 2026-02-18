import type { ModuleManifest } from '@foxeo/types'

export const manifest: ModuleManifest = {
  id: 'support',
  name: 'Support',
  description: 'Signalement de problèmes et aide en ligne',
  version: '1.0.0',
  targets: ['client-lab', 'client-one'],
  navigation: {
    label: 'Support',
    icon: 'help-circle',
    position: 90,
  },
  routes: [
    { path: '/support', component: 'SupportPage' },
    { path: '/help', component: 'FaqPage' },
  ],
  requiredTables: ['support_tickets'],
  dependencies: [],
}
