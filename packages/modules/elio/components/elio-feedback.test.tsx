import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ElioFeedback } from './elio-feedback'

const mockSubmitFeedback = vi.fn()

vi.mock('../actions/submit-feedback', () => ({
  submitFeedback: (...args: unknown[]) => mockSubmitFeedback(...args),
}))

describe('ElioFeedback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmitFeedback.mockResolvedValue({ data: true, error: null })
  })

  it('rend les deux boutons feedback', () => {
    render(<ElioFeedback messageId="msg-1" />)
    expect(screen.getByTestId('feedback-useful')).toBeDefined()
    expect(screen.getByTestId('feedback-not-useful')).toBeDefined()
  })

  it('affiche le feedback existant comme actif', () => {
    render(<ElioFeedback messageId="msg-1" currentFeedback="useful" />)
    const btn = screen.getByTestId('feedback-useful') as HTMLButtonElement
    expect(btn.getAttribute('aria-pressed')).toBe('true')
  })

  it('appelle submitFeedback avec "useful" au clic', async () => {
    render(<ElioFeedback messageId="msg-1" />)
    fireEvent.click(screen.getByRole('button', { name: /réponse utile/i }))
    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith('msg-1', 'useful')
    })
  })

  it('appelle submitFeedback avec "not_useful" au clic', async () => {
    render(<ElioFeedback messageId="msg-1" />)
    fireEvent.click(screen.getByRole('button', { name: /pas utile/i }))
    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith('msg-1', 'not_useful')
    })
  })

  it('toggle : cliquer à nouveau sur le feedback actif envoie null', async () => {
    render(<ElioFeedback messageId="msg-1" currentFeedback="useful" />)
    fireEvent.click(screen.getByRole('button', { name: /réponse utile/i }))
    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith('msg-1', null)
    })
  })

  it('change de sélection : cliquer sur l\'autre bouton change le feedback', async () => {
    render(<ElioFeedback messageId="msg-1" currentFeedback="useful" />)
    fireEvent.click(screen.getByRole('button', { name: /pas utile/i }))
    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith('msg-1', 'not_useful')
    })
  })
})
