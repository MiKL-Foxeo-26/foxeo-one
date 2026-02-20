import type { DocumentFolder, DocumentFolderDB } from '../types/folder.types'

export function toDocumentFolder(row: DocumentFolderDB): DocumentFolder {
  return {
    id: row.id,
    clientId: row.client_id,
    operatorId: row.operator_id,
    name: row.name,
    parentId: row.parent_id,
    createdAt: row.created_at,
  }
}
