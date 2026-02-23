import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateLabForm } from './create-lab-form'

const mockCreateLabOnboarding = vi.fn()
vi.mock('../actions/create-lab-onboarding', () => ({
  createLabOnboarding: (input: unknown) => mockCreateLabOnboarding(input),
}))

const MEETING_ID = '00000000-0000-0000-0000-000000000001'
const TEMPLATE_ID = '00000000-0000-0000-0000-000000000002'
const CLIENT_ID = '00000000-0000-0000-0000-000000000003'

const templates = [{ id: TEMPLATE_ID, name: 'Parcours Complet' }]

describe('CreateLabForm', () => {
  it('renders all form fields', () => {
    render(<CreateLabForm meetingId={MEETING_ID} templates={templates} onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/nom du client/i)).toBeDefined()
    expect(screen.getByLabelText(/email/i)).toBeDefined()
    expect(screen.getByLabelText(/parcours template/i)).toBeDefined()
  })

  it('renders submit button', () => {
    render(<CreateLabForm meetingId={MEETING_ID} templates={templates} onSuccess={vi.fn()} />)
    expect(screen.getByRole('button', { name: /lancer le parcours lab/i })).toBeDefined()
  })

  it('renders template options in select', () => {
    render(<CreateLabForm meetingId={MEETING_ID} templates={templates} onSuccess={vi.fn()} />)
    expect(screen.getByText('Parcours Complet')).toBeDefined()
  })

  it('shows error message on API failure', async () => {
    mockCreateLabOnboarding.mockResolvedValue({
      data: null,
      error: { message: 'Un client avec cet email existe déjà', code: 'CONFLICT' },
    })
    render(<CreateLabForm meetingId={MEETING_ID} templates={templates} onSuccess={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/nom du client/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } })
    fireEvent.change(screen.getByLabelText(/parcours template/i), { target: { value: TEMPLATE_ID } })
    fireEvent.submit(screen.getByRole('button', { name: /lancer le parcours lab/i }).closest('form')!)

    await waitFor(() => {
      expect(screen.getByText('Un client avec cet email existe déjà')).toBeDefined()
    })
  })

  it('calls onSuccess with clientId on success', async () => {
    mockCreateLabOnboarding.mockResolvedValue({
      data: { clientId: CLIENT_ID, parcoursId: '00000000-0000-0000-0000-000000000099' },
      error: null,
    })
    const onSuccess = vi.fn()
    render(<CreateLabForm meetingId={MEETING_ID} templates={templates} onSuccess={onSuccess} />)

    fireEvent.change(screen.getByLabelText(/nom du client/i), { target: { value: 'Bob' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob@test.com' } })
    fireEvent.change(screen.getByLabelText(/parcours template/i), { target: { value: TEMPLATE_ID } })
    fireEvent.submit(screen.getByRole('button', { name: /lancer le parcours lab/i }).closest('form')!)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(CLIENT_ID)
    })
  })
})
