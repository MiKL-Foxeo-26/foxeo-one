import { describe, it, expect } from 'vitest'
import { getInitials, truncate } from './string'

describe('getInitials', () => {
  it('returns two uppercase initials for two-word name', () => {
    expect(getInitials('Jean Dupont')).toBe('JD')
  })

  it('returns first two chars for single-word name', () => {
    expect(getInitials('Marie')).toBe('MA')
  })

  it('returns first two initials for multi-word name', () => {
    expect(getInitials('Jean Claude Dupont')).toBe('JC')
  })

  it('returns ?? for empty string', () => {
    expect(getInitials('')).toBe('??')
  })

  it('returns ?? for whitespace-only string', () => {
    expect(getInitials('   ')).toBe('??')
  })

  it('returns uppercase', () => {
    expect(getInitials('alice bob')).toBe('AB')
  })
})

describe('truncate', () => {
  it('returns text unchanged if shorter than limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('returns text unchanged if equal to limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('truncates text longer than limit with ellipsis', () => {
    const result = truncate('Bonjour le monde', 7)
    expect(result).toBe('Bonjour…')
  })

  it('ellipsis is a single character', () => {
    const result = truncate('Hello World', 5)
    expect(result.endsWith('…')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(6)
  })
})
