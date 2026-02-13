import { z } from 'zod'
import { createClientSchema, updateClientSchema } from '@foxeo/utils'

// Client type enums
export const ClientTypeEnum = z.enum(['complet', 'direct-one', 'ponctuel'])
export const ClientStatusEnum = z.enum(['lab-actif', 'one-actif', 'inactif', 'suspendu'])

// Client Config types (from client_configs table)
export const ClientConfig = z.object({
  activeModules: z.array(z.string()),
  dashboardType: z.enum(['one', 'lab']),
  themeVariant: z.string().nullable().optional(),
  parcoursConfig: z.record(z.unknown()).optional(),
})

export type ClientConfig = z.infer<typeof ClientConfig>

// Full Client schema (for detailed views and operations)
export const Client = z.object({
  id: z.string().uuid(),
  operatorId: z.string().uuid(),
  name: z.string().min(1, 'Le nom est requis'),
  company: z.string().min(1, 'L\'entreprise est requise'),
  email: z.string().email('Email invalide'),
  clientType: ClientTypeEnum,
  status: ClientStatusEnum,
  sector: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  config: ClientConfig.optional(),
})

export type Client = z.infer<typeof Client>
export type ClientType = z.infer<typeof ClientTypeEnum>
export type ClientStatus = z.infer<typeof ClientStatusEnum>

// Client list item schema (optimized for list views)
export const ClientListItem = z.object({
  id: z.string().uuid(),
  name: z.string(),
  company: z.string(),
  email: z.string().optional(),
  sector: z.string().optional(),
  clientType: ClientTypeEnum,
  status: ClientStatusEnum,
  createdAt: z.string().datetime()
})

export type ClientListItem = z.infer<typeof ClientListItem>

// Client filters schema (for search and filtering)
export const ClientFilters = z.object({
  search: z.string().optional(),
  clientType: z.array(ClientTypeEnum).optional(),
  status: z.array(ClientStatusEnum).optional(),
  sector: z.array(z.string()).optional()
})

export type ClientFilters = z.infer<typeof ClientFilters>

// Create/Update input schemas (re-exported from @foxeo/utils)
export const CreateClientInput = createClientSchema
export const UpdateClientInput = updateClientSchema

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>

// Helper type for DB → API transformation
export type ClientDB = {
  id: string
  operator_id: string
  name: string
  company: string
  email: string
  client_type: 'complet' | 'direct-one' | 'ponctuel'
  status: 'lab-actif' | 'one-actif' | 'inactif' | 'suspendu'
  sector?: string
  phone?: string
  website?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Activity Log types (for client timeline/history)
export const ActivityLogTypeEnum = z.enum([
  'client_created',
  'status_changed',
  'validation_submitted',
  'validation_approved',
  'validation_rejected',
  'visio_completed',
  'graduated_to_one',
  'document_shared',
  'message_sent'
])

export const ActivityLog = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  eventType: ActivityLogTypeEnum,
  eventData: z.record(z.unknown()).optional(),
  description: z.string(),
  createdAt: z.string().datetime()
})

export type ActivityLog = z.infer<typeof ActivityLog>
export type ActivityLogType = z.infer<typeof ActivityLogTypeEnum>

// Client Document types (stub for Epic 4)
export const ClientDocument = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  name: z.string(),
  type: z.enum(['brief', 'livrable', 'rapport', 'autre']),
  url: z.string().url().optional(),
  visibleToClient: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type ClientDocument = z.infer<typeof ClientDocument>

// Client Exchange types (stub for Epic 3)
export const ClientExchange = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  type: z.enum(['message', 'notification', 'elio_summary']),
  content: z.string(),
  createdAt: z.string().datetime()
})

export type ClientExchange = z.infer<typeof ClientExchange>
