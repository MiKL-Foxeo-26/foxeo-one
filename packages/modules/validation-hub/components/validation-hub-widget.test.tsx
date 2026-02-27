import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ValidationHubWidget } from './validation-hub-widget'
import type { ValidationRequest } from '../types/validation.types'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock the hooks
vi.mock('../hooks/use-validation-queue', () => ({
  useValidationQueue: vi.fn(),
}))
vi.mock('../hooks/use-validation-realtime', () => ({
  useValidationRealtime: vi.fn(),
}))

const { useValidationQueue } = await import('../hooks/use-validation-queue')
const mockUseValidationQueue = vi.mocked(useValidationQueue)

const pendingRequest: ValidationRequest = {
  id: 'req-1',
  clientId: 'client-1',
  operatorId: 'op-1',
  parcoursId: null,
  stepId: null,
  type: 'brief_lab',
  title: 'Brief de démarrage',
  content: 'Contenu',
  documentIds: [],
  status: 'pending',
  reviewerComment: null,
  submittedAt: '2026-02-20T10:00:00Z',
  reviewedAt: null,
  createdAt: '2026-02-20T10:00:00Z',
  updatedAt: '2026-02-20T10:00:00Z',
  client: {
    id: 'client-1',
    name: 'Jean Dupont',
    company: 'Acme Corp',
    clientType: 'complet',
    avatarUrl: null,
  },
}

const defaultHookReturn = {
  requests: [pendingRequest],
  filters: {
    status: 'all' as const,
    type: 'all' as const,
    sortBy: 'submitted_at' as const,
    sortOrder: 'asc' as const,
  },
  setFilters: vi.fn(),
  isLoading: false,
  error: null,
  pendingCount: 1,
}

describe('ValidationHubWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseValidationQueue.mockReturnValue(defaultHookReturn)
  })

  it('renders loading skeleton when isLoading is true', () => {
    mockUseValidationQueue.mockReturnValue({ ...defaultHookReturn, isLoading: true })
    render(<ValidationHubWidget />)
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty state when pendingCount is 0 (AC5)', () => {
    mockUseValidationQueue.mockReturnValue({
      ...defaultHookReturn,
      requests: [],
      pendingCount: 0,
    })
    render(<ValidationHubWidget />)
    expect(screen.getByText('Aucune demande en attente — tout est à jour !')).toBeInTheDocument()
  })

  it('displays pending count (AC5)', () => {
    render(<ValidationHubWidget />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/demande\s+en attente/)).toBeInTheDocument()
  })

  it('uses "demandes" plural when count > 1', () => {
    mockUseValidationQueue.mockReturnValue({
      ...defaultHookReturn,
      pendingCount: 3,
      requests: [pendingRequest, { ...pendingRequest, id: 'req-2' }, { ...pendingRequest, id: 'req-3' }],
    })
    render(<ValidationHubWidget />)
    expect(screen.getByText(/demandes\s+en attente/)).toBeInTheDocument()
  })

  it('shows latest pending request title (AC5)', () => {
    render(<ValidationHubWidget />)
    expect(screen.getByText('Brief de démarrage')).toBeInTheDocument()
  })

  it('shows client name of latest request (AC5)', () => {
    render(<ValidationHubWidget />)
    expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument()
  })

  it('has link to validation hub (AC5)', () => {
    render(<ValidationHubWidget />)
    const link = screen.getAllByRole('link').find((l) =>
      l.getAttribute('href') === '/modules/validation-hub'
    )
    expect(link).toBeDefined()
  })

  it('shows "Voir toutes les demandes" button', () => {
    render(<ValidationHubWidget />)
    expect(screen.getByText('Voir toutes les demandes')).toBeInTheDocument()
  })

  it('renders title "Validations en attente"', () => {
    render(<ValidationHubWidget />)
    expect(screen.getAllByText('Validations en attente').length).toBeGreaterThan(0)
  })

  it('shows "Client inconnu" when client is undefined', () => {
    mockUseValidationQueue.mockReturnValue({
      ...defaultHookReturn,
      requests: [{ ...pendingRequest, client: undefined }],
    })
    render(<ValidationHubWidget />)
    expect(screen.getByText(/Client inconnu/)).toBeInTheDocument()
  })
})
