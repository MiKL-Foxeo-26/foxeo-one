import { describe, it, expect } from 'vitest'
import { communicationProfileSchema, DEFAULT_COMMUNICATION_PROFILE } from './defaults'

describe('communicationProfileSchema', () => {
  it('validates a complete valid profile', () => {
    const result = communicationProfileSchema.safeParse({
      levelTechnical: 'intermediaire',
      styleExchange: 'conversationnel',
      adaptedTone: 'pro_decontracte',
      messageLength: 'moyen',
      tutoiement: false,
      concreteExamples: true,
      avoid: ['jargon technique'],
      privilege: ['listes à puces'],
      styleNotes: 'Notes de test',
    })

    expect(result.success).toBe(true)
  })

  it('validates DEFAULT_COMMUNICATION_PROFILE', () => {
    const result = communicationProfileSchema.safeParse(DEFAULT_COMMUNICATION_PROFILE)
    expect(result.success).toBe(true)
  })

  it('rejects invalid levelTechnical', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      levelTechnical: 'expert',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid styleExchange', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      styleExchange: 'agressif',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid adaptedTone', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      adaptedTone: 'neutre',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid messageLength', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      messageLength: 'tres_long',
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional lab_learnings', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      lab_learnings: ['Préfère les listes', 'Répond mieux le matin'],
    })
    expect(result.success).toBe(true)
  })

  it('validates profile with empty arrays', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      avoid: [],
      privilege: [],
      lab_learnings: [],
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-boolean tutoiement', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      tutoiement: 'yes',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-array avoid field', () => {
    const result = communicationProfileSchema.safeParse({
      ...DEFAULT_COMMUNICATION_PROFILE,
      avoid: 'jargon technique',
    })
    expect(result.success).toBe(false)
  })
})

describe('DEFAULT_COMMUNICATION_PROFILE', () => {
  it('has all required fields', () => {
    expect(DEFAULT_COMMUNICATION_PROFILE).toMatchObject({
      levelTechnical: 'intermediaire',
      styleExchange: 'conversationnel',
      adaptedTone: 'pro_decontracte',
      messageLength: 'moyen',
      tutoiement: false,
      concreteExamples: true,
      avoid: [],
      privilege: [],
      styleNotes: '',
    })
  })

  it('has no lab_learnings by default', () => {
    expect(DEFAULT_COMMUNICATION_PROFILE.lab_learnings).toBeUndefined()
  })
})
