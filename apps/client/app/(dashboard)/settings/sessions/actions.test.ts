import { describe, it, expect } from 'vitest'
import { jwtDecode } from './jwt-decode'

/**
 * Server Actions integration tests require a running Supabase instance.
 * Here we test the JWT decode helper and validate action signatures exist.
 * Full integration tests run in CI with Supabase.
 */

describe('jwtDecode', () => {
  it('decodes a valid JWT payload', () => {
    // Create a test JWT with session_id claim
    const payload = { session_id: 'test-session-123', sub: 'user-456', exp: 9999999999 }
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const token = `${header}.${body}.fake-signature`

    const result = jwtDecode(token)
    expect(result).not.toBeNull()
    expect(result?.session_id).toBe('test-session-123')
    expect(result?.sub).toBe('user-456')
  })

  it('returns null for invalid token format', () => {
    expect(jwtDecode('not-a-jwt')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(jwtDecode('')).toBeNull()
  })

  it('returns null for malformed base64', () => {
    expect(jwtDecode('a.!!!invalid!!!.c')).toBeNull()
  })

  it('handles token without session_id', () => {
    const payload = { sub: 'user-789', exp: 9999999999 }
    const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const token = `${header}.${body}.sig`

    const result = jwtDecode(token)
    expect(result).not.toBeNull()
    expect(result?.session_id).toBeUndefined()
    expect(result?.sub).toBe('user-789')
  })
})

describe('Server Actions — module signatures', () => {
  it('getActiveSessionsAction is exported', async () => {
    const mod = await import('./actions')
    expect(typeof mod.getActiveSessionsAction).toBe('function')
  })

  it('revokeSessionAction is exported', async () => {
    const mod = await import('./actions')
    expect(typeof mod.revokeSessionAction).toBe('function')
  })

  it('revokeOtherSessionsAction is exported', async () => {
    const mod = await import('./actions')
    expect(typeof mod.revokeOtherSessionsAction).toBe('function')
  })
})
