import type { ModuleManifest } from '@foxeo/types'

export const manifest: ModuleManifest = {
  id: 'visio',
  name: 'Visioconférence',
  description: 'Salle de visio OpenVidu — meetings en temps réel entre MiKL et clients',
  version: '1.0.0',
  targets: ['hub', 'client-lab', 'client-one'],
  navigation: {
    label: 'Visio',
    icon: 'video',
    position: 50,
  },
  routes: [
    { path: '/modules/visio', component: 'VisioPage' },
    { path: '/modules/visio/:meetingId', component: 'MeetingRoomPage' },
  ],
  requiredTables: ['meetings'],
  dependencies: [],
}
