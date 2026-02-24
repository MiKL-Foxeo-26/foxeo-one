import { z } from 'zod'

// --- Enums ---

export const ParcoursStepStatusValues = ['locked', 'current', 'completed', 'skipped'] as const
export type ParcoursStepStatus = typeof ParcoursStepStatusValues[number]

// --- DB Types (snake_case, from Supabase) ---

export interface ParcoursDB {
  id: string
  client_id: string
  template_id: string | null
  name: string
  description: string | null
  status: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ParcoursStepDB {
  id: string
  parcours_id: string
  step_number: number
  title: string
  description: string
  brief_template: string | null
  brief_content: string | null
  brief_assets: string[] | null
  one_teasing_message: string | null
  status: ParcoursStepStatus
  completed_at: string | null
  validation_required: boolean
  validation_id: string | null
  created_at: string
  updated_at: string
}

// --- App Types (camelCase) ---

export interface Parcours {
  id: string
  clientId: string
  templateId: string | null
  name: string
  description: string | null
  status: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ParcoursStep {
  id: string
  parcoursId: string
  stepNumber: number
  title: string
  description: string
  briefTemplate: string | null
  briefContent: string | null
  briefAssets: string[]
  oneTeasingMessage: string | null
  status: ParcoursStepStatus
  completedAt: string | null
  validationRequired: boolean
  validationId: string | null
  createdAt: string
  updatedAt: string
}

// --- Zod Schemas ---

export const GetParcoursInput = z.object({
  clientId: z.string().uuid('clientId invalide'),
})
export type GetParcoursInput = z.infer<typeof GetParcoursInput>

export const UpdateStepStatusInput = z.object({
  stepId: z.string().uuid('stepId invalide'),
  status: z.enum(ParcoursStepStatusValues),
})
export type UpdateStepStatusInput = z.infer<typeof UpdateStepStatusInput>

export const CompleteStepInput = z.object({
  stepId: z.string().uuid('stepId invalide'),
})
export type CompleteStepInput = z.infer<typeof CompleteStepInput>

export const SkipStepInput = z.object({
  stepId: z.string().uuid('stepId invalide'),
})
export type SkipStepInput = z.infer<typeof SkipStepInput>

// --- Result Types ---

export interface ParcoursWithSteps extends Parcours {
  steps: ParcoursStep[]
  totalSteps: number
  completedSteps: number
  progressPercent: number
}

export interface CompleteStepResult {
  nextStepUnlocked: boolean
  parcoursCompleted: boolean
}
