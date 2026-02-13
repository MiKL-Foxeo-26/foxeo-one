# Story 8.9a: Élio One+ — Système de tiers & actions modules

Status: ready-for-dev

## Story

As a **client One+**,
I want **qu'Élio One exécute des actions sur mes modules actifs après vérification de mon tier d'abonnement**,
So that **Élio est un véritable co-pilote qui agit sur mes outils à ma demande**.

## Acceptance Criteria

### AC1 : Système de tiers Élio (One vs One+)

**Given** le système de tiers Élio (One vs One+)
**When** un client One utilise Élio
**Then** le tier est déterminé par `client_configs.elio_tier` (valeurs : `'one'` | `'one_plus'`, défaut : `'one'`)

**And** le system prompt de `send-to-elio.ts` adapte les capacités :
- **One** : FAQ, guidance, collecte d'évolutions uniquement
- **One+** : tout One + actions, génération, alertes

**And** si un client One tente une action One+, Élio répond :
> "Cette fonctionnalité fait partie de l'offre Élio One+. Contactez MiKL pour en savoir plus !"

**And** le check de tier est effectué AVANT l'appel LLM (pas de gaspillage de tokens)

### AC2 : Actions sur modules actifs (FR48)

**Given** un client One+ demande une action sur un module actif
**When** il écrit :
- "Envoie un rappel de cotisation aux membres en retard"
- "Crée un événement pour samedi prochain"

**Then** Élio One+ :

1. Identifie le module cible (adhésions, événements, etc.) et l'action demandée
2. Vérifie que le module est actif pour ce client
3. **Demande TOUJOURS confirmation avant exécution** :

```
Je vais envoyer un rappel de cotisation à 12 membres en retard de paiement.

Voici la liste :
- Dupont Marie (3 mois de retard)
- Martin Jean (1 mois de retard)
[...]

Vous confirmez l'envoi ? (Oui / Non / Modifier)
```

4. Sur confirmation, exécute l'action via la Server Action du module concerné
5. Confirme l'exécution :
> "C'est fait ! 12 rappels envoyés. Vous serez notifié des réponses."

**And** l'action est logguée dans `activity_logs` avec l'acteur `'elio_one_plus'`
**And** les actions destructives (suppression, envoi masse) nécessitent une double confirmation
**And** si l'action échoue, un message d'erreur clair est affiché avec option de réessayer

### AC3 : Vérification module actif

**Given** un client One+ demande une action
**When** Élio vérifie le module concerné
**Then** :

- Si le module est actif : procéder à l'action
- Si le module n'est pas actif : répondre
> "Le module {nom} n'est pas activé pour vous. Voulez-vous que je demande à MiKL de l'activer ?"

## Tasks / Subtasks

