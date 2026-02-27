import { DashboardShell, ThemeToggle } from '@foxeo/ui'
import { discoverModules, getModulesForTarget, registerModule } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { PresenceProvider } from '@foxeo/modules-chat'
import { manifest as validationHubManifest } from '@foxeo/modules-validation-hub'
import { HubSidebarClient } from '../../components/hub-sidebar-client'
import { LogoutButton } from './logout-button'

async function HubSidebar({ operatorId }: { operatorId: string }) {
  // Auto-discover core modules
  await discoverModules()
  // Register hub-specific modules
  registerModule(validationHubManifest)
  const modules = getModulesForTarget('hub')

  return <HubSidebarClient modules={modules} operatorId={operatorId} />
}

function HubHeader({ authUserId }: { authUserId: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Hub Operateur</span>
      <div className="flex items-center gap-2">
        {authUserId && <NotificationBadge recipientId={authUserId} />}
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // AC2, AC4: Mount PresenceProvider once at layout level
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Lookup operator record — operators.id ≠ auth.uid()
  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('auth_user_id', user?.id ?? '')
    .maybeSingle()

  const operatorId = operator?.id ?? ''
  const userId = operatorId // For hub, userId in presence = operator.id

  return (
    <DashboardShell
      density="compact"
      sidebar={<HubSidebar operatorId={operatorId} />}
      header={<HubHeader authUserId={user?.id ?? ''} />}
    >
      <PresenceProvider userId={userId} userType="operator" operatorId={operatorId}>
        {children}
      </PresenceProvider>
    </DashboardShell>
  )
}
