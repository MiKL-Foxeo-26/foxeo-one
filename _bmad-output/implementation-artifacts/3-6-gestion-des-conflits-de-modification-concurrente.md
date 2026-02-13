# Story 3.6: Gestion des conflits de modification concurrente

Status: ready-for-dev

## Story

As a **utilisateur (MiKL ou client)**,
I want **être prévenu si quelqu'un d'autre a modifié les mêmes données que moi pendant que je les éditais**,
So that **je ne perds pas mon travail et les modifications ne s'écrasent pas silencieusement**.

## Acceptance Criteria

1. **AC1 — Helper optimisticLock** : Helper `optimisticLock()` disponible dans `@foxeo/utils`. Pattern basé sur le champ `updated_at` existant.

2. **AC2 — Capture version** : Quand un formulaire d'édition s'ouvre, le `updated_at` de l'enregistrement est stocké comme référence.

3. **AC3 — Vérification au submit** : La Server Action inclut `.eq('updated_at', originalUpdatedAt)` dans l'update (FR128). Si match → modification OK. Si différent → 0 rows affected → conflit.

4. **AC4 — Dialog conflit** : Si conflit détecté, réponse `{ error: { code: 'CONFLICT' } }`. Dialog avec options : "Recharger les données" (perd modifications locales, défaut), "Forcer ma version" (écrase, re-soumet avec nouveau updated_at).

5. **AC5 — Multi-onglets** : Le mécanisme fonctionne entre onglets du même utilisateur. Message explicatif.

