export type UserRole = 'operator' | 'client' | 'admin'

export type DashboardType = 'hub' | 'lab' | 'one'

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown'

export type UserSession = {
  id: string
  email: string
  role: UserRole
  dashboardType: DashboardType
  clientId?: string
  operatorId?: string
  displayName?: string
  avatarUrl?: string
}

/** Active session info for the sessions management UI (Story 1.6) */
export type SessionInfo = {
  id: string
  browser: string
  os: string
  deviceType: DeviceType
  ipAddress: string
  lastActivity: string
  createdAt: string
  isCurrent: boolean
}
