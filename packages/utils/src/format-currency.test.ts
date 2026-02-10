import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format-currency'

describe('formatCurrency', () => {
  it('formats cents to EUR by default', () => {
    const result = formatCurrency(2500)
    // fr-FR locale formats as "25,00 €" (with non-breaking space)
    expect(result).toContain('25')
    expect(result).toContain('00')
    expect(result).toContain('€')
  })

  it('formats zero cents', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formats large amounts', () => {
    const result = formatCurrency(199900)
    expect(result).toContain('1')
    expect(result).toContain('999')
    expect(result).toContain('€')
  })

  it('formats with decimal cents', () => {
    const result = formatCurrency(1999)
    expect(result).toContain('19')
    expect(result).toContain('99')
    expect(result).toContain('€')
  })
})
