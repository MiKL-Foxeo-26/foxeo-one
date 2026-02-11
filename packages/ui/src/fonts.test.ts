import { describe, it, expect } from 'vitest'
import {
  FONT_VARIABLE_POPPINS,
  FONT_VARIABLE_INTER,
  POPPINS_WEIGHTS,
  INTER_WEIGHTS,
} from './fonts'

describe('Font configuration', () => {
  it('exports Poppins CSS variable name', () => {
    expect(FONT_VARIABLE_POPPINS).toBe('--font-poppins')
  })

  it('exports Inter CSS variable name', () => {
    expect(FONT_VARIABLE_INTER).toBe('--font-inter')
  })

  it('Poppins includes required weights', () => {
    expect(POPPINS_WEIGHTS).toContain('400')
    expect(POPPINS_WEIGHTS).toContain('500')
    expect(POPPINS_WEIGHTS).toContain('600')
    expect(POPPINS_WEIGHTS).toContain('700')
  })

  it('Inter includes required weights', () => {
    expect(INTER_WEIGHTS).toContain('400')
    expect(INTER_WEIGHTS).toContain('500')
  })

  it('Poppins weights are readonly tuple', () => {
    expect(POPPINS_WEIGHTS.length).toBe(4)
  })

  it('Inter weights are readonly tuple', () => {
    expect(INTER_WEIGHTS.length).toBe(2)
  })
})
