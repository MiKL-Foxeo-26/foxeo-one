import { z } from 'zod'
import { createClientSchema, updateClientSchema } from '@foxeo/utils'

// Client type enums
export const ClientTypeEnum = z.enum(['complet', 'direct-one', 'ponctuel'])
export const ClientStatusEnum = z.enum(['lab-actif', 'one-actif', 'inactif', 'suspendu'])

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
  updatedAt: z.string().datetime()
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
