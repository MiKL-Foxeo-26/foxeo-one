'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@foxeo/ui'
import { cn } from '@foxeo/utils'
import type { ModuleManifest } from '@foxeo/types'
import * as LucideIcons from 'lucide-react'
import { useValidationBadge } from '@foxeo/modules-validation-hub'

type HubSidebarClientProps = {
  modules: ModuleManifest[]
  operatorId: string
}

export function HubSidebarClient({ modules, operatorId }: HubSidebarClientProps) {
  const pathname = usePathname()
  const { pendingCount } = useValidationBadge(operatorId)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Foxeo Hub</h2>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {modules.map((module) => {
            const isActive = pathname?.startsWith(`/modules/${module.id}`)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[module.navigation.icon] || LucideIcons.Box
            const isValidationHub = module.id === 'validation-hub'

            return (
              <li key={module.id}>
                <Link
                  href={`/modules/${module.id}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground'
                  )}
                >
                  <IconComponent className="h-5 w-5 shrink-0" />
                  <span className="flex-1">{module.navigation.label}</span>
                  {/* AC4: Badge rouge pour validation-hub */}
                  {isValidationHub && pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">
                      {pendingCount}
                    </Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">
          {modules.length} module{modules.length > 1 ? 's' : ''} actif{modules.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
