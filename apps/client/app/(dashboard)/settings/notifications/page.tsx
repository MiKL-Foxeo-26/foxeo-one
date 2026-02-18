import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { getNotificationPrefs, NotificationPrefsPage } from '@foxeo/modules-notifications'

export const metadata = {
  title: 'Notifications — Foxeo',
  description: 'Gérez vos préférences de notification',
}

export default async function NotificationsSettingsPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!client) {
    redirect('/login')
  }

  // Lazy initialization: ensure default preferences exist
  await getNotificationPrefs({ userId: client.id, userType: 'client' })

  return <NotificationPrefsPage userId={client.id} userType="client" />
}
