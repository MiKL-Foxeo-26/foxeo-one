import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { PresenceContext } from '../components/presence-provider'
import type { PresenceStateMap } from '../types/presence.types'

function makeWrapper(presenceState: PresenceStateMap) {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(
      PresenceContext.Provider,
      { value: { presenceState, operatorId: 'op-111' } },
      children
    )
}

describe('useOnlineUsers', () => {
  it('returns empty array when no users are online', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper({}),
    })

    expect(result.current).toEqual([])
  })

  it('returns list of online user IDs', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    const presenceState: PresenceStateMap = {
      'user-a': [{ user_id: 'user-a', user_type: 'operator', online_at: '2026-01-01T00:00:00Z' }],
      'user-b': [{ user_id: 'user-b', user_type: 'client', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toContain('user-a')
    expect(result.current).toContain('user-b')
    expect(result.current).toHaveLength(2)
  })

  it('handles multiple entries per key (multiple tabs)', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    // Same user connected from multiple tabs — Supabase groups by presence key
    const presenceState: PresenceStateMap = {
      'user-a': [
        { user_id: 'user-a', user_type: 'operator', online_at: '2026-01-01T00:00:00Z' },
        { user_id: 'user-a', user_type: 'operator', online_at: '2026-01-01T00:01:00Z' },
      ],
    }

    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper(presenceState),
    })

    // Should deduplicate — user-a should appear only once
    const uniqueIds = [...new Set(result.current)]
    expect(uniqueIds).toContain('user-a')
  })
})
