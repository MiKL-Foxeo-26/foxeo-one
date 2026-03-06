import Link from 'next/link'
import { DashboardShell, ThemeToggle, ModuleSidebar, Button } from '@foxeo/ui'
import { discoverModules, getModulesForTarget } from '@foxeo/utils'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { NotificationBadge } from '@foxeo/modules-notifications'
import { PresenceProvider } from '@foxeo/modules-chat'
import { LogoutButton } from './logout-button'
import type { ModuleTarget } from '@foxeo/types'

async function ClientSidebar({
  dashboardType,
  activeModules,
}: {
  dashboardType: string
  activeModules: string[]
}) {
  await discoverModules()
  const target: ModuleTarget =
    dashboardType === 'one' ? 'client-one' : 'client-lab'

  const modules = activeModules.length > 0
    ? getModulesForTarget(target).filter((m) => activeModules.includes(m.id))
    : []

  if (modules.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Contactez MiKL pour activer vos modules.
      </div>
    )
  }

  return <ModuleSidebar target={target} modules={modules} />
}

function ClientHeader({ authUserId }: { authUserId: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-sm font-medium">Mon espace</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/help">Aide</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/support">Signaler</Link>
        </Button>
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
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Single query: fetch client record with joined client_configs
  const { data: clientRecord } = user
    ? await supabase
        .from('clients')
        .select('id, first_name, name, operator_id, client_configs(dashboard_type, active_modules, density)')
        .eq('auth_user_id', user.id)
        .maybeSingle()
    : { data: null }

  const clientId = clientRecord?.id ?? ''
  const operatorId = clientRecord?.operator_id ?? ''

  // Normalize joined relation (array or object)
  const configRelation = clientRecord?.client_configs
  const clientConfig = Array.isArray(configRelation) ? configRelation[0] : configRelation

  const dashboardType = clientConfig?.dashboard_type ?? 'lab'
  const activeModules: string[] = clientConfig?.active_modules ?? ['core-dashboard']
  const density = dashboardType === 'one' ? 'comfortable' : 'spacious'

  return (
    <DashboardShell
      density={density}
      sidebar={
        <ClientSidebar dashboardType={dashboardType} activeModules={activeModules} />
      }
      header={<ClientHeader authUserId={user?.id ?? ''} />}
    >
      <PresenceProvider userId={clientId} userType="client" operatorId={operatorId}>
        {children}
      </PresenceProvider>
    </DashboardShell>
  )
}
