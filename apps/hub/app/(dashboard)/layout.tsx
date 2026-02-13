import { DashboardShell, ThemeToggle, ModuleSidebar } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { LogoutButton } from './logout-button'

async function HubSidebar() {
  // Auto-discover modules from packages/modules/
  await discoverModules()
  const modules = getModulesForTarget('hub')

  return <ModuleSidebar target="hub" modules={modules} />
}

function HubHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Hub Operateur</span>
      <div className="flex items-center gap-2">
        {/* Notifications, profile — future stories */}
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
