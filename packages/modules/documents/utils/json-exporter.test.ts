import { describe, it, expect } from 'vitest'
import { generateDocumentsJson } from './json-exporter'
import type { Document, ExportMetadata } from '../types/document.types'
import type { DocumentFolder } from '../types/folder.types'

const FIXED_DATE = '2026-02-19T10:00:00.000Z'
const CLIENT_ID = '00000000-0000-0000-0000-000000000002'
const FOLDER_ID = '00000000-0000-0000-0000-000000000010'

const makeDoc = (overrides: Partial<Document> = {}): Document => ({
  id: '00000000-0000-0000-0000-000000000001',
  clientId: CLIENT_ID,
  operatorId: '00000000-0000-0000-0000-000000000003',
  name: 'rapport.pdf',
  filePath: 'op/client/rapport.pdf',
  fileType: 'pdf',
  fileSize: 2048,
  folderId: null,
  tags: ['important'],
  visibility: 'shared',
  uploadedBy: 'operator',
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  lastSyncedAt: null,
  deletedAt: null,
  ...overrides,
})

const makeFolder = (overrides: Partial<DocumentFolder> = {}): DocumentFolder => ({
  id: FOLDER_ID,
  clientId: CLIENT_ID,
  operatorId: '00000000-0000-0000-0000-000000000003',
  name: 'Projets',
  parentId: null,
  createdAt: FIXED_DATE,
  ...overrides,
})

const metadata: ExportMetadata = {
  clientId: CLIENT_ID,
  exportedAt: FIXED_DATE,
  exportedBy: 'auth-user-id',
}

describe('generateDocumentsJson', () => {
  it('structure JSON valide — parse sans erreur', () => {
    const result = generateDocumentsJson([makeDoc()], metadata)
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('champs camelCase présents dans chaque document', () => {
    const result = generateDocumentsJson([makeDoc()], metadata)
    const parsed = JSON.parse(result)
    const doc = parsed.documents[0]
    expect(doc).toHaveProperty('fileType')
    expect(doc).toHaveProperty('fileSize')
    expect(doc).toHaveProperty('formattedSize')
    expect(doc).toHaveProperty('folderId')
    expect(doc).toHaveProperty('folderName')
    expect(doc).toHaveProperty('uploadedBy')
    expect(doc).not.toHaveProperty('file_type')
    expect(doc).not.toHaveProperty('file_size')
    expect(doc).not.toHaveProperty('uploaded_by')
  })

  it('champs requis de la structure racine présents', () => {
    const result = generateDocumentsJson([makeDoc(), makeDoc({ id: 'doc-2' })], metadata)
    const parsed = JSON.parse(result)
    expect(parsed).toHaveProperty('exportedAt', FIXED_DATE)
    expect(parsed).toHaveProperty('exportedBy', 'auth-user-id')
    expect(parsed).toHaveProperty('clientId', CLIENT_ID)
    expect(parsed).toHaveProperty('totalCount', 2)
    expect(parsed.documents).toHaveLength(2)
  })

  it('folderName résolu quand folderId correspond à un dossier', () => {
    const doc = makeDoc({ folderId: FOLDER_ID })
    const folder = makeFolder()
    const result = generateDocumentsJson([doc], metadata, [folder])
    const parsed = JSON.parse(result)
    expect(parsed.documents[0].folderName).toBe('Projets')
  })

  it('folderName null quand folderId est null', () => {
    const result = generateDocumentsJson([makeDoc()], metadata, [makeFolder()])
    const parsed = JSON.parse(result)
    expect(parsed.documents[0].folderName).toBeNull()
  })
})
