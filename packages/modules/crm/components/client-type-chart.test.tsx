import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClientTypeChart } from './client-type-chart'

describe('ClientTypeChart', () => {
  it('should render chart with data', () => {
    render(
      <ClientTypeChart
        data={{ complet: 5, directOne: 3, ponctuel: 2 }}
        total={10}
      />
    )

    expect(screen.getByText('Répartition par type')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument() // Total in center
  })

  it('should render legend labels', () => {
    render(
      <ClientTypeChart
        data={{ complet: 5, directOne: 3, ponctuel: 2 }}
        total={10}
      />
    )

    expect(screen.getByText('Complet (Lab)')).toBeInTheDocument()
    expect(screen.getByText('Direct One')).toBeInTheDocument()
    expect(screen.getByText('Ponctuel')).toBeInTheDocument()
  })

  it('should show percentages in legend', () => {
    render(
      <ClientTypeChart
        data={{ complet: 5, directOne: 3, ponctuel: 2 }}
        total={10}
      />
    )

    expect(screen.getByText('5 (50%)')).toBeInTheDocument()
    expect(screen.getByText('3 (30%)')).toBeInTheDocument()
    expect(screen.getByText('2 (20%)')).toBeInTheDocument()
  })

  it('should render empty state when total is 0', () => {
    render(
      <ClientTypeChart
        data={{ complet: 0, directOne: 0, ponctuel: 0 }}
        total={0}
      />
    )

    expect(screen.getByText('Aucun client')).toBeInTheDocument()
  })

  it('should render SVG donut segments', () => {
    render(
      <ClientTypeChart
        data={{ complet: 5, directOne: 3, ponctuel: 2 }}
        total={10}
      />
    )

    expect(screen.getByTestId('donut-segment-complet')).toBeInTheDocument()
    expect(screen.getByTestId('donut-segment-directOne')).toBeInTheDocument()
    expect(screen.getByTestId('donut-segment-ponctuel')).toBeInTheDocument()
  })

  it('should skip zero-value segments in donut', () => {
    render(
      <ClientTypeChart
        data={{ complet: 5, directOne: 0, ponctuel: 0 }}
        total={5}
      />
    )

    expect(screen.getByTestId('donut-segment-complet')).toBeInTheDocument()
    expect(screen.queryByTestId('donut-segment-directOne')).not.toBeInTheDocument()
    expect(screen.queryByTestId('donut-segment-ponctuel')).not.toBeInTheDocument()
  })
})
