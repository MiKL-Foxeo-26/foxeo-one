# Story 9.4: Changement de tier abonnement client One

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **changer le tier d'abonnement d'un client One (Base, Essentiel, Agentique) avec effet immédiat sur les capacités Elio**,
so that **je peux adapter l'offre à l'évolution des besoins du client**.

## Acceptance Criteria

**Given** MiKL consulte la fiche d'un client One (FR91)
**When** il accède à la section "Abonnement" de la fiche client
**Then** il voit :
- Le tier actuel du client (Base / Essentiel / Agentique) avec un badge coloré
- La date de début du tier actuel
- Le coût mensuel associé
- Un bouton "Modifier le tier"

**Given** MiKL clique sur "Modifier le tier"
**When** la modale de changement s'affiche
**Then** elle contient :
- Les 3 options de tier avec détail :
  | Tier | Prix | Elio | Description |
  |------|------|------|-------------|
  | Base | Ponctuel | Aucun | Maintenance 1 mois + docs techniques |
  | Essentiel | 49€/mois | One | Maintenance continue, mises à jour, Elio One assistant |
  | Agentique | 99€/mois | One+ | Maintenance continue, mises à jour, Elio One+ agentif |
- Le tier actuel est surligné et indiqué "(actuel)"
- Un avertissement si downgrade : "Attention : le passage de Agentique à Essentiel désactivera les fonctionnalités Elio One+ (actions, génération de documents, alertes proactives)."
- Boutons "Confirmer le changement" / "Annuler"

**Given** MiKL confirme le changement de tier
**When** la Server Action `changeClientTier(clientId, newTier)` s'exécute
**Then** les opérations suivantes sont effectuées :
1. `client_configs.elio_tier` → nouveau tier ('one' | 'one_plus' | null pour Base)
2. `client_configs.subscription_tier` → nouveau tier ('base' | 'essentiel' | 'agentique')
3. `client_configs.tier_changed_at` → NOW()
4. `activity_logs` → événement 'tier_changed' avec ancien et nouveau tier
5. Si upgrade vers One+ : les alertes proactives sont activées (config par défaut)
6. Si downgrade depuis One+ : les alertes proactives sont désactivées, les actions en cours sont préservées
**And** l'effet est immédiat : Elio adapte ses capacités dès la prochaine interaction
**And** un toast confirme "Tier modifié — {nom} est maintenant en {tier}"
**And** le cache TanStack Query est invalidé

**Given** le tier change impacte la facturation (intégration future Epic 11)
**When** la Server Action s'exécute
**Then** un champ `client_configs.pending_billing_update` → true est positionné pour signaler à l'Epic 11 (Facturation & Abonnements) qu'une mise à jour Stripe est nécessaire
**And** pour le MVP, la facturation est gérée manuellement par MiKL (pas de Stripe auto dans cet epic)

**Given** le client utilise Elio One après un changement de tier
**When** il tente une action One+ alors qu'il est en tier One
**Then** Elio One répond : "Cette fonctionnalité fait partie de l'offre Elio One+. Contactez MiKL pour en savoir plus !"
**And** le check de tier est effectué avant l'appel LLM (pas de tokens gaspillés)

## Tasks / Subtasks

