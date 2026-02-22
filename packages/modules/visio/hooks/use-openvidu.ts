'use client'

import { useState, useCallback } from 'react'
import { OpenVidu } from 'openvidu-browser'
import type { Session, Publisher, StreamManager } from 'openvidu-browser'
import { getOpenViduToken } from '../actions/get-openvidu-token'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface UseOpenViduReturn {
  session: Session | null
  publisher: Publisher | null
  subscribers: StreamManager[]
  status: ConnectionStatus
  connect: () => Promise<void>
  disconnect: () => void
}

export function useOpenVidu(meetingId: string): UseOpenViduReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [subscribers, setSubscribers] = useState<StreamManager[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')

  const connect = useCallback(async () => {
    setStatus('connecting')

    // Obtenir token via Server Action (ne pas exposer le secret côté client)
    const tokenResult = await getOpenViduToken({ meetingId })
    if (tokenResult.error || !tokenResult.data) {
      console.error('[VISIO:CONNECT] Token error:', tokenResult.error)
      setStatus('error')
      return
    }

    const { token } = tokenResult.data

    try {
      const OV = new OpenVidu()
      const newSession = OV.initSession()

      newSession.on('streamCreated', (event) => {
        const subscriber = newSession.subscribe((event as any).stream, undefined)
        setSubscribers((prev) => [...prev, subscriber])
      })

      newSession.on('streamDestroyed', (event) => {
        setSubscribers((prev) =>
          prev.filter((s) => s.stream.streamId !== (event as any).stream.streamId)
        )
      })

      await newSession.connect(token)

      const pub = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
      })

      newSession.publish(pub)

      setSession(newSession)
      setPublisher(pub)
      setStatus('connected')
    } catch (err) {
      console.error('[VISIO:CONNECT] Connection error:', err)
      setStatus('error')
    }
  }, [meetingId])

  const disconnect = useCallback(() => {
    if (session) {
      session.disconnect()
      setSession(null)
      setPublisher(null)
      setSubscribers([])
      setStatus('disconnected')
    }
  }, [session])

  return { session, publisher, subscribers, status, connect, disconnect }
}
