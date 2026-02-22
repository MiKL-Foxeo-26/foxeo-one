import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecordingPlayer } from './recording-player'

describe('RecordingPlayer', () => {
  it('renders video element', () => {
    const { container } = render(
      <RecordingPlayer recordingUrl="https://example.com/video.mp4" />
    )
    const video = container.querySelector('video')
    expect(video).toBeDefined()
    expect(video?.getAttribute('src')).toBe('https://example.com/video.mp4')
  })

  it('renders video with controls', () => {
    const { container } = render(
      <RecordingPlayer recordingUrl="https://example.com/video.mp4" />
    )
    const video = container.querySelector('video')
    expect(video?.hasAttribute('controls')).toBe(true)
  })

  it('renders transcript panel when transcriptUrl provided', () => {
    render(
      <RecordingPlayer
        recordingUrl="https://example.com/video.mp4"
        transcriptUrl="https://example.com/transcript.srt"
      />
    )
    expect(screen.getByText('Transcription')).toBeDefined()
  })

  it('does not render transcript panel when no transcriptUrl', () => {
    render(
      <RecordingPlayer recordingUrl="https://example.com/video.mp4" />
    )
    expect(screen.queryByText('Transcription')).toBeNull()
  })
})
