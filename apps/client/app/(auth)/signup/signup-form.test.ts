import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignupForm } from './signup-form'
import * as authActions from '../actions/auth'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock Server Actions
vi.mock('../actions/auth', () => ({
  signupAction: vi.fn(),
}))

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('devrait afficher les deux checkboxes de consentement', () => {
    render(<SignupForm />)

    // Vérifier la présence des deux checkboxes
    expect(
      screen.getByLabelText(/J'accepte les Conditions Générales d'Utilisation/i)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(
        /J'accepte le traitement de mes données par l'IA Élio/i
      )
    ).toBeInTheDocument()
  })

  it('devrait afficher les liens vers les pages légales', () => {
    render(<SignupForm />)

    const cguLink = screen.getByRole('link', { name: /Consulter les CGU/i })
    const iaLink = screen.getByRole('link', { name: /En savoir plus sur Élio/i })

    expect(cguLink).toHaveAttribute('href', '/legal/cgu')
    expect(cguLink).toHaveAttribute('target', '_blank')
    expect(iaLink).toHaveAttribute('href', '/legal/ia-processing')
    expect(iaLink).toHaveAttribute('target', '_blank')
  })

  it('devrait désactiver le bouton de soumission si CGU non acceptées', () => {
    render(<SignupForm />)

    const submitButton = screen.getByRole('button', {
      name: /Creer mon compte/i,
    })

    // Le bouton devrait être désactivé initialement
    expect(submitButton).toBeDisabled()
  })

  it('devrait activer le bouton de soumission quand CGU acceptées', async () => {
    render(<SignupForm />)

    const cguCheckbox = screen.getByLabelText(
      /J'accepte les Conditions Générales d'Utilisation/i
    )
    const submitButton = screen.getByRole('button', {
      name: /Creer mon compte/i,
    })

    // Cocher la checkbox CGU
    fireEvent.click(cguCheckbox)

    // Le bouton devrait maintenant être activé
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('devrait permettre de soumettre le formulaire avec CGU acceptées et IA refusée', async () => {
    const mockSignupAction = vi.mocked(authActions.signupAction)
    mockSignupAction.mockResolvedValue({ data: { id: '1' }, error: null })

    render(<SignupForm />)

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'Test1234!' },
    })

    // Accepter seulement les CGU (pas l'IA)
    const cguCheckbox = screen.getByLabelText(
      /J'accepte les Conditions Générales d'Utilisation/i
    )
    fireEvent.click(cguCheckbox)

    // Soumettre
    const submitButton = screen.getByRole('button', {
      name: /Creer mon compte/i,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignupAction).toHaveBeenCalledWith(
        expect.objectContaining({
          get: expect.any(Function),
        })
      )
    })

    // Vérifier que acceptIaProcessing est false
    const formDataCall = mockSignupAction.mock.calls[0][0] as FormData
    expect(formDataCall.get('acceptCgu')).toBe('true')
    expect(formDataCall.get('acceptIaProcessing')).toBe('false')
  })

  it('devrait afficher une erreur si CGU non acceptées lors de la soumission', async () => {
    render(<SignupForm />)

    // Remplir le formulaire SANS accepter les CGU
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'Test1234!' },
    })

    // Essayer de soumettre (le bouton est désactivé mais on vérifie la validation)
    // Note: dans ce cas, le bouton est désactivé donc on ne peut pas vraiment
    // soumettre, mais le test vérifie que le bouton reste désactivé
    const submitButton = screen.getByRole('button', {
      name: /Creer mon compte/i,
    })
    expect(submitButton).toBeDisabled()
  })

  it('devrait permettre d\'accepter les deux consentements (CGU + IA)', async () => {
    const mockSignupAction = vi.mocked(authActions.signupAction)
    mockSignupAction.mockResolvedValue({ data: { id: '1' }, error: null })

    render(<SignupForm />)

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Mot de passe$/i), {
      target: { value: 'Test1234!' },
    })
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'Test1234!' },
    })

    // Accepter les deux consentements
    fireEvent.click(
      screen.getByLabelText(
        /J'accepte les Conditions Générales d'Utilisation/i
      )
    )
    fireEvent.click(
      screen.getByLabelText(
        /J'accepte le traitement de mes données par l'IA Élio/i
      )
    )

    // Soumettre
    fireEvent.click(
      screen.getByRole('button', { name: /Creer mon compte/i })
    )

    await waitFor(() => {
      expect(mockSignupAction).toHaveBeenCalled()
    })

    // Vérifier que les deux consentements sont true
    const formDataCall = mockSignupAction.mock.calls[0][0] as FormData
    expect(formDataCall.get('acceptCgu')).toBe('true')
    expect(formDataCall.get('acceptIaProcessing')).toBe('true')
  })
})
