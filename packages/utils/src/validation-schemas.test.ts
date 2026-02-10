import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  uuidSchema,
  slugSchema,
  phoneSchema,
} from './validation-schemas'

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('test@foxeo.io').success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false)
    expect(emailSchema.safeParse('').success).toBe(false)
  })
})

describe('passwordSchema', () => {
  it('accepts valid password', () => {
    expect(passwordSchema.safeParse('Foxeo123').success).toBe(true)
    expect(passwordSchema.safeParse('MyStr0ngPass').success).toBe(true)
  })

  it('rejects too short', () => {
    expect(passwordSchema.safeParse('Abc1').success).toBe(false)
  })

  it('rejects without uppercase', () => {
    expect(passwordSchema.safeParse('foxeo123').success).toBe(false)
  })

  it('rejects without lowercase', () => {
    expect(passwordSchema.safeParse('FOXEO123').success).toBe(false)
  })

  it('rejects without digit', () => {
    expect(passwordSchema.safeParse('FoxeoPass').success).toBe(false)
  })
})

describe('uuidSchema', () => {
  it('accepts valid UUID', () => {
    expect(
      uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success
    ).toBe(true)
  })

  it('rejects invalid UUID', () => {
    expect(uuidSchema.safeParse('not-a-uuid').success).toBe(false)
  })
})

describe('slugSchema', () => {
  it('accepts valid slugs', () => {
    expect(slugSchema.safeParse('my-company').success).toBe(true)
    expect(slugSchema.safeParse('foxeo-one-123').success).toBe(true)
  })

  it('rejects too short', () => {
    expect(slugSchema.safeParse('ab').success).toBe(false)
  })

  it('rejects uppercase', () => {
    expect(slugSchema.safeParse('My-Company').success).toBe(false)
  })

  it('rejects spaces', () => {
    expect(slugSchema.safeParse('my company').success).toBe(false)
  })
})

describe('phoneSchema', () => {
  it('accepts valid phone numbers', () => {
    expect(phoneSchema.safeParse('+33 6 12 34 56 78').success).toBe(true)
    expect(phoneSchema.safeParse('0612345678').success).toBe(true)
  })

  it('rejects invalid phone', () => {
    expect(phoneSchema.safeParse('abc').success).toBe(false)
    expect(phoneSchema.safeParse('123').success).toBe(false)
  })
})
