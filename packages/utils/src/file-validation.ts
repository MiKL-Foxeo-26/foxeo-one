/**
 * File validation constants and utilities for document upload.
 * Used by the Documents module to validate files before upload.
 */

/** Maximum file size in bytes (10 Mo) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/** Allowed file extensions (lowercase, without dot) */
export const ALLOWED_FILE_TYPES = [
  'pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg', 'svg', 'md', 'txt', 'csv',
] as const

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number]

/** MIME type mapping for allowed extensions */
export const MIME_TYPE_MAP: Record<AllowedFileType, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  md: 'text/markdown',
  txt: 'text/plain',
  csv: 'text/csv',
}

export type FileValidationResult = {
  valid: boolean
  error?: string
}

/**
 * Validate a file before upload.
 * Checks file extension, MIME type cross-validation, and size.
 */
export function validateFile(file: File): FileValidationResult {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (!ext || !ALLOWED_FILE_TYPES.includes(ext as AllowedFileType)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé. Types acceptés : ${ALLOWED_FILE_TYPES.map((t) => t.toUpperCase()).join(', ')}`,
    }
  }

  // Cross-validate MIME type against extension (defense against extension spoofing)
  // Skip check if MIME is empty or generic 'application/octet-stream' (browser may not detect)
  if (file.type && file.type !== 'application/octet-stream') {
    const expectedMime = MIME_TYPE_MAP[ext as AllowedFileType]
    const expectedCategory = expectedMime.split('/')[0]
    const actualCategory = file.type.split('/')[0]
    if (expectedCategory !== actualCategory) {
      return {
        valid: false,
        error: `Type MIME invalide pour .${ext} (attendu: ${expectedCategory}/*, reçu: ${file.type})`,
      }
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'Le fichier est vide',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} Mo)`,
    }
  }

  return { valid: true }
}

/**
 * Format file size for display.
 * Returns human-readable string (e.g., "1.5 Mo", "256 Ko").
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 o'
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
