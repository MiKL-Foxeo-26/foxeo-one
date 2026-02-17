import { DashboardShell, ThemeToggle, ModuleSidebar } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { LogoutButton } from './logout-button'

async function HubSidebar() {
  // Auto-discover modules from packages/modules/
  await discoverModules()
  const modules = getModulesForTarget('hub')

  return <ModuleSidebar target="hub" modules={modules} />
}

async function HubHeader() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id ?? ''

  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Hub Operateur</span>
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
  return (
    <DashboardShell
      density="compact"
      sidebar={<HubSidebar />}
      header={<HubHeader />}
    >
      {children}
    </DashboardShell>
  )
}
