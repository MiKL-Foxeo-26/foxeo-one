'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'

export async function deleteClientNote(
  noteId: string
): Promise<ActionResponse<void>> {
  try {
    const supabase = await createServerSupabaseClient()

    // Auth check
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    const operatorId = user.id

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(noteId)) {
      return errorResponse('ID de note invalide', 'VALIDATION_ERROR')
    }

    // Delete note (RLS ensures operator owns this note)
    const { error: deleteError } = await supabase
      .from('client_notes')
      .delete()
      .eq('id', noteId)
      .eq('operator_id', operatorId) // Explicit check even though RLS enforces

    if (deleteError) {
      console.error('[CRM:DELETE_NOTE] Delete error:', deleteError)
      return errorResponse(
        'Impossible de supprimer la note',
        'DELETE_FAILED',
        deleteError
      )
    }

    console.log(`[CRM:DELETE_NOTE] Note ${noteId} deleted`)

    return successResponse(undefined)
  } catch (error) {
    console.error('[CRM:DELETE_NOTE] Unexpected error:', error)
    return errorResponse(
      'Erreur interne',
      'INTERNAL_ERROR',
      error
    )
  }
}
