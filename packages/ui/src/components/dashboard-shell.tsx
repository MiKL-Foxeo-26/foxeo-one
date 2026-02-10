import { type ReactNode } from 'react'
import { cn } from '@foxeo/utils'

type DashboardShellProps = {
  density?: 'compact' | 'comfortable' | 'spacious'
  sidebar?: ReactNode
  header?: ReactNode
  children?: ReactNode
}

const densityClasses = {
  compact: 'gap-2 p-2',
  comfortable: 'gap-4 p-4',
  spacious: 'gap-6 p-6',
} as const

export function DashboardShell({
  density = 'comfortable',
  sidebar,
  header,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {sidebar && (
        <aside className="hidden md:flex md:flex-col md:w-64 border-r border-sidebar-border bg-sidebar">
          {sidebar}
        </aside>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {header && (
          <header className="flex h-14 items-center border-b border-border px-4 bg-card">
            {header}
          </header>
        )}
        <main className={cn('flex-1 overflow-y-auto', densityClasses[density])}>
          {children}
        </main>
      </div>
    </div>
  )
}
