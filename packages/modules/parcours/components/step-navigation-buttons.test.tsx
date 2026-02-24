import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepNavigationButtons } from './step-navigation-buttons'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('StepNavigationButtons', () => {
  it('renders both nav labels', () => {
    render(<StepNavigationButtons currentStepNumber={2} totalSteps={3} />)
    expect(screen.getByText(/étape précédente/i)).toBeDefined()
    expect(screen.getByText(/étape suivante/i)).toBeDefined()
  })

  it('shows disabled prev on first step', () => {
    render(<StepNavigationButtons currentStepNumber={1} totalSteps={3} />)
    const prev = screen.getByText(/étape précédente/i)
    const el = prev.closest('span')
    expect(el?.getAttribute('aria-disabled')).toBe('true')
  })

  it('shows disabled next on last step', () => {
    render(<StepNavigationButtons currentStepNumber={3} totalSteps={3} />)
    const next = screen.getByText(/étape suivante/i)
    const el = next.closest('span')
    expect(el?.getAttribute('aria-disabled')).toBe('true')
  })

  it('shows active prev link on middle step', () => {
    render(<StepNavigationButtons currentStepNumber={2} totalSteps={3} />)
    const prevLink = screen.getByText(/étape précédente/i).closest('a')
    expect(prevLink?.getAttribute('href')).toBe('/modules/parcours/steps/1')
  })

  it('shows active next link on middle step', () => {
    render(<StepNavigationButtons currentStepNumber={2} totalSteps={3} />)
    const nextLink = screen.getByText(/étape suivante/i).closest('a')
    expect(nextLink?.getAttribute('href')).toBe('/modules/parcours/steps/3')
  })

  it('disables next when next step is locked', () => {
    render(
      <StepNavigationButtons
        currentStepNumber={2}
        totalSteps={3}
        nextStep={{ stepNumber: 3, status: 'locked' }}
      />
    )
    const next = screen.getByText(/étape suivante/i)
    const el = next.closest('span')
    expect(el?.getAttribute('aria-disabled')).toBe('true')
  })

  it('enables next when next step is not locked', () => {
    render(
      <StepNavigationButtons
        currentStepNumber={2}
        totalSteps={3}
        nextStep={{ stepNumber: 3, status: 'current' }}
      />
    )
    const nextLink = screen.getByText(/étape suivante/i).closest('a')
    expect(nextLink?.getAttribute('href')).toBe('/modules/parcours/steps/3')
  })

  it('disables prev when prev step is locked', () => {
    render(
      <StepNavigationButtons
        currentStepNumber={2}
        totalSteps={3}
        prevStep={{ stepNumber: 1, status: 'locked' }}
      />
    )
    const prev = screen.getByText(/étape précédente/i)
    const el = prev.closest('span')
    expect(el?.getAttribute('aria-disabled')).toBe('true')
  })
})
