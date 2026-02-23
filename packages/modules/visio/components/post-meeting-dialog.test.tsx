import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PostMeetingDialog } from './post-meeting-dialog'

// Mock sub-form components to keep tests focused on dialog
vi.mock('./create-lab-form', () => ({
  CreateLabForm: ({ onSuccess }: { onSuccess: (id: string) => void }) => (
    <button onClick={() => onSuccess('client-id')}>Mock CreateLabForm</button>
  ),
}))
vi.mock('./send-resources-form', () => ({
  SendResourcesForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Mock SendResourcesForm</button>
  ),
}))
vi.mock('./schedule-follow-up-form', () => ({
  ScheduleFollowUpForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Mock ScheduleFollowUpForm</button>
  ),
}))
vi.mock('./not-interested-form', () => ({
  NotInterestedForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Mock NotInterestedForm</button>
  ),
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'

const defaultProps = {
  meetingId: MEETING_ID,
  isOpen: true,
  onClose: vi.fn(),
  templates: [{ id: 'tmpl-1', name: 'Parcours Complet' }],
  prospectDocuments: [{ id: 'doc-1', name: 'Guide.pdf' }],
}

describe('PostMeetingDialog', () => {
  it('does not render when isOpen is false', () => {
    render(<PostMeetingDialog {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders dialog with 4 action buttons when isOpen is true', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Créer parcours Lab')).toBeDefined()
    expect(screen.getByText('Envoyer ressources')).toBeDefined()
    expect(screen.getByText('Programmer rappel')).toBeDefined()
    expect(screen.getByText('Pas intéressé')).toBeDefined()
  })

  it('shows "Suite à donner" title on initial view', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    expect(screen.getByText('Suite à donner')).toBeDefined()
  })

  it('shows CreateLabForm when "Créer parcours Lab" is clicked', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Créer parcours Lab'))
    expect(screen.getByText('Mock CreateLabForm')).toBeDefined()
  })

  it('shows SendResourcesForm when "Envoyer ressources" is clicked', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Envoyer ressources'))
    expect(screen.getByText('Mock SendResourcesForm')).toBeDefined()
  })

  it('shows ScheduleFollowUpForm when "Programmer rappel" is clicked', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Programmer rappel'))
    expect(screen.getByText('Mock ScheduleFollowUpForm')).toBeDefined()
  })

  it('shows NotInterestedForm when "Pas intéressé" is clicked', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Pas intéressé'))
    expect(screen.getByText('Mock NotInterestedForm')).toBeDefined()
  })

  it('shows back button after selecting an action', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Créer parcours Lab'))
    expect(screen.getByText('← Retour')).toBeDefined()
  })

  it('goes back to main menu when back button clicked', () => {
    render(<PostMeetingDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Créer parcours Lab'))
    fireEvent.click(screen.getByText('← Retour'))
    expect(screen.getByText('Suite à donner')).toBeDefined()
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(<PostMeetingDialog {...defaultProps} onClose={onClose} />)
    // The overlay is the first child of the dialog div
    const overlay = screen.getByRole('dialog').firstElementChild
    if (overlay) fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onLabCreated and onClose when CreateLabForm succeeds', () => {
    const onClose = vi.fn()
    const onLabCreated = vi.fn()
    render(<PostMeetingDialog {...defaultProps} onClose={onClose} onLabCreated={onLabCreated} />)
    fireEvent.click(screen.getByText('Créer parcours Lab'))
    fireEvent.click(screen.getByText('Mock CreateLabForm'))
    expect(onLabCreated).toHaveBeenCalledWith('client-id')
    expect(onClose).toHaveBeenCalled()
  })
})
