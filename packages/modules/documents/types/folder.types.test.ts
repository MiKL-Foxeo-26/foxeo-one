import { describe, it, expect } from 'vitest'
import {
  CreateFolderInput,
  RenameFolderInput,
  MoveDocumentInput,
  GetFoldersInput,
  DeleteFolderInput,
} from './folder.types'

const UUID = '00000000-0000-0000-0000-000000000001'

describe('CreateFolderInput', () => {
  it('accepte des donnees valides', () => {
    const result = CreateFolderInput.safeParse({
      clientId: UUID,
      operatorId: UUID,
      name: 'Mon dossier',
    })
    expect(result.success).toBe(true)
    expect(result.data?.parentId).toBeNull()
  })

  it('accepte un parentId valide', () => {
    const result = CreateFolderInput.safeParse({
      clientId: UUID,
      operatorId: UUID,
      name: 'Sous-dossier',
      parentId: UUID,
    })
    expect(result.success).toBe(true)
    expect(result.data?.parentId).toBe(UUID)
  })

  it('rejette un nom vide', () => {
    const result = CreateFolderInput.safeParse({ clientId: UUID, operatorId: UUID, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejette un clientId invalide', () => {
    const result = CreateFolderInput.safeParse({ clientId: 'not-uuid', operatorId: UUID, name: 'Test' })
    expect(result.success).toBe(false)
  })
})

describe('RenameFolderInput', () => {
  it('accepte des donnees valides', () => {
    const result = RenameFolderInput.safeParse({ folderId: UUID, name: 'Nouveau nom' })
    expect(result.success).toBe(true)
  })

  it('rejette un nom vide', () => {
    const result = RenameFolderInput.safeParse({ folderId: UUID, name: '' })
    expect(result.success).toBe(false)
  })
})

describe('MoveDocumentInput', () => {
  it('accepte un folderId UUID', () => {
    const result = MoveDocumentInput.safeParse({ documentId: UUID, folderId: UUID })
    expect(result.success).toBe(true)
  })

  it('accepte folderId null (Non classes)', () => {
    const result = MoveDocumentInput.safeParse({ documentId: UUID, folderId: null })
    expect(result.success).toBe(true)
    expect(result.data?.folderId).toBeNull()
  })

  it('rejette un documentId invalide', () => {
    const result = MoveDocumentInput.safeParse({ documentId: 'bad', folderId: null })
    expect(result.success).toBe(false)
  })
})

describe('GetFoldersInput', () => {
  it('accepte un clientId valide', () => {
    const result = GetFoldersInput.safeParse({ clientId: UUID })
    expect(result.success).toBe(true)
  })

  it('rejette un clientId invalide', () => {
    const result = GetFoldersInput.safeParse({ clientId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })
})

describe('DeleteFolderInput', () => {
  it('accepte un folderId valide', () => {
    const result = DeleteFolderInput.safeParse({ folderId: UUID })
    expect(result.success).toBe(true)
  })

  it('rejette un folderId invalide', () => {
    const result = DeleteFolderInput.safeParse({ folderId: 'bad' })
    expect(result.success).toBe(false)
  })
})
