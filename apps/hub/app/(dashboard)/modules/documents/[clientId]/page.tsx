import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { getDocuments, DocumentsPageClient } from '@foxeo/module-documents'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface Props {
  params: Promise<{ clientId: string }>
}

export default async function ClientDocumentsPage({ params }: Props) {
  const { clientId } = await params

  // Validate clientId is a valid UUID
  if (!UUID_REGEX.test(clientId)) notFound()

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  // Verify operator access
  const { data: operator } = await supabase
    .from('operators')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!operator) notFound()

  // Verify client belongs to this operator
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('id', clientId)
    .eq('operator_id', operator.id)
    .single()

  if (!client) notFound()

  // Load documents
  const { data: documents } = await getDocuments({ clientId })

  return (
    <DocumentsPageClient
      clientId={clientId}
      operatorId={operator.id}
      uploadedBy="operator"
      initialDocuments={documents ?? []}
      showVisibility
      showBatchActions
      viewerBaseHref={`/modules/documents/${clientId}`}
      isOperator={true}
    />
  )
}
