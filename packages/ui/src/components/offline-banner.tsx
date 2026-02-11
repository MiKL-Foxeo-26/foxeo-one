'use client'

import { useOnline } from '../hooks/use-online'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useOnline()

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-destructive px-4 py-2 text-center text-sm text-destructive-foreground">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>Connexion perdue — Reconnexion en cours...</span>
      </div>
    </div>
  )
}
