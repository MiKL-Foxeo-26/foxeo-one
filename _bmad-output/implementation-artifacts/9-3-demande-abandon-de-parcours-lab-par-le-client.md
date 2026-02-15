# Story 9.3: Demande d'abandon de parcours Lab par le client

Status: ready-for-dev

## Story

As a **client Lab**,
I want **pouvoir demander à abandonner mon parcours si je ne souhaite plus continuer**,
so that **je peux sortir du parcours proprement sans que mes données soient perdues**.

## Acceptance Criteria

**Given** un client Lab est en cours de parcours (FR88)
**When** il souhaite abandonner
**Then** un bouton "Quitter le parcours" est accessible depuis :
- La page "Mon Parcours" (parcours-progress) — en bas de page, discret
- Les paramètres du compte — section "Mon parcours Lab"
**And** le bouton n'est visible que si le parcours est en statut 'in_progress' ou 'not_started'

**Given** le client clique sur "Quitter le parcours"
**When** la modale de confirmation s'affiche
**Then** elle contient :
- Message d'avertissement : "Êtes-vous sûr de vouloir quitter votre parcours Lab ?"
- Récapitulatif de la progression actuelle : "{X}/{Y} étapes complétées"
- Champ raison d'abandon (optionnel, textarea) avec des suggestions :
  - "Je n'ai plus le temps en ce moment"
  - "Le parcours ne correspond pas à mes attentes"
  - "J'ai trouvé une autre solution"
  - "Autre raison..."
- Mention rassurante : "Vos données et documents seront conservés. MiKL vous contactera pour en discuter."
- Boutons "Confirmer l'abandon" (rouge) / "Continuer mon parcours" (vert, mis en avant)

**Given** le client confirme l'abandon
**When** la Server Action `requestParcoursAbandonment(clientId, reason)` s'exécute
**Then** les opérations suivantes sont effectuées :
1. `parcours.status` → 'abandoned'
2. `parcours.completed_at` → NOW() (date de fin)
3. `activity_logs` → événement 'parcours_abandoned' avec la raison
4. Une notification est envoyée à MiKL (type : 'alert', priorité haute) :
   - Titre : "Le client {nom} souhaite abandonner son parcours Lab"
   - Body : "Raison : {raison}. Progression : {X}/{Y} étapes. Contactez-le pour en discuter."
   - Link : "/modules/crm/clients/{clientId}"
