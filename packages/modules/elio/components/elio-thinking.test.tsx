import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ElioThinking } from './elio-thinking'

describe('ElioThinking', () => {
  it('affiche le texte par défaut pour le dashboard lab', () => {
    render(<ElioThinking dashboardType="lab" />)
    expect(screen.getByText('Élio réfléchit...')).toBeDefined()
  })

  it('affiche le texte spécifique au dashboard hub', () => {
    render(<ElioThinking dashboardType="hub" />)
    expect(screen.getByText('Élio analyse votre question...')).toBeDefined()
  })

  it('affiche le texte spécifique au dashboard one', () => {
    render(<ElioThinking dashboardType="one" />)
    expect(screen.getByText('Élio réfléchit...')).toBeDefined()
  })

  it('affiche un texte personnalisé si fourni', () => {
    render(<ElioThinking text="Élio travaille sur votre demande..." />)
    expect(screen.getByText('Élio travaille sur votre demande...')).toBeDefined()
  })

  it('a les attributs aria corrects (role=status, aria-live=polite, aria-busy=true)', () => {
    render(<ElioThinking dashboardType="lab" />)
    const status = screen.getByRole('status')
    expect(status).toBeDefined()
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('aria-busy')).toBe('true')
  })

  it('fonctionne sans props (valeurs par défaut)', () => {
    render(<ElioThinking />)
    expect(screen.getByRole('status')).toBeDefined()
  })
})
