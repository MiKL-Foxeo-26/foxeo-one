import { describe, it, expect } from 'vitest'
import { validateCsvRow, validateCsvRows, isValidEmail, markDuplicateEmails } from './csv-validator'
import type { CsvImportRow } from '../types/crm.types'

const validRow: CsvImportRow = {
  lineNumber: 2,
  name: 'Jean Dupont',
  email: 'jean@test.com',
  company: 'Acme',
  phone: '0612345678',
  sector: 'Tech',
  clientType: 'complet',
}

describe('isValidEmail', () => {
  it('should accept valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co')).toBe(true)
    expect(isValidEmail('user+tag@domain.com')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user @domain.com')).toBe(false)
  })
})

describe('validateCsvRow', () => {
  it('should validate a correct row', () => {
    const result = validateCsvRow(validRow)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.row).toBe(validRow)
  })

  it('should reject missing name', () => {
    const result = validateCsvRow({ ...validRow, name: '' })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Nom obligatoire')
  })

  it('should reject missing email', () => {
    const result = validateCsvRow({ ...validRow, email: '' })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Email obligatoire')
  })

  it('should reject invalid email format', () => {
    const result = validateCsvRow({ ...validRow, email: 'notanemail' })

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Email invalide')
  })

  it('should reject invalid client type', () => {
    const result = validateCsvRow({ ...validRow, clientType: 'invalid' })

    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('Type client invalide')
  })

  it('should accept valid client types', () => {
    for (const type of ['complet', 'direct_one', 'ponctuel']) {
      const result = validateCsvRow({ ...validRow, clientType: type })
      expect(result.valid).toBe(true)
    }
  })

  it('should accept empty optional fields', () => {
    const result = validateCsvRow({
      ...validRow,
      company: '',
      phone: '',
      sector: '',
    })

    expect(result.valid).toBe(true)
  })

  it('should collect multiple errors', () => {
    const result = validateCsvRow({
      ...validRow,
      name: '',
      email: '',
      clientType: 'invalid',
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })
})

describe('validateCsvRows', () => {
  it('should validate all rows', () => {
    const rows: CsvImportRow[] = [
      { ...validRow, lineNumber: 2 },
      { ...validRow, lineNumber: 3, email: 'other@test.com' },
    ]

    const results = validateCsvRows(rows)

    expect(results).toHaveLength(2)
    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(true)
  })

  it('should detect duplicate emails within the file', () => {
    const rows: CsvImportRow[] = [
      { ...validRow, lineNumber: 2, email: 'same@test.com' },
      { ...validRow, lineNumber: 3, email: 'same@test.com' },
    ]

    const results = validateCsvRows(rows)

    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(false)
    expect(results[1].errors.some((e) => e.includes('doublon'))).toBe(true)
  })

  it('should detect case-insensitive duplicate emails', () => {
    const rows: CsvImportRow[] = [
      { ...validRow, lineNumber: 2, email: 'Test@Example.com' },
      { ...validRow, lineNumber: 3, email: 'test@example.com' },
    ]

    const results = validateCsvRows(rows)

    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(false)
  })

  it('should handle mix of valid and invalid rows', () => {
    const rows: CsvImportRow[] = [
      { ...validRow, lineNumber: 2 },
      { ...validRow, lineNumber: 3, name: '', email: '' },
      { ...validRow, lineNumber: 4, email: 'other@test.com' },
    ]

    const results = validateCsvRows(rows)

    expect(results[0].valid).toBe(true)
    expect(results[1].valid).toBe(false)
    expect(results[2].valid).toBe(true)
  })
})

describe('markDuplicateEmails', () => {
  it('should mark rows with existing emails as invalid', () => {
    const results = [
      { row: { ...validRow, email: 'existing@test.com' }, valid: true, errors: [] },
      { row: { ...validRow, email: 'new@test.com', lineNumber: 3 }, valid: true, errors: [] },
    ]

    const existingEmails = new Set(['existing@test.com'])
    const marked = markDuplicateEmails(results, existingEmails)

    expect(marked[0].valid).toBe(false)
    expect(marked[0].errors).toContain('Email déjà existant en base')
    expect(marked[1].valid).toBe(true)
  })

  it('should handle case-insensitive email matching', () => {
    const results = [
      { row: { ...validRow, email: 'Test@Example.com' }, valid: true, errors: [] },
    ]

    const existingEmails = new Set(['test@example.com'])
    const marked = markDuplicateEmails(results, existingEmails)

    expect(marked[0].valid).toBe(false)
  })

  it('should not modify rows without matching emails', () => {
    const results = [
      { row: { ...validRow, email: 'new@test.com' }, valid: true, errors: [] },
    ]

    const existingEmails = new Set(['other@test.com'])
    const marked = markDuplicateEmails(results, existingEmails)

    expect(marked[0].valid).toBe(true)
    expect(marked[0].errors).toHaveLength(0)
  })
})
