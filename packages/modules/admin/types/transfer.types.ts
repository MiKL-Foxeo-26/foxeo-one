import { z } from 'zod'

// ============================================================
// Input schemas
// ============================================================

export const TransferInstanceInput = z.object({
  clientId: z.string().uuid('clientId doit être un UUID valide'),
  recipientEmail: z.string().email('recipientEmail doit être un email valide'),
})

export type TransferInstanceInput = z.infer<typeof TransferInstanceInput>

// ============================================================
// Domain types (camelCase)
// ============================================================

export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type TransferResult = {
  transferId: string
}

export type InstanceTransfer = {
  id: string
  clientId: string
  instanceId: string
  recipientEmail: string
  status: TransferStatus
  filePath: string | null
  fileSizeBytes: number | null
  errorMessage: string | null
  sentAt: string | null
  createdAt: string
  completedAt: string | null
}
