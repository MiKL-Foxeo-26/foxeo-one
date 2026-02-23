import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotInterestedForm } from './not-interested-form'

const mockMarkProspectNotInterested = vi.fn()
vi.mock('../actions/mark-prospect-not-interested', () => ({
  markProspectNotInterested: (input: unknown) => mockMarkProspectNotInterested(input),
  NotInterestedReasonValues: ['budget', 'timing', 'competitor', 'not_ready', 'other'] as const,
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'

describe('NotInterestedForm', () => {
  it('renders reason select dropdown', () => {
    render(<NotInterestedForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/raison/i)).toBeDefined()
  })

  it('shows all reason options', () => {
    render(<NotInterestedForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)
    expect(screen.getByText('Budget insuffisant')).toBeDefined()
    expect(screen.getByText('Pas le bon moment')).toBeDefined()
    expect(screen.getByText('Concurrent choisi')).toBeDefined()
    expect(screen.getByText('Pas encore prêt')).toBeDefined()
    expect(screen.getByText('Autre raison')).toBeDefined()
  })

  it('reason is optional — can submit without selecting one', async () => {
    mockMarkProspectNotInterested.mockResolvedValue({
      data: { meetingId: MEETING_ID },
      error: null,
    })
    const onSuccess = vi.fn()
    render(<NotInterestedForm meetingId={MEETING_ID} onSuccess={onSuccess} />)

    // Submit without selecting a reason
    fireEvent.submit(screen.getByRole('button', { name: /confirmer/i }).closest('form')!)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
    expect(mockMarkProspectNotInterested).toHaveBeenCalledWith({
      meetingId: MEETING_ID,
      reason: undefined,
    })
  })

  it('calls onSuccess after successful submission', async () => {
    mockMarkProspectNotInterested.mockResolvedValue({
      data: { meetingId: MEETING_ID },
      error: null,
    })
    const onSuccess = vi.fn()
    render(<NotInterestedForm meetingId={MEETING_ID} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/raison/i), { target: { value: 'budget' } })
    fireEvent.submit(screen.getByRole('button', { name: /confirmer/i }).closest('form')!)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message on API failure', async () => {
    mockMarkProspectNotInterested.mockResolvedValue({
      data: null,
      error: { message: 'Erreur serveur', code: 'SERVER_ERROR' },
    })
    render(<NotInterestedForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)

    fireEvent.submit(screen.getByRole('button', { name: /confirmer/i }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeDefined()
    })
  })
})
