import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyClientList } from './empty-client-list'

describe('EmptyClientList', () => {
  it('should render "no clients" state when hasFilters is false', () => {
    render(<EmptyClientList />)

    expect(screen.getByText('Aucun client')).toBeInTheDocument()
    expect(
      screen.getByText(/commencez par créer votre premier client/i)
    ).toBeInTheDocument()
  })

  it('should render "no results" state when hasFilters is true', () => {
    render(<EmptyClientList hasFilters />)

    expect(screen.getByText('Aucun résultat')).toBeInTheDocument()
    expect(
      screen.getByText(/aucun client ne correspond/i)
    ).toBeInTheDocument()
  })

  it('should show create button when onCreateClient is provided and no filters', () => {
    const handleCreate = vi.fn()
    render(<EmptyClientList onCreateClient={handleCreate} />)

    const button = screen.getByRole('button', { name: /créer un client/i })
    expect(button).toBeInTheDocument()

    button.click()
    expect(handleCreate).toHaveBeenCalledOnce()
  })

  it('should not show create button when hasFilters is true', () => {
    render(<EmptyClientList hasFilters onCreateClient={vi.fn()} />)

    expect(
      screen.queryByRole('button', { name: /créer un client/i })
    ).not.toBeInTheDocument()
  })

  it('should not show create button when onCreateClient is not provided', () => {
    render(<EmptyClientList />)

    expect(
      screen.queryByRole('button', { name: /créer un client/i })
    ).not.toBeInTheDocument()
  })
})
