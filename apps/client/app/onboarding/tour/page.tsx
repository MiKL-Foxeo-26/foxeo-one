import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@foxeo/supabase'
import { OnboardingTour } from '../../../components/onboarding/onboarding-tour'

export const metadata = {
  title: 'Tutoriel — Foxeo Lab',
  description: 'Découvrez votre espace Lab avec un tutoriel interactif.',
}

export default async function TourPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: client } = await supabase
    .from('clients')
    .select('id, onboarding_completed')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!client) {
    redirect('/login')
  }

  // Note: PAS de redirect si onboarding_completed — le tour doit être
  // relançable depuis Settings (AC6 "Revoir le tutoriel")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4 text-muted-foreground">
        <div className="text-5xl">🚀</div>
        <p className="text-lg">Le tutoriel démarre...</p>
      </div>
      <OnboardingTour isRestart={client.onboarding_completed} />
    </div>
  )
}
