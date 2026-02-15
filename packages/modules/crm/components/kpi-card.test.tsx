import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KpiCard } from './kpi-card'

describe('KpiCard', () => {
  it('should render label and value', () => {
    render(<KpiCard label="Total clients" value={42} />)

    expect(screen.getByText('Total clients')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render string values', () => {
    render(<KpiCard label="Taux graduation" value="85%" />)

    expect(screen.getByText('Taux graduation')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('should render tooltip icon when tooltip is provided', () => {
    render(<KpiCard label="Test" value={0} tooltip="Detail info" />)

    // Info icon should be present (used as tooltip trigger)
    const infoIcon = document.querySelector('[class*="lucide-info"]')
    expect(infoIcon).toBeInTheDocument()
  })

  it('should not render tooltip icon when no tooltip', () => {
    render(<KpiCard label="Test" value={0} />)

    const infoIcon = document.querySelector('[class*="lucide-info"]')
    expect(infoIcon).not.toBeInTheDocument()
  })

  it('should render zero values correctly', () => {
    render(<KpiCard label="Empty" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
