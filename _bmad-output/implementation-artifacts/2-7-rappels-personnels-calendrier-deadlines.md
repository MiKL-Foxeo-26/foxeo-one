# Story 2.7: Rappels personnels & calendrier deadlines

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **créer des rappels personnels avec une tâche et une date, et visualiser mes rappels et deadlines dans un calendrier**,
So that **je n'oublie aucune action importante et je planifie mon travail efficacement**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `reminders` créée avec : id (UUID PK), operator_id (FK operators NOT NULL), client_id (FK clients nullable), title (TEXT NOT NULL), description (TEXT nullable), due_date (TIMESTAMPTZ NOT NULL), completed (BOOLEAN DEFAULT false), created_at, updated_at. Index `idx_reminders_operator_id_due_date`. Trigger updated_at. RLS policies : `reminders_select_operator`, `reminders_insert_operator`, `reminders_update_operator`, `reminders_delete_operator`.

2. **AC2 — Création rappel** : Bouton "Nouveau rappel" dans le module CRM ou sur fiche client (FR132). Dialog avec : titre (obligatoire), description (optionnel), date d'échéance (obligatoire, date picker), client associé (optionnel, auto-rempli si depuis fiche client). react-hook-form + Zod. Server Action `createReminder()`, pattern `{ data, error }`, toast "Rappel créé", invalidation `['reminders']`.

3. **AC3 — Vue calendrier** : Calendrier mensuel affichant les rappels sous forme de points/badges par jour (FR133). Clic sur un jour → liste détaillée des rappels. Rappels passés non complétés en rouge (en retard). Rappels complétés barrés/grisés. Navigation mois précédent/suivant.

4. **AC4 — Toggle complété** : Marquer un rappel comme complété via `toggleReminderComplete()`. Style "complété" (barré/grisé). Invalidation cache.

5. **AC5 — Filtres** : Filtrer par statut : Tous, À venir, En retard, Complétés. Filtre par défaut : "À venir".

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests RLS. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00019_create_reminders.sql`
  - [ ] 1.2 Table `reminders` avec tous les champs spécifiés
  - [ ] 1.3 Index `idx_reminders_operator_id_due_date`
  - [ ] 1.4 Trigger updated_at (réutiliser fonction existante de migration 00006)
  - [ ] 1.5 RLS policies 4 opérations avec vérification `operator_id`

- [ ] Task 2 — Types TypeScript (AC: #2)
  - [ ] 2.1 Types dans `crm.types.ts` : `Reminder`, `CreateReminderInput`, `ReminderFilter`
  - [ ] 2.2 Schémas Zod pour validation formulaire
  - [ ] 2.3 Type DB `ReminderDB` (snake_case)

- [ ] Task 3 — Server Actions (AC: #2, #4)
  - [ ] 3.1 `actions/get-reminders.ts` — Récupérer rappels opérateur, filtrables par statut/mois
  - [ ] 3.2 `actions/create-reminder.ts` — Créer rappel
  - [ ] 3.3 `actions/toggle-reminder-complete.ts` — Toggle completed
  - [ ] 3.4 `actions/update-reminder.ts` — Modifier titre/description/date
  - [ ] 3.5 `actions/delete-reminder.ts` — Supprimer rappel

- [ ] Task 4 — Hooks TanStack Query (AC: #2, #3, #4)
  - [ ] 4.1 `hooks/use-reminders.ts` — queryKey `['reminders', operatorId, { month, year, filter }]`
  - [ ] 4.2 Mutations avec invalidation `['reminders']`

- [ ] Task 5 — Composants UI (AC: #2, #3, #4, #5)
  - [ ] 5.1 `components/create-reminder-dialog.tsx` — Dialog formulaire création (react-hook-form + Zod)
  - [ ] 5.2 `components/reminders-calendar.tsx` — Vue calendrier mensuel avec badges par jour
  - [ ] 5.3 `components/reminder-day-list.tsx` — Liste des rappels d'un jour sélectionné
  - [ ] 5.4 `components/reminder-card.tsx` — Carte rappel individuel avec checkbox complété, menu actions
  - [ ] 5.5 `components/reminders-filter.tsx` — Filtres par statut (tabs ou select)

- [ ] Task 6 — Route et intégration (AC: #3)
  - [ ] 6.1 Ajouter route `/modules/crm/reminders` dans le manifest CRM ou comme sous-navigation
  - [ ] 6.2 Page Server Component avec skeleton loader
  - [ ] 6.3 Bouton "Nouveau rappel" dans le header CRM + sur chaque fiche client

- [ ] Task 7 — Tests (AC: #6)
  - [ ] 7.1 Tests unitaires Server Actions
  - [ ] 7.2 Tests composants calendrier, dialog, cards
  - [ ] 7.3 Tests hooks useReminders
  - [ ] 7.4 Tests RLS : isolation par operator_id
  - [ ] 7.5 Tests edge cases : rappels passés, changement de mois, suppression

- [ ] Task 8 — Documentation (AC: #6)
  - [ ] 8.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **Data fetching** : Server Component pour la page calendrier, Server Actions pour mutations.
- **State** : TanStack Query pour rappels. Le mois/année visible et le filtre actif sont état UI → Zustand ou `useState` (préférer `useState` local si pas de persistance nécessaire).
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[CRM:CREATE_REMINDER]`, `[CRM:TOGGLE_REMINDER]`, `[CRM:DELETE_REMINDER]`

