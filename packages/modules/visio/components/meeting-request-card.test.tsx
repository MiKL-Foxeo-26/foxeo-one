import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MeetingRequestCard } from './meeting-request-card'
import type { MeetingRequest } from '../types/meeting-request.types'

vi.mock('../actions/accept-meeting-request', () => ({
  acceptMeetingRequest: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock('../actions/reject-meeting-request', () => ({
  rejectMeetingRequest: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

const mockRequest: MeetingRequest = {
  id: 'req-1',
  clientId: 'client-1',
  operatorId: 'op-1',
  requestedSlots: ['2026-03-01T10:00:00Z', '2026-03-01T14:00:00Z'],
  selectedSlot: null,
  status: 'pending',
  message: 'Besoin de discuter du projet',
  meetingId: null,
  createdAt: '2026-02-20T10:00:00Z',
  updatedAt: '2026-02-20T10:00:00Z',
}

describe('MeetingRequestCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders request status badge', () => {
    render(<MeetingRequestCard request={mockRequest} />)
    expect(screen.getByText('En attente')).toBeDefined()
  })

  it('displays request message', () => {
    render(<MeetingRequestCard request={mockRequest} />)
    expect(screen.getByText('Besoin de discuter du projet')).toBeDefined()
  })

  it('renders slot buttons for requested slots', () => {
    render(<MeetingRequestCard request={mockRequest} />)
    const buttons = screen.getAllByRole('button')
    // At least slot buttons + action buttons
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('renders accept and reject buttons for pending requests', () => {
    render(<MeetingRequestCard request={mockRequest} />)
    expect(screen.getByText('Accepter')).toBeDefined()
    expect(screen.getByText('Refuser')).toBeDefined()
  })

  it('does not render action buttons for accepted requests', () => {
    const accepted: MeetingRequest = {
      ...mockRequest,
      status: 'accepted',
      selectedSlot: '2026-03-01T10:00:00Z',
    }
    render(<MeetingRequestCard request={accepted} />)
    expect(screen.queryByText('Accepter')).toBeNull()
    expect(screen.queryByText('Refuser')).toBeNull()
  })

  it('shows confirmed date for accepted requests', () => {
    const accepted: MeetingRequest = {
      ...mockRequest,
      status: 'accepted',
      selectedSlot: '2026-03-01T10:00:00Z',
    }
    render(<MeetingRequestCard request={accepted} />)
    expect(screen.getByText(/RDV confirmé/)).toBeDefined()
  })
})
