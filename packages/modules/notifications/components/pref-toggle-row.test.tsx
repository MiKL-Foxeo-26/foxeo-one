import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import { PrefToggleRow } from './pref-toggle-row'

describe('PrefToggleRow', () => {
  const defaultProps = {
    label: 'Messages MiKL',
    description: 'Nouveaux messages de votre accompagnateur',
    notificationType: 'message' as const,
    channelEmail: true,
    channelInapp: true,
    isCriticalInapp: false,
    onToggleEmail: vi.fn(),
    onToggleInapp: vi.fn(),
  }

  it('renders label and description', () => {
    render(createElement(PrefToggleRow, defaultProps))

    expect(screen.getByText('Messages MiKL')).toBeDefined()
    expect(screen.getByText('Nouveaux messages de votre accompagnateur')).toBeDefined()
  })

  it('renders email and in-app toggles', () => {
    render(createElement(PrefToggleRow, defaultProps))

    expect(screen.getByTestId('toggle-email-message')).toBeDefined()
    expect(screen.getByTestId('toggle-inapp-message')).toBeDefined()
  })

  it('calls onToggleEmail when email toggle clicked', async () => {
    const onToggleEmail = vi.fn()
    const user = userEvent.setup()

    render(createElement(PrefToggleRow, { ...defaultProps, onToggleEmail }))

    await user.click(screen.getByTestId('toggle-email-message'))
    expect(onToggleEmail).toHaveBeenCalledWith(false)
  })

  it('calls onToggleInapp when in-app toggle clicked', async () => {
    const onToggleInapp = vi.fn()
    const user = userEvent.setup()

    render(createElement(PrefToggleRow, { ...defaultProps, onToggleInapp }))

    await user.click(screen.getByTestId('toggle-inapp-message'))
    expect(onToggleInapp).toHaveBeenCalledWith(false)
  })

  it('disables in-app toggle for critical types', () => {
    render(
      createElement(PrefToggleRow, {
        ...defaultProps,
        notificationType: 'system',
        isCriticalInapp: true,
      })
    )

    const inappToggle = screen.getByTestId('toggle-inapp-system')
    // Switch should be disabled (aria-disabled or disabled attribute)
    const isDisabled =
      inappToggle.hasAttribute('disabled') ||
      inappToggle.getAttribute('data-disabled') === 'true' ||
      inappToggle.getAttribute('aria-disabled') === 'true'

    expect(isDisabled).toBe(true)
  })

  it('shows "Critique" badge for critical in-app types', () => {
    render(
      createElement(PrefToggleRow, {
        ...defaultProps,
        notificationType: 'graduation',
        isCriticalInapp: true,
      })
    )

    expect(screen.getByText(/critique/i)).toBeDefined()
  })
})
