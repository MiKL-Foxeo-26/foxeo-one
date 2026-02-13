import { notFound } from 'next/navigation'
import { EmptyState } from '@foxeo/ui'
import { discoverModules, getModule } from '@foxeo/utils'
import dynamic from 'next/dynamic'

type ModulePageProps = {
  params: Promise<{ moduleId: string }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params

  // Auto-discover modules
  await discoverModules()
  const module = getModule(moduleId)

  if (!module) {
    notFound()
  }

  // Dynamic import of module component
  // For now, manually map module IDs to imports
  // In production, this would use a more sophisticated registry
  const moduleComponents: Record<string, any> = {
    'core-dashboard': dynamic(() =>
      import('@foxeo/module-core-dashboard').then((mod) => mod.CoreDashboard)
    ),
  }

  const ModuleComponent = moduleComponents[moduleId]

  if (!ModuleComponent) {
    return (
      <EmptyState
        title={`Module: ${module.name}`}
        description="Ce module n'a pas encore de composant implementé."
      />
    )
  }

  return <ModuleComponent />
}
