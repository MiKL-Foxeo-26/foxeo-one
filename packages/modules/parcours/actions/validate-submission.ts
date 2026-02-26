'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import { type ActionResponse, successResponse, errorResponse } from '@foxeo/types'
import type { ValidateSubmissionResult } from '../types/parcours.types'
import { ValidateSubmissionInput } from '../types/parcours.types'

export async function validateSubmission(
  input: { submissionId: string; decision: 'approved' | 'rejected' | 'revision_requested'; feedback?: string }
): Promise<ActionResponse<ValidateSubmissionResult>> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    // Validate input
    const parsed = ValidateSubmissionInput.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Données invalides'
      return errorResponse(firstError, 'VALIDATION_ERROR', parsed.error.issues)
    }

    // Récupérer soumission avec données associées
    const { data: submission, error: submissionError } = await supabase
      .from('step_submissions')
      .select('*, parcours_steps(id, step_number, title, parcours_id)')
      .eq('id', input.submissionId)
      .single()

    if (submissionError || !submission) {
      return errorResponse('Soumission non trouvée', 'NOT_FOUND', submissionError)
    }

    const step = submission.parcours_steps as {
      id: string
      step_number: number
      title: string
      parcours_id: string
    }

    // Mettre à jour la soumission
    const { error: updateError } = await supabase
      .from('step_submissions')
      .update({
        status: input.decision,
        feedback: input.feedback ?? null,
        feedback_at: new Date().toISOString(),
      })
      .eq('id', input.submissionId)

    if (updateError) {
      return errorResponse('Échec mise à jour soumission', 'DATABASE_ERROR', updateError)
    }

    let stepCompleted = false

    if (input.decision === 'approved') {
      // Compléter l'étape
      await supabase
        .from('parcours_steps')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          validation_id: input.submissionId,
        })
        .eq('id', step.id)

      // Unlock étape suivante
      const nextStepNumber = step.step_number + 1
      const { data: nextStep } = await supabase
        .from('parcours_steps')
        .select('id')
        .eq('parcours_id', step.parcours_id)
        .eq('step_number', nextStepNumber)
        .maybeSingle()

      if (nextStep) {
        await supabase
          .from('parcours_steps')
          .update({ status: 'current' })
          .eq('id', nextStep.id)
      }

      stepCompleted = true

      // Notification client : approuvé
      await supabase.from('notifications').insert({
        recipient_type: 'client',
        recipient_id: submission.client_id,
        type: 'success',
        title: 'Validation approuvée ✅',
        body: `Votre soumission pour l'étape "${step.title}" a été validée. Vous pouvez passer à l'étape suivante.`,
        link: '/modules/parcours',
      })

      console.log('[PARCOURS:VALIDATE] Approuvée — Soumission:', input.submissionId, '| Step:', step.id)
    } else {
      // Révision ou refus → remettre étape en "current"
      await supabase
        .from('parcours_steps')
        .update({ status: 'current' })
        .eq('id', step.id)

      const notifTitle = input.decision === 'revision_requested'
        ? 'Révision demandée 🔄'
        : 'Soumission refusée ❌'

      await supabase.from('notifications').insert({
        recipient_type: 'client',
        recipient_id: submission.client_id,
        type: input.decision === 'revision_requested' ? 'warning' : 'error',
        title: notifTitle,
        body: input.feedback || 'MiKL a laissé un commentaire sur votre soumission.',
        link: `/modules/parcours/steps/${step.step_number}/submission`,
      })

      console.log('[PARCOURS:VALIDATE] Décision:', input.decision, '| Soumission:', input.submissionId)
    }

    return successResponse({ stepCompleted })
  } catch (error) {
    console.error('[PARCOURS:VALIDATE] Unexpected error:', error)
    return errorResponse('Une erreur inattendue est survenue', 'INTERNAL_ERROR', error)
  }
}
