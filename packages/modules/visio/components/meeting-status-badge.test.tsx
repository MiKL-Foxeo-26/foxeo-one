import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MeetingStatusBadge } from './meeting-status-badge'
import type { MeetingStatus } from '../types/meeting.types'

describe('MeetingStatusBadge', () => {
  const cases: Array<{ status: MeetingStatus; label: string }> = [
    { status: 'scheduled', label: 'Planifié' },
    { status: 'in_progress', label: 'En cours' },
    { status: 'completed', label: 'Terminé' },
    { status: 'cancelled', label: 'Annulé' },
  ]

  cases.forEach(({ status, label }) => {
    it(`renders "${label}" for status "${status}"`, () => {
      render(<MeetingStatusBadge status={status} />)
      expect(screen.getByText(label)).toBeDefined()
    })
  })

  it('renders a badge element', () => {
    const { container } = render(<MeetingStatusBadge status="scheduled" />)
    expect(container.firstChild).toBeDefined()
  })
})
