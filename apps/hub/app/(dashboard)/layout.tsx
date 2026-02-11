import Link from 'next/link'
import { DashboardShell, ThemeToggle } from '@foxeo/ui'
import { LogoutButton } from './logout-button'

function HubSidebar() {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-sidebar-foreground">Foxeo Hub</h2>
      </div>
      <nav className="flex-1 space-y-1">
        {/* Module navigation populated by registry — Story 1.1 placeholder */}
        <Link
          href="/modules/core-dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          Dashboard
        </Link>
      </nav>
    </div>
  )
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
