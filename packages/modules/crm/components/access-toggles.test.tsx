import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AccessToggles } from './access-toggles'

// Mock the toggle action
vi.mock('../actions/toggle-access', () => ({
  toggleAccess: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('AccessToggles', () => {
  it('should render Lab and One toggles', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Accès Lab')).toBeInTheDocument()
    expect(screen.getByText('Accès One')).toBeInTheDocument()
  })

  it('should render Switch elements (role=switch)', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    const switches = screen.getAllByRole('switch')
    expect(switches).toHaveLength(2)
  })

  it('should show both toggles ON when dashboardType is lab', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    const labToggle = screen.getByTestId('toggle-lab')
    const oneToggle = screen.getByTestId('toggle-one')

    // Lab ON → both toggles should be checked
    expect(labToggle).toHaveAttribute('aria-checked', 'true')
    expect(oneToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('should show only One ON when dashboardType is one', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="one"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    const labToggle = screen.getByTestId('toggle-lab')
    const oneToggle = screen.getByTestId('toggle-one')

    expect(labToggle).toHaveAttribute('aria-checked', 'false')
    expect(oneToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('should show confirmation dialog when disabling access', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    // Click Lab toggle to disable it (currently ON)
    const labToggle = screen.getByTestId('toggle-lab')
    fireEvent.click(labToggle)

    // Confirmation dialog should appear
    expect(screen.getByText(/perdra l'accès/)).toBeInTheDocument()
  })

  it('should mention parcours suspension in confirmation when active parcours exists', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={true}
      />,
      { wrapper: createWrapper() }
    )

    const labToggle = screen.getByTestId('toggle-lab')
    fireEvent.click(labToggle)

    expect(screen.getByText(/parcours Lab en cours sera suspendu/)).toBeInTheDocument()
  })

  it('should have data-testid attribute', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByTestId('access-toggles')).toBeInTheDocument()
  })

  it('should have card title "Accès dashboards"', () => {
    render(
      <AccessToggles
        clientId="550e8400-e29b-41d4-a716-446655440001"
        dashboardType="lab"
        hasActiveParcours={false}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Accès dashboards')).toBeInTheDocument()
  })
})
