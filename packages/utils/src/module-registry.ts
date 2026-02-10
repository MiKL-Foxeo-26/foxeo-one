import type { ModuleManifest, ModuleTarget } from '@foxeo/types'

const registry = new Map<string, ModuleManifest>()

export function registerModule(manifest: ModuleManifest): void {
  if (registry.has(manifest.id)) {
    console.warn(`Module "${manifest.id}" is already registered. Skipping.`)
    return
  }
  registry.set(manifest.id, manifest)
}

export function getModuleRegistry(): Map<string, ModuleManifest> {
  return new Map(registry)
}

export function getModule(id: string): ModuleManifest | undefined {
  return registry.get(id)
}

export function getModulesForTarget(target: ModuleTarget): ModuleManifest[] {
  return Array.from(registry.values())
    .filter((m) => m.targets.includes(target))
    .sort((a, b) => a.navigation.position - b.navigation.position)
}

export function clearRegistry(): void {
  registry.clear()
}
