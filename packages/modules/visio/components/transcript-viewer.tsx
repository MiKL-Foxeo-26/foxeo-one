'use client'

import { useEffect, useState, useCallback } from 'react'
import type { SrtEntry } from '../utils/parse-srt'
import { parseSrt, formatTimestamp } from '../utils/parse-srt'

interface TranscriptViewerProps {
  transcriptUrl: string | null
  currentTime?: number
  onSeek?: (seconds: number) => void
}

export function TranscriptViewer({ transcriptUrl, currentTime = 0, onSeek }: TranscriptViewerProps) {
  const [entries, setEntries] = useState<SrtEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!transcriptUrl) return

    setLoading(true)
    setError(null)

    fetch(transcriptUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load transcript')
        return res.text()
      })
      .then((text) => {
        setEntries(parseSrt(text))
        setLoading(false)
      })
      .catch((err) => {
        console.error('[VISIO:TRANSCRIPT_VIEWER] Load error:', err)
        setError('Impossible de charger la transcription')
        setLoading(false)
      })
  }, [transcriptUrl])

  const handleSeek = useCallback(
    (seconds: number) => {
      onSeek?.(seconds)
    },
    [onSeek]
  )

  if (!transcriptUrl) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Aucune transcription disponible
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-white/5" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-400">
        {error}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Transcription vide
      </div>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[600px]" role="list" aria-label="Transcription">
      {entries.map((entry) => {
        const isActive = currentTime >= entry.start && currentTime <= entry.end
        return (
          <button
            key={entry.index}
            onClick={() => handleSeek(entry.start)}
            className={`block w-full text-left px-3 py-2 transition-colors hover:bg-white/5 ${
              isActive ? 'bg-white/10 border-l-2 border-primary' : ''
            }`}
            role="listitem"
          >
            <span className="text-xs text-muted-foreground font-mono">
              {formatTimestamp(entry.start)}
            </span>
            <p className="text-sm mt-0.5">{entry.text}</p>
          </button>
        )
      })}
    </div>
  )
}
