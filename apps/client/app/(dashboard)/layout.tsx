import Link from 'next/link'
import { DashboardShell } from '@foxeo/ui'

function ClientSidebar() {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-sidebar-foreground">Foxeo</h2>
      </div>
      <nav className="flex-1 space-y-1">
        {/* Module navigation populated by registry — density from client_config */}
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

function ClientHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Mon espace</span>
      <div className="flex items-center gap-2">
        {/* Notifications, profile, Elio chat — future stories */}
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
