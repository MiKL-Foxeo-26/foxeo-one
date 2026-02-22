import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MeetingScheduleDialog } from './meeting-schedule-dialog'

const CLIENT_ID = '00000000-0000-0000-0000-000000000001'
const OPERATOR_ID = '00000000-0000-0000-0000-000000000002'

const defaultProps = {
  clientId: CLIENT_ID,
  operatorId: OPERATOR_ID,
  open: true,
  onOpenChange: vi.fn(),
}

describe('MeetingScheduleDialog', () => {
  it('renders dialog when open is true', () => {
    render(<MeetingScheduleDialog {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('renders title input', () => {
    render(<MeetingScheduleDialog {...defaultProps} />)
    expect(screen.getByLabelText(/titre/i)).toBeDefined()
  })

  it('renders submit button', () => {
    render(<MeetingScheduleDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: /planifier/i })).toBeDefined()
  })

  it('renders cancel button', () => {
    render(<MeetingScheduleDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: /annuler/i })).toBeDefined()
  })

  it('does not render when open is false', () => {
    render(<MeetingScheduleDialog {...defaultProps} open={false} />)
    const dialog = screen.queryByRole('dialog')
    expect(dialog).toBeNull()
  })

  it('calls onOpenChange when cancel button clicked', () => {
    const onOpenChange = vi.fn()
    render(<MeetingScheduleDialog {...defaultProps} onOpenChange={onOpenChange} />)

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
