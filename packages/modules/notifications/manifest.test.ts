import { describe, it, expect } from 'vitest'
import { manifest } from './manifest'

describe('notifications manifest', () => {
  it('should have correct id', () => {
    expect(manifest.id).toBe('notifications')
  })

  it('should target all dashboards', () => {
    expect(manifest.targets).toContain('hub')
    expect(manifest.targets).toContain('client-lab')
    expect(manifest.targets).toContain('client-one')
  })

  it('should require notifications table', () => {
    expect(manifest.requiredTables).toContain('notifications')
  })

  it('should have no dependencies', () => {
    expect(manifest.dependencies).toEqual([])
  })

  it('should have bell icon', () => {
    expect(manifest.navigation.icon).toBe('bell')
  })

  it('should have no routes (header-only module)', () => {
    expect(manifest.routes).toEqual([])
  })
})
