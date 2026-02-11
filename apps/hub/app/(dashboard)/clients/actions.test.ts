import { describe, it, expect } from 'vitest'

describe('Hub Client Actions — module signatures', () => {
  it('forceDisconnectClientAction is exported', async () => {
    const mod = await import('./actions')
    expect(typeof mod.forceDisconnectClientAction).toBe('function')
  })
})
