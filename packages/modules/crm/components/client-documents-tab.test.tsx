import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientDocumentsTab } from './client-documents-tab'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/modules/crm/clients/123',
}))

// Mock useClientDocuments hook
vi.mock('../hooks/use-client-documents', () => ({
  useClientDocuments: vi.fn().mockReturnValue({
    data: [
      {
        id: '550e8400-e29b-41d4-a716-446655440020',
        clientId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Brief initial',
        type: 'brief',
        url: 'https://example.com/doc.pdf',
        visibleToClient: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
    isPending: false,
    error: null,
  }),
}))

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('ClientDocumentsTab', () => {
  it('should render document list', () => {
    renderWithQueryClient(<ClientDocumentsTab clientId="550e8400-e29b-41d4-a716-446655440001" />)

    expect(screen.getByText('Brief initial')).toBeInTheDocument()
    expect(screen.getByText('Brief')).toBeInTheDocument()
  })

  it('should show visible to client badge', () => {
    renderWithQueryClient(<ClientDocumentsTab clientId="550e8400-e29b-41d4-a716-446655440001" />)

    expect(screen.getByText('Visible client')).toBeInTheDocument()
  })

  it('should render empty state when no documents', async () => {
    const { useClientDocuments } = await import('../hooks/use-client-documents')
    vi.mocked(useClientDocuments).mockReturnValueOnce({
      data: [],
      isPending: false,
      error: null,
    } as ReturnType<typeof useClientDocuments>)

    renderWithQueryClient(<ClientDocumentsTab clientId="550e8400-e29b-41d4-a716-446655440001" />)

    expect(screen.getByText(/aucun document/i)).toBeInTheDocument()
  })

  it('should render view link when URL exists', () => {
    renderWithQueryClient(<ClientDocumentsTab clientId="550e8400-e29b-41d4-a716-446655440001" />)

    expect(screen.getByText('Voir')).toBeInTheDocument()
  })
})
