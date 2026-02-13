import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditClientDialog } from './edit-client-dialog'
import type { Client } from '../types/crm.types'

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

// Mock updateClient action
vi.mock('../actions/update-client', () => ({
  updateClient: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

const mockClient: Client = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  operatorId: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Jean Dupont',
  company: 'Acme Corp',
  email: 'jean@acme.com',
  clientType: 'complet',
  status: 'lab-actif',
  sector: 'Tech',
  createdAt: '2026-02-13T10:00:00Z',
  updatedAt: '2026-02-13T10:00:00Z',
}

describe('EditClientDialog', () => {
  it('should render trigger button "Modifier"', () => {
    render(<EditClientDialog client={mockClient} />)

    const button = screen.getByRole('button', { name: /modifier/i })
    expect(button).toBeDefined()
    expect(button.textContent).toContain('Modifier')
  })

  it('should export component with correct displayName', () => {
    expect(EditClientDialog.displayName).toBe('EditClientDialog')
  })

  it('should accept onClientUpdated callback prop', () => {
    const onUpdated = vi.fn()
    render(<EditClientDialog client={mockClient} onClientUpdated={onUpdated} />)

    // Component renders without error with callback prop
    expect(screen.getByRole('button', { name: /modifier/i })).toBeDefined()
  })
})
