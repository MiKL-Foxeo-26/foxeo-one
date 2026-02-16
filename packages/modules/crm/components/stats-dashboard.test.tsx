import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { StatsDashboard } from './stats-dashboard'
import type { PortfolioStats, GraduationRate, ClientTimeEstimate } from '../types/crm.types'

// Mock hooks to avoid Server Action calls
vi.mock('../hooks/use-portfolio-stats', () => ({
  usePortfolioStats: vi.fn((initial) => ({
    data: initial,
    isPending: !initial,
    isError: false,
    error: null,
  })),
  useGraduationRate: vi.fn((initial) => ({
    data: initial,
    isPending: !initial,
    isError: false,
    error: null,
  })),
}))

vi.mock('../hooks/use-time-per-client', () => ({
  useTimePerClient: vi.fn((initial) => ({
    data: initial ?? [],
    isPending: !initial,
    isError: false,
    error: null,
  })),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockStats: PortfolioStats = {
  totalClients: 10,
  byStatus: { active: 7, archived: 2, suspended: 1 },
  byType: { complet: 5, directOne: 3, ponctuel: 2 },
  labActive: 3,
  oneActive: 4,
  mrr: { available: false, message: 'Module Facturation requis' },
}

const mockGraduation: GraduationRate = {
  percentage: 40,
  graduated: 2,
  totalLabClients: 5,
}

const mockTimeData: ClientTimeEstimate[] = [
  {
    clientId: '550e8400-e29b-41d4-a716-446655440001',
    clientName: 'Alice',
    clientCompany: 'AliceCorp',
    clientType: 'complet',
    messageCount: 10,
    validationCount: 2,
    visioSeconds: 3600,
    totalEstimatedSeconds: 5400,
    lastActivity: '2024-01-20T10:00:00Z',
  },
]

describe('StatsDashboard', () => {
  it('should render skeleton when loading without initial data', () => {
    render(<StatsDashboard />, { wrapper: createWrapper() })

    // When no initialData, isPending=true → skeleton
    // StatsSkeleton renders skeleton elements
    expect(screen.queryByTestId('stats-dashboard')).not.toBeInTheDocument()
  })

  it('should render dashboard with initial data', () => {
    render(
      <StatsDashboard
        initialStats={mockStats}
        initialGraduation={mockGraduation}
        initialTimePerClient={mockTimeData}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByTestId('stats-dashboard')).toBeInTheDocument()
  })

  it('should render KPI cards', () => {
    render(
      <StatsDashboard
        initialStats={mockStats}
        initialGraduation={mockGraduation}
        initialTimePerClient={mockTimeData}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Total clients')).toBeInTheDocument()
    // '10' appears in KPI card + donut center, use getAllByText
    expect(screen.getAllByText('10').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Clients Lab actifs')).toBeInTheDocument()
    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Clients One actifs')).toBeInTheDocument()
    expect(screen.getByText('Taux graduation')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('should render chart section', () => {
    render(
      <StatsDashboard
        initialStats={mockStats}
        initialGraduation={mockGraduation}
        initialTimePerClient={mockTimeData}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Répartition par type')).toBeInTheDocument()
  })

  it('should render time per client table', () => {
    render(
      <StatsDashboard
        initialStats={mockStats}
        initialGraduation={mockGraduation}
        initialTimePerClient={mockTimeData}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Temps passé par client')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
