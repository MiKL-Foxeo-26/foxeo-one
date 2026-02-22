'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMeetingRealtime } from '../hooks/use-meeting-realtime'
import { startMeeting } from '../actions/start-meeting'

interface MeetingLobbyProps {
  meetingId: string
  userType: 'client' | 'operator'
}

export function MeetingLobby({ meetingId, userType }: MeetingLobbyProps) {
  const router = useRouter()
  const { operatorJoined, clientWaiting, broadcastClientWaiting, broadcastOperatorJoined } = useMeetingRealtime(meetingId)
  const hasBroadcasted = useRef(false)

  // Client broadcasts that they're waiting
  useEffect(() => {
    if (userType === 'client' && !hasBroadcasted.current) {
      hasBroadcasted.current = true
      broadcastClientWaiting()
    }
  }, [userType, broadcastClientWaiting])

  // Client auto-redirects when operator joins
  useEffect(() => {
    if (operatorJoined && userType === 'client') {
      router.push(`/modules/visio/${meetingId}`)
    }
  }, [operatorJoined, userType, meetingId, router])

  async function handleAdmit() {
    await startMeeting({ meetingId })
    await broadcastOperatorJoined()
    router.push(`/modules/visio/${meetingId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="rounded-full bg-white/5 p-8">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-semibold">Salle d'attente</h1>

      {userType === 'client' && (
        <>
          <p className="text-muted-foreground text-center max-w-md">
            En attente de MiKL... Vous serez redirigé automatiquement vers la salle de visio.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            En attente
          </div>
        </>
      )}

      {userType === 'operator' && (
        <>
          {clientWaiting ? (
            <>
              <p className="text-muted-foreground text-center max-w-md">
                Un client est en attente dans le lobby.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Client en attente
              </div>
              <button
                type="button"
                onClick={handleAdmit}
                className="rounded-md bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Accepter l'entrée du client
              </button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-center max-w-md">
                En attente du client...
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                Aucun client dans le lobby
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
