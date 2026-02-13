import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientDetailContent } from './client-detail-content'
import type { Client } from '../types/crm.types'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/modules/crm/clients/123',
}))

// Mock getClient server action (used by useClient hook)
vi.mock('../actions/get-client', () => ({
  getClient: vi.fn().mockResolvedValue({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      operatorId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Jean Dupont',
      company: 'Acme Corp',
      email: 'jean@acme.com',
      clientType: 'complet',
      status: 'lab-actif',
      sector: 'tech',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    error: null,
  }),
}))

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  )
}

describe('ClientDetailContent', () => {
  const mockClient: Client = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    operatorId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Jean Dupont',
    company: 'Acme Corp',
    email: 'jean@acme.com',
    clientType: 'complet',
    status: 'lab-actif',
    sector: 'tech',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  }

  it('should render client header', () => {
    renderWithQueryClient(<ClientDetailContent client={mockClient} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Jean Dupont' })).toBeInTheDocument()
  })

  it('should render all tabs', () => {
    renderWithQueryClient(<ClientDetailContent client={mockClient} />)

    expect(screen.getByRole('tab', { name: /informations/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /historique/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /documents/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /échanges/i })).toBeInTheDocument()
  })

  it('should render edit buttons', () => {
    renderWithQueryClient(<ClientDetailContent client={mockClient} />)

    const editButtons = screen.getAllByRole('button', { name: /modifier/i })
    expect(editButtons.length).toBeGreaterThanOrEqual(1)
  })
})
