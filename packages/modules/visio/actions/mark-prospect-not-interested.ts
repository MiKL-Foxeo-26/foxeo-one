'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import { type ActionResponse, successResponse, errorResponse } from '@foxeo/types'
import { z } from 'zod'

export const NotInterestedReasonValues = [
  'budget',
  'timing',
  'competitor',
  'not_ready',
  'other',
] as const
export type NotInterestedReason = typeof NotInterestedReasonValues[number]

export const MarkProspectNotInterestedInput = z.object({
  meetingId: z.string().uuid('meetingId invalide'),
  reason: z.enum(NotInterestedReasonValues).optional(),
})
export type MarkProspectNotInterestedInput = z.infer<typeof MarkProspectNotInterestedInput>

export async function markProspectNotInterested(
  input: MarkProspectNotInterestedInput
): Promise<ActionResponse<{ meetingId: string }>> {
  const supabase = await createServerSupabaseClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return errorResponse('Non authentifié', 'UNAUTHORIZED')

  const parsed = MarkProspectNotInterestedInput.safeParse(input)
  if (!parsed.success) {
    return errorResponse('Données invalides', 'VALIDATION_ERROR', parsed.error.issues)
  }

  const { meetingId, reason } = parsed.data

  // Récupérer metadata actuelle du meeting
  const { data: existing, error: findError } = await supabase
    .from('meetings')
    .select('metadata')
    .eq('id', meetingId)
    .single()

  if (findError || !existing) {
    return errorResponse('Meeting non trouvé', 'NOT_FOUND')
  }

  const updatedMetadata: Record<string, unknown> = {
    ...(existing.metadata as Record<string, unknown>),
    not_interested: true,
    ...(reason ? { not_interested_reason: reason } : {}),
    not_interested_at: new Date().toISOString(),
  }

  const { error: updateError } = await supabase
    .from('meetings')
    .update({
      status: 'completed',
      metadata: updatedMetadata,
    })
    .eq('id', meetingId)

  if (updateError) {
    console.error('[VISIO:POST_MEETING] Not interested update failed:', updateError)
    return errorResponse('Échec mise à jour meeting', 'DATABASE_ERROR', updateError)
  }

  console.log('[VISIO:POST_MEETING] Prospect marqué non intéressé:', meetingId)

  return successResponse({ meetingId })
}
