import { describe, it, expect } from 'vitest'
import { formatRelativeDate, formatShortDate, formatDate, formatFullDate } from './date'

describe('formatRelativeDate', () => {
  it('returns "Date inconnue" for invalid date', () => {
    expect(formatRelativeDate('not-a-date')).toBe('Date inconnue')
  })

  it('returns "a l\'instant" for just now', () => {
    const now = new Date().toISOString()
    expect(formatRelativeDate(now)).toBe("à l'instant")
  })

  it('returns minutes ago for recent dates', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeDate(fiveMinAgo)).toBe('il y a 5 minutes')
  })

  it('returns singular minute', () => {
    const oneMinAgo = new Date(Date.now() - 1.5 * 60 * 1000).toISOString()
    expect(formatRelativeDate(oneMinAgo)).toBe('il y a 1 minute')
  })

  it('returns hours ago', () => {
    const threeHoursAgo = new Date(
      Date.now() - 3 * 60 * 60 * 1000
    ).toISOString()
    expect(formatRelativeDate(threeHoursAgo)).toBe('il y a 3 heures')
  })

  it('returns "hier" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeDate(yesterday)).toBe('hier')
  })

  it('returns days ago for recent days', () => {
    const threeDaysAgo = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString()
    expect(formatRelativeDate(threeDaysAgo)).toBe('il y a 3 jours')
  })

  it('returns full date for old dates', () => {
    const result = formatRelativeDate('2024-01-15T12:00:00Z')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('returns full date for future dates', () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const result = formatRelativeDate(future)
    expect(result).toBeTruthy()
    expect(result).not.toBe('Date inconnue')
  })
})

describe('formatShortDate', () => {
  it('formats a date in short format', () => {
    const result = formatShortDate('2026-01-15T12:00:00Z')
    expect(result).toContain('15')
    expect(result).toContain('2026')
  })
})

describe('formatDate', () => {
  it('formats a date in full format', () => {
    const result = formatDate('2026-01-15T12:00:00Z')
    expect(result).toContain('15')
    expect(result).toContain('janvier')
    expect(result).toContain('2026')
  })

  it('returns "Date inconnue" for invalid date', () => {
    expect(formatDate('invalid')).toBe('Date inconnue')
  })
})

describe('formatFullDate', () => {
  it('formats a date with day, month, year and time', () => {
    const result = formatFullDate('2026-02-15T14:30:00.000Z')
    expect(result).toContain('2026')
    expect(result).toMatch(/\d+h\d+/)
  })

  it('returns "Date inconnue" for invalid date', () => {
    expect(formatFullDate('invalid')).toBe('Date inconnue')
  })

  it('includes "à" separator between date and time', () => {
    const result = formatFullDate('2026-02-15T10:00:00.000Z')
    expect(result).toContain('à')
  })
})
