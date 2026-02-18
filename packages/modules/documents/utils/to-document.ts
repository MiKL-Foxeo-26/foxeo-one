import type { Document, DocumentDB } from '../types/document.types'

export function toDocument(row: DocumentDB): Document {
  return {
    id: row.id,
    clientId: row.client_id,
    operatorId: row.operator_id,
    name: row.name,
    filePath: row.file_path,
    fileType: row.file_type,
    fileSize: row.file_size,
    folderId: row.folder_id,
    tags: row.tags,
    visibility: row.visibility,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
