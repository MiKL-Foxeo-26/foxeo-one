import { describe, it, expect } from 'vitest'
import { showSuccess, showError, showInfo } from './toast-utils'

describe('Toast utils', () => {
  it('exports showSuccess', () => {
    expect(typeof showSuccess).toBe('function')
  })

  it('exports showError', () => {
    expect(typeof showError).toBe('function')
  })

  it('exports showInfo', () => {
    expect(typeof showInfo).toBe('function')
  })
})
