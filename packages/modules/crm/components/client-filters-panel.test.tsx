import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClientFiltersPanel } from './client-filters-panel'
import type { ClientFilters } from '../types/crm.types'

describe('ClientFiltersPanel', () => {
  it('should render type and status select triggers', () => {
    render(
      <ClientFiltersPanel filters={{}} onFiltersChange={vi.fn()} />
    )

    expect(screen.getByText('Tous les types')).toBeInTheDocument()
    expect(screen.getByText('Tous les statuts')).toBeInTheDocument()
  })

  it('should not show reset button when no active filters', () => {
    render(
      <ClientFiltersPanel filters={{}} onFiltersChange={vi.fn()} />
    )

    expect(
      screen.queryByRole('button', { name: /réinitialiser/i })
    ).not.toBeInTheDocument()
  })

  it('should show reset button when clientType filters are active', () => {
    const filters: ClientFilters = { clientType: ['complet'] }
    render(
      <ClientFiltersPanel filters={filters} onFiltersChange={vi.fn()} />
    )

    expect(
      screen.getByRole('button', { name: /réinitialiser/i })
    ).toBeInTheDocument()
  })

  it('should show reset button when status filters are active', () => {
    const filters: ClientFilters = { status: ['lab-actif'] }
    render(
      <ClientFiltersPanel filters={filters} onFiltersChange={vi.fn()} />
    )

    expect(
      screen.getByRole('button', { name: /réinitialiser/i })
    ).toBeInTheDocument()
  })

  it('should not show reset button when filter arrays are empty', () => {
    const filters: ClientFilters = { clientType: [], status: [] }
    render(
      <ClientFiltersPanel filters={filters} onFiltersChange={vi.fn()} />
    )

    expect(
      screen.queryByRole('button', { name: /réinitialiser/i })
    ).not.toBeInTheDocument()
  })

  it('should call onFiltersChange with empty object on reset', () => {
    const handleChange = vi.fn()
    const filters: ClientFilters = { clientType: ['complet'] }
    render(
      <ClientFiltersPanel filters={filters} onFiltersChange={handleChange} />
    )

    screen.getByRole('button', { name: /réinitialiser/i }).click()
    expect(handleChange).toHaveBeenCalledWith({})
  })
})
