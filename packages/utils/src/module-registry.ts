import type { ModuleManifest, ModuleTarget } from '@foxeo/types'

const registry = new Map<string, ModuleManifest>()
let isDiscovered = false

export function registerModule(manifest: ModuleManifest): void {
  if (registry.has(manifest.id)) {
    console.warn(`Module "${manifest.id}" is already registered. Skipping.`)
    return
  }
  registry.set(manifest.id, manifest)
}

/**
 * Auto-discover modules from packages/modules/
 * Scans for manifest.ts files and registers them automatically
 * NOTE: This uses dynamic imports which only work in Node.js context (build time)
 * For runtime, modules must be registered manually via registerModule()
 */
export async function discoverModules(): Promise<void> {
  if (isDiscovered) return

  try {
    // Dynamic import of core-dashboard (only available module for now)
    // In production, this would scan packages/modules/ directory
    const { coreDashboardManifest } = await import('@foxeo/module-core-dashboard')
    registerModule(coreDashboardManifest)
    isDiscovered = true
  } catch (error) {
    console.warn('Module discovery failed:', error)
  }
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
  isDiscovered = false
}
