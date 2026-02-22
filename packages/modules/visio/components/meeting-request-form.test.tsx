import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MeetingRequestForm } from './meeting-request-form'

vi.mock('../actions/request-meeting', () => ({
  requestMeeting: vi.fn(),
}))

describe('MeetingRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with title', () => {
    render(<MeetingRequestForm operatorId="op-1" />)
    expect(screen.getByText('Demander un rendez-vous')).toBeDefined()
  })

  it('renders 3 slot inputs', () => {
    render(<MeetingRequestForm operatorId="op-1" />)
    expect(screen.getByLabelText(/Créneau 1/)).toBeDefined()
    expect(screen.getByLabelText(/Créneau 2/)).toBeDefined()
    expect(screen.getByLabelText(/Créneau 3/)).toBeDefined()
  })

  it('renders optional message textarea', () => {
    render(<MeetingRequestForm operatorId="op-1" />)
    expect(screen.getByLabelText(/Message/)).toBeDefined()
  })

  it('renders submit button', () => {
    render(<MeetingRequestForm operatorId="op-1" />)
    expect(screen.getByText('Envoyer la demande')).toBeDefined()
  })

  it('first slot is required', () => {
    render(<MeetingRequestForm operatorId="op-1" />)
    const firstSlot = screen.getByLabelText(/Créneau 1/) as HTMLInputElement
    expect(firstSlot.required).toBe(true)
  })
})
