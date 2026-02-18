import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { DocumentViewerPageClient } from '@foxeo/module-documents'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Props {
  params: Promise<{ documentId: string }>
}

export default async function ClientDocumentViewerPage({ params }: Props) {
  const { documentId } = await params

  if (!UUID_REGEX.test(documentId)) notFound()

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  return (
    <DocumentViewerPageClient
      documentId={documentId}
      backHref="/modules/documents"
    />
  )
}
