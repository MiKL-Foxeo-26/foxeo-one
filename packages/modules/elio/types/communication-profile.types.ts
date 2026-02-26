import { z } from 'zod'

// --- Enums ---

export const PreferredToneValues = ['formal', 'casual', 'technical', 'friendly'] as const
export type PreferredTone = typeof PreferredToneValues[number]

export const PreferredLengthValues = ['concise', 'detailed', 'balanced'] as const
export type PreferredLength = typeof PreferredLengthValues[number]

export const InteractionStyleValues = ['directive', 'explorative', 'collaborative'] as const
export type InteractionStyle = typeof InteractionStyleValues[number]

// --- DB Types (snake_case, from Supabase) ---

export interface CommunicationProfileDB {
  id: string
  client_id: string
  preferred_tone: PreferredTone
  preferred_length: PreferredLength
  interaction_style: InteractionStyle
  context_preferences: Record<string, boolean> | null
  created_at: string
  updated_at: string
}

// --- App Types (camelCase) ---

export interface CommunicationProfile {
  id: string
  clientId: string
  preferredTone: PreferredTone
  preferredLength: PreferredLength
  interactionStyle: InteractionStyle
  contextPreferences: Record<string, boolean>
  createdAt: string
  updatedAt: string
}

// --- Context Preferences ---

export interface ContextPreferences {
  examples?: boolean
  theory?: boolean
}

// --- Zod Schemas ---

export const CreateCommunicationProfileInput = z.object({
  clientId: z.string().uuid('clientId doit être un UUID valide'),
  preferredTone: z.enum(PreferredToneValues).default('friendly'),
  preferredLength: z.enum(PreferredLengthValues).default('balanced'),
  interactionStyle: z.enum(InteractionStyleValues).default('collaborative'),
  contextPreferences: z.record(z.boolean()).default({}),
})
export type CreateCommunicationProfileInput = z.infer<typeof CreateCommunicationProfileInput>

export const UpdateCommunicationProfileInput = z.object({
  clientId: z.string().uuid('clientId doit être un UUID valide'),
  preferredTone: z.enum(PreferredToneValues).optional(),
  preferredLength: z.enum(PreferredLengthValues).optional(),
  interactionStyle: z.enum(InteractionStyleValues).optional(),
  contextPreferences: z.record(z.boolean()).optional(),
})
export type UpdateCommunicationProfileInput = z.infer<typeof UpdateCommunicationProfileInput>

export const GetCommunicationProfileInput = z.object({
  clientId: z.string().uuid('clientId doit être un UUID valide'),
})
export type GetCommunicationProfileInput = z.infer<typeof GetCommunicationProfileInput>

// --- Mapper ---

export function toCommunicationProfile(db: CommunicationProfileDB): CommunicationProfile {
  return {
    id: db.id,
    clientId: db.client_id,
    preferredTone: db.preferred_tone,
    preferredLength: db.preferred_length,
    interactionStyle: db.interaction_style,
    contextPreferences: db.context_preferences ?? {},
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}
