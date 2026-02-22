import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MeetingRequestList } from './meeting-request-list'
import type { MeetingRequest } from '../types/meeting-request.types'

vi.mock('./meeting-request-card', () => ({
  MeetingRequestCard: ({ request }: { request: MeetingRequest }) => (
    <div data-testid={`card-${request.id}`}>{request.id}</div>
  ),
}))

const mockRequest: MeetingRequest = {
  id: 'req-1',
  clientId: 'client-1',
  operatorId: 'op-1',
  requestedSlots: ['2026-03-01T10:00:00Z'],
  selectedSlot: null,
  status: 'pending',
  message: null,
  meetingId: null,
  createdAt: '2026-02-20T10:00:00Z',
  updatedAt: '2026-02-20T10:00:00Z',
}

describe('MeetingRequestList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no requests', () => {
    render(<MeetingRequestList requests={[]} />)
    expect(screen.getByText('Aucune demande de visio en attente')).toBeDefined()
  })

  it('renders request cards for each request', () => {
    const requests = [
      mockRequest,
      { ...mockRequest, id: 'req-2' },
    ]
    render(<MeetingRequestList requests={requests} />)
    expect(screen.getByTestId('card-req-1')).toBeDefined()
    expect(screen.getByTestId('card-req-2')).toBeDefined()
  })

  it('does not render empty state when requests exist', () => {
    render(<MeetingRequestList requests={[mockRequest]} />)
    expect(screen.queryByText('Aucune demande de visio en attente')).toBeNull()
  })
})
