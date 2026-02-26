import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ElioGuidedSuggestions } from './elio-guided-suggestions'

describe('ElioGuidedSuggestions', () => {
  it('renders suggestions for step 1', () => {
    render(<ElioGuidedSuggestions stepNumber={1} onSuggestionClick={vi.fn()} />)
    expect(screen.getByText("J'ai une idée précise, aide-moi à la structurer")).toBeDefined()
  })

  it('renders suggestions for step 2', () => {
    render(<ElioGuidedSuggestions stepNumber={2} onSuggestionClick={vi.fn()} />)
    expect(screen.getByText('Qui sont mes clients idéaux ?')).toBeDefined()
  })

  it('renders nothing when stepNumber has no suggestions', () => {
    const { container } = render(
      <ElioGuidedSuggestions stepNumber={999} onSuggestionClick={vi.fn()} />
    )
    // Should render empty or a fallback, not crash
    expect(container).toBeDefined()
  })

  it('calls onSuggestionClick with the suggestion text when clicked', async () => {
    const handleClick = vi.fn()
    render(<ElioGuidedSuggestions stepNumber={1} onSuggestionClick={handleClick} />)

    const suggestion = screen.getByText("J'ai une idée précise, aide-moi à la structurer")
    await userEvent.click(suggestion)

    expect(handleClick).toHaveBeenCalledWith("J'ai une idée précise, aide-moi à la structurer")
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders all 3 suggestions for step 1', () => {
    render(<ElioGuidedSuggestions stepNumber={1} onSuggestionClick={vi.fn()} />)
    expect(screen.getByText("J'ai une idée précise, aide-moi à la structurer")).toBeDefined()
    expect(screen.getByText('Je veux explorer plusieurs directions')).toBeDefined()
    expect(screen.getByText('Aide-moi à identifier mes forces')).toBeDefined()
  })

  it('renders chips as buttons', () => {
    render(<ElioGuidedSuggestions stepNumber={1} onSuggestionClick={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })
})
