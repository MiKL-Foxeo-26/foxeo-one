# Story 2.9a: Suspendre & réactiver un client

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **suspendre temporairement un client et le réactiver quand nécessaire**,
So that **je peux gérer les situations où un client doit être temporairement désactivé sans perdre ses données**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Colonne `suspended_at` (TIMESTAMPTZ nullable) ajoutée à la table `clients`. Les statuts possibles restent : `active`, `suspended`, `archived` (contrainte CHECK existante).

2. **AC2 — Suspendre un client** : Sur la fiche d'un client actif, bouton "Suspendre le client" (FR89). Dialog de confirmation avec : raison (optionnel), conséquences listées ("Le client ne pourra plus accéder à son dashboard"). Si confirmé, Server Action `suspendClient()` met status à `suspended` et `suspended_at` à NOW(). Le middleware client bloque l'accès au dashboard. Toast "Client suspendu". Entrée `activity_logs` (action: `client_suspended`). Invalidation cache TanStack Query.

3. **AC3 — Réactiver un client** : Sur la fiche d'un client suspendu, bouton "Réactiver le client". Server Action `reactivateClient()` repasse status à `active`, clear `suspended_at`. Le client retrouve l'accès avec données intactes. Entrée `activity_logs` (action: `client_reactivated`). Invalidation cache.

4. **AC4 — Indicateurs visuels** : Badge "Suspendu" sur la fiche client et dans la liste. Couleur distincte (ex: orange/ambre). Date de suspension visible.

5. **AC5 — Tests** : Tests unitaires co-localisés. Tests middleware blocking. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00020_client_lifecycle_columns.sql`
  - [ ] 1.2 `ALTER TABLE clients ADD COLUMN suspended_at TIMESTAMPTZ`
  - [ ] 1.3 `ALTER TABLE clients ADD COLUMN archived_at TIMESTAMPTZ` (préparation Story 2.9b)

- [ ] Task 2 — Types TypeScript (AC: #2, #3)
  - [ ] 2.1 Types : `SuspendClientInput` (clientId, reason?), `ReactivateClientInput` (clientId)
  - [ ] 2.2 Schémas Zod
  - [ ] 2.3 Étendre `Client` avec `suspendedAt`, `archivedAt`

- [ ] Task 3 — Server Actions (AC: #2, #3)
  - [ ] 3.1 `actions/suspend-client.ts` — Set status='suspended', suspended_at=NOW(), log activity
  - [ ] 3.2 `actions/reactivate-client.ts` — Set status='active', suspended_at=NULL, log activity
  - [ ] 3.3 Logging dans `activity_logs` avec metadata (raison, opérateur)

- [ ] Task 4 — Composants UI (AC: #2, #3, #4)
  - [ ] 4.1 `components/suspend-client-dialog.tsx` — Dialog confirmation avec raison optionnelle + liste conséquences
  - [ ] 4.2 `components/client-status-badge.tsx` — Badge statut avec couleurs (actif=vert, suspendu=ambre, archivé=gris)
  - [ ] 4.3 Bouton contextuel sur la fiche client : "Suspendre" si actif, "Réactiver" si suspendu

- [ ] Task 5 — Middleware client (AC: #2)
  - [ ] 5.1 Vérifier dans `apps/client/middleware.ts` que le statut client est vérifié
  - [ ] 5.2 Si status='suspended' → rediriger vers une page `/suspended` avec message explicatif
  - [ ] 5.3 Page `/suspended` : "Votre accès a été temporairement suspendu. Contactez votre opérateur."

- [ ] Task 6 — Intégration (AC: #4)
  - [ ] 6.1 Ajouter ClientStatusBadge dans le header de la fiche client
  - [ ] 6.2 Ajouter colonne/badge statut dans la liste clients (si pas déjà présent)
  - [ ] 6.3 Actions contextuelles : suspendre si actif, réactiver si suspendu

- [ ] Task 7 — Tests (AC: #5)
  - [ ] 7.1 Tests Server Actions : suspend, reactivate, activity logging
  - [ ] 7.2 Tests composants : SuspendClientDialog, ClientStatusBadge
  - [ ] 7.3 Tests middleware : redirect si suspendu
  - [ ] 7.4 Tests edge cases : double suspension, réactivation d'un non-suspendu

- [ ] Task 8 — Documentation (AC: #5)
  - [ ] 8.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **Data fetching** : Server Actions pour mutations. Server Component pour page.
- **State** : TanStack Query pour données client. Invalidation après chaque action.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging activity** : Format `[CRM:SUSPEND_CLIENT]`, `[CRM:REACTIVATE_CLIENT]`

### Base de données

**Table `clients` existante** — Statuts CHECK : `active`, `suspended`, `archived`.

**Migration `00020`** — Ajout colonnes lifecycle :
```sql
ALTER TABLE clients ADD COLUMN suspended_at TIMESTAMPTZ;
ALTER TABLE clients ADD COLUMN archived_at TIMESTAMPTZ;

COMMENT ON COLUMN clients.suspended_at IS 'Date de dernière suspension du client';
COMMENT ON COLUMN clients.archived_at IS 'Date de clôture/archivage du client';
```

**Note** : On ajoute `archived_at` maintenant pour éviter une migration séparée en 2.9b.

### Activity logging

Utiliser la table `activity_logs` existante :
```typescript
await supabase.from('activity_logs').insert({
  actor_type: 'operator',
  actor_id: user.id,
  action: 'client_suspended', // ou 'client_reactivated'
  entity_type: 'client',
  entity_id: clientId,
  metadata: { reason: input.reason }
})
```

### Middleware client — Vérification statut

Le middleware `apps/client/middleware.ts` doit vérifier le statut du client lors de chaque requête authentifiée :
```typescript
// Dans le middleware existant, après vérification auth
const { data: client } = await supabase
  .from('clients')
  .select('status')
  .eq('auth_user_id', user.id)
  .single()

if (client?.status === 'suspended') {
  return NextResponse.redirect(new URL('/suspended', request.url))
}
```

**ATTENTION** : Vérifier le middleware existant avant de modifier. Ne pas casser la logique d'auth en place.

### Composants shadcn/ui

- `<AlertDialog>` pour confirmation suspension (action destructive)
- `<Badge>` pour statut (variant contextuel)
- `<Textarea>` pour raison optionnelle
- Toast via système existant

### Fichiers à créer

- `supabase/migrations/00020_client_lifecycle_columns.sql`
- `packages/modules/crm/actions/suspend-client.ts`
- `packages/modules/crm/actions/reactivate-client.ts`
- `packages/modules/crm/components/suspend-client-dialog.tsx`
- `packages/modules/crm/components/client-status-badge.tsx`
- `apps/client/app/suspended/page.tsx` (page suspendu)
- Tests co-localisés

### Fichiers à modifier

- `packages/modules/crm/types/crm.types.ts` (étendre Client)
- `packages/modules/crm/index.ts` (exports)
- `apps/client/middleware.ts` (vérification statut)
- `packages/modules/crm/docs/guide.md`, `faq.md`, `flows.md`

### Dépendances

- Table `activity_logs` existante (migration 00005)
- Table `clients` existante (migration 00002)
- Middleware client existant

### Anti-patterns — Interdit

- NE PAS supprimer les données lors de la suspension (juste changer le statut)
- NE PAS permettre la suspension d'un client déjà suspendu (vérifier statut avant)
- NE PAS throw dans les Server Actions
- NE PAS bloquer côté UI uniquement (le middleware DOIT bloquer aussi)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.9a]
- [Source: supabase/migrations/00002_create_clients.sql]
- [Source: apps/client/middleware.ts]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
