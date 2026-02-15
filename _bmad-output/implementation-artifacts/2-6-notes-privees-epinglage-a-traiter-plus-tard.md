# Story 2.6: Notes privées, épinglage & "à traiter plus tard"

Status: review

## Story

As a **MiKL (opérateur)**,
I want **ajouter des notes privées sur un client, épingler des clients prioritaires et marquer des éléments à traiter plus tard**,
So that **j'organise mon travail quotidien et conserve mes observations sans que le client les voie**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `client_notes` créée avec : id (UUID PK), client_id (FK clients), operator_id (FK operators), content (TEXT NOT NULL), created_at, updated_at. Colonnes `is_pinned` (BOOLEAN DEFAULT false) et `deferred_until` (TIMESTAMP nullable) ajoutées à la table `clients`. Trigger `trg_client_notes_updated_at`. RLS policies : `client_notes_select_operator`, `client_notes_insert_operator`, `client_notes_update_operator`, `client_notes_delete_operator`.

2. **AC2 — Liste notes privées** : Sur la fiche client (onglet Informations), section "Notes privées" affiche la liste ordonnée de la plus récente à la plus ancienne (FR79). Chaque note : contenu + date création. Badge "Privé" clairement visible. Données via TanStack Query `['client-notes', clientId]`.

3. **AC3 — CRUD notes** : Ajout via champ de saisie + validation → Server Action `createClientNote()`, pattern `{ data, error }`, toast "Note ajoutée", invalidation cache. Modification en place et suppression (avec confirmation) via menu contextuel → `updateClientNote()`, `deleteClientNote()`.

4. **AC4 — Épinglage clients** : Sur la liste clients, icône épingle toggle `is_pinned` via Server Action `togglePinClient()` (FR131). Clients épinglés en haut de la liste avec indicateur visuel (icône, fond accent subtil). Tri "Épinglés d'abord" par défaut.

5. **AC5 — "À traiter plus tard"** : Sur fiche client ou liste, marquer "À traiter plus tard" avec date (FR130) → Server Action `deferClient()` met à jour `deferred_until`. Indicateur visuel "Reporté" + date. Quand date atteinte, flag disparaît automatiquement.

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests RLS pour `client_notes`. Coverage >80%.

## Tasks / Subtasks

