import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentVisibilityBadge } from './document-visibility-badge'

describe('DocumentVisibilityBadge', () => {
  it('shows "Visible par le client" for shared documents', () => {
    render(<DocumentVisibilityBadge visibility="shared" />)
    expect(screen.getByTestId('visibility-badge')).toHaveTextContent('Visible par le client')
  })

  it('shows "Non visible" for private documents', () => {
    render(<DocumentVisibilityBadge visibility="private" />)
    expect(screen.getByTestId('visibility-badge')).toHaveTextContent('Non visible')
  })

  it('applies green styling for shared badge', () => {
    render(<DocumentVisibilityBadge visibility="shared" />)
    const badge = screen.getByTestId('visibility-badge')
    expect(badge.className).toContain('green')
  })
})
