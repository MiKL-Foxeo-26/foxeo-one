import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreateClientDialog } from './create-client-dialog'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}))

// Mock createClient action
vi.mock('../actions/create-client', () => ({
  createClient: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

describe('CreateClientDialog', () => {
  it('should render trigger button "Créer un client"', () => {
    render(<CreateClientDialog onClientCreated={vi.fn()} />)

    const button = screen.getByRole('button', { name: /cr.er un client/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('Créer un client')
  })

  it('should export component with correct displayName', () => {
    expect(CreateClientDialog.displayName).toBe('CreateClientDialog')
  })
})
