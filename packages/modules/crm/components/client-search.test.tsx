import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ClientSearch } from './client-search'

describe('ClientSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render search input with default placeholder', () => {
    render(<ClientSearch onSearchChange={vi.fn()} />)

    expect(
      screen.getByPlaceholderText(/rechercher par nom/i)
    ).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    render(
      <ClientSearch onSearchChange={vi.fn()} placeholder="Chercher..." />
    )

    expect(screen.getByPlaceholderText('Chercher...')).toBeInTheDocument()
  })

  it('should debounce search callback by 300ms', () => {
    const handleSearch = vi.fn()
    render(<ClientSearch onSearchChange={handleSearch} />)

    const input = screen.getByRole('searchbox')

    // Clear initial timer
    act(() => {
      vi.advanceTimersByTime(300)
    })
    handleSearch.mockClear()

    // Type into input
    fireEvent.change(input, { target: { value: 'test' } })

    // Should not be called immediately
    expect(handleSearch).not.toHaveBeenCalled()

    // Advance past debounce delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(handleSearch).toHaveBeenCalledWith('test')
  })

  it('should cancel previous debounce on new input', () => {
    const handleSearch = vi.fn()
    render(<ClientSearch onSearchChange={handleSearch} />)

    const input = screen.getByRole('searchbox')

    // Clear initial timer
    act(() => {
      vi.advanceTimersByTime(300)
    })
    handleSearch.mockClear()

    // Type 'ab'
    fireEvent.change(input, { target: { value: 'ab' } })

    // Advance partially (not enough for debounce)
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Type 'abc' (replaces previous debounce)
    fireEvent.change(input, { target: { value: 'abc' } })

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Should have been called with final value
    expect(handleSearch).toHaveBeenCalledWith('abc')
    // Should not have been called with intermediate value
    expect(handleSearch).not.toHaveBeenCalledWith('ab')
  })

  it('should call onSearchChange with empty string on initial render', () => {
    const handleSearch = vi.fn()
    render(<ClientSearch onSearchChange={handleSearch} />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(handleSearch).toHaveBeenCalledWith('')
  })
})
