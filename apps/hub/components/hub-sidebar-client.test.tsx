import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HubSidebarClient } from './hub-sidebar-client'
import type { ModuleManifest } from '@foxeo/types'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/modules/validation-hub'),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock validation badge hook
const mockUseValidationBadge = vi.fn(() => ({
  pendingCount: 0,
  isLoading: false,
}))
vi.mock('@foxeo/modules-validation-hub', () => ({
  useValidationBadge: (...args: unknown[]) => mockUseValidationBadge(...args),
}))

// Mock lucide-react to provide a minimal Box icon fallback
vi.mock('lucide-react', () => {
  const MockIcon = ({ className }: { className?: string }) => (
    <span data-testid="icon" className={className} />
  )
  return new Proxy(
    { Box: MockIcon, __esModule: true },
    {
      get: (target, prop) => {
        if (prop in target) return (target as Record<string, unknown>)[prop as string]
        return MockIcon
      },
    }
  )
})

const mockModules: ModuleManifest[] = [
  {
    id: 'validation-hub',
    name: 'Validation Hub',
    version: '1.0.0',
    description: 'Module de validation',
    target: 'hub',
    navigation: {
      label: 'Validation Hub',
      icon: 'CheckCircle2',
      order: 1,
    },
    routes: [],
    permissions: [],
    docs: {
      guide: 'docs/guide.md',
      faq: 'docs/faq.md',
      flows: 'docs/flows.md',
    },
  },
  {
    id: 'crm',
    name: 'CRM',
    version: '1.0.0',
    description: 'Module CRM',
    target: 'hub',
    navigation: {
      label: 'CRM Clients',
      icon: 'Users',
      order: 2,
    },
    routes: [],
    permissions: [],
    docs: {
      guide: 'docs/guide.md',
      faq: 'docs/faq.md',
      flows: 'docs/flows.md',
    },
  },
]

describe('HubSidebarClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseValidationBadge.mockReturnValue({ pendingCount: 0, isLoading: false })
  })

  it('renders module labels', () => {
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    expect(screen.getByText('Validation Hub')).toBeInTheDocument()
    expect(screen.getByText('CRM Clients')).toBeInTheDocument()
  })

  it('renders module count footer', () => {
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    expect(screen.getByText('2 modules actifs')).toBeInTheDocument()
  })

  it('shows badge when pendingCount > 0 for validation-hub (AC4)', () => {
    mockUseValidationBadge.mockReturnValue({ pendingCount: 5, isLoading: false })
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does NOT show badge when pendingCount is 0', () => {
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    // No badge number should appear
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('does NOT show badge on non-validation-hub modules', () => {
    mockUseValidationBadge.mockReturnValue({ pendingCount: 3, isLoading: false })
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    // Only one badge (on validation-hub), not on CRM
    const badges = screen.getAllByText('3')
    expect(badges).toHaveLength(1)
  })

  it('passes operatorId to useValidationBadge', () => {
    render(<HubSidebarClient modules={mockModules} operatorId="op-xyz" />)
    expect(mockUseValidationBadge).toHaveBeenCalledWith('op-xyz')
  })

  it('renders links with correct href', () => {
    render(<HubSidebarClient modules={mockModules} operatorId="op-1" />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/modules/validation-hub')
    expect(hrefs).toContain('/modules/crm')
  })
})
