import Link from 'next/link'

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
    </div>
  )
}
