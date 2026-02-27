import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ElioMessageItem } from './elio-message'
import type { ElioMessage } from '../types/elio.types'

function makeMessage(overrides?: Partial<ElioMessage>): ElioMessage {
  return {
    id: 'msg-1',
    role: 'user',
    content: 'Bonjour Élio',
    createdAt: new Date().toISOString(),
    dashboardType: 'lab',
    ...overrides,
  }
}

describe('ElioMessageItem', () => {
  it('affiche le contenu du message', () => {
    render(<ElioMessageItem message={makeMessage()} dashboardType="lab" />)
    expect(screen.getByText('Bonjour Élio')).toBeDefined()
  })

  it('applique la classe du rôle user (justify-end)', () => {
    const { container } = render(
      <ElioMessageItem message={makeMessage({ role: 'user' })} dashboardType="lab" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('justify-end')
  })

  it('applique la classe du rôle assistant (justify-start)', () => {
    const { container } = render(
      <ElioMessageItem message={makeMessage({ role: 'assistant' })} dashboardType="lab" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('justify-start')
  })

  it('applique la palette du dashboard lab', () => {
    const { container } = render(
      <ElioMessageItem message={makeMessage()} dashboardType="lab" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('data-dashboard')).toBe('lab')
  })

  it('applique la palette du dashboard hub', () => {
    const { container } = render(
      <ElioMessageItem message={makeMessage({ dashboardType: 'hub' })} dashboardType="hub" />
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.getAttribute('data-dashboard')).toBe('hub')
  })

  it('affiche le slot de feedback pour les messages assistant', () => {
    const feedback = <button>👍</button>
    render(
      <ElioMessageItem
        message={makeMessage({ role: 'assistant' })}
        dashboardType="lab"
        feedbackSlot={feedback}
      />
    )
    expect(screen.getByText('👍')).toBeDefined()
  })

  it('n\'affiche pas le slot de feedback pour les messages user', () => {
    const feedback = <button>👍</button>
    render(
      <ElioMessageItem
        message={makeMessage({ role: 'user' })}
        dashboardType="lab"
        feedbackSlot={feedback}
      />
    )
    expect(screen.queryByText('👍')).toBeNull()
  })
})
