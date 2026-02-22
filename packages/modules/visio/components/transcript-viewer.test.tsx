import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptViewer } from './transcript-viewer'

const MOCK_SRT = `1
00:00:00,000 --> 00:00:05,000
Bonjour à tous

2
00:00:05,000 --> 00:00:10,000
Bienvenue dans cette réunion
`

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('TranscriptViewer', () => {
  it('renders empty state when no transcriptUrl', () => {
    render(<TranscriptViewer transcriptUrl={null} />)
    expect(screen.getByText('Aucune transcription disponible')).toBeDefined()
  })

  it('shows skeleton loaders while loading', () => {
    // Mock fetch that never resolves
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}))

    const { container } = render(<TranscriptViewer transcriptUrl="https://example.com/transcript.srt" />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(5)
  })

  it('renders transcript entries after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(MOCK_SRT, { status: 200 })
    )

    render(<TranscriptViewer transcriptUrl="https://example.com/transcript.srt" />)

    await waitFor(() => {
      expect(screen.getByText('Bonjour à tous')).toBeDefined()
      expect(screen.getByText('Bienvenue dans cette réunion')).toBeDefined()
    })
  })

  it('shows error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

    render(<TranscriptViewer transcriptUrl="https://example.com/transcript.srt" />)

    await waitFor(() => {
      expect(screen.getByText('Impossible de charger la transcription')).toBeDefined()
    })
  })

  it('calls onSeek when clicking a transcript entry', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(MOCK_SRT, { status: 200 })
    )
    const mockSeek = vi.fn()
    const user = userEvent.setup()

    render(
      <TranscriptViewer
        transcriptUrl="https://example.com/transcript.srt"
        onSeek={mockSeek}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Bonjour à tous')).toBeDefined()
    })

    await user.click(screen.getByText('Bonjour à tous'))
    expect(mockSeek).toHaveBeenCalledWith(0)
  })

  it('highlights active entry based on currentTime', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(MOCK_SRT, { status: 200 })
    )

    const { container } = render(
      <TranscriptViewer
        transcriptUrl="https://example.com/transcript.srt"
        currentTime={7}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Bienvenue dans cette réunion')).toBeDefined()
    })

    // The second entry (5-10s) should be active at currentTime=7
    const activeEntry = container.querySelector('.border-primary')
    expect(activeEntry).not.toBeNull()
    expect(activeEntry?.textContent).toContain('Bienvenue dans cette réunion')
  })
})
