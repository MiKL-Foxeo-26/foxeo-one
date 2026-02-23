import type { SupabaseClient } from '@supabase/supabase-js'

export interface ResourceLink {
  name: string
  url: string
}

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60

/**
 * Génère des signed URLs Supabase Storage (expiration 7 jours) pour une liste de document IDs.
 * Les documents sans file_path ou signed URL échouent silencieusement.
 * [VISIO:POST_MEETING] Génération liens temporaires
 */
export async function generateResourceLinks(
  supabase: SupabaseClient,
  documentIds: string[]
): Promise<ResourceLink[]> {
  if (documentIds.length === 0) return []

  // Batch query — single DB call instead of N+1
  const { data: docs, error: docsError } = await supabase
    .from('documents')
    .select('id, name, file_path')
    .in('id', documentIds)

  if (docsError || !docs) return []

  const links: ResourceLink[] = []

  for (const doc of docs) {
    if (!doc.file_path) continue

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(doc.file_path as string, SEVEN_DAYS_IN_SECONDS)

    if (signedUrlError || !signedUrlData) continue

    links.push({ name: doc.name as string, url: signedUrlData.signedUrl })
  }

  return links
}
