'use client'

import { ValidationHubWidget } from '@foxeo/modules-validation-hub'
import { usePresenceContext } from '@foxeo/modules-chat'

export default function HubHomePage() {
  const { operatorId } = usePresenceContext()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenue sur Foxeo Hub</h1>
        <p className="text-muted-foreground">
          Cockpit operateur — gestion clients, validation hub, communications.
        </p>
      </div>

      {/* AC5: Actions prioritaires — widget Validation Hub */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Actions prioritaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ValidationHubWidget operatorId={operatorId} />
        </div>
      </section>
    </div>
  )
}
