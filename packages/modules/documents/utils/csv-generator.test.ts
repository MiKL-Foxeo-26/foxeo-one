import { describe, it, expect } from 'vitest'
import { generateDocumentsCsv } from './csv-generator'
import type { Document } from '../types/document.types'
import type { DocumentFolder } from '../types/folder.types'

const FIXED_DATE = '2026-02-19T10:00:00.000Z'
const FOLDER_ID = '00000000-0000-0000-0000-000000000010'

const makeDoc = (overrides: Partial<Document> = {}): Document => ({
  id: '00000000-0000-0000-0000-000000000001',
  clientId: '00000000-0000-0000-0000-000000000002',
  operatorId: '00000000-0000-0000-0000-000000000003',
  name: 'rapport.pdf',
  filePath: 'op/client/rapport.pdf',
  fileType: 'pdf',
  fileSize: 1024,
  folderId: null,
  tags: [],
  visibility: 'private',
  uploadedBy: 'operator',
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  lastSyncedAt: null,
  deletedAt: null,
  ...overrides,
})

const makeFolder = (overrides: Partial<DocumentFolder> = {}): DocumentFolder => ({
  id: FOLDER_ID,
  clientId: '00000000-0000-0000-0000-000000000002',
  operatorId: '00000000-0000-0000-0000-000000000003',
  name: 'Projets',
  parentId: null,
  createdAt: FIXED_DATE,
  ...overrides,
})

describe('generateDocumentsCsv', () => {
  it('liste vide — retourne uniquement les en-têtes avec BOM', () => {
    const result = generateDocumentsCsv([])
    // BOM UTF-8 en début
    expect(result.charCodeAt(0)).toBe(0xfeff)
    const withoutBom = result.slice(1)
    expect(withoutBom).toBe('Nom,Type,Taille,Dossier,Visibilité,Date création,Date modification')
  })

  it('un document sans dossier — colonne dossier = "Non classes"', () => {
    const result = generateDocumentsCsv([makeDoc()])
    expect(result).toContain('Non classes')
    expect(result).toContain('rapport.pdf')
    expect(result).toContain('Prive')
  })

  it('un document avec dossier — résout le nom de dossier via folderMap', () => {
    const doc = makeDoc({ folderId: FOLDER_ID })
    const folder = makeFolder()
    const result = generateDocumentsCsv([doc], [folder])
    expect(result).toContain('Projets')
    expect(result).not.toContain('Non classes')
  })

  it('caractères spéciaux dans le nom — valeur CSV correctement échappée', () => {
    const doc = makeDoc({ name: 'rapport, final "v2".pdf' })
    const result = generateDocumentsCsv([doc])
    // La valeur contient une virgule et des guillemets, doit être entourée de guillemets et les " doublés
    expect(result).toContain('"rapport, final ""v2"".pdf"')
  })

  it('BOM UTF-8 présent — premier caractère est \\uFEFF', () => {
    const result = generateDocumentsCsv([makeDoc()])
    expect(result.startsWith('\uFEFF')).toBe(true)
  })
})
