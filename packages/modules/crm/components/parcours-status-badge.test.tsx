import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ParcoursStatusBadge } from './parcours-status-badge'

describe('ParcoursStatusBadge', () => {
  it('should render "En cours" for en_cours status', () => {
    render(<ParcoursStatusBadge status="en_cours" />)
    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  it('should render "Suspendu" for suspendu status', () => {
    render(<ParcoursStatusBadge status="suspendu" />)
    expect(screen.getByText('Suspendu')).toBeInTheDocument()
  })

  it('should render "Terminé" for termine status', () => {
    render(<ParcoursStatusBadge status="termine" />)
    expect(screen.getByText('Terminé')).toBeInTheDocument()
  })

  it('should have data-testid attribute', () => {
    render(<ParcoursStatusBadge status="en_cours" />)
    expect(screen.getByTestId('parcours-status-badge')).toBeInTheDocument()
  })
})
