'use client'

import { useState, useCallback } from 'react'
import type { MeetingRecording } from '../types/recording.types'
import { RecordingStatusBadge } from './recording-status-badge'
import { RecordingPlayer } from './recording-player'
import { downloadRecording } from '../actions/download-recording'
import { downloadTranscript } from '../actions/download-transcript'

interface RecordingListProps {
  recordings: MeetingRecording[]
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}min`
  if (m > 0) return `${m}min ${s}s`
  return `${s}s`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

interface PlayerUrls {
  recordingUrl: string
  transcriptUrl: string | null
}

export function RecordingList({ recordings }: RecordingListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [playerUrls, setPlayerUrls] = useState<PlayerUrls | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (recordings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">Aucun enregistrement disponible</p>
      </div>
    )
  }

  async function handlePlay(rec: MeetingRecording) {
    if (expandedId === rec.id) {
      setExpandedId(null)
      setPlayerUrls(null)
      return
    }

    setError(null)
    setDownloading(`play-${rec.id}`)

    // Fetch signed URLs for inline playback
    const recResult = await downloadRecording({ recordingId: rec.id })
    if (recResult.error || !recResult.data) {
      setError(recResult.error?.message ?? 'Erreur de chargement vidéo')
      setDownloading(null)
      return
    }

    let transcriptSignedUrl: string | null = null
    if (rec.transcriptionStatus === 'completed' && rec.transcriptUrl) {
      const transResult = await downloadTranscript({ recordingId: rec.id })
      if (transResult.data?.signedUrl) {
        transcriptSignedUrl = transResult.data.signedUrl
      }
    }

    setPlayerUrls({
      recordingUrl: recResult.data.signedUrl,
      transcriptUrl: transcriptSignedUrl,
    })
    setExpandedId(rec.id)
    setDownloading(null)
  }

  async function handleDownloadRecording(recordingId: string) {
    setError(null)
    setDownloading(recordingId)
    const result = await downloadRecording({ recordingId })
    if (result.error || !result.data?.signedUrl) {
      setError(result.error?.message ?? 'Erreur de téléchargement')
    } else {
      window.location.href = result.data.signedUrl
    }
    setDownloading(null)
  }

  async function handleDownloadTranscript(recordingId: string) {
    setError(null)
    setDownloading(`transcript-${recordingId}`)
    const result = await downloadTranscript({ recordingId })
    if (result.error || !result.data?.signedUrl) {
      setError(result.error?.message ?? 'Erreur de téléchargement')
    } else {
      window.location.href = result.data.signedUrl
    }
    setDownloading(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 pr-4 font-medium text-muted-foreground">Date</th>
              <th className="pb-3 pr-4 font-medium text-muted-foreground">Durée</th>
              <th className="pb-3 pr-4 font-medium text-muted-foreground">Taille</th>
              <th className="pb-3 pr-4 font-medium text-muted-foreground">Transcription</th>
              <th className="pb-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((rec) => (
              <tr key={rec.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 pr-4 text-muted-foreground">{formatDate(rec.createdAt)}</td>
                <td className="py-3 pr-4">{formatDuration(rec.recordingDurationSeconds)}</td>
                <td className="py-3 pr-4 text-muted-foreground">{formatFileSize(rec.fileSizeBytes)}</td>
                <td className="py-3 pr-4">
                  <RecordingStatusBadge status={rec.transcriptionStatus} />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlay(rec)}
                      disabled={downloading === `play-${rec.id}`}
                      className="inline-flex items-center rounded-md border border-white/20 px-3 py-1 text-xs font-medium hover:bg-white/10 disabled:opacity-50"
                    >
                      {downloading === `play-${rec.id}` ? '...' : expandedId === rec.id ? 'Fermer' : 'Lire'}
                    </button>
                    <button
                      onClick={() => handleDownloadRecording(rec.id)}
                      disabled={downloading === rec.id}
                      className="inline-flex items-center rounded-md border border-white/20 px-3 py-1 text-xs font-medium hover:bg-white/10 disabled:opacity-50"
                    >
                      {downloading === rec.id ? '...' : 'Vidéo'}
                    </button>
                    {rec.transcriptionStatus === 'completed' && (
                      <button
                        onClick={() => handleDownloadTranscript(rec.id)}
                        disabled={downloading === `transcript-${rec.id}`}
                        className="inline-flex items-center rounded-md border border-white/20 px-3 py-1 text-xs font-medium hover:bg-white/10 disabled:opacity-50"
                      >
                        {downloading === `transcript-${rec.id}` ? '...' : 'Transcription'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expandedId && playerUrls && (
        <div className="rounded-lg border border-white/10 p-4">
          <RecordingPlayer
            recordingUrl={playerUrls.recordingUrl}
            transcriptUrl={playerUrls.transcriptUrl}
          />
        </div>
      )}
    </div>
  )
}
