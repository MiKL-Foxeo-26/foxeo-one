import { describe, it, expect } from 'vitest'
import { TIME_ESTIMATES } from './time-estimates'

describe('TIME_ESTIMATES constants', () => {
  it('should have message estimate of 120 seconds (2 min)', () => {
    expect(TIME_ESTIMATES.message).toBe(120)
  })

  it('should have validation estimate of 300 seconds (5 min)', () => {
    expect(TIME_ESTIMATES.validation).toBe(300)
  })

  it('should use real duration for visio', () => {
    expect(TIME_ESTIMATES.visio).toBe('real')
  })
})
