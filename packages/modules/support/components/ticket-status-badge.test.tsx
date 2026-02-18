import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TicketStatusBadge } from './ticket-status-badge'

describe('TicketStatusBadge', () => {
  it('should render open status', () => {
    render(<TicketStatusBadge status="open" />)
    expect(screen.getByText('Ouvert')).toBeDefined()
  })

  it('should render in_progress status', () => {
    render(<TicketStatusBadge status="in_progress" />)
    expect(screen.getByText('En cours')).toBeDefined()
  })

  it('should render resolved status', () => {
    render(<TicketStatusBadge status="resolved" />)
    expect(screen.getByText('Résolu')).toBeDefined()
  })

  it('should render closed status', () => {
    render(<TicketStatusBadge status="closed" />)
    expect(screen.getByText('Fermé')).toBeDefined()
  })
})