6. **AC6 — Tests** : Tests unitaires co-localisés. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Helper optimisticLock (AC: #1, #3)
  - [ ] 1.1 `packages/utils/src/optimistic-lock.ts` — Helper function
  - [ ] 1.2 Fonction `withOptimisticLock(supabase, table, id, updatedAt, updateData)` qui vérifie updated_at
  - [ ] 1.3 Retourne `ActionResponse` avec code `CONFLICT` si mismatch
  - [ ] 1.4 Export depuis `@foxeo/utils`

- [ ] Task 2 — Hook useOptimisticLock (AC: #2)
  - [ ] 2.1 `packages/ui/src/hooks/use-optimistic-lock.ts` — Hook qui capture le updated_at initial
  - [ ] 2.2 Expose : `originalUpdatedAt`, `isConflict`, `resolveConflict(action: 'reload' | 'force')`

- [ ] Task 3 — Composant ConflictDialog (AC: #4)
  - [ ] 3.1 `packages/ui/src/components/conflict-dialog.tsx` — Dialog avec les deux options
  - [ ] 3.2 Option "Recharger" : invalide le cache TanStack Query + ferme le dialog
  - [ ] 3.3 Option "Forcer" : re-soumet la mutation sans vérification updated_at
  - [ ] 3.4 Défaut sélectionné : "Recharger"

- [ ] Task 4 — Intégration Server Actions existantes (AC: #3)
  - [ ] 4.1 Intégrer `withOptimisticLock` dans les Server Actions de mutation CRM (updateClient, etc.)
  - [ ] 4.2 Documenter le pattern pour les futures Server Actions

- [ ] Task 5 — Tests (AC: #6)
  - [ ] 5.1 Tests helper : optimisticLock normal, conflit, force
  - [ ] 5.2 Tests hook : capture updated_at, détection conflit
  - [ ] 5.3 Tests composant : ConflictDialog, options, actions
  - [ ] 5.4 Tests intégration : Server Action avec conflit simulé

## Dev Notes

### Architecture — Règles critiques

- **Pas de migration DB** : Utilise les colonnes `updated_at` existantes sur toutes les tables.
- **Package utils** : Le helper va dans `@foxeo/utils` (réutilisable par tous les modules).
- **Package ui** : Le hook et le dialog vont dans `@foxeo/ui` (composants partagés).
- **Response format** : `{ data: null, error: { code: 'CONFLICT', message: '...' } }`

### Helper optimisticLock

```typescript
// packages/utils/src/optimistic-lock.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActionResponse } from '@foxeo/types'
import { successResponse, errorResponse } from '@foxeo/types'

export async function withOptimisticLock<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  originalUpdatedAt: string,
  updateData: Record<string, unknown>,
  options?: { force?: boolean }
): Promise<ActionResponse<T>> {
  const query = supabase
    .from(table)
    .update(updateData)
    .eq('id', id)

  // Si pas force, ajouter le check updated_at
  if (!options?.force) {
    query.eq('updated_at', originalUpdatedAt)
  }

  const { data, error, count } = await query.select().single()

  if (error) {
    // Si aucune row affectée et pas d'erreur DB → conflit
    if (error.code === 'PGRST116') { // No rows found
      return errorResponse(
        'Les données ont été modifiées par un autre utilisateur. Veuillez recharger.',
        'CONFLICT'
      )
    }
    return errorResponse('Erreur lors de la mise à jour', 'DATABASE_ERROR', error)
  }

  return successResponse(data as T)
}
```

### Hook useOptimisticLock

```typescript
// packages/ui/src/hooks/use-optimistic-lock.ts
'use client'
import { useState, useCallback } from 'react'

export function useOptimisticLock(initialUpdatedAt: string) {
  const [originalUpdatedAt] = useState(initialUpdatedAt)
  const [isConflict, setIsConflict] = useState(false)
  const [conflictError, setConflictError] = useState<string | null>(null)

  const checkResponse = useCallback((response: { error?: { code?: string } | null }) => {
    if (response.error?.code === 'CONFLICT') {
      setIsConflict(true)
      setConflictError(response.error.message)
      return true
    }
    return false
  }, [])

  const resolveConflict = useCallback(() => {
    setIsConflict(false)
    setConflictError(null)
  }, [])

  return { originalUpdatedAt, isConflict, conflictError, checkResponse, resolveConflict }
}
```

### Intégration dans les formulaires

```typescript
// Exemple dans un composant d'édition client
function EditClientForm({ client }: { client: Client }) {
  const { originalUpdatedAt, isConflict, checkResponse, resolveConflict } = useOptimisticLock(client.updatedAt)
  const queryClient = useQueryClient()

  const onSubmit = async (data: UpdateClientInput) => {
    const response = await updateClient({ ...data, updatedAt: originalUpdatedAt })
    if (checkResponse(response)) return // Conflit détecté → dialog s'affiche
    // Succès
    queryClient.invalidateQueries({ queryKey: ['client', client.id] })
    toast({ title: 'Client mis à jour' })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>
      <ConflictDialog
        open={isConflict}
        onReload={() => {
          resolveConflict()
          queryClient.invalidateQueries({ queryKey: ['client', client.id] })
        }}
        onForce={() => {
          resolveConflict()
          onSubmit({ ...getValues(), force: true })
        }}
      />
    </>
  )
}
```

### Fichiers à créer

- `packages/utils/src/optimistic-lock.ts`
- `packages/utils/src/optimistic-lock.test.ts`
- `packages/ui/src/hooks/use-optimistic-lock.ts`
- `packages/ui/src/hooks/use-optimistic-lock.test.tsx`
- `packages/ui/src/components/conflict-dialog.tsx`
- `packages/ui/src/components/conflict-dialog.test.tsx`

### Fichiers à modifier

- `packages/utils/src/index.ts` (export withOptimisticLock)
- `packages/ui/src/index.ts` (export hook + composant)
- Server Actions de mutation CRM pour intégrer le pattern (optionnel, peut être fait progressivement)

### Dépendances

- `@foxeo/types` — ActionResponse, errorResponse, successResponse
- `@foxeo/supabase` — SupabaseClient
- Colonnes `updated_at` existantes sur toutes les tables principales

### Anti-patterns — Interdit

- NE PAS utiliser de verrouillage pessimiste (lock DB) — trop lourd
- NE PAS ignorer les conflits silencieusement
- NE PAS throw dans les Server Actions (retourner code CONFLICT)
- NE PAS forcer par défaut — le défaut est "Recharger"

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-3-*.md#Story 3.6]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
