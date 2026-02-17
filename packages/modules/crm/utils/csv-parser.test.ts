import { describe, it, expect } from 'vitest'
import { parseCsv, generateCsvTemplate } from './csv-parser'

describe('parseCsv', () => {
  it('should parse a valid CSV with all columns', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nJean Dupont,jean@test.com,Acme,0612345678,Tech,complet'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0]).toEqual({
      lineNumber: 2,
      name: 'Jean Dupont',
      email: 'jean@test.com',
      company: 'Acme',
      phone: '0612345678',
      sector: 'Tech',
      clientType: 'complet',
    })
  })

  it('should handle multiple rows', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nAlice,alice@test.com,Co1,,Tech,complet\nBob,bob@test.com,Co2,,Finance,ponctuel'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(2)
    expect(rows[0].name).toBe('Alice')
    expect(rows[1].name).toBe('Bob')
  })

  it('should handle missing optional fields', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nJean,jean@test.com,,,,ponctuel'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0].company).toBe('')
    expect(rows[0].phone).toBe('')
    expect(rows[0].sector).toBe('')
  })

  it('should strip UTF-8 BOM', () => {
    const csv = '\uFEFFnom,email,entreprise,telephone,secteur,type_client\nJean,jean@test.com,Acme,,,ponctuel'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('Jean')
  })

  it('should handle \\r\\n line endings', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\r\nJean,jean@test.com,Acme,,,ponctuel\r\nMarie,marie@test.com,Co2,,,complet'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(2)
    expect(rows[0].name).toBe('Jean')
    expect(rows[1].name).toBe('Marie')
  })

  it('should skip empty lines', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nJean,jean@test.com,Acme,,,ponctuel\n\nMarie,marie@test.com,Co2,,,complet\n'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(2)
  })

  it('should handle quoted fields with commas', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\n"Dupont, Jean",jean@test.com,"Acme, Inc",0612345678,Tech,complet'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('Dupont, Jean')
    expect(rows[0].company).toBe('Acme, Inc')
  })

  it('should handle escaped quotes in fields', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\n"Jean ""Bob"" Dupont",jean@test.com,Acme,,,ponctuel'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('Jean "Bob" Dupont')
  })

  it('should normalize client type values', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nA,a@t.com,,,,Complet\nB,b@t.com,,,,Direct One\nC,c@t.com,,,,directone\nD,d@t.com,,,,'
    const rows = parseCsv(csv)

    expect(rows[0].clientType).toBe('complet')
    expect(rows[1].clientType).toBe('direct_one')
    expect(rows[2].clientType).toBe('direct_one')
    expect(rows[3].clientType).toBe('ponctuel') // default
  })

  it('should return empty array for empty content', () => {
    expect(parseCsv('')).toEqual([])
  })

  it('should return empty array for headers-only CSV', () => {
    expect(parseCsv('nom,email,entreprise,telephone,secteur,type_client')).toEqual([])
  })

  it('should handle headers in different order', () => {
    const csv = 'email,nom,type_client,entreprise,secteur,telephone\njean@test.com,Jean,complet,Acme,Tech,0612345678'
    const rows = parseCsv(csv)

    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('Jean')
    expect(rows[0].email).toBe('jean@test.com')
    expect(rows[0].clientType).toBe('complet')
  })

  it('should set correct lineNumber (1-indexed, accounting for header)', () => {
    const csv = 'nom,email,entreprise,telephone,secteur,type_client\nA,a@t.com,,,,\nB,b@t.com,,,,\nC,c@t.com,,,,'
    const rows = parseCsv(csv)

    expect(rows[0].lineNumber).toBe(2)
    expect(rows[1].lineNumber).toBe(3)
    expect(rows[2].lineNumber).toBe(4)
  })
})

describe('generateCsvTemplate', () => {
  it('should return a valid CSV template with headers and example rows', () => {
    const template = generateCsvTemplate()

    expect(template).toContain('nom,email,entreprise,telephone,secteur,type_client')
    expect(template).toContain('Jean Dupont')
    expect(template).toContain('jean@example.com')
  })

  it('should be parseable by parseCsv', () => {
    const template = generateCsvTemplate()
    const rows = parseCsv(template)

    expect(rows.length).toBeGreaterThan(0)
    expect(rows[0].name).toBe('Jean Dupont')
    expect(rows[0].email).toBe('jean@example.com')
  })
})
