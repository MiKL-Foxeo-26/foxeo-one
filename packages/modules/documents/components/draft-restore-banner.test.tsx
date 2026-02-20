import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DraftRestoreBanner } from './draft-restore-banner'

describe('DraftRestoreBanner', () => {
  it('should not render when hasDraft is false', () => {
    const { container } = render(
      <DraftRestoreBanner
        hasDraft={false}
        draftDate={null}
        onRestore={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render banner with formatted date when hasDraft is true', () => {
    const draftDate = new Date('2026-02-20T10:30:00Z')
    render(
      <DraftRestoreBanner
        hasDraft={true}
        draftDate={draftDate}
        onRestore={vi.fn()}
        onDismiss={vi.fn()}
      />
    )

    // Should show the banner
    expect(screen.getByText(/Un brouillon a été trouvé/i)).toBeInTheDocument()

    // Should show formatted date
    expect(screen.getByText(/sauvegardé le/i)).toBeInTheDocument()

    // Should have Reprendre and Non, recommencer buttons
    expect(screen.getByRole('button', { name: /reprendre/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /non, recommencer/i })).toBeInTheDocument()
  })

  it('should call onRestore when Reprendre button is clicked', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()
    const onDismiss = vi.fn()

    render(
      <DraftRestoreBanner
        hasDraft={true}
        draftDate={new Date()}
        onRestore={onRestore}
        onDismiss={onDismiss}
      />
    )

    const reprendreButton = screen.getByRole('button', { name: /reprendre/i })
    await user.click(reprendreButton)

    expect(onRestore).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('should call onDismiss when Non, recommencer button is clicked', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()
    const onDismiss = vi.fn()

    render(
      <DraftRestoreBanner
        hasDraft={true}
        draftDate={new Date()}
        onRestore={onRestore}
        onDismiss={onDismiss}
      />
    )

    const dismissButton = screen.getByRole('button', { name: /non, recommencer/i })
    await user.click(dismissButton)

    expect(onDismiss).toHaveBeenCalledOnce()
    expect(onRestore).not.toHaveBeenCalled()
  })
})
