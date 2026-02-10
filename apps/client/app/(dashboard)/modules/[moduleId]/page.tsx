import { EmptyState } from '@foxeo/ui'

type ModulePageProps = {
  params: Promise<{ moduleId: string }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params

  return (
    <div>
      <EmptyState
        title={`Module: ${moduleId}`}
        description="Ce module sera charge dynamiquement via le registry."
      />
    </div>
  )
}
