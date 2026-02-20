import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentSyncBadge } from './document-sync-badge'

describe('DocumentSyncBadge', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('n\'affiche rien si lastSyncedAt est null', () => {
    const { container } = render(<DocumentSyncBadge lastSyncedAt={null} />)
    expect(container.firstChild).toBeNull()
    expect(screen.queryByTestId('document-sync-badge')).toBeNull()
  })

  it('affiche le badge "Syncé" avec la date si lastSyncedAt est récent (< 7 jours)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-20T12:00:00.000Z'))

    // Syncé il y a 2 jours
    render(<DocumentSyncBadge lastSyncedAt="2026-02-18T10:00:00.000Z" />)

    const badge = screen.getByTestId('document-sync-badge')
    expect(badge).toBeTruthy()
    expect(badge.textContent).toContain('Syncé le')
    expect(badge.textContent).toContain('18/02/2026')
    // Badge récent — ne doit pas avoir la classe text-muted-foreground
    expect(badge.className).not.toContain('text-muted-foreground')
  })

  it('affiche le badge en gris clair si lastSyncedAt est > 7 jours', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-20T12:00:00.000Z'))

    // Syncé il y a 10 jours
    render(<DocumentSyncBadge lastSyncedAt="2026-02-10T10:00:00.000Z" />)

    const badge = screen.getByTestId('document-sync-badge')
    expect(badge).toBeTruthy()
    expect(badge.textContent).toContain('10/02/2026')
    // Badge périmé — doit avoir la classe text-muted-foreground
    expect(badge.className).toContain('text-muted-foreground')
  })
})
