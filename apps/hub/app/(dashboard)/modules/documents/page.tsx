import { redirect } from 'next/navigation'

export default function DocumentsHubIndex() {
  // Hub documents index — redirect to CRM to select a client
  redirect('/modules/crm')
}