5. Les données du client sont PRÉSERVÉES intégralement (pas d'archivage ni suppression)
**And** un toast confirme au client : "Votre demande a été envoyée à MiKL. Il vous contactera prochainement."
**And** le cache TanStack Query est invalidé

**Given** le parcours est abandonné
**When** le client se reconnecte
**Then** :
- La page parcours affiche : "Votre parcours est en pause. MiKL va vous contacter pour en discuter."
- Elio Lab est désactivé (le chat affiche : "Votre parcours est en pause. Contactez MiKL si vous souhaitez reprendre.")
- Les documents et briefs restent accessibles en lecture
- Le chat avec MiKL reste actif

**Given** MiKL veut réactiver un parcours abandonné
**When** il accède à la fiche client et clique "Réactiver le parcours"
**Then** `parcours.status` → 'in_progress', `parcours.completed_at` → null
**And** Elio Lab est réactivé
**And** le client est notifié : "Bonne nouvelle ! Votre parcours Lab a été réactivé par MiKL."

## Tasks / Subtasks

- [ ] Créer bouton "Quitter le parcours" dans page parcours (AC: #1)
  - [ ] Modifier `packages/modules/parcours-lab/components/parcours-progress.tsx`
  - [ ] Ajouter bouton en bas de page, style discret (variant "ghost" ou "outline")
  - [ ] Afficher uniquement si `parcours.status IN ('in_progress', 'not_started')`
  - [ ] Cacher si `parcours.status = 'completed'` ou 'abandoned'
  - [ ] Au clic, ouvrir `AbandonParcoursDialog`

- [ ] Créer bouton dans paramètres compte (AC: #1)
  - [ ] Modifier `apps/client/app/(dashboard)/settings/page.tsx` (ou créer si n'existe pas)
  - [ ] Section "Mon parcours Lab" avec statut actuel + bouton "Quitter le parcours"
  - [ ] Même logique : visible uniquement si status in_progress ou not_started

- [ ] Créer modale de confirmation abandon (AC: #2)
  - [ ] Créer `packages/modules/parcours-lab/components/abandon-parcours-dialog.tsx`
  - [ ] Utiliser Dialog component de @foxeo/ui (Radix UI)
  - [ ] Header : "Êtes-vous sûr de vouloir quitter votre parcours Lab ?"
  - [ ] Afficher progression : "{stepsCompleted}/{totalSteps} étapes complétées"
  - [ ] Champ raison : Textarea avec suggestions (Select ou RadioGroup + "Autre" avec textarea)
  - [ ] Suggestions :
    - "Je n'ai plus le temps en ce moment"
    - "Le parcours ne correspond pas à mes attentes"
    - "J'ai trouvé une autre solution"
    - "Autre raison..." (déclenche textarea libre)
  - [ ] Mention rassurante : "Vos données et documents seront conservés. MiKL vous contactera pour en discuter."
  - [ ] Boutons : "Confirmer l'abandon" (destructive, rouge) / "Continuer mon parcours" (default, vert)
  - [ ] Validation : raison optionnelle mais encouragée

- [ ] Créer Server Action `requestParcoursAbandonment` (AC: #3)
  - [ ] Créer `packages/modules/parcours-lab/actions/request-abandonment.ts`
  - [ ] Signature: `requestParcoursAbandonment(clientId: string, reason?: string): Promise<ActionResponse<void>>`
  - [ ] Validation Zod : clientId UUID, reason optionnel (max 1000 chars)
  - [ ] Vérifier que parcours existe et status IN ('in_progress', 'not_started')
  - [ ] Si déjà abandonné ou completed : retourner error 'PARCOURS_ALREADY_COMPLETED'
  - [ ] UPDATE `parcours` SET `status = 'abandoned'`, `completed_at = NOW()`, `abandonment_reason = {reason}`
  - [ ] INSERT `activity_logs` : type 'parcours_abandoned', metadata { reason, progression: {X}/{Y} }
  - [ ] Retourner format `{ data: null, error }` standard

- [ ] Créer notification MiKL pour abandon (AC: #3)
  - [ ] Créer helper `notifyOperatorParcoursAbandonment(clientId, reason)` dans `packages/modules/notifications/actions/notify-operator.ts`
  - [ ] Fetch client info + operator_id
  - [ ] Créer notification type 'alert' avec priorité haute
  - [ ] Titre : "Le client {nom} souhaite abandonner son parcours Lab"
  - [ ] Body : "Raison : {raison}. Progression : {X}/{Y} étapes. Contactez-le pour en discuter."
  - [ ] Link : `/modules/crm/clients/{clientId}`
  - [ ] Envoyer via Realtime channel `operator:notifications:{operatorId}`
  - [ ] Invalider cache TanStack Query `['notifications', operatorId]`

- [ ] Implémenter invalidation cache client (AC: #3)
  - [ ] Après succès action : invalider `queryClient.invalidateQueries(['parcours', clientId])`
  - [ ] Toast success : "Votre demande a été envoyée à MiKL. Il vous contactera prochainement."

- [ ] Implémenter affichage parcours abandonné (AC: #4)
  - [ ] Modifier `packages/modules/parcours-lab/components/parcours-progress.tsx`
  - [ ] Si `parcours.status = 'abandoned'` : afficher état pause
  - [ ] Message : "Votre parcours est en pause. MiKL va vous contacter pour en discuter."
  - [ ] Désactiver navigation entre étapes (lecture seule)
  - [ ] Cacher bouton "Soumettre brief"

- [ ] Désactiver Elio Lab pour parcours abandonné (AC: #4)
  - [ ] Modifier `packages/modules/elio/components/elio-chat.tsx`
  - [ ] Vérifier `parcours.status` avant d'afficher input
  - [ ] Si status = 'abandoned' : désactiver input + afficher message
  - [ ] Message : "Votre parcours est en pause. Contactez MiKL si vous souhaitez reprendre."
  - [ ] Chat MiKL reste actif (module chat séparé, pas impacté)

- [ ] Créer action réactivation parcours (MiKL side) (AC: #5)
  - [ ] Créer `packages/modules/parcours-lab/actions/reactivate-parcours.ts`
  - [ ] Signature: `reactivateParcours(clientId: string): Promise<ActionResponse<void>>`
  - [ ] Vérifier que parcours status = 'abandoned'
  - [ ] UPDATE `parcours` SET `status = 'in_progress'`, `completed_at = null`
  - [ ] INSERT `activity_logs` : type 'parcours_reactivated'
  - [ ] Créer notification client : "Bonne nouvelle ! Votre parcours Lab a été réactivé par MiKL."
  - [ ] Invalider cache `['parcours', clientId]`
  - [ ] Retourner format `{ data, error }` standard

- [ ] Créer UI réactivation dans fiche client Hub (AC: #5)
  - [ ] Modifier `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Section "Parcours Lab" : si status = 'abandoned', afficher badge "Abandonné" + bouton "Réactiver le parcours"
  - [ ] Au clic : confirmation dialog "Réactiver le parcours de {nom} ?"
  - [ ] Appeler `reactivateParcours(clientId)`
  - [ ] Toast success : "Parcours réactivé — {nom} a été notifié"

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `requestParcoursAbandonment`: parcours in_progress → status abandoned + completed_at
  - [ ] Test `requestParcoursAbandonment`: parcours already completed → error 'PARCOURS_ALREADY_COMPLETED'
  - [ ] Test `requestParcoursAbandonment`: notification MiKL créée avec raison
  - [ ] Test `reactivateParcours`: parcours abandoned → status in_progress + completed_at null
  - [ ] Test `reactivateParcours`: notification client envoyée
  - [ ] Test composant `AbandonParcoursDialog`: raison optionnelle acceptée
  - [ ] Test composant `ParcoursProgress`: status abandoned → message pause affiché

- [ ] Créer test RLS
  - [ ] Test : client A ne peut pas abandonner parcours de client B
  - [ ] Test : seul opérateur owner peut réactiver parcours

## Dev Notes

### Architecture Patterns
- **Pattern data fetching**: Server Action pour mutation (`requestParcoursAbandonment`, `reactivateParcours`)
- **Pattern state**: TanStack Query pour cache parcours
- **Pattern notifications**: Notification MiKL type 'alert' priorité haute
- **Pattern UI**: Dialog confirmation avec mention rassurante (UX empathique)
- **Pattern lecture seule**: Désactiver Elio Lab mais préserver accès documents et chat MiKL

### Source Tree Components
```
packages/modules/parcours-lab/
├── components/
│   ├── parcours-progress.tsx         # MODIFIER: ajouter bouton abandon + état pause
│   ├── parcours-progress.test.tsx
│   ├── abandon-parcours-dialog.tsx   # CRÉER: modale confirmation abandon
│   └── abandon-parcours-dialog.test.tsx
├── actions/
│   ├── request-abandonment.ts        # CRÉER: Server Action abandon
│   ├── request-abandonment.test.ts
│   ├── reactivate-parcours.ts        # CRÉER: Server Action réactivation (MiKL)
│   └── reactivate-parcours.test.ts

packages/modules/crm/
└── components/
    └── client-info-tab.tsx           # MODIFIER: ajouter bouton réactivation parcours

packages/modules/elio/
└── components/
    └── elio-chat.tsx                 # MODIFIER: désactiver input si parcours abandonné

packages/modules/notifications/
└── actions/
    └── notify-operator.ts            # MODIFIER: ajouter notifyOperatorParcoursAbandonment()

apps/client/app/(dashboard)/
└── settings/
    └── page.tsx                      # CRÉER ou MODIFIER: section "Mon parcours Lab"
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Coverage**: >80% pour actions abandon/réactivation
- **RLS**: Test isolation client (ne peut pas abandonner parcours d'un autre)
- **UX**: Test affichage message pause + désactivation Elio

### Project Structure Notes
- Alignement avec module parcours-lab (Story 6.1)
- Utilisation module notifications existant (Story 3.2)
- Fiche client CRM (Story 2.3) — ajouter bouton réactivation
- Elio Lab (Story 6.4) — désactiver si parcours abandonné

### Key Technical Decisions

**1. Statut parcours 'abandoned'**
- Nouveau statut dans enum `parcours_status` : 'not_started' | 'in_progress' | 'completed' | 'abandoned'
- `completed_at` positionné à NOW() lors de l'abandon (date de fin du parcours)
- Champ `abandonment_reason` (TEXT, optionnel) pour stocker raison client
- Données client PRÉSERVÉES (pas d'archivage ni suppression)

**2. Notification MiKL priorité haute**
- Type 'alert' pour attirer attention opérateur
- Priorité haute (affichée en premier dans liste notifications)
- Lien direct vers fiche client pour action rapide
- Metadata : raison + progression (X/Y étapes)

**3. UX empathique**
- Message rassurant : "Vos données seront conservées"
- Bouton "Continuer mon parcours" mis en avant (variant primary, vert)
- Bouton "Confirmer l'abandon" discret (variant destructive, rouge)
- Raison d'abandon optionnelle mais encouragée (suggestions pré-remplies)

**4. État pause vs archivage**
- Parcours abandonné = "en pause" (peut être réactivé)
- Différent de client archivé (Story 9.5c — suppression/anonymisation)
- Elio Lab désactivé mais chat MiKL actif
- Documents et briefs accessibles en lecture

**5. Réactivation par MiKL**
- Seul opérateur owner peut réactiver (RLS check)
- Réactivation instantanée (pas de confirmation client nécessaire)
- Notification client automatique
- Elio Lab réactivé immédiatement (check status dans composant)

### Database Schema Changes

```sql
-- Migration: update parcours_status enum to include 'abandoned'
ALTER TYPE parcours_status ADD VALUE IF NOT EXISTS 'abandoned';

-- Migration: add abandonment_reason column to parcours table
ALTER TABLE parcours
  ADD COLUMN abandonment_reason TEXT;

-- Migration: add index on parcours status for filtering
CREATE INDEX IF NOT EXISTS idx_parcours_status ON parcours(status);

-- NOTE: completed_at column already exists (Story 6.1)
-- Will be set to NOW() when status changes to 'abandoned'
```

### UI/UX Considerations

**Bouton "Quitter le parcours"**
- Placement discret en bas de page parcours (pas mis en avant)
- Style outline ou ghost (pas primary)
- Icon : XCircle ou LogOut
- Visible uniquement si status in_progress ou not_started

**Modale de confirmation**
- Largeur max-w-lg (confortable pour lecture)
- Header avec icon alert (AlertCircle)
- Suggestions raisons en RadioGroup pour faciliter sélection
- "Autre raison" ouvre textarea libre
- Boutons inversés (destructif à gauche, safe à droite) pour pattern confirmation

**État pause parcours**
- Message empathique : "en pause" plutôt que "abandonné"
- Icon Pause au lieu de X
- Couleur warning (orange) plutôt que destructive (rouge)
- CTA : "Contactez MiKL si vous souhaitez reprendre"

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — API Response Format, Notifications]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.3 Requirements]
- [Source: Story 6.1 — Module parcours Lab structure]
- [Source: Story 3.2 — Module notifications]
- [Source: Story 2.3 — Fiche client CRM]

### Dependencies
- **Bloquée par**: Story 6.1 (module parcours Lab), Story 3.2 (notifications), Story 2.3 (fiche client)
- **Bloque**: Aucune

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
