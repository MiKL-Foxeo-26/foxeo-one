import { z } from 'zod'

// ============================================================
// Domain types (camelCase — post-boundary transformation)
// ============================================================

export type DocumentVisibility = 'private' | 'shared'
export type UploadedBy = 'client' | 'operator'

export interface Document {
  id: string
  clientId: string
  operatorId: string
  name: string
  filePath: string
  fileType: string
  fileSize: number
  folderId: string | null
  tags: string[]
  visibility: DocumentVisibility
  uploadedBy: UploadedBy
  createdAt: string
  updatedAt: string
}

// ============================================================
// DB types (snake_case — raw Supabase rows)
// ============================================================

export interface DocumentDB {
  id: string
  client_id: string
  operator_id: string
  name: string
  file_path: string
  file_type: string
  file_size: number
  folder_id: string | null
  tags: string[]
  visibility: DocumentVisibility
  uploaded_by: UploadedBy
  created_at: string
  updated_at: string
}

// ============================================================
// Action input types & Zod schemas
// ============================================================

export const UploadDocumentInput = z.object({
  clientId: z.string().uuid(),
  operatorId: z.string().uuid(),
  name: z.string().min(1, 'Le nom du fichier est requis'),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
  visibility: z.enum(['private', 'shared']).default('private'),
  uploadedBy: z.enum(['client', 'operator']),
  tags: z.array(z.string()).default([]),
})
export type UploadDocumentInput = z.infer<typeof UploadDocumentInput>

export const GetDocumentsInput = z.object({
  clientId: z.string().uuid(),
})
export type GetDocumentsInput = z.infer<typeof GetDocumentsInput>

export const DeleteDocumentInput = z.object({
  documentId: z.string().uuid(),
})
export type DeleteDocumentInput = z.infer<typeof DeleteDocumentInput>

export const GetDocumentUrlInput = z.object({
  documentId: z.string().uuid(),
})
export type GetDocumentUrlInput = z.infer<typeof GetDocumentUrlInput>

export const GeneratePdfInput = z.object({
  documentId: z.string().uuid(),
})
export type GeneratePdfInput = z.infer<typeof GeneratePdfInput>
