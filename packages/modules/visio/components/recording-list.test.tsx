import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordingList } from './recording-list'
import type { MeetingRecording } from '../types/recording.types'

vi.mock('../actions/download-recording', () => ({
  downloadRecording: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://example.com/signed' }, error: null }),
}))

vi.mock('../actions/download-transcript', () => ({
  downloadTranscript: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://example.com/transcript-signed' }, error: null }),
}))

vi.mock('./recording-player', () => ({
  RecordingPlayer: ({ recordingUrl }: { recordingUrl: string }) => (
    <div data-testid="recording-player">{recordingUrl}</div>
  ),
}))

const RECORDING_ID = '00000000-0000-0000-0000-000000000001'
const MEETING_ID = '00000000-0000-0000-0000-000000000002'

const mockRecording: MeetingRecording = {
  id: RECORDING_ID,
  meetingId: MEETING_ID,
  recordingUrl: 'session-abc/rec-123.mp4',
  recordingDurationSeconds: 3600,
  fileSizeBytes: 104857600,
  transcriptUrl: null,
  transcriptionStatus: 'pending',
  transcriptionLanguage: 'fr',
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-03-01T10:00:00.000Z',
}

const completedRecording: MeetingRecording = {
  ...mockRecording,
  id: '00000000-0000-0000-0000-000000000003',
  transcriptUrl: 'rec-123.srt',
  transcriptionStatus: 'completed',
}

describe('RecordingList', () => {
  it('renders empty state when no recordings', () => {
    render(<RecordingList recordings={[]} />)
    expect(screen.getByText('Aucun enregistrement disponible')).toBeDefined()
  })

  it('renders recording rows', () => {
    render(<RecordingList recordings={[mockRecording]} />)
    expect(screen.getByText('1h 0min')).toBeDefined()
    expect(screen.getByText('100.0 MB')).toBeDefined()
    expect(screen.getByText('En attente')).toBeDefined()
  })

  it('shows action buttons', () => {
    render(<RecordingList recordings={[mockRecording]} />)
    expect(screen.getByText('Lire')).toBeDefined()
    expect(screen.getByText('Vidéo')).toBeDefined()
  })

  it('shows transcript download button when completed', () => {
    render(<RecordingList recordings={[completedRecording]} />)
    // Table header + button = 2 elements with "Transcription" text
    const elements = screen.getAllByText('Transcription')
    // Header + button
    expect(elements.length).toBeGreaterThanOrEqual(2)
    const button = elements.find((el) => el.tagName === 'BUTTON')
    expect(button).toBeDefined()
  })

  it('does not show transcript button when pending', () => {
    render(<RecordingList recordings={[mockRecording]} />)
    const elements = screen.getAllByText('Transcription')
    // Only the table header, no button
    const button = elements.find((el) => el.tagName === 'BUTTON')
    expect(button).toBeUndefined()
  })
})
