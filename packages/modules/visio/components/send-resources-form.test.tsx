import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SendResourcesForm } from './send-resources-form'
import type { ProspectDocument } from './send-resources-form'

const mockSendProspectResources = vi.fn()
vi.mock('../actions/send-prospect-resources', () => ({
  sendProspectResources: (input: unknown) => mockSendProspectResources(input),
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'

const documents: ProspectDocument[] = [
  { id: 'doc-1', name: 'Plaquette commerciale' },
  { id: 'doc-2', name: 'Grille tarifaire' },
]

describe('SendResourcesForm', () => {
  it('renders email input and document checkboxes', () => {
    render(<SendResourcesForm meetingId={MEETING_ID} documents={documents} onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/email du prospect/i)).toBeDefined()
    expect(screen.getByLabelText('Plaquette commerciale')).toBeDefined()
    expect(screen.getByLabelText('Grille tarifaire')).toBeDefined()
  })

  it('shows empty message when documents is empty', () => {
    render(<SendResourcesForm meetingId={MEETING_ID} documents={[]} onSuccess={vi.fn()} />)
    expect(
      screen.getByText(/aucun document partagé disponible/i)
    ).toBeDefined()
  })

  it('submit button disabled when no documents available', () => {
    render(<SendResourcesForm meetingId={MEETING_ID} documents={[]} onSuccess={vi.fn()} />)
    const button = screen.getByRole('button', { name: /envoyer les ressources/i })
    expect(button).toHaveProperty('disabled', true)
  })

  it('calls onSuccess after successful submission', async () => {
    mockSendProspectResources.mockResolvedValue({
      data: { linksSent: 2 },
      error: null,
    })
    const onSuccess = vi.fn()
    render(<SendResourcesForm meetingId={MEETING_ID} documents={documents} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/email du prospect/i), {
      target: { value: 'prospect@test.com' },
    })
    fireEvent.click(screen.getByLabelText('Plaquette commerciale'))
    fireEvent.submit(screen.getByRole('button', { name: /envoyer les ressources/i }).closest('form')!)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message on API failure', async () => {
    mockSendProspectResources.mockResolvedValue({
      data: null,
      error: { message: 'Erreur lors de l\'envoi', code: 'SEND_ERROR' },
    })
    render(<SendResourcesForm meetingId={MEETING_ID} documents={documents} onSuccess={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/email du prospect/i), {
      target: { value: 'prospect@test.com' },
    })
    fireEvent.click(screen.getByLabelText('Plaquette commerciale'))
    fireEvent.submit(screen.getByRole('button', { name: /envoyer les ressources/i }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Erreur lors de l\'envoi')).toBeDefined()
    })
  })
})
