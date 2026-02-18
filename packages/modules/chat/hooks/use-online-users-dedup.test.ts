/**
 * Edge case tests: timeout behavior, reconnection, multiple tabs
 * AC5: Timeout 30s, reconnection automatique
 */
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

describe('useOnlineUsers — edge cases', () => {
  it('deduplicates user connected from multiple tabs (AC5)', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    // Supabase groups multiple connections by key but may return multiple entries
    const presenceState: PresenceStateMap = {
      // Same user connected from 2 tabs
      'user-a': [
        { user_id: 'user-a', user_type: 'client', online_at: '2026-01-01T00:00:00Z' },
        { user_id: 'user-a', user_type: 'client', online_at: '2026-01-01T00:01:00Z' },
      ],
    }

    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper(presenceState),
    })

    // Should return user-a only once
    expect(result.current).toEqual(['user-a'])
    expect(result.current).toHaveLength(1)
  })

  it('returns empty list after user disconnects (simulates post-timeout)', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    // After 30s timeout, user is removed from presence state
    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper({}),
    })

    expect(result.current).toHaveLength(0)
  })

  it('correctly handles mix of clients and operator in presence', async () => {
    const { useOnlineUsers } = await import('./use-online-users')

    const presenceState: PresenceStateMap = {
      'client-1': [{ user_id: 'client-1', user_type: 'client', online_at: '2026-01-01T00:00:00Z' }],
      'client-2': [{ user_id: 'client-2', user_type: 'client', online_at: '2026-01-01T00:00:00Z' }],
      'op-111': [{ user_id: 'op-111', user_type: 'operator', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => useOnlineUsers(), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toHaveLength(3)
    expect(result.current).toContain('client-1')
    expect(result.current).toContain('client-2')
    expect(result.current).toContain('op-111')
  })
})

describe('usePresenceStatus — edge cases', () => {
  it('returns offline for user not in presence (simulates 30s timeout)', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    // Presence state is empty (user timed out)
    const { result } = renderHook(() => usePresenceStatus('disconnected-user'), {
      wrapper: makeWrapper({}),
    })

    expect(result.current).toBe('offline')
  })

  it('returns online after user reconnects (presence state updated)', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    // User is now back online
    const presenceState: PresenceStateMap = {
      'reconnected-user': [
        { user_id: 'reconnected-user', user_type: 'client', online_at: '2026-01-01T00:05:00Z' },
      ],
    }

    const { result } = renderHook(() => usePresenceStatus('reconnected-user'), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toBe('online')
  })
})
