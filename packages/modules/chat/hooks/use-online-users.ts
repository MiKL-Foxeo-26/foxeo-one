'use client'

import { useMemo } from 'react'
import { usePresenceContext } from '../components/presence-provider'

/**
 * Returns a deduplicated list of user IDs currently online.
 * Useful for MiKL (Hub) to know which clients are connected.
 *
 * AC4: Presence list for Hub conversation list and CRM.
 */
export function useOnlineUsers(): string[] {
  const { presenceState } = usePresenceContext()

  return useMemo(() => {
    const userIds = Object.values(presenceState)
      .flat()
      .map((entry) => entry.user_id)

    // Deduplicate — same user can be connected from multiple tabs
    return [...new Set(userIds)]
  }, [presenceState])
}
