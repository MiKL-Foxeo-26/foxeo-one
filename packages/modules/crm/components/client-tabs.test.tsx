import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientTabs } from './client-tabs'

// Mock Next.js navigation
const mockPush = vi.fn()
const mockUseSearchParams = vi.fn(() => new URLSearchParams())
const mockUsePathname = vi.fn(() => '/modules/crm/clients/123')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockUseSearchParams(),
  usePathname: () => mockUsePathname(),
}))

// Helper to render with QueryClient
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

describe('ClientTabs', () => {
  const mockClientId = '550e8400-e29b-41d4-a716-446655440001'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all 4 tabs', () => {
    renderWithQueryClient(<ClientTabs clientId={mockClientId} />)

    expect(screen.getByRole('tab', { name: /informations/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /historique/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /documents/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /échanges/i })).toBeInTheDocument()
  })

  it('should activate "Informations" tab by default when no query param', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams())

    renderWithQueryClient(<ClientTabs clientId={mockClientId} />)

    const informationsTab = screen.getByRole('tab', { name: /informations/i })
    expect(informationsTab).toHaveAttribute('data-state', 'active')
  })

  it('should activate tab based on URL query param', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('tab=historique'))

    renderWithQueryClient(<ClientTabs clientId={mockClientId} />)

    const historiqueTab = screen.getByRole('tab', { name: /historique/i })
    expect(historiqueTab).toHaveAttribute('data-state', 'active')
  })

  it('should update URL when switching tabs', async () => {
    const user = userEvent.setup()
    mockUseSearchParams.mockReturnValue(new URLSearchParams())

    renderWithQueryClient(<ClientTabs clientId={mockClientId} />)

    const historiqueTab = screen.getByRole('tab', { name: /historique/i })
    await user.click(historiqueTab)

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('tab=historique'))
  })
})
