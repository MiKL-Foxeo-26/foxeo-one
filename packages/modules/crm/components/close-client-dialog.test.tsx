import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CloseClientDialog } from './close-client-dialog'

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('../actions/close-client', () => ({
  closeClient: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
}))

describe('CloseClientDialog', () => {
  const defaultProps = {
    clientId: '550e8400-e29b-41d4-a716-446655440001',
    clientName: 'Test Client',
    open: true,
    onOpenChange: vi.fn(),
  }

  it('should render dialog with client name', () => {
    render(<CloseClientDialog {...defaultProps} />)

    expect(screen.getAllByText(/Test Client/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Clôturer le client')).toBeInTheDocument()
  })

  it('should show consequences of closing', () => {
    render(<CloseClientDialog {...defaultProps} />)

    expect(screen.getByText(/Le client ne pourra plus se connecter/i)).toBeInTheDocument()
    expect(screen.getByText(/données seront archivées/i)).toBeInTheDocument()
  })

  it('should have confirm button disabled initially', () => {
    render(<CloseClientDialog {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: /clôturer définitivement/i })
    expect(closeButton).toBeDisabled()
  })

  it('should enable confirm button when valid name is entered', async () => {
    const user = userEvent.setup()
    render(<CloseClientDialog {...defaultProps} />)

    const input = screen.getByPlaceholderText('Nom du client')
    await user.type(input, 'Test Client')

    const closeButton = screen.getByRole('button', { name: /clôturer définitivement/i })
    expect(closeButton).not.toBeDisabled()
  })

  it('should validate name case-insensitively', async () => {
    const user = userEvent.setup()
    render(<CloseClientDialog {...defaultProps} />)

    const input = screen.getByPlaceholderText('Nom du client')
    await user.type(input, 'test client')

    const closeButton = screen.getByRole('button', { name: /clôturer définitivement/i })
    expect(closeButton).not.toBeDisabled()
  })

  it('should show error message for invalid name', async () => {
    const user = userEvent.setup()
    render(<CloseClientDialog {...defaultProps} />)

    const input = screen.getByPlaceholderText('Nom du client')
    await user.type(input, 'Wrong Name')

    expect(screen.getByText(/Le nom saisi ne correspond pas/i)).toBeInTheDocument()
  })

  it('should render cancel and confirm buttons', () => {
    render(<CloseClientDialog {...defaultProps} />)

    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clôturer définitivement/i })).toBeInTheDocument()
  })

  it('should NOT render when open is false', () => {
    render(<CloseClientDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('Clôturer le client')).not.toBeInTheDocument()
  })
})
