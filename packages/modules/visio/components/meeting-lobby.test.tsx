import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MeetingLobby } from './meeting-lobby'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

// Mock useMeetingRealtime
vi.mock('../hooks/use-meeting-realtime', () => ({
  useMeetingRealtime: vi.fn(() => ({
    operatorJoined: false,
    clientWaiting: false,
    broadcastClientWaiting: vi.fn(),
    broadcastOperatorJoined: vi.fn(),
  })),
}))

// Mock startMeeting
vi.mock('../actions/start-meeting', () => ({
  startMeeting: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

describe('MeetingLobby', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders lobby title', () => {
    render(<MeetingLobby meetingId="meeting-123" userType="client" />)
    expect(screen.getByText("Salle d'attente")).toBeDefined()
  })

  it('displays waiting message for client userType', () => {
    render(<MeetingLobby meetingId="meeting-123" userType="client" />)
    expect(screen.getByText(/En attente de MiKL/)).toBeDefined()
  })

  it('displays waiting for client message for operator when no client waiting', () => {
    render(<MeetingLobby meetingId="meeting-123" userType="operator" />)
    expect(screen.getByText(/En attente du client/)).toBeDefined()
  })

  it('displays admit button when client is waiting (operator view)', async () => {
    const { useMeetingRealtime } = await import('../hooks/use-meeting-realtime')
    vi.mocked(useMeetingRealtime).mockReturnValue({
      operatorJoined: false,
      clientWaiting: true,
      broadcastClientWaiting: vi.fn(),
      broadcastOperatorJoined: vi.fn(),
    })

    render(<MeetingLobby meetingId="meeting-123" userType="operator" />)
    expect(screen.getByText("Accepter l'entrée du client")).toBeDefined()
  })
})
