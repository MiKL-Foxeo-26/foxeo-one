import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SuspendClientDialog } from './suspend-client-dialog'

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('../actions/suspend-client', () => ({
  suspendClient: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
}))

describe('SuspendClientDialog', () => {
  const defaultProps = {
    clientId: '550e8400-e29b-41d4-a716-446655440001',
    clientName: 'Jean Dupont',
    open: true,
    onOpenChange: vi.fn(),
  }

  it('should render dialog title', () => {
    render(<SuspendClientDialog {...defaultProps} />)

    expect(screen.getByRole('heading', { name: /suspendre le client/i })).toBeInTheDocument()
  })

  it('should display client name in description', () => {
    render(<SuspendClientDialog {...defaultProps} />)

    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument()
  })

  it('should display consequences list', () => {
    render(<SuspendClientDialog {...defaultProps} />)

    expect(screen.getByText(/ne pourra plus accéder à son dashboard/)).toBeInTheDocument()
    expect(screen.getByText(/données seront conservées/)).toBeInTheDocument()
    expect(screen.getByText(/réactiver à tout moment/)).toBeInTheDocument()
  })

  it('should render reason textarea', () => {
    render(<SuspendClientDialog {...defaultProps} />)

    expect(screen.getByPlaceholderText(/paiement/i)).toBeInTheDocument()
  })

  it('should render cancel and confirm buttons', () => {
    render(<SuspendClientDialog {...defaultProps} />)

    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /suspendre le client/i })).toBeInTheDocument()
  })

  it('should show character count when reason is entered', async () => {
    const user = userEvent.setup()
    render(<SuspendClientDialog {...defaultProps} />)

    const textarea = screen.getByPlaceholderText(/paiement/i)
    await user.type(textarea, 'Test reason')

    expect(screen.getByText(/11 \/ 500/)).toBeInTheDocument()
  })

  it('should NOT render when open is false', () => {
    render(<SuspendClientDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('Suspendre le client')).not.toBeInTheDocument()
  })
})