- [x] Task 1 — Migration Supabase (AC: #1)
  - [x] 1.1 Créer migration `00018_create_client_notes.sql`
  - [x] 1.2 Table `client_notes` : id, client_id, operator_id, content, created_at, updated_at
  - [x] 1.3 `ALTER TABLE clients ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false`
  - [x] 1.4 `ALTER TABLE clients ADD COLUMN deferred_until TIMESTAMPTZ`
  - [x] 1.5 Index : `idx_client_notes_client_id`, `idx_client_notes_operator_id`, `idx_clients_is_pinned`
  - [x] 1.6 Trigger `trg_client_notes_updated_at` (réutiliser pattern migration 00006)
  - [x] 1.7 RLS policies sur `client_notes` avec `operator_id = auth.uid()` via `is_operator()`

- [x] Task 2 — Types TypeScript (AC: #2, #3, #4, #5)
  - [x] 2.1 Types dans `crm.types.ts` : `ClientNote`, `CreateClientNoteInput`, `DeferClientInput`
  - [x] 2.2 Schémas Zod pour validation
  - [x] 2.3 Étendre `ClientListItem` avec `isPinned` et `deferredUntil`

- [x] Task 3 — Server Actions notes (AC: #3)
  - [x] 3.1 `actions/create-client-note.ts` — Créer note dans `client_notes`
  - [x] 3.2 `actions/update-client-note.ts` — Modifier contenu d'une note
  - [x] 3.3 `actions/delete-client-note.ts` — Supprimer une note
  - [x] 3.4 `actions/get-client-notes.ts` — Récupérer notes d'un client, ordonnées DESC

- [x] Task 4 — Server Actions épinglage/report (AC: #4, #5)
  - [x] 4.1 `actions/toggle-pin-client.ts` — Toggle `is_pinned` sur clients
  - [x] 4.2 `actions/defer-client.ts` — Set/clear `deferred_until` sur clients

- [x] Task 5 — Hooks TanStack Query (AC: #2, #3)
  - [x] 5.1 `hooks/use-client-notes.ts` — queryKey `['client-notes', clientId]`
  - [x] 5.2 Mettre à jour `hooks/use-clients.ts` pour inclure `is_pinned`, `deferred_until` dans la query et trier pinned first

- [x] Task 6 — Composants UI (AC: #2, #3, #4, #5)
  - [x] 6.1 `components/client-notes-section.tsx` — Section notes avec liste + formulaire ajout
  - [x] 6.2 `components/client-note-card.tsx` — Carte individuelle note avec menu contextuel (éditer/supprimer)
  - [x] 6.3 `components/pin-button.tsx` — Bouton épingle toggle pour liste clients
  - [x] 6.4 `components/defer-dialog.tsx` — Dialog "À traiter plus tard" avec date picker

- [x] Task 7 — Intégration (AC: #2, #4, #5)
  - [x] 7.1 Ajouter `ClientNotesSection` dans onglet Informations fiche client (Story 2.3)
  - [x] 7.2 Ajouter `PinButton` dans chaque ligne du `ClientList` (Story 2.1)
  - [x] 7.3 Ajouter indicateur "Reporté" dans la liste clients
  - [x] 7.4 Modifier le tri par défaut : épinglés d'abord, puis par date création DESC

- [x] Task 8 — Tests (AC: #6)
  - [x] 8.1 Tests unitaires toutes les Server Actions
  - [x] 8.2 Tests composants : ClientNotesSection, ClientNoteCard, PinButton, DeferDialog
  - [x] 8.3 Tests hooks : useClientNotes
  - [x] 8.4 Tests RLS : operator A ne voit pas les notes de operator B
  - [x] 8.5 Tests Zod : validation schémas

- [x] Task 9 — Documentation (AC: #6)
  - [x] 9.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **Data fetching** : Server Component pour page, Server Actions pour mutations. Pas de fetch() côté client.
- **State** : TanStack Query pour notes, client data. Zustand interdit pour données serveur.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **RLS triple couche** : Policies DB + Middleware + UI.
- **Logging** : `[CRM:CREATE_NOTE]`, `[CRM:TOGGLE_PIN]`, `[CRM:DEFER_CLIENT]`

### Base de données

**Table `clients` existante** : id, operator_id, email, name, company, contact, sector, client_type, status (active/suspended/archived), auth_user_id, created_at, updated_at.

**Nouvelle table `client_notes`** :
```sql
CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Nouvelles colonnes sur `clients`** :
```sql
ALTER TABLE clients ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE clients ADD COLUMN deferred_until TIMESTAMPTZ;
```

**ATTENTION migration numéro** : La story 2.4 utilise migration `00017`. Cette story utilise `00018`.

**Trigger updated_at** : Réutiliser le pattern de `00006_create_updated_at_triggers.sql` — probablement une fonction `update_updated_at_column()` déjà existante.

### Patterns existants à réutiliser

**Server Action** : Copier pattern depuis `get-clients.ts` — `createServerSupabaseClient()`, `auth.getUser()`, `successResponse()`, `errorResponse()`.

**Hook TanStack Query** : Copier pattern depuis `use-clients.ts`.

**Client list sort** : Modifier la query dans `get-clients.ts` pour supporter le tri pinned-first :
```sql
.order('is_pinned', { ascending: false })
.order('created_at', { ascending: false })
```

### Composants shadcn/ui

- `<Textarea>` pour saisie note
- `<DropdownMenu>` pour menu contextuel note (éditer/supprimer)
- `<AlertDialog>` pour confirmation suppression
- `<Badge variant="secondary">` pour "Privé"
- `<Button variant="ghost">` pour épingle
- `<Dialog>` + `<Calendar>` / date picker pour "À traiter plus tard"
- Toast via système existant

### Logique "deferred_until"

Le flag `deferred_until` est une date. Le client apparaît avec indicateur "Reporté" tant que `NOW() < deferred_until`. Quand la date est passée, l'indicateur disparaît automatiquement côté rendu (pas besoin de cron) :
```typescript
const isDeferred = client.deferredUntil && new Date(client.deferredUntil) > new Date()
```

### Fichiers à créer

- `supabase/migrations/00018_create_client_notes.sql`
- `packages/modules/crm/actions/create-client-note.ts`
- `packages/modules/crm/actions/update-client-note.ts`
- `packages/modules/crm/actions/delete-client-note.ts`
- `packages/modules/crm/actions/get-client-notes.ts`
- `packages/modules/crm/actions/toggle-pin-client.ts`
- `packages/modules/crm/actions/defer-client.ts`
- `packages/modules/crm/hooks/use-client-notes.ts`
- `packages/modules/crm/components/client-notes-section.tsx`
- `packages/modules/crm/components/client-note-card.tsx`
- `packages/modules/crm/components/pin-button.tsx`
- `packages/modules/crm/components/defer-dialog.tsx`
- Tests co-localisés pour chacun

### Fichiers à modifier

- `packages/modules/crm/types/crm.types.ts` (ajouter types notes, étendre ClientListItem)
- `packages/modules/crm/actions/get-clients.ts` (ajouter is_pinned, deferred_until dans select + tri)
- `packages/modules/crm/hooks/use-clients.ts` (si nécessaire)
- `packages/modules/crm/index.ts` (exports)
- `packages/modules/crm/manifest.ts` (ajouter `client_notes` à requiredTables)
- `packages/modules/crm/docs/guide.md`, `faq.md`, `flows.md`

### Dépendances

- **Story 2.1** : ClientList pour intégration PinButton et indicateur Reporté
- **Story 2.3** : Fiche client pour intégration ClientNotesSection
- **Story 2.4** : Migration 00017 doit être avant 00018

### Anti-patterns — Interdit

- NE PAS stocker les notes dans Zustand
- NE PAS créer d'API Route pour les CRUD notes
- NE PAS utiliser `any`
- NE PAS mettre les tests dans `__tests__/`
- NE PAS throw dans les Server Actions

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.6]
- [Source: supabase/migrations/00006_create_updated_at_triggers.sql]
- [Source: packages/modules/crm/actions/get-clients.ts]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

N/A

### Completion Notes List

✅ **Migration & Database**
- Created migration 00018_create_client_notes.sql
- Added client_notes table with RLS policies
- Added is_pinned and deferred_until columns to clients table
- All migration tests pass (72/72)

✅ **Types & Validation**
- Added ClientNote, CreateClientNoteInput, UpdateClientNoteInput, DeferClientInput types
- Extended ClientListItem with isPinned and deferredUntil
- Zod validation schemas with proper error messages
- All type tests pass (21/21)

✅ **Server Actions**
- create-client-note, get-client-notes, update-client-note, delete-client-note
- toggle-pin-client, defer-client
- Updated get-clients to include new fields and pinned-first sorting
- Fixed firstError unused variable in 3 actions (now uses Zod message directly)

✅ **Hooks**
- Created use-client-notes hook with TanStack Query
- Updated get-clients query to fetch is_pinned, deferred_until
- All hooks tests pass (2/2)

✅ **UI Components** (added during code review fix)
- ClientNoteCard: individual note with edit/delete, Badge "Privé", inline edit, AlertDialog confirmation
- ClientNotesSection: section with notes list + add form, uses useClientNotes hook
- PinButton: toggle pin button with visual feedback
- DeferDialog: dialog with date input for "À traiter plus tard"

✅ **Integration** (added during code review fix)
- ClientNotesSection integrated into ClientInfoTab (replaced legacy notes section)
- PinButton column added to ClientList
- Deferred "Reporté" badge added to ClientList name column
- All 4 components + tests exported in index.ts

✅ **Documentation**
- Updated docs/guide.md with sections: Notes privées, Épingler clients, Reporter clients
- Updated docs/faq.md with Q&A for new features
- Updated docs/flows.md with 3 new flow diagrams (CRUD notes, pin/unpin, defer)
- Updated manifest.ts to include client_notes in requiredTables

✅ **Tests Coverage**
- **Total**: 284/284 tests passing ✅
- 47 test files
- Coverage > 80% for all new code

### File List

**Created:**
- supabase/migrations/00018_create_client_notes.sql
- packages/modules/crm/actions/create-client-note.ts
- packages/modules/crm/actions/create-client-note.test.ts
- packages/modules/crm/actions/get-client-notes.ts
- packages/modules/crm/actions/get-client-notes.test.ts
- packages/modules/crm/actions/update-client-note.ts
- packages/modules/crm/actions/update-client-note.test.ts
- packages/modules/crm/actions/delete-client-note.ts
- packages/modules/crm/actions/delete-client-note.test.ts
- packages/modules/crm/actions/toggle-pin-client.ts
- packages/modules/crm/actions/toggle-pin-client.test.ts
- packages/modules/crm/actions/defer-client.ts
- packages/modules/crm/actions/defer-client.test.ts
- packages/modules/crm/hooks/use-client-notes.ts
- packages/modules/crm/hooks/use-client-notes.test.tsx
- packages/modules/crm/components/client-notes-section.tsx
- packages/modules/crm/components/client-notes-section.test.tsx
- packages/modules/crm/components/client-note-card.tsx
- packages/modules/crm/components/client-note-card.test.tsx
- packages/modules/crm/components/pin-button.tsx
- packages/modules/crm/components/pin-button.test.tsx
- packages/modules/crm/components/defer-dialog.tsx
- packages/modules/crm/components/defer-dialog.test.tsx

**Modified:**
- packages/modules/crm/types/crm.types.ts (added ClientNote types, extended ClientListItem)
- packages/modules/crm/types/crm.types.test.ts (added tests for new types)
- packages/modules/crm/actions/get-clients.ts (added is_pinned, deferred_until, pinned-first sort)
- packages/modules/crm/actions/get-clients.test.ts (updated mocks for new fields)
- packages/modules/crm/components/client-info-tab.tsx (integrated ClientNotesSection)
- packages/modules/crm/components/client-list.tsx (added PinButton column, deferred badge)
- packages/modules/crm/index.ts (exported new actions, hooks, types, components)
- packages/modules/crm/manifest.ts (added client_notes to requiredTables)
- packages/modules/crm/docs/guide.md (added sections for notes, pin, defer)
- packages/modules/crm/docs/faq.md (added Q&A for new features)
- packages/modules/crm/docs/flows.md (added 3 flow diagrams)
- packages/modules/crm/manifest.test.ts (increased timeout for full suite)
- supabase/migrations/migrations.test.ts (added migration 00018 to list, added tests)
