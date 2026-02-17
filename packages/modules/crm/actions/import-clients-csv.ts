'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@foxeo/supabase'
import {
  type ActionResponse,
  successResponse,
  errorResponse,
} from '@foxeo/types'
import { ImportCsvInput } from '../types/crm.types'
import type { CsvImportRow, CsvImportResult } from '../types/crm.types'

export async function importClientsCsv(
  input: { rows: CsvImportRow[] }
): Promise<ActionResponse<CsvImportResult>> {
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

    // Server-side validation
    const parsed = ImportCsvInput.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Données invalides'
      return errorResponse(firstError, 'VALIDATION_ERROR', parsed.error.issues)
    }

    const { rows } = parsed.data

    // Batch check email uniqueness per operator
    const rowEmails = rows.map((r) => r.email.toLowerCase())
    const { data: existingClients, error: emailCheckError } = await supabase
      .from('clients')
      .select('email')
      .eq('operator_id', operatorId)
      .in('email', rowEmails)

    if (emailCheckError) {
      console.error('[CRM:IMPORT_CSV] Email check error:', emailCheckError)
      return errorResponse(
        'Erreur lors de la vérification des emails',
        'DB_ERROR',
        emailCheckError
      )
    }

    const existingEmails = new Set(
      (existingClients ?? []).map((c) => c.email.toLowerCase())
    )

    // Filter out rows with duplicate emails
    const validRows: CsvImportRow[] = []
    const errors: string[] = []

    for (const row of rows) {
      if (existingEmails.has(row.email.toLowerCase())) {
        errors.push(`Ligne ${row.lineNumber}: email ${row.email} déjà existant`)
        continue
      }
      validRows.push(row)
    }

    if (validRows.length === 0) {
      return successResponse({
        imported: 0,
        ignored: rows.length,
        errors,
      })
    }

    // Batch insert clients
    const { data: insertedClients, error: insertError } = await supabase
      .from('clients')
      .insert(
        validRows.map((row) => ({
          operator_id: operatorId,
          name: row.name,
          email: row.email.toLowerCase(),
          company: row.company || null,
          phone: row.phone || null,
          sector: row.sector || null,
          client_type: row.clientType || 'ponctuel',
          status: 'active',
        }))
      )
      .select('id, client_type')

    if (insertError || !insertedClients) {
      console.error('[CRM:IMPORT_CSV] Batch insert error:', insertError)
      return errorResponse(
        'Erreur lors de l\'insertion des clients',
        'DB_ERROR',
        insertError
      )
    }

    // Create client_configs for each inserted client
    const { error: configError } = await supabase
      .from('client_configs')
      .insert(
        insertedClients.map((c) => ({
          client_id: c.id,
          operator_id: operatorId,
          active_modules: ['core-dashboard'],
          dashboard_type: c.client_type === 'direct_one' ? 'one' : 'lab',
        }))
      )

    if (configError) {
      console.error('[CRM:IMPORT_CSV] Config insert error:', configError)
      // Non-blocking — clients were created, configs can be fixed later
    }

    // Log activity
    const { error: logError } = await supabase
      .from('activity_logs')
      .insert({
        actor_type: 'operator',
        actor_id: operatorId,
        action: 'csv_import',
        entity_type: 'clients',
        entity_id: null,
        metadata: {
          importedCount: insertedClients.length,
          ignoredCount: rows.length - validRows.length,
          totalRows: rows.length,
        },
      })

    if (logError) {
      console.error('[CRM:IMPORT_CSV] Activity log error:', logError)
      // Non-blocking
    }

    // Invalidate cache
    revalidatePath('/modules/crm')

    return successResponse({
      imported: insertedClients.length,
      ignored: rows.length - validRows.length,
      errors,
    })
  } catch (error) {
    console.error('[CRM:IMPORT_CSV] Unexpected error:', error)
    return errorResponse(
      'Une erreur inattendue est survenue',
      'INTERNAL_ERROR',
      error
    )
  }
}
