'use server'

import { createServerSupabaseClient } from '@foxeo/supabase'
import { type ActionResponse, successResponse, errorResponse } from '@foxeo/types'
import { DeleteDocumentInput, type DocumentDB } from '../types/document.types'

export async function deleteDocument(
  input: DeleteDocumentInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return errorResponse('Non authentifié', 'UNAUTHORIZED')
    }

    const parsed = DeleteDocumentInput.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Données invalides'
      return errorResponse(firstError, 'VALIDATION_ERROR', parsed.error.issues)
    }

    const { documentId } = parsed.data

    // Get document to find storage path (RLS will filter unauthorized access)
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (fetchError || !doc) {
      console.error('[DOCUMENTS:DELETE] Document not found:', fetchError)
      return errorResponse('Document non trouvé', 'NOT_FOUND')
    }

    const typedDoc = doc as DocumentDB

    // Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([typedDoc.file_path])

    if (storageError) {
      // Only continue if file is already gone (Not Found); otherwise abort to prevent orphans
      const isNotFound = storageError.message?.includes('Not Found') || storageError.message?.includes('Object not found')
      if (!isNotFound) {
        console.error('[DOCUMENTS:DELETE] Storage delete error (non-recoverable):', storageError)
        return errorResponse('Échec de la suppression du fichier', 'STORAGE_ERROR', storageError)
      }
      console.warn('[DOCUMENTS:DELETE] Storage file already gone, continuing DB delete')
    }

    // Delete from DB (RLS will enforce authorization)
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('[DOCUMENTS:DELETE] DB delete error:', deleteError)
      return errorResponse('Échec de la suppression du document', 'DB_ERROR', deleteError)
    }

    return successResponse({ id: documentId })
  } catch (error) {
    console.error('[DOCUMENTS:DELETE] Unexpected error:', error)
    return errorResponse('Une erreur inattendue est survenue', 'INTERNAL_ERROR', error)
  }
}
