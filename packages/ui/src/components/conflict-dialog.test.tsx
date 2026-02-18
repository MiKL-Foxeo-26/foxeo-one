import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConflictDialog } from './conflict-dialog'

describe('ConflictDialog', () => {
  const defaultProps = {
    open: true,
    onReload: vi.fn(),
    onForce: vi.fn(),
  }

  it('exports ConflictDialog component', () => {
    expect(ConflictDialog).toBeDefined()
  })

  it('renders when open is true', () => {
    render(<ConflictDialog {...defaultProps} />)
    expect(screen.getByText(/conflit/i)).toBeDefined()
  })

  it('does not render dialog content when open is false', () => {
    render(<ConflictDialog {...defaultProps} open={false} />)
    expect(screen.queryByText(/conflit/i)).toBeNull()
  })

  it('displays reload option', () => {
    render(<ConflictDialog {...defaultProps} />)
    expect(screen.getByText(/recharger/i)).toBeDefined()
  })

  it('displays force option', () => {
    render(<ConflictDialog {...defaultProps} />)
    expect(screen.getByText(/forcer/i)).toBeDefined()
  })

  it('calls onReload when reload button is clicked', () => {
    const onReload = vi.fn()
    render(<ConflictDialog {...defaultProps} onReload={onReload} />)

    const reloadBtn = screen.getByText(/recharger/i)
    fireEvent.click(reloadBtn)
    expect(onReload).toHaveBeenCalledOnce()
  })

  it('calls onForce when force button is clicked', () => {
    const onForce = vi.fn()
    render(<ConflictDialog {...defaultProps} onForce={onForce} />)

    const forceBtn = screen.getByText(/forcer/i)
    fireEvent.click(forceBtn)
    expect(onForce).toHaveBeenCalledOnce()
  })

  it('displays custom message when provided', () => {
    render(
      <ConflictDialog
        {...defaultProps}
        message="Un autre utilisateur a modifié ce client."
      />
    )
    expect(screen.getByText(/autre utilisateur/i)).toBeDefined()
  })
})