- [ ] Créer section "Abonnement" dans fiche client (AC: #1)
  - [ ] Modifier `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Ajouter section "Abonnement" (visible uniquement si `client_type = 'one'`)
  - [ ] Afficher tier actuel avec badge coloré :
    - Base : badge gris (neutral)
    - Essentiel : badge vert (success)
    - Agentique : badge violet (premium)
  - [ ] Afficher date début tier : `client_configs.tier_changed_at` ou `clients.graduated_at`
  - [ ] Afficher coût mensuel : lookup table (Base: Ponctuel, Essentiel: 49€/mois, Agentique: 99€/mois)
  - [ ] Bouton "Modifier le tier"

- [ ] Créer modale de changement de tier (AC: #2)
  - [ ] Créer `packages/modules/crm/components/change-tier-dialog.tsx`
  - [ ] Utiliser Dialog component de @foxeo/ui (Radix UI)
  - [ ] RadioGroup avec 3 options : Base, Essentiel, Agentique
  - [ ] Chaque option affiche : nom tier, prix, capacité Elio, description
  - [ ] Tier actuel surligné + badge "(actuel)"
  - [ ] Si downgrade One+ → Essentiel ou Base : afficher Alert warning
  - [ ] Alert : "Attention : le passage de Agentique à {newTier} désactivera les fonctionnalités Elio One+ (actions, génération de documents, alertes proactives)."
  - [ ] Boutons "Confirmer le changement" (primary) / "Annuler"

- [ ] Créer Server Action `changeClientTier` (AC: #3, #4)
  - [ ] Créer `packages/modules/crm/actions/change-tier.ts`
  - [ ] Signature: `changeClientTier(clientId: string, newTier: SubscriptionTier): Promise<ActionResponse<void>>`
  - [ ] Validation Zod : clientId UUID, newTier enum ('base' | 'essentiel' | 'agentique')
  - [ ] Fetch client actuel avec `client_configs`
  - [ ] Si même tier : retourner error 'TIER_UNCHANGED'
  - [ ] Déterminer ancien tier pour logging
  - [ ] UPDATE `client_configs` :
    - `subscription_tier = {newTier}`
    - `elio_tier = {mapTierToElio(newTier)}` (Base→null, Essentiel→'one', Agentique→'one_plus')
    - `tier_changed_at = NOW()`
    - `pending_billing_update = true` (pour Epic 11)
  - [ ] Si upgrade vers One+ : activer alertes proactives par défaut
  - [ ] Si downgrade depuis One+ : désactiver alertes proactives, préserver actions
  - [ ] INSERT `activity_logs` : type 'tier_changed', metadata { oldTier, newTier, changedBy: operatorId }
  - [ ] Retourner format `{ data: null, error }` standard

- [ ] Créer helper `mapTierToElio` (AC: #3)
  - [ ] Créer `packages/modules/crm/utils/tier-helpers.ts`
  - [ ] `mapTierToElio(tier: SubscriptionTier): ElioTier | null`
  - [ ] Mapping : 'base' → null, 'essentiel' → 'one', 'agentique' → 'one_plus'

- [ ] Implémenter gestion alertes proactives (AC: #3)
  - [ ] Si upgrade vers One+ : `client_configs.elio_proactive_alerts = true`
  - [ ] Si downgrade depuis One+ : `client_configs.elio_proactive_alerts = false`
  - [ ] Actions Elio One+ en cours préservées (pas de suppression)

- [ ] Implémenter invalidation cache et notifications (AC: #3)
  - [ ] Invalider TanStack Query : `queryClient.invalidateQueries(['client', clientId])`
  - [ ] Invalider TanStack Query : `queryClient.invalidateQueries(['client-config', clientId])`
  - [ ] Toast success : "Tier modifié — {nom} est maintenant en {tier}"
  - [ ] Notification client optionnelle : "Votre abonnement a été mis à jour par MiKL"

- [ ] Implémenter check tier dans Elio One+ (AC: #5)
  - [ ] Modifier `packages/modules/elio/actions/execute-action.ts`
  - [ ] Avant exécution action One+ : vérifier `client_configs.elio_tier`
  - [ ] Si `elio_tier != 'one_plus'` : retourner error message
  - [ ] Message : "Cette fonctionnalité fait partie de l'offre Elio One+. Contactez MiKL pour en savoir plus !"
  - [ ] Ne pas consommer tokens LLM si check échoue

- [ ] Créer types TypeScript (AC: all)
  - [ ] Créer `packages/modules/crm/types/subscription.types.ts`
  - [ ] Type `SubscriptionTier = 'base' | 'essentiel' | 'agentique'`
  - [ ] Type `ElioTier = 'one' | 'one_plus' | null`
  - [ ] Type `TierInfo = { name: string; price: string; elio: string; description: string }`
  - [ ] Const `TIER_INFO: Record<SubscriptionTier, TierInfo>`

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `changeClientTier`: tier modifié + elio_tier mis à jour
  - [ ] Test `changeClientTier`: upgrade vers One+ → alertes activées
  - [ ] Test `changeClientTier`: downgrade depuis One+ → alertes désactivées
  - [ ] Test `changeClientTier`: même tier → error 'TIER_UNCHANGED'
  - [ ] Test `changeClientTier`: activity_log créé avec ancien et nouveau tier
  - [ ] Test `mapTierToElio`: mapping correct pour chaque tier
  - [ ] Test check Elio One+ : elio_tier != 'one_plus' → error message

- [ ] Créer test RLS
  - [ ] Test : opérateur A ne peut pas changer tier de client de opérateur B
  - [ ] Test : client ne peut pas changer son propre tier (fonction Hub only)

## Dev Notes

### Architecture Patterns
- **Pattern data fetching**: Server Action pour mutation (`changeClientTier`)
- **Pattern state**: TanStack Query pour cache client + config
- **Pattern validation**: Zod schema pour validation inputs
- **Pattern tier gating**: Check tier avant actions Elio One+ (pas de tokens gaspillés)
- **Pattern facturation**: Flag `pending_billing_update` pour Epic 11 (Stripe/Pennylane)

### Source Tree Components
```
packages/modules/crm/
├── components/
│   ├── client-info-tab.tsx           # MODIFIER: ajouter section "Abonnement"
│   ├── change-tier-dialog.tsx        # CRÉER: modale changement tier
│   └── change-tier-dialog.test.tsx
├── actions/
│   ├── change-tier.ts                # CRÉER: Server Action changement tier
│   └── change-tier.test.ts
├── utils/
│   ├── tier-helpers.ts               # CRÉER: mapTierToElio() + TIER_INFO const
│   └── tier-helpers.test.ts
└── types/
    └── subscription.types.ts         # CRÉER: types SubscriptionTier, ElioTier, TierInfo

packages/modules/elio/
└── actions/
    └── execute-action.ts             # MODIFIER: ajouter check tier One+ avant exécution
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Coverage**: >80% pour Server Actions critiques
- **RLS**: Test isolation opérateur (ne peut pas modifier tier d'un autre opérateur)
- **Tier gating**: Test Elio One+ refuse action si tier != 'one_plus'

### Project Structure Notes
- Alignement avec fiche client CRM (Story 2.3)
- Intégration Elio One+ (Story 8.9a — actions tiers)
- Préparation Epic 11 (facturation Stripe/Pennylane) via flag `pending_billing_update`
- Alertes proactives Elio One+ (Story 8.9c)

### Key Technical Decisions

**1. Tiers et capacités Elio**
- **Base (Ponctuel)** : Pas d'abonnement, maintenance 1 mois, pas d'Elio
- **Essentiel (49€/mois)** : Elio One (assistant FAQ, guidance dashboard)
- **Agentique (99€/mois)** : Elio One+ (actions, génération documents, alertes proactives)
- Mapping tier → elio_tier dans `client_configs` pour check rapide

**2. Effet immédiat**
- Changement tier commit immédiatement en DB
- Elio adapte capacités dès prochaine interaction (check `elio_tier` dans action)
- Pas de période de transition (changement instantané)
- Cache TanStack Query invalidé pour refresh UI

**3. Downgrade One+ → gestion features**
- Alertes proactives désactivées (`elio_proactive_alerts = false`)
- Actions Elio One+ en cours PRÉSERVÉES (pas de suppression)
- Client peut consulter historique actions mais ne peut plus en créer
- Message explicite si tentative action One+ avec tier One ou Base

**4. Facturation manuelle MVP**
- Flag `pending_billing_update = true` positionné lors du changement
- Epic 11 (Facturation & Abonnements) consommera ce flag pour sync Stripe/Pennylane
- Pour MVP : MiKL gère facturation manuellement (devis, factures Pennylane)
- Pas de webhook Stripe dans cette story

**5. Tier gating Elio**
- Check tier AVANT appel LLM (économie tokens)
- Message refus friendly : "Cette fonctionnalité fait partie de l'offre Elio One+. Contactez MiKL..."
- Pas d'erreur technique, juste information upsell
- Client peut continuer à utiliser Elio One (FAQ, guidance) en tier Essentiel

### Database Schema Changes

```sql
-- Migration: add subscription_tier and tier_changed_at to client_configs
ALTER TABLE client_configs
  ADD COLUMN subscription_tier TEXT CHECK (subscription_tier IN ('base', 'essentiel', 'agentique')) DEFAULT 'base',
  ADD COLUMN tier_changed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN pending_billing_update BOOLEAN DEFAULT false,
  ADD COLUMN elio_proactive_alerts BOOLEAN DEFAULT false;

-- Migration: add index on subscription_tier for analytics
CREATE INDEX idx_client_configs_subscription_tier ON client_configs(subscription_tier);

-- NOTE: elio_tier column already exists from Story 8.1 (Elio infrastructure)
-- Values: null (Base), 'one' (Essentiel), 'one_plus' (Agentique)
```

### UI/UX Considerations

**Badge colors par tier**
- Base : neutral (gris) — minimal
- Essentiel : success (vert) — standard
- Agentique : premium (violet/indigo) — advanced

**Modale changement tier**
- RadioGroup vertical pour meilleure lisibilité (3 options)
- Chaque option : Card avec hover effect
- Tier actuel : border accent + badge "(actuel)"
- Prix mis en avant (h2) + description en subtitle
- Downgrade warning : Alert component (destructive variant)

**Toast notifications**
- Success : "Tier modifié — {nom} est maintenant en {tier}"
- Error : "Erreur lors du changement de tier — {errorMessage}"

**Message refus Elio One+**
- Ton friendly, pas d'erreur technique
- CTA : "Contactez MiKL pour en savoir plus !"
- Link optionnel vers chat MiKL
- Affichage dans UI Elio (pas de toast error)

### Tier Information Constants

```typescript
// packages/modules/crm/utils/tier-helpers.ts
export const TIER_INFO: Record<SubscriptionTier, TierInfo> = {
  base: {
    name: 'Base',
    price: 'Ponctuel',
    elio: 'Aucun',
    description: 'Maintenance 1 mois + documentation technique',
  },
  essentiel: {
    name: 'Essentiel',
    price: '49€/mois',
    elio: 'Elio One',
    description: 'Maintenance continue, mises à jour, Elio One assistant',
  },
  agentique: {
    name: 'Agentique',
    price: '99€/mois',
    elio: 'Elio One+',
    description: 'Maintenance continue, mises à jour, Elio One+ agentif',
  },
}
```

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — API Response Format]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.4 Requirements]
- [Source: Story 2.3 — Fiche client CRM]
- [Source: Story 8.9a — Elio One+ actions (tier gating)]
- [Source: Story 8.9c — Elio One+ alertes proactives]
- [Source: Epic 11 — Facturation & Abonnements (pending_billing_update)]

### Dependencies
- **Bloquée par**: Story 2.3 (fiche client CRM), Story 8.1 (infrastructure Elio), Story 8.9a (Elio One+ actions)
- **Bloque**: Aucune
- **Référence**: Epic 11 (facturation Stripe/Pennylane — consommation flag pending_billing_update)

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
