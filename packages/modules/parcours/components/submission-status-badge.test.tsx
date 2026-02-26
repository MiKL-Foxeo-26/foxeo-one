import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SubmissionStatusBadge } from './submission-status-badge'

describe('SubmissionStatusBadge', () => {
  it('renders "En attente" for pending status', () => {
    render(<SubmissionStatusBadge status="pending" />)
    expect(screen.getByText('En attente')).toBeDefined()
  })

  it('renders "Approuvé" for approved status', () => {
    render(<SubmissionStatusBadge status="approved" />)
    expect(screen.getByText('Approuvé')).toBeDefined()
  })

  it('renders "Refusé" for rejected status', () => {
    render(<SubmissionStatusBadge status="rejected" />)
    expect(screen.getByText('Refusé')).toBeDefined()
  })

  it('renders "Révision demandée" for revision_requested status', () => {
    render(<SubmissionStatusBadge status="revision_requested" />)
    expect(screen.getByText('Révision demandée')).toBeDefined()
  })

  it('applies orange classes for pending', () => {
    const { container } = render(<SubmissionStatusBadge status="pending" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('orange')
  })

  it('applies green classes for approved', () => {
    const { container } = render(<SubmissionStatusBadge status="approved" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('green')
  })

  it('applies red classes for rejected', () => {
    const { container } = render(<SubmissionStatusBadge status="rejected" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('red')
  })

  it('applies blue classes for revision_requested', () => {
    const { container } = render(<SubmissionStatusBadge status="revision_requested" />)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('blue')
  })
})
