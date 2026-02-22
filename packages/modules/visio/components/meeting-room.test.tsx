import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MeetingRoom } from './meeting-room'

// Mock use-openvidu hook
vi.mock('../hooks/use-openvidu', () => ({
  useOpenVidu: vi.fn().mockReturnValue({
    session: null,
    publisher: null,
    subscribers: [],
    status: 'disconnected',
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

// Mock MeetingControls
vi.mock('./meeting-controls', () => ({
  MeetingControls: () => <div data-testid="meeting-controls" />,
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000003'

describe('MeetingRoom', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders disconnected state initially (connect called async via useEffect)', () => {
    render(<MeetingRoom meetingId={MEETING_ID} />)
    expect(screen.getByText('Déconnecté')).toBeDefined()
  })

  it('renders meeting controls', () => {
    render(<MeetingRoom meetingId={MEETING_ID} />)
    expect(screen.getByTestId('meeting-controls')).toBeDefined()
  })

  it('renders connected state when status is connected', async () => {
    const { useOpenVidu } = await import('../hooks/use-openvidu')
    vi.mocked(useOpenVidu).mockReturnValue({
      session: {} as any,
      publisher: { createVideoElement: vi.fn() } as any,
      subscribers: [],
      status: 'connected',
      connect: vi.fn(),
      disconnect: vi.fn(),
    })

    render(<MeetingRoom meetingId={MEETING_ID} />)
    expect(screen.getByText(/connecté/i)).toBeDefined()
  })

  it('renders error state with retry button when status is error', async () => {
    const { useOpenVidu } = await import('../hooks/use-openvidu')
    vi.mocked(useOpenVidu).mockReturnValue({
      session: null,
      publisher: null,
      subscribers: [],
      status: 'error',
      connect: vi.fn(),
      disconnect: vi.fn(),
    })

    render(<MeetingRoom meetingId={MEETING_ID} />)
    expect(screen.getAllByText(/erreur/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Réessayer')).toBeDefined()
  })

  it('calls connect() when retry button is clicked in error state', async () => {
    const retryConnect = vi.fn()
    const { useOpenVidu } = await import('../hooks/use-openvidu')
    vi.mocked(useOpenVidu).mockReturnValue({
      session: null,
      publisher: null,
      subscribers: [],
      status: 'error',
      connect: retryConnect,
      disconnect: vi.fn(),
    })

    render(<MeetingRoom meetingId={MEETING_ID} />)
    const callCountAfterMount = retryConnect.mock.calls.length

    fireEvent.click(screen.getByText('Réessayer'))
    expect(retryConnect.mock.calls.length).toBe(callCountAfterMount + 1)
  })
})
