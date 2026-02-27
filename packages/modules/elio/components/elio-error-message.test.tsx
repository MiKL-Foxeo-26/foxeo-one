import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ElioErrorMessage } from './elio-error-message'
import type { ElioError } from '../types/elio.types'

describe('ElioErrorMessage', () => {
  const makeError = (code: ElioError['code'], message?: string): ElioError => ({
    code,
    message: message ?? '',
  })

  it('affiche le message pour une erreur TIMEOUT', () => {
    render(<ElioErrorMessage error={makeError('TIMEOUT')} />)
    expect(screen.getByText('Élio est temporairement indisponible. Réessayez dans quelques instants.')).toBeDefined()
  })

  it('affiche le message pour une erreur NETWORK_ERROR', () => {
    render(<ElioErrorMessage error={makeError('NETWORK_ERROR')} />)
    expect(screen.getByText('Problème de connexion. Vérifiez votre connexion internet.')).toBeDefined()
  })

  it('affiche le message pour une erreur LLM_ERROR', () => {
    render(<ElioErrorMessage error={makeError('LLM_ERROR')} />)
    expect(screen.getByText('Élio est surchargé. Réessayez dans quelques minutes.')).toBeDefined()
  })

  it('affiche le message pour une erreur UNKNOWN', () => {
    render(<ElioErrorMessage error={makeError('UNKNOWN')} />)
    expect(screen.getByText('Une erreur inattendue est survenue.')).toBeDefined()
  })

  it('affiche le message custom fourni dans error.message', () => {
    render(<ElioErrorMessage error={makeError('UNKNOWN', 'Erreur spécifique')} />)
    expect(screen.getByText('Erreur spécifique')).toBeDefined()
  })

  it('affiche le bouton Réessayer si onRetry est fourni', () => {
    const onRetry = vi.fn()
    render(<ElioErrorMessage error={makeError('TIMEOUT')} onRetry={onRetry} />)
    expect(screen.getByText('Réessayer')).toBeDefined()
  })

  it('n\'affiche pas le bouton Réessayer si onRetry n\'est pas fourni', () => {
    render(<ElioErrorMessage error={makeError('TIMEOUT')} />)
    expect(screen.queryByText('Réessayer')).toBeNull()
  })

  it('appelle onRetry au clic sur le bouton', () => {
    const onRetry = vi.fn()
    render(<ElioErrorMessage error={makeError('LLM_ERROR')} onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Réessayer'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('a le role=alert pour l\'accessibilité', () => {
    render(<ElioErrorMessage error={makeError('TIMEOUT')} />)
    expect(screen.getByRole('alert')).toBeDefined()
  })
})
