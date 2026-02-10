import { describe, it, expect, beforeEach } from 'vitest'
import {
  registerModule,
  getModuleRegistry,
  getModule,
  getModulesForTarget,
  clearRegistry,
} from './module-registry'
import type { ModuleManifest } from '@foxeo/types'

const mockManifest: ModuleManifest = {
  id: 'test-module',
  name: 'Test Module',
  version: '1.0.0',
  description: 'A test module',
  navigation: { icon: 'TestIcon', label: 'Test', position: 1 },
  routes: [{ path: '/test', component: 'TestComponent' }],
  requiredTables: [],
  targets: ['hub', 'client-lab'],
  dependencies: [],
}

const mockManifest2: ModuleManifest = {
  id: 'another-module',
  name: 'Another Module',
  version: '1.0.0',
  description: 'Another test module',
  navigation: { icon: 'Icon2', label: 'Another', position: 0 },
  routes: [{ path: '/another', component: 'AnotherComponent' }],
  requiredTables: [],
  targets: ['hub'],
  dependencies: [],
}

describe('module-registry', () => {
  beforeEach(() => {
    clearRegistry()
  })

  it('registers a module', () => {
    registerModule(mockManifest)
    expect(getModule('test-module')).toEqual(mockManifest)
  })

  it('returns undefined for unregistered module', () => {
    expect(getModule('nonexistent')).toBeUndefined()
  })

  it('does not register duplicate modules', () => {
    registerModule(mockManifest)
    registerModule(mockManifest)
    expect(getModuleRegistry().size).toBe(1)
  })

  it('returns all registered modules', () => {
    registerModule(mockManifest)
    registerModule(mockManifest2)
    expect(getModuleRegistry().size).toBe(2)
  })

  it('filters modules by target', () => {
    registerModule(mockManifest)
    registerModule(mockManifest2)

    const hubModules = getModulesForTarget('hub')
    expect(hubModules).toHaveLength(2)

    const labModules = getModulesForTarget('client-lab')
    expect(labModules).toHaveLength(1)
    expect(labModules[0]?.id).toBe('test-module')

    const oneModules = getModulesForTarget('client-one')
    expect(oneModules).toHaveLength(0)
  })

  it('sorts modules by navigation position', () => {
    registerModule(mockManifest) // position: 1
    registerModule(mockManifest2) // position: 0

    const hubModules = getModulesForTarget('hub')
    expect(hubModules[0]?.id).toBe('another-module')
    expect(hubModules[1]?.id).toBe('test-module')
  })

  it('clears registry', () => {
    registerModule(mockManifest)
    clearRegistry()
    expect(getModuleRegistry().size).toBe(0)
  })
})
