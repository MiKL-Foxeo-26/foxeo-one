import { describe, it, expect } from 'vitest'
import { applyDocumentFilters } from './apply-document-filters'
import type { Document } from '../types/document.types'

const FIXED_DATE = '2026-02-19T10:00:00.000Z'
const FOLDER_A = '00000000-0000-0000-0000-00000000000a'

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

describe('applyDocumentFilters', () => {
  const docs = [
    makeDoc({ id: 'd1', folderId: FOLDER_A, visibility: 'shared', uploadedBy: 'client' }),
    makeDoc({ id: 'd2', folderId: null, visibility: 'private', uploadedBy: 'operator' }),
    makeDoc({ id: 'd3', folderId: FOLDER_A, visibility: 'private', uploadedBy: 'operator' }),
  ]

  it('sans filtres — retourne tous les documents', () => {
    expect(applyDocumentFilters(docs)).toHaveLength(3)
    expect(applyDocumentFilters(docs, undefined)).toHaveLength(3)
  })

  it('filtre par folderId — retourne uniquement les documents du dossier', () => {
    const result = applyDocumentFilters(docs, { folderId: FOLDER_A })
    expect(result).toHaveLength(2)
    expect(result.every((d) => d.folderId === FOLDER_A)).toBe(true)
  })

  it('filtre par folderId null — retourne les documents non classés', () => {
    const result = applyDocumentFilters(docs, { folderId: null })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d2')
  })

  it('filtre par visibility — retourne uniquement les documents partagés', () => {
    const result = applyDocumentFilters(docs, { visibility: 'shared' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d1')
  })

  it('filtre par uploadedBy — retourne uniquement les documents uploadés par operator', () => {
    const result = applyDocumentFilters(docs, { uploadedBy: 'operator' })
    expect(result).toHaveLength(2)
  })

  it('filtres combinés — applique tous les critères', () => {
    const result = applyDocumentFilters(docs, { folderId: FOLDER_A, visibility: 'private' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('d3')
  })
})
