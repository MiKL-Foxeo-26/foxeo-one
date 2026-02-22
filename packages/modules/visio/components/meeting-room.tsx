'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useOpenVidu } from '../hooks/use-openvidu'
import { MeetingControls } from './meeting-controls'

interface MeetingRoomProps {
  meetingId: string
  onLeave?: () => void
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'Déconnecté',
  connecting: 'Connexion en cours...',
  connected: 'Connecté',
  error: 'Erreur de connexion',
}

function SubscriberVideo({ subscriber }: { subscriber: { stream?: { streamId: string }; createVideoElement?: (el: HTMLElement) => void } }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && typeof subscriber.createVideoElement === 'function') {
      ref.current.innerHTML = ''
      subscriber.createVideoElement(ref.current)
    }
  }, [subscriber])

  return (
    <div
      ref={ref}
      className="aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10"
    />
  )
}

export function MeetingRoom({ meetingId, onLeave }: MeetingRoomProps) {
  const { session, publisher, subscribers, status, connect, disconnect } = useOpenVidu(meetingId)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const publisherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId])

  // Attach publisher video stream to DOM
  useEffect(() => {
    if (publisher && publisherRef.current) {
      // Clear previous video elements
      publisherRef.current.innerHTML = ''
      if (typeof publisher.createVideoElement === 'function') {
        publisher.createVideoElement(publisherRef.current)
      }
    }
  }, [publisher])

  const handleToggleMute = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(isMuted)
      setIsMuted(!isMuted)
    }
  }, [publisher, isMuted])

  const handleToggleCamera = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(isCameraOff)
      setIsCameraOff(!isCameraOff)
    }
  }, [publisher, isCameraOff])

  const handleToggleScreenShare = useCallback(async () => {
    if (!session || !publisher) return
    try {
      if (isScreenSharing) {
        // Revenir à la caméra
        await publisher.replaceTrack(undefined as any)
        setIsScreenSharing(false)
      } else {
        // Demander le partage d'écran via getDisplayMedia
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const screenTrack = screenStream.getVideoTracks()[0]
        if (screenTrack) {
          await publisher.replaceTrack(screenTrack)
          screenTrack.onended = () => {
            setIsScreenSharing(false)
          }
          setIsScreenSharing(true)
        }
      }
    } catch (err) {
      console.error('[VISIO:SCREEN_SHARE] Error:', err)
    }
  }, [session, publisher, isScreenSharing])

  const handleLeave = useCallback(() => {
    disconnect()
    onLeave?.()
  }, [disconnect, onLeave])

  return (
    <div className="relative flex h-full min-h-[400px] flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/80 p-4">
      {/* Status indicator */}
      <div className="flex w-full items-center justify-between">
        <span className="text-sm text-muted-foreground">{STATUS_LABELS[status]}</span>
        {status === 'error' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-400">Erreur — Vérifiez votre connexion</span>
            <button
              type="button"
              onClick={() => connect()}
              className="rounded-md border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>

      {/* Video grid */}
      <div className="flex-1 w-full grid gap-2">
        {/* Publisher (local) */}
        {publisher && (
          <div
            ref={publisherRef}
            className="aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">Vous</span>
          </div>
        )}

        {/* Subscribers (remote) */}
        {subscribers.map((subscriber) => (
          <SubscriberVideo key={subscriber.stream?.streamId} subscriber={subscriber} />
        ))}

        {status === 'connecting' && (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-muted-foreground">Connexion au meeting...</span>
          </div>
        )}

        {status === 'connected' && subscribers.length === 0 && !publisher && (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-muted-foreground text-sm">En attente des participants...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <MeetingControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        isScreenSharing={isScreenSharing}
        onToggleMute={handleToggleMute}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onLeave={handleLeave}
      />
    </div>
  )
}
