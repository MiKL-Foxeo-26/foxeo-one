import { describe, it, expect } from 'vitest'
import { FAQ_CATEGORIES } from './faq-content'

describe('FAQ Content', () => {
  it('should have at least 5 categories', () => {
    expect(FAQ_CATEGORIES.length).toBeGreaterThanOrEqual(5)
  })

  it('should have required category fields', () => {
    for (const cat of FAQ_CATEGORIES) {
      expect(cat.id).toBeTruthy()
      expect(cat.title).toBeTruthy()
      expect(cat.icon).toBeTruthy()
      expect(cat.questions.length).toBeGreaterThan(0)
    }
  })

  it('should have questions with non-empty q and a', () => {
    for (const cat of FAQ_CATEGORIES) {
      for (const faq of cat.questions) {
        expect(faq.q.length).toBeGreaterThan(0)
        expect(faq.a.length).toBeGreaterThan(0)
      }
    }
  })

  it('should have unique category ids', () => {
    const ids = FAQ_CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('should include expected categories', () => {
    const ids = FAQ_CATEGORIES.map((c) => c.id)
    expect(ids).toContain('getting-started')
    expect(ids).toContain('account-security')
    expect(ids).toContain('contact')
  })

  it('should have at least 13 total questions', () => {
    const total = FAQ_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0)
    expect(total).toBeGreaterThanOrEqual(13)
  })
})
