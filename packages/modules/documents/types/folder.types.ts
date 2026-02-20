import { z } from 'zod'

// ============================================================
// Domain types (camelCase — post-boundary transformation)
// ============================================================

export interface DocumentFolder {
  id: string
  clientId: string
  operatorId: string
  name: string
  parentId: string | null
  createdAt: string
}

// ============================================================
// DB types (snake_case — raw Supabase rows)
// ============================================================

export interface DocumentFolderDB {
  id: string
  client_id: string
  operator_id: string
  name: string
  parent_id: string | null
  created_at: string
}

// ============================================================
// Action input schemas
// ============================================================

export const CreateFolderInput = z.object({
  clientId: z.string().uuid('clientId invalide'),
  operatorId: z.string().uuid('operatorId invalide'),
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne doit pas depasser 100 caracteres'),
  parentId: z.string().uuid('parentId invalide').nullable().default(null),
})
export type CreateFolderInput = z.infer<typeof CreateFolderInput>

export const RenameFolderInput = z.object({
  folderId: z.string().uuid('folderId invalide'),
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne doit pas depasser 100 caracteres'),
})
export type RenameFolderInput = z.infer<typeof RenameFolderInput>

export const DeleteFolderInput = z.object({
  folderId: z.string().uuid('folderId invalide'),
})
export type DeleteFolderInput = z.infer<typeof DeleteFolderInput>

export const GetFoldersInput = z.object({
  clientId: z.string().uuid('clientId invalide'),
})
export type GetFoldersInput = z.infer<typeof GetFoldersInput>

export const MoveDocumentInput = z.object({
  documentId: z.string().uuid('documentId invalide'),
  folderId: z.string().uuid('folderId invalide').nullable(), // null = "Non classes"
})
export type MoveDocumentInput = z.infer<typeof MoveDocumentInput>