### Base de données

**Migration `00019`** (après 00017 parcours et 00018 notes) :
```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_operator_id_due_date ON reminders(operator_id, due_date);
CREATE INDEX idx_reminders_completed ON reminders(operator_id, completed);
```

**`ON DELETE SET NULL` pour `client_id`** : Si un client est supprimé, le rappel reste (orphelin mais conservé).

### Calendrier — Approche technique

**Pas de librairie externe** pour le calendrier. Construire un composant simple :
- Grille 7 colonnes (Lun-Dim) × 5-6 lignes
- Chaque cellule = un jour du mois
- Badge numérique si rappels ce jour (couleur: accent pour à venir, rouge pour en retard, gris pour complétés)
- Clic sur cellule → affiche `ReminderDayList` en dessous ou dans un panel latéral

**Query par mois** : Filtrer `due_date >= début_mois AND due_date < début_mois_suivant` côté serveur.

```typescript
// Calcul statut
const isOverdue = !reminder.completed && new Date(reminder.dueDate) < new Date()
const isUpcoming = !reminder.completed && new Date(reminder.dueDate) >= new Date()
```

### Composants shadcn/ui

- `<Dialog>` pour création rappel
- `<Calendar>` (date picker) de shadcn/ui pour sélection date
- `<Checkbox>` pour toggle complété
- `<Tabs>` ou `<Select>` pour filtres statut
- `<Badge>` pour indicateurs sur les jours du calendrier
- `<DropdownMenu>` pour actions sur rappel (modifier/supprimer)
- `<AlertDialog>` pour confirmation suppression

### Fichiers à créer

- `supabase/migrations/00019_create_reminders.sql`
- `packages/modules/crm/actions/get-reminders.ts`
- `packages/modules/crm/actions/create-reminder.ts`
- `packages/modules/crm/actions/toggle-reminder-complete.ts`
- `packages/modules/crm/actions/update-reminder.ts`
- `packages/modules/crm/actions/delete-reminder.ts`
- `packages/modules/crm/hooks/use-reminders.ts`
- `packages/modules/crm/components/create-reminder-dialog.tsx`
- `packages/modules/crm/components/reminders-calendar.tsx`
- `packages/modules/crm/components/reminder-day-list.tsx`
- `packages/modules/crm/components/reminder-card.tsx`
- `packages/modules/crm/components/reminders-filter.tsx`
- Tests co-localisés pour chacun

### Fichiers à modifier

- `packages/modules/crm/types/crm.types.ts`
- `packages/modules/crm/manifest.ts` (ajouter `reminders` à requiredTables, ajouter route)
- `packages/modules/crm/index.ts` (exports)
- `packages/modules/crm/docs/guide.md`, `faq.md`, `flows.md`

### Dépendances

- **Story 2.6** : Migration 00018 avant 00019
- **Story 2.3** : Pour intégrer bouton "Nouveau rappel" sur fiche client

### Anti-patterns — Interdit

- NE PAS utiliser de librairie calendrier lourde (FullCalendar, etc.) — composant simple custom
- NE PAS stocker le mois/filtre visible dans TanStack Query (c'est du state UI)
- NE PAS utiliser fetch() côté client
- NE PAS throw dans les Server Actions

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.7]
- [Source: docs/project-context.md]
- [Source: packages/modules/crm/actions/get-clients.ts] — Pattern Server Action

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
