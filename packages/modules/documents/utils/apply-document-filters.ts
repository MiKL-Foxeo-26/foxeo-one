import type { Document, DocumentFilters } from '../types/document.types'

export function applyDocumentFilters(
  documents: Document[],
  filters?: DocumentFilters
): Document[] {
  if (!filters) return documents

  let result = documents

  if (filters.folderId !== undefined) {
    result = result.filter((d) => d.folderId === filters.folderId)
  }
  if (filters.visibility) {
    result = result.filter((d) => d.visibility === filters.visibility)
  }
  if (filters.uploadedBy) {
    result = result.filter((d) => d.uploadedBy === filters.uploadedBy)
  }

  return result
}
