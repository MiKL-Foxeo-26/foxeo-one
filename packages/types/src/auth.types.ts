export type UserRole = 'operator' | 'client' | 'admin'

export type DashboardType = 'hub' | 'lab' | 'one'

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
