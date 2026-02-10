import { describe, it, expect } from 'vitest'
import { toCamelCase, toSnakeCase } from './case-transform'

describe('toCamelCase', () => {
  it('converts simple snake_case keys', () => {
    expect(toCamelCase({ client_id: '123', created_at: 'now' })).toEqual({
      clientId: '123',
      createdAt: 'now',
    })
  })

  it('converts nested objects recursively', () => {
    expect(
      toCamelCase({
        client_config: {
          active_modules: ['chat'],
          elio_config: { tier_level: 'one' },
        },
      })
    ).toEqual({
      clientConfig: {
        activeModules: ['chat'],
        elioConfig: { tierLevel: 'one' },
      },
    })
  })

  it('converts arrays of objects', () => {
    expect(
      toCamelCase([{ first_name: 'John' }, { last_name: 'Doe' }])
    ).toEqual([{ firstName: 'John' }, { lastName: 'Doe' }])
  })

  it('returns primitives unchanged', () => {
    expect(toCamelCase('hello')).toBe('hello')
    expect(toCamelCase(42)).toBe(42)
    expect(toCamelCase(null)).toBeNull()
    expect(toCamelCase(true)).toBe(true)
  })

  it('preserves Date objects', () => {
    const date = new Date('2026-01-01')
    expect(toCamelCase(date)).toBe(date)
  })
})

describe('toSnakeCase', () => {
  it('converts simple camelCase keys', () => {
    expect(toSnakeCase({ clientId: '123', createdAt: 'now' })).toEqual({
      client_id: '123',
      created_at: 'now',
    })
  })

  it('converts nested objects recursively', () => {
    expect(
      toSnakeCase({
        clientConfig: {
          activeModules: ['chat'],
          elioConfig: { tierLevel: 'one' },
        },
      })
    ).toEqual({
      client_config: {
        active_modules: ['chat'],
        elio_config: { tier_level: 'one' },
      },
    })
  })

  it('converts arrays of objects', () => {
    expect(
      toSnakeCase([{ firstName: 'John' }, { lastName: 'Doe' }])
    ).toEqual([{ first_name: 'John' }, { last_name: 'Doe' }])
  })

  it('returns primitives unchanged', () => {
    expect(toSnakeCase('hello')).toBe('hello')
    expect(toSnakeCase(42)).toBe(42)
    expect(toSnakeCase(null)).toBeNull()
  })
})
