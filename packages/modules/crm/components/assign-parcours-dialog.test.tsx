import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AssignParcoursDialog } from './assign-parcours-dialog'

// Mock hooks and actions
vi.mock('../hooks/use-parcours-templates', () => ({
  useParcourTemplates: vi.fn(),
}))

vi.mock('../actions/assign-parcours', () => ({
  assignParcours: vi.fn(),
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

describe('AssignParcoursDialog', () => {
  it('should render dialog with title when open', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Assigner un parcours Lab')).toBeInTheDocument()
  })

  it('should show loading skeletons when templates are loading', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: undefined,
      isPending: true,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByTestId('templates-loading')).toBeInTheDocument()
  })

  it('should show empty state when no templates exist', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Aucun template de parcours')).toBeInTheDocument()
  })

  it('should show templates when available', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    const now = new Date().toISOString()
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          operatorId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Parcours Complet',
          description: 'Parcours en 5 étapes',
          parcoursType: 'complet',
          stages: [{ key: 'vision', name: 'Vision', description: 'Desc', order: 1 }],
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      isPending: false,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByText('Parcours Complet')).toBeInTheDocument()
    expect(screen.getByText('Parcours en 5 étapes')).toBeInTheDocument()
  })

  it('should have Assigner button disabled when no template selected', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    const now = new Date().toISOString()
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          operatorId: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Parcours Complet',
          description: null,
          parcoursType: 'complet',
          stages: [],
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      isPending: false,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    const assignButton = screen.getByRole('button', { name: 'Assigner' })
    expect(assignButton).toBeDisabled()
  })

  it('should have Annuler and Assigner buttons', async () => {
    const { useParcourTemplates } = await import('../hooks/use-parcours-templates')
    vi.mocked(useParcourTemplates).mockReturnValue({
      data: [],
      isPending: false,
    } as ReturnType<typeof useParcourTemplates>)

    render(
      <AssignParcoursDialog
        clientId="550e8400-e29b-41d4-a716-446655440001"
        open={true}
        onOpenChange={vi.fn()}
      />,
      { wrapper: createWrapper() }
    )

    expect(screen.getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Assigner' })).toBeInTheDocument()
  })
})
