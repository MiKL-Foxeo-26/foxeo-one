'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { createClient } from '../client'

type RealtimeContextType = {
  supabase: ReturnType<typeof createClient>
}

const RealtimeContext = createContext<RealtimeContextType | null>(null)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    return () => {
      supabase.removeAllChannels()
    }
  }, [supabase])

  return (
    <RealtimeContext.Provider value={{ supabase }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
