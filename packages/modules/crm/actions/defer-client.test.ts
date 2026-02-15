import { describe, it, expect, vi } from 'vitest'
import { deferClient } from './defer-client'

const validClientUuid = '550e8400-e29b-41d4-a716-446655440000'
const validOperatorUuid = '550e8400-e29b-41d4-a716-446655440001'

const mockEq2 = vi.fn()
const mockEq1 = vi.fn(() => ({ eq: mockEq2 }))
const mockUpdate = vi.fn(() => ({ eq: mockEq1 }))
const mockFrom = vi.fn(() => ({ update: mockUpdate }))

vi.mock('@foxeo/supabase', () => ({
  createServerSupabaseClient: vi.fn(() => ({
    from: mockFrom,
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: validOperatorUuid } },
        error: null,
      })),
    },
  })),
}))

describe('deferClient', () => {
  it('should defer client successfully', async () => {
    mockEq2.mockResolvedValueOnce({ error: null })

    const result = await deferClient({
      clientId: validClientUuid,
      deferredUntil: '2026-02-20T10:00:00Z',
    })

    expect(result.error).toBeNull()
    expect(mockUpdate).toHaveBeenCalledWith({ deferred_until: '2026-02-20T10:00:00Z' })
  })

  it('should clear defer successfully', async () => {
    mockEq2.mockResolvedValueOnce({ error: null })

    const result = await deferClient({
      clientId: validClientUuid,
      deferredUntil: null,
    })

    expect(result.error).toBeNull()
    expect(mockUpdate).toHaveBeenCalledWith({ deferred_until: null })
  })
})
