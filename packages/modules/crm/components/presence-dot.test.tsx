import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PresenceDot } from './presence-dot'

describe('PresenceDot', () => {
  it('renders green dot when isOnline=true', () => {
    render(<PresenceDot isOnline={true} clientId="client-1" />)
    const dot = screen.getByTestId('presence-dot-client-1')
    expect(dot).toBeInTheDocument()
    expect(dot).toHaveClass('bg-green-500')
  })

  it('renders gray dot when isOnline=false', () => {
    render(<PresenceDot isOnline={false} clientId="client-1" />)
    const dot = screen.getByTestId('presence-dot-client-1')
    expect(dot).toHaveClass('bg-gray-300')
  })

  it('has accessible aria-label for online', () => {
    render(<PresenceDot isOnline={true} clientId="c1" />)
    expect(screen.getByRole('img', { name: 'En ligne' })).toBeInTheDocument()
  })

  it('has accessible aria-label for offline', () => {
    render(<PresenceDot isOnline={false} clientId="c1" />)
    expect(screen.getByRole('img', { name: 'Hors ligne' })).toBeInTheDocument()
  })
})
