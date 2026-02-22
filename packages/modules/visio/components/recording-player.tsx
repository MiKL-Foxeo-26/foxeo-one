'use client'

import { useRef, useState, useCallback } from 'react'
import { TranscriptViewer } from './transcript-viewer'

interface RecordingPlayerProps {
  recordingUrl: string
  transcriptUrl?: string | null
}

export function RecordingPlayer({ recordingUrl, transcriptUrl }: RecordingPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }, [])

  const handleSeek = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <video
          ref={videoRef}
          src={recordingUrl}
          controls
          className="w-full rounded-lg bg-black"
          onTimeUpdate={handleTimeUpdate}
        >
          <track kind="captions" />
        </video>
      </div>
      {transcriptUrl && (
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-2">
            <h3 className="text-sm font-medium">Transcription</h3>
          </div>
          <TranscriptViewer
            transcriptUrl={transcriptUrl}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
        </div>
      )}
    </div>
  )
}
