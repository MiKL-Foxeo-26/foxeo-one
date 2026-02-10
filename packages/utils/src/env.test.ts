import { describe, it, expect, afterEach } from 'vitest'
import { getRequiredEnv } from './env'

describe('getRequiredEnv', () => {
  afterEach(() => {
    delete process.env.TEST_VAR
  })

  it('returns value when env var exists', () => {
    process.env.TEST_VAR = 'hello'
    expect(getRequiredEnv('TEST_VAR')).toBe('hello')
  })

  it('throws when env var is missing', () => {
    expect(() => getRequiredEnv('MISSING_VAR')).toThrow(
      'Missing required environment variable: MISSING_VAR'
    )
  })

  it('throws when env var is empty string', () => {
    process.env.TEST_VAR = ''
    expect(() => getRequiredEnv('TEST_VAR')).toThrow(
      'Missing required environment variable: TEST_VAR'
    )
  })
})
