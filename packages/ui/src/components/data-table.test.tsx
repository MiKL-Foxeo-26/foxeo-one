import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DataTable, type ColumnDef } from './data-table'

describe('DataTable', () => {
  interface TestData {
    id: string
    name: string
    status: string
  }

  const mockData: TestData[] = [
    { id: '1', name: 'Test 1', status: 'active' },
    { id: '2', name: 'Test 2', status: 'inactive' },
    { id: '3', name: 'Test 3', status: 'active' }
  ]

  const mockColumns: ColumnDef<TestData>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name'
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status'
    }
  ]

  it('should render data table with headers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should render all rows of data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />)

    expect(screen.getByText('Test 1')).toBeInTheDocument()
    expect(screen.getByText('Test 2')).toBeInTheDocument()
    expect(screen.getByText('Test 3')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />)

    expect(screen.getByText(/aucune donnée/i)).toBeInTheDocument()
  })

  it('should apply custom className to container', () => {
    const { container } = render(
      <DataTable data={mockData} columns={mockColumns} className="custom-class" />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })
})
