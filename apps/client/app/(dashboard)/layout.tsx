import { DashboardShell, ThemeToggle, ModuleSidebar } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { PresenceProvider } from '@foxeo/modules-chat'
import { LogoutButton } from './logout-button'

async function ClientSidebar() {
  // Auto-discover modules from packages/modules/
  await discoverModules()
  // For Lab, use 'client-lab'; for One, use 'client-one' (dynamic in future story)
  const modules = getModulesForTarget('client-lab')

  return <ModuleSidebar target="client-lab" modules={modules} />
}

function ClientHeader({ authUserId }: { authUserId: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Mon espace</span>
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

  // Look up client record to get operator_id and client.id
  const { data: clientRecord } = user
    ? await supabase
        .from('clients')
        .select('id, operator_id')
        .eq('auth_user_id', user.id)
        .maybeSingle()
    : { data: null }

  // userId = client's record ID (used as presence key)
  // operatorId = the operator this client belongs to (channel identifier)
  const userId = clientRecord?.id ?? ''
  const operatorId = clientRecord?.operator_id ?? ''

  // Density determined by client_config (Lab=spacious, One=comfortable)
  // Default to spacious for Lab — will be dynamic in Story 1.5+
  return (
    <DashboardShell
      density="spacious"
      sidebar={<ClientSidebar />}
      header={<ClientHeader authUserId={user?.id ?? ''} />}
    >
      <PresenceProvider userId={userId} userType="client" operatorId={operatorId}>
        {children}
      </PresenceProvider>
    </DashboardShell>
  )
}
