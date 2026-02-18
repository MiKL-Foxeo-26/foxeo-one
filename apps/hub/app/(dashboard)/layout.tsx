import { DashboardShell, ThemeToggle, ModuleSidebar } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { PresenceProvider } from '@foxeo/modules-chat'
import { LogoutButton } from './logout-button'

async function HubSidebar() {
  // Auto-discover modules from packages/modules/
  await discoverModules()
  const modules = getModulesForTarget('hub')

  return <ModuleSidebar target="hub" modules={modules} />
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
      sidebar={<HubSidebar />}
      header={<HubHeader authUserId={user?.id ?? ''} />}
    >
      <PresenceProvider userId={userId} userType="operator" operatorId={operatorId}>
        {children}
      </PresenceProvider>
    </DashboardShell>
  )
}
