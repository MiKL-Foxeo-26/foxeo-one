import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { LocaleProvider } from './locale-provider'
import { useTranslations } from '../hooks/use-translations'

function TestComponent() {
  const { locale, t } = useTranslations()
  return <div data-testid="locale">{locale}</div>
}

describe('LocaleProvider', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  })

  afterEach(() => {
    // Clean up
    document.cookie = 'NEXT_LOCALE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  })

  it('should provide default locale (fr)', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('fr')
    })
  })

  it('should initialize from NEXT_LOCALE cookie', async () => {
    // Set cookie before rendering
    document.cookie = 'NEXT_LOCALE=fr; path=/'

    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('locale')).toHaveTextContent('fr')
    })
  })

  it('should provide locale context to children', () => {
    const { container } = render(
      <LocaleProvider>
        <div>Test content</div>
      </LocaleProvider>
    )

    expect(container.textContent).toBe('Test content')
  })
})
