import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ScheduleFollowUpForm } from './schedule-follow-up-form'

const mockScheduleFollowUp = vi.fn()
vi.mock('../actions/schedule-follow-up', () => ({
  scheduleFollowUp: (input: unknown) => mockScheduleFollowUp(input),
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'

describe('ScheduleFollowUpForm', () => {
  it('renders date input and message textarea', () => {
    render(<ScheduleFollowUpForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/date du rappel/i)).toBeDefined()
    expect(screen.getByLabelText(/message/i)).toBeDefined()
  })

  it('shows default message text', () => {
    render(<ScheduleFollowUpForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)
    const textarea = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    expect(textarea.value).toBe('Relancer le prospect suite à la visio')
  })

  it('renders submit button', () => {
    render(<ScheduleFollowUpForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)
    expect(screen.getByRole('button', { name: /créer le rappel/i })).toBeDefined()
  })

  it('calls onSuccess after successful submission', async () => {
    mockScheduleFollowUp.mockResolvedValue({
      data: { reminderId: 'r-1' },
      error: null,
    })
    const onSuccess = vi.fn()
    render(<ScheduleFollowUpForm meetingId={MEETING_ID} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/date du rappel/i), {
      target: { value: '2026-03-01T10:00' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /créer le rappel/i }).closest('form')!)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message on API failure', async () => {
    mockScheduleFollowUp.mockResolvedValue({
      data: null,
      error: { message: 'Impossible de créer le rappel', code: 'SCHEDULE_ERROR' },
    })
    render(<ScheduleFollowUpForm meetingId={MEETING_ID} onSuccess={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/date du rappel/i), {
      target: { value: '2026-03-01T10:00' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /créer le rappel/i }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Impossible de créer le rappel')).toBeDefined()
    })
  })
})
