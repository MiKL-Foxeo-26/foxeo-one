import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimePerClientTable, formatDuration } from './time-per-client-table'
import type { ClientTimeEstimate } from '../types/crm.types'

const mockData: ClientTimeEstimate[] = [
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
  {
    clientId: '550e8400-e29b-41d4-a716-446655440002',
    clientName: 'Bob',
    clientCompany: 'BobInc',
    clientType: 'direct_one',
    messageCount: 1,
    validationCount: 0,
    visioSeconds: 0,
    totalEstimatedSeconds: 120,
    lastActivity: '2024-01-19T10:00:00Z',
  },
]

describe('TimePerClientTable', () => {
  it('should render table with data', () => {
    render(<TimePerClientTable data={mockData} />)

    expect(screen.getByText('Temps passé par client')).toBeInTheDocument()
    expect(screen.getByTestId('time-per-client-table')).toBeInTheDocument()
  })

  it('should render client names and companies', () => {
    render(<TimePerClientTable data={mockData} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('AliceCorp')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('BobInc')).toBeInTheDocument()
  })

  it('should render client type badges', () => {
    render(<TimePerClientTable data={mockData} />)

    expect(screen.getByText('Complet')).toBeInTheDocument()
    expect(screen.getByText('Direct One')).toBeInTheDocument()
  })

  it('should render formatted durations', () => {
    render(<TimePerClientTable data={mockData} />)

    expect(screen.getByText('1h 30min')).toBeInTheDocument() // 5400s
    expect(screen.getByText('2min')).toBeInTheDocument() // 120s
  })

  it('should render empty state when no data', () => {
    render(<TimePerClientTable data={[]} />)

    expect(screen.getByText(/aucune donnée/i)).toBeInTheDocument()
  })

  it('should render rows with correct testids', () => {
    render(<TimePerClientTable data={mockData} />)

    expect(screen.getByTestId('time-row-550e8400-e29b-41d4-a716-446655440001')).toBeInTheDocument()
    expect(screen.getByTestId('time-row-550e8400-e29b-41d4-a716-446655440002')).toBeInTheDocument()
  })

  it('should handle null lastActivity', () => {
    const dataWithNull = [{
      ...mockData[0],
      lastActivity: null,
    }]

    render(<TimePerClientTable data={dataWithNull} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('should toggle sort when clicking column header', async () => {
    const user = userEvent.setup()
    render(<TimePerClientTable data={mockData} />)

    const clientHeader = screen.getByRole('button', { name: /client/i })
    await user.click(clientHeader)

    // After clicking "Client", should sort alphabetically
    const rows = screen.getAllByTestId(/time-row-/)
    expect(rows).toHaveLength(2)
  })
})

describe('formatDuration', () => {
  it('should format 0 seconds as 0min', () => {
    expect(formatDuration(0)).toBe('0min')
  })

  it('should format seconds under 1 hour as Xmin', () => {
    expect(formatDuration(120)).toBe('2min')
    expect(formatDuration(300)).toBe('5min')
  })

  it('should format seconds over 1 hour as Xh Ymin', () => {
    expect(formatDuration(3600)).toBe('1h 0min')
    expect(formatDuration(5400)).toBe('1h 30min')
    expect(formatDuration(7200)).toBe('2h 0min')
  })

  it('should handle large values', () => {
    expect(formatDuration(36000)).toBe('10h 0min')
  })
})
