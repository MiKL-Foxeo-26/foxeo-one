import { describe, it, expect, vi } from 'vitest'
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

describe('usePresenceStatus', () => {
  it('returns online when targetUserId is in presence state', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    const presenceState: PresenceStateMap = {
      'user-abc': [{ user_id: 'user-abc', user_type: 'operator', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => usePresenceStatus('user-abc'), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toBe('online')
  })

  it('returns offline when targetUserId is NOT in presence state', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    const presenceState: PresenceStateMap = {
      'other-user': [{ user_id: 'other-user', user_type: 'client', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => usePresenceStatus('user-abc'), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toBe('offline')
  })

  it('returns offline when presence state is empty', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    const { result } = renderHook(() => usePresenceStatus('user-abc'), {
      wrapper: makeWrapper({}),
    })

    expect(result.current).toBe('offline')
  })

  it('returns offline when targetUserId is empty string', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    const presenceState: PresenceStateMap = {
      'user-abc': [{ user_id: 'user-abc', user_type: 'operator', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => usePresenceStatus(''), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toBe('offline')
  })

  it('checks user_id field of PresenceEntry (not just the key)', async () => {
    const { usePresenceStatus } = await import('./use-presence-status')

    // Key might be the user's UUID, but user_id in entry is what we match
    const presenceState: PresenceStateMap = {
      'key-irrelevant': [{ user_id: 'actual-user-id', user_type: 'client', online_at: '2026-01-01T00:00:00Z' }],
    }

    const { result } = renderHook(() => usePresenceStatus('actual-user-id'), {
      wrapper: makeWrapper(presenceState),
    })

    expect(result.current).toBe('online')
  })
})
