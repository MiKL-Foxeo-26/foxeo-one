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

// ============================================================
// Parcours types (Story 2.4)
// ============================================================

// Enums
export const ParcoursTypeEnum = z.enum(['complet', 'partiel', 'ponctuel'])
export type ParcoursType = z.infer<typeof ParcoursTypeEnum>

export const ParcoursStatusEnum = z.enum(['en_cours', 'suspendu', 'termine'])
export type ParcoursStatus = z.infer<typeof ParcoursStatusEnum>

export const StageStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'skipped'])

// Stage definition (in parcours_templates.stages)
export const ParcoursStage = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  order: z.number().int().positive(),
})

export type ParcoursStage = z.infer<typeof ParcoursStage>

// Active stage (in parcours.active_stages)
export const ActiveStage = z.object({
  key: z.string().min(1),
  active: z.boolean(),
  status: StageStatusEnum,
})

export type ActiveStage = z.infer<typeof ActiveStage>

// ParcoursTemplate schema
export const ParcoursTemplate = z.object({
  id: z.string().uuid(),
  operatorId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  parcoursType: ParcoursTypeEnum,
  stages: z.array(ParcoursStage),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type ParcoursTemplate = z.infer<typeof ParcoursTemplate>

// Parcours schema
export const Parcours = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  templateId: z.string().uuid().nullable(),
  operatorId: z.string().uuid(),
  activeStages: z.array(ActiveStage),
  status: ParcoursStatusEnum,
  startedAt: z.string().datetime(),
  suspendedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Parcours = z.infer<typeof Parcours>

// Input schemas
export const AssignParcoursInput = z.object({
  clientId: z.string().uuid(),
  templateId: z.string().uuid(),
  activeStages: z.array(z.object({
    key: z.string().min(1),
    active: z.boolean(),
  })),
})

export type AssignParcoursInput = z.infer<typeof AssignParcoursInput>

export const ToggleAccessInput = z.object({
  clientId: z.string().uuid(),
  accessType: z.enum(['lab', 'one']),
  enabled: z.boolean(),
})

export type ToggleAccessInput = z.infer<typeof ToggleAccessInput>

// DB types (snake_case)
export type ParcoursTemplateDB = {
  id: string
  operator_id: string
  name: string
  description: string | null
  parcours_type: 'complet' | 'partiel' | 'ponctuel'
  stages: ParcoursStage[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ParcoursDB = {
  id: string
  client_id: string
  template_id: string | null
  operator_id: string
  active_stages: ActiveStage[]
  status: 'en_cours' | 'suspendu' | 'termine'
  started_at: string
  suspended_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}
