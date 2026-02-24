export interface OneModule {
  id: string
  name: string
  description: string
  icon: string
}

interface OneModuleCardProps {
  module: OneModule
}

export function OneModuleCard({ module }: OneModuleCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
      <div className="text-4xl mb-3">{module.icon}</div>
      <h3 className="font-semibold text-base mb-2">{module.name}</h3>
      <p className="text-sm text-green-200">{module.description}</p>
    </div>
  )
}
