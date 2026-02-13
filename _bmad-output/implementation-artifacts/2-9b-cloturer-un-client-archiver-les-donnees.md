# Story 2.9b: Clôturer un client & archiver les données

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **clôturer définitivement un client avec archivage automatique de ses données**,
So that **le client est proprement désactivé et ses données sont conservées en lecture seule**.

## Acceptance Criteria

1. **AC1 — Bouton clôturer** : Sur la fiche client, bouton "Clôturer le client" (FR89). Dialog de confirmation avec **double validation** : saisir le nom du client pour confirmer. Message : "Cette action archivera toutes les données du client. Le client ne pourra plus se connecter."

2. **AC2 — Server Action `closeClient()`** : Met status à `archived`, `archived_at` à NOW() (FR85). Le client n'apparaît plus dans la liste par défaut (filtre "Clôturés" nécessaire). Entrée `activity_logs` (action: `client_closed`).

3. **AC3 — Consultation lecture seule** : Via filtre "Clôturés" dans la liste, MiKL peut consulter la fiche. Données en lecture seule (tous les boutons d'édition désactivés). Bandeau "Client clôturé le {date}" avec bouton "Réactiver".

4. **AC4 — Réactivation depuis clôture** : Bouton "Réactiver" repasse status à `active`, supprime `archived_at`. Entrée `activity_logs`.

5. **AC5 — Tests** : Tests unitaires co-localisés. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Server Actions (AC: #2, #4)
  - [ ] 1.1 `actions/close-client.ts` — Set status='archived', archived_at=NOW(), log activity
  - [ ] 1.2 Réutiliser `actions/reactivate-client.ts` de Story 2.9a (clear archived_at aussi)

- [ ] Task 2 — Types TypeScript (AC: #1)
  - [ ] 2.1 Type `CloseClientInput` (clientId, confirmName)
  - [ ] 2.2 Validation Zod : `confirmName` doit matcher le nom du client

- [ ] Task 3 — Composants UI (AC: #1, #3)
  - [ ] 3.1 `components/close-client-dialog.tsx` — Dialog double confirmation : saisie nom client, comparaison, bouton "Clôturer" rouge
  - [ ] 3.2 `components/archived-banner.tsx` — Bandeau info "Client clôturé le {date}" + bouton Réactiver
  - [ ] 3.3 Modifier fiche client : si status='archived', désactiver tous les boutons d'édition (prop `readOnly`)

- [ ] Task 4 — Filtrage liste (AC: #2)
  - [ ] 4.1 Modifier `get-clients.ts` pour exclure les clients `archived` par défaut
  - [ ] 4.2 Ajouter filtre "Clôturés" dans ClientFiltersPanel (Story 2.1) pour les afficher
  - [ ] 4.3 Si filtre "Clôturés" actif, inclure `status = 'archived'` dans la query

- [ ] Task 5 — Tests (AC: #5)
  - [ ] 5.1 Tests Server Action closeClient : double validation, activity logging
  - [ ] 5.2 Tests composant CloseClientDialog : saisie confirmation, validation nom
  - [ ] 5.3 Tests ArchivedBanner : rendu, bouton réactiver
  - [ ] 5.4 Tests filtrage : clients archivés exclus par défaut, visibles avec filtre
  - [ ] 5.5 Tests edge cases : nom avec accents/espaces dans la confirmation

- [ ] Task 6 — Documentation (AC: #5)
  - [ ] 6.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **Response format** : `{ data, error }` — JAMAIS throw.
- **Double validation** : Le nom saisi doit exactement matcher le nom du client (case-insensitive, trim).
- **Logging** : `[CRM:CLOSE_CLIENT]`

### Base de données

**Colonne `archived_at`** : Ajoutée en migration 00020 (Story 2.9a). Pas de nouvelle migration nécessaire.

**Filtrage par défaut** : Modifier la query dans `get-clients.ts` :
```typescript
// Avant (actuel)
.eq('operator_id', operatorId)

// Après (exclure archivés par défaut)
.eq('operator_id', operatorId)
.neq('status', 'archived') // Sauf si filtre "Clôturés" actif
```

### Double validation — Pattern

```typescript
// Dans le composant CloseClientDialog
const isConfirmValid = confirmName.trim().toLowerCase() === client.name.trim().toLowerCase()

// Dans la Server Action
export async function closeClient(input: CloseClientInput): Promise<ActionResponse<Client>> {
  // Vérifier que confirmName match
  const { data: client } = await supabase.from('clients').select('name').eq('id', input.clientId).single()
  if (input.confirmName.trim().toLowerCase() !== client.name.trim().toLowerCase()) {
    return errorResponse('Le nom saisi ne correspond pas', 'VALIDATION_ERROR')
  }
  // Procéder à la clôture
}
```

### Mode lecture seule — Approche

Passer une prop `readOnly` au composant fiche client. Quand `readOnly=true` :
- Tous les `<Button>` d'édition sont `disabled`
- Les formulaires sont verrouillés
- Le bandeau ArchivedBanner est affiché en haut

```typescript
const isArchived = client.status === 'archived'
// Dans le composant fiche client
<ClientHeader client={client} readOnly={isArchived} />
{isArchived && <ArchivedBanner client={client} />}
```

### Server Action `reactivateClient()` — Mise à jour

La Server Action `reactivateClient()` de Story 2.9a doit aussi clear `archived_at` :
```typescript
await supabase.from('clients').update({
  status: 'active',
  suspended_at: null,
  archived_at: null, // Clear les deux
}).eq('id', clientId)
```

### Composants shadcn/ui

- `<AlertDialog>` pour confirmation clôture (action destructive)
- `<Input>` pour saisie nom de confirmation
- `<Alert variant="warning">` pour bandeau archivé
- `<Badge variant="secondary">` pour statut "Clôturé"

### Fichiers à créer

- `packages/modules/crm/actions/close-client.ts`
- `packages/modules/crm/components/close-client-dialog.tsx`
- `packages/modules/crm/components/archived-banner.tsx`
- Tests co-localisés

### Fichiers à modifier

- `packages/modules/crm/actions/get-clients.ts` (exclure archivés par défaut)
- `packages/modules/crm/actions/reactivate-client.ts` (clear archived_at)
- `packages/modules/crm/components/client-filters-panel.tsx` (ajouter filtre Clôturés)
- `packages/modules/crm/types/crm.types.ts`
- `packages/modules/crm/index.ts`
- `packages/modules/crm/docs/guide.md`, `faq.md`, `flows.md`

### Dépendances

- **Story 2.9a** : Migration 00020 (colonnes suspended_at, archived_at) et Server Action reactivateClient
- **Story 2.1** : ClientFiltersPanel pour ajouter filtre "Clôturés"
- **Story 2.3** : Fiche client pour intégrer le mode lecture seule et bandeau

### Anti-patterns — Interdit

- NE PAS supprimer physiquement les données client (soft delete uniquement)
- NE PAS permettre la clôture sans double validation
- NE PAS throw dans les Server Actions

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.9b]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
