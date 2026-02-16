import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArchivedBanner } from './archived-banner'

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('../actions/reactivate-client', () => ({
  reactivateClient: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
}))

describe('ArchivedBanner', () => {
  const defaultProps = {
    clientId: '550e8400-e29b-41d4-a716-446655440001',
    archivedAt: '2026-02-16T10:00:00.000Z',
  }

  it('should render banner with archived date', () => {
    render(<ArchivedBanner {...defaultProps} />)

    expect(screen.getByText('Client clôturé')).toBeInTheDocument()
    expect(screen.getByText(/clôturé le 16 février 2026/i)).toBeInTheDocument()
    expect(screen.getByText(/données sont en lecture seule/i)).toBeInTheDocument()
  })

  it('should render reactivate button', () => {
    render(<ArchivedBanner {...defaultProps} />)

    const reactivateButton = screen.getByRole('button', { name: /réactiver/i })
    expect(reactivateButton).toBeInTheDocument()
  })


  it('should handle null archivedAt gracefully', () => {
    render(<ArchivedBanner {...defaultProps} archivedAt={null} />)

    expect(screen.getByText('Client clôturé')).toBeInTheDocument()
    // Should not crash, even with empty date
  })
})
