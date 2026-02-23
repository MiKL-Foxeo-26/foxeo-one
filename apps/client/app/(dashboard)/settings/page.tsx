import Link from 'next/link'
import { RestartTourButton } from '../../components/onboarding/restart-tour-button'

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/settings/sessions"
        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
      >
        <div>
          <h2 className="text-base font-medium text-foreground">Sessions actives</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos sessions et appareils connectés
          </p>
        </div>
        <span className="text-muted-foreground">&rarr;</span>
      </Link>

      <Link
        href="/settings/consents"
        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
      >
        <div>
          <h2 className="text-base font-medium text-foreground">Consentements</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos consentements CGU et traitement IA
          </p>
        </div>
        <span className="text-muted-foreground">&rarr;</span>
      </Link>

      {/* AC6 — Revoir le tutoriel */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
        <div>
          <h2 className="text-base font-medium text-foreground">Tutoriel interactif</h2>
          <p className="text-sm text-muted-foreground">
            Relancez le tutoriel de découverte de votre espace Lab
          </p>
        </div>
        <RestartTourButton />
      </div>
    </div>
  )
}
