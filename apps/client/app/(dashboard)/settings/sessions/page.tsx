import { getActiveSessionsAction } from './actions'
import { SessionList } from './session-list'

export default async function SessionsPage() {
  const { data: sessions, error } = await getActiveSessionsAction()

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Sessions actives</h2>
        <p className="text-sm text-muted-foreground">
          Vos connexions sur différents appareils. Vous pouvez révoquer une session pour déconnecter un appareil.
        </p>
      </div>
      <SessionList sessions={sessions ?? []} />
    </div>
  )
}
