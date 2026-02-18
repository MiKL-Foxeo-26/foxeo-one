'use client'

import { createContext, useContext } from 'react'
import { useChatPresence } from '../hooks/use-chat-presence'
import type { PresenceStateMap } from '../types/presence.types'

// ---- Context ----

export interface PresenceContextValue {
  presenceState: PresenceStateMap
  operatorId: string
}

export const PresenceContext = createContext<PresenceContextValue>({
  presenceState: {},
  operatorId: '',
})

export function usePresenceContext(): PresenceContextValue {
  return useContext(PresenceContext)
}

// ---- Provider ----

interface PresenceProviderProps {
  /** Auth user's unique ID — becomes the presence key */
  userId: string
  /** 'client' for client dashboard, 'operator' for hub */
  userType: 'client' | 'operator'
  /** Operator record UUID — used as the Realtime channel identifier */
  operatorId: string
  children: React.ReactNode
}

/**
 * Mount ONCE in the dashboard layout (hub or client).
 * Registers current user's presence and provides presence state to all children.
 * AC2: auto-sync on mount, cleanup on unmount.
 * AC4: operatorId exposed for sub-components that need to filter by operator.
 */
export function PresenceProvider({
  userId,
  userType,
  operatorId,
  children,
}: PresenceProviderProps) {
  const { presenceState } = useChatPresence(operatorId, userId, userType)

  return (
    <PresenceContext.Provider value={{ presenceState, operatorId }}>
      {children}
    </PresenceContext.Provider>
  )
}
