import { describe, it, expect } from 'vitest'
import { useOnline } from './use-online'

describe('useOnline', () => {
  it('exports useOnline hook', () => {
    expect(typeof useOnline).toBe('function')
  })
})
