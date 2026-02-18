'use client'

import { useMemo } from 'react'
import { usePresenceContext } from '../components/presence-provider'

/**
 * Returns the online/offline status of a specific user.
 * Reads from PresenceProvider context — no direct channel subscription.
 *
 * AC3: Client checks if MiKL (operator) is online.
 * AC4: MiKL checks if a specific client is online.
 */
export function usePresenceStatus(targetUserId: string): 'online' | 'offline' {
  const { presenceState } = usePresenceContext()

  return useMemo(() => {
    if (!targetUserId) return 'offline' as const

    const isOnline = Object.values(presenceState)
      .flat()
      .some((entry) => entry.user_id === targetUserId)

    return isOnline ? 'online' as const : 'offline' as const
  }, [presenceState, targetUserId])
}