- [ ] **Task 1** : Ajouter `elio_tier` dans `client_configs` (AC: #1)
  - [ ] 1.1 : Migration Supabase pour ajouter `elio_tier` (valeurs : 'one' | 'one_plus', défaut : 'one')
  - [ ] 1.2 : Modifier le type `ClientConfig`

- [ ] **Task 2** : Créer le check de tier dans `send-to-elio.ts` (AC: #1)
  - [ ] 2.1 : Charger `client_configs.elio_tier`
  - [ ] 2.2 : Adapter le system prompt selon le tier (One vs One+)
  - [ ] 2.3 : Bloquer les actions One+ si tier = 'one'
  - [ ] 2.4 : Message upsell si action One+ tentée

- [ ] **Task 3** : Créer la détection intention "action module" (AC: #2, FR48)
  - [ ] 3.1 : Modifier `utils/detect-intent.ts`
  - [ ] 3.2 : Patterns : "envoie", "crée", "supprime", "modifie", verbes d'action
  - [ ] 3.3 : Extraire : module cible, action, paramètres

- [ ] **Task 4** : Créer le système de confirmation (AC: #2)
  - [ ] 4.1 : Créer `components/action-confirmation.tsx`
  - [ ] 4.2 : Afficher détails de l'action (liste entités concernées)
  - [ ] 4.3 : Boutons : Oui / Non / Modifier
  - [ ] 4.4 : Double confirmation pour actions destructives

- [ ] **Task 5** : Créer les Server Actions par module (AC: #2)
  - [ ] 5.1 : `actions/elio-actions/send-reminders.ts` (module adhésions)
  - [ ] 5.2 : `actions/elio-actions/create-event.ts` (module agenda)
  - [ ] 5.3 : `actions/elio-actions/send-sms.ts` (module SMS)
  - [ ] 5.4 : Pattern générique : vérifier module actif, exécuter, logger

- [ ] **Task 6** : Logger les actions dans `activity_logs` (AC: #2)
  - [ ] 6.1 : Créer l'entrée avec `actor='elio_one_plus'`
  - [ ] 6.2 : Stocker : action, module, entités concernées, résultat

- [ ] **Task 7** : Vérifier module actif (AC: #3)
  - [ ] 7.1 : Créer `utils/check-module-active.ts`
  - [ ] 7.2 : Charger `client_configs.active_modules`
  - [ ] 7.3 : Vérifier si le module est dans la liste
  - [ ] 7.4 : Message si module non actif

- [ ] **Task 8** : Gestion des erreurs d'exécution (AC: #2)
  - [ ] 8.1 : Try/catch autour de l'exécution
  - [ ] 8.2 : Message d'erreur clair + option réessayer
  - [ ] 8.3 : Logger l'erreur dans `activity_logs`

- [ ] **Task 9** : Tests
  - [ ] 9.1 : Tester check tier (One bloqué, One+ autorisé)
  - [ ] 9.2 : Tester détection intention action
  - [ ] 9.3 : Tester confirmation (accepter, refuser, modifier)
  - [ ] 9.4 : Tester exécution action (succès, échec)
  - [ ] 9.5 : Tester module non actif

## Dev Notes

### Migration elio_tier

```sql
-- Ajouter elio_tier dans client_configs
ALTER TABLE client_configs
ADD COLUMN elio_tier TEXT DEFAULT 'one' CHECK (elio_tier IN ('one', 'one_plus'));

CREATE INDEX idx_client_configs_elio_tier ON client_configs(elio_tier);
```

### Check tier dans system prompt

```typescript
// config/system-prompts.ts
export function buildOneSystemPrompt(
  config: ElioConfig,
  clientId: string,
  elioTier: 'one' | 'one_plus'
): string {
  const basePrompt = buildBasePrompt(config)

  const capabilitiesPrompt =
    elioTier === 'one'
      ? `
**Tes capacités (Élio One)** :
- Répondre aux questions (FAQ)
- Guider dans le dashboard
- Collecter des demandes d'évolutions

**Ce que tu NE PEUX PAS faire** :
- Exécuter des actions sur les modules
- Générer des documents
- Envoyer des alertes proactives

Si on te demande une action, réponds : "Cette fonctionnalité fait partie de l'offre Élio One+. Contactez MiKL pour en savoir plus !"
`
      : `
**Tes capacités (Élio One+)** :
- Répondre aux questions (FAQ)
- Guider dans le dashboard
- Collecter des demandes d'évolutions
- **Exécuter des actions** sur les modules actifs
- **Générer des documents**
- **Envoyer des alertes proactives**

**Important pour les actions** :
- Toujours demander confirmation avant d'exécuter
- Afficher les détails (liste des entités concernées)
- Double confirmation pour les actions destructives
`

  return basePrompt + capabilitiesPrompt + navigationMap + modulesDoc
}
```

### Détection intention action

```typescript
// utils/detect-intent.ts
export interface ActionIntent {
  action: 'module_action'
  module: string
  verb: 'send' | 'create' | 'update' | 'delete'
  target: string
  params?: Record<string, unknown>
}

export function detectModuleAction(message: string): ActionIntent | null {
  const lowerMessage = message.toLowerCase()

  // Patterns actions
  const sendPattern = /envoie?(?:r)?\s+(?:un\s+)?(.+?)\s+(?:à|aux)\s+(.+)/
  const createPattern = /crée?(?:r)?\s+(?:un\s+)?(.+?)\s+(?:pour|le|la)\s+(.+)/
  const deletePattern = /supprime?(?:r)?\s+(?:le|la|les)\s+(.+)/

  // Envoie un rappel aux membres
  const sendMatch = lowerMessage.match(sendPattern)
  if (sendMatch) {
    return {
      action: 'module_action',
      module: inferModule(sendMatch[1]),
      verb: 'send',
      target: sendMatch[2],
      params: { type: sendMatch[1] },
    }
  }

  // Crée un événement pour samedi
  const createMatch = lowerMessage.match(createPattern)
  if (createMatch) {
    return {
      action: 'module_action',
      module: inferModule(createMatch[1]),
      verb: 'create',
      target: createMatch[2],
      params: { type: createMatch[1] },
    }
  }

  return null
}

function inferModule(target: string): string {
  const moduleMap: Record<string, string> = {
    rappel: 'adhesions',
    cotisation: 'adhesions',
    événement: 'agenda',
    réservation: 'agenda',
    sms: 'sms',
    message: 'sms',
    facture: 'facturation',
    devis: 'facturation',
  }

  for (const [key, module] of Object.entries(moduleMap)) {
    if (target.includes(key)) return module
  }

  return 'unknown'
}
```

### Server Action exemple

```typescript
// actions/elio-actions/send-reminders.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'

export async function sendReminders(
  clientId: string,
  memberIds: string[]
): Promise<ActionResponse<{ sent: number }>> {
  const supabase = createServerClient()

  // 1. Vérifier module actif
  const { data: config } = await supabase
    .from('client_configs')
    .select('active_modules')
    .eq('client_id', clientId)
    .single()

  if (!config?.active_modules?.includes('adhesions')) {
    return {
      data: null,
      error: {
        message: 'Le module Adhésions n\'est pas activé',
        code: 'MODULE_NOT_ACTIVE',
      },
    }
  }

  // 2. Exécuter l'action (envoi rappels)
  let sent = 0
  for (const memberId of memberIds) {
    // Logique envoi email/SMS rappel
    // ...
    sent++
  }

  // 3. Logger l'action
  await supabase.from('activity_logs').insert({
    client_id: clientId,
    actor: 'elio_one_plus',
    action: 'send_reminders',
    details: { memberIds, sent },
  })

  return { data: { sent }, error: null }
}
```

### Composant confirmation

```typescript
// components/action-confirmation.tsx
'use client'

import { Button } from '@foxeo/ui'

interface ActionConfirmationProps {
  action: string
  details: string[]
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ActionConfirmation({
  action,
  details,
  isDestructive,
  onConfirm,
  onCancel,
}: ActionConfirmationProps) {
  const [doubleConfirm, setDoubleConfirm] = useState(false)

  return (
    <div className="border-2 border-yellow-500/20 rounded-lg p-4 my-4 bg-yellow-500/5">
      <h4 className="font-medium mb-2">Confirmation requise</h4>
      <p className="mb-3">{action}</p>

      <div className="bg-card rounded p-3 mb-3 max-h-40 overflow-y-auto">
        <ul className="text-sm space-y-1">
          {details.map((detail, i) => (
            <li key={i}>- {detail}</li>
          ))}
        </ul>
      </div>

      {isDestructive && !doubleConfirm ? (
        <div>
          <p className="text-sm text-red-500 mb-2">
            ⚠️ Cette action est irréversible. Êtes-vous sûr ?
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => setDoubleConfirm(true)}>
              Je confirme
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={onConfirm}>Confirmer</Button>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  )
}
```

### References

- [Source: Epic 8 — Story 8.9a](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-89a)
- [Source: PRD — FR48](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.7
**FRs couvertes** : FR48 (actions modules One+)
