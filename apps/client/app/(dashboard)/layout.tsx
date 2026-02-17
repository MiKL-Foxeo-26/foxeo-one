import { DashboardShell, ThemeToggle, ModuleSidebar } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { LogoutButton } from './logout-button'

async function ClientSidebar() {
  // Auto-discover modules from packages/modules/
  await discoverModules()
  // For Lab, use 'client-lab'; for One, use 'client-one' (dynamic in future story)
  const modules = getModulesForTarget('client-lab')

  return <ModuleSidebar target="client-lab" modules={modules} />
}

async function ClientHeader() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''

  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Mon espace</span>
      <div className="flex items-center gap-2">
        {userId && <NotificationBadge recipientId={userId} />}
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Density determined by client_config (Lab=spacious, One=comfortable)
  // Default to spacious for Lab — will be dynamic in Story 1.5+
  return (
    <DashboardShell
      density="spacious"
      sidebar={<ClientSidebar />}
      header={<ClientHeader />}
    >
      {children}
    </DashboardShell>
  )
}
