# Story 4.6: Autosave brouillons & undo actions recentes

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **utilisateur (MiKL ou client)**,
I want **que les formulaires longs sauvegardent automatiquement en brouillon et que je puisse annuler certaines actions recentes**,
so that **je ne perds jamais mon travail en cours et je peux corriger une erreur rapidement**.

## Acceptance Criteria

1. **AC1 — Autosave brouillon toutes les 30 secondes** : Les formulaires longs (upload document, creation dossier, edition nom de document) sauvegardent automatiquement dans `localStorage` toutes les 30 secondes (FR135). Cle de stockage : `draft:{formType}:{entityId}`. Indicateur discret "Brouillon sauvegarde il y a {X}s". Zustand N'EST PAS utilise pour cet autosave — localStorage direct via `react-hook-form watch()` + `useEffect`.

2. **AC2 — Reprise de brouillon** : Quand un formulaire se charge et qu'un brouillon existe dans localStorage, un bandeau s'affiche : "Un brouillon a ete trouve (sauvegarde le {date}). [Reprendre] [Non, recommencer]". Si "Reprendre" : formulaire prerempli. Si "Non" : brouillon supprime. Brouillon supprime automatiquement apres soumission reussie.

3. **AC3 — Undo pour actions reversibles** : Un toast avec bouton "Annuler" (5 secondes) s'affiche apres : suppression de document, retrait de partage, suppression de dossier, suppression de note privee (FR136). Si "Annuler" clique dans le delai : action inversee. Si delai expire : action definitive.

4. **AC4 — Hook useUndoableAction** : Un hook `useUndoableAction()` dans `packages/modules/documents/hooks/` encapsule la logique undo. Signature : `useUndoableAction<T>(action: () => Promise<T>, undoAction: () => Promise<void>, options?: { delay?: number; successMessage?: string })`. Execute l'action, affiche le toast avec timer, inverse si "Annuler" clique, confirme apres expiration.

5. **AC5 — Actions supportees** : Les actions supportant l'undo dans le module Documents sont : suppression de document (`deleteDocument`), retrait de partage (`unshareDocument`), suppression de dossier (`deleteFolder`).

6. **AC6 — Tests** : Tests unitaires co-localises pour tous les nouveaux hooks et composants. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Hook useDraftForm (AC: #1, #2)
  - [ ] 1.1 Creer `hooks/use-draft-form.ts` — `useDraftForm<T>(formType: string, entityId: string, form: UseFormReturn<T>)`. Logique : `useEffect` qui s'abonne a `form.watch()`, debounce 30s, ecrit dans localStorage. Au montage : verifie si brouillon existe, expose `hasDraft`, `draftDate`, `restoreDraft()`, `clearDraft()`. Supprimer le brouillon automatiquement quand `form.formState.isSubmitSuccessful === true`.
  - [ ] 1.2 Tests `hooks/use-draft-form.test.ts` — pas de brouillon initial, brouillon detecre au montage, sauvegarde automatique apres 30s, restauration brouillon, effacement manuel, effacement apres succes soumission (6 tests)

- [ ] Task 2 — Composant DraftRestoreBanner (AC: #2)
  - [ ] 2.1 Creer `components/draft-restore-banner.tsx` — Props : `hasDraft: boolean`, `draftDate: Date | null`, `onRestore: () => void`, `onDismiss: () => void`. Affiche bandeau jaune/amber avec icone Info, date formatee, boutons "Reprendre" et "Non, recommencer".
  - [ ] 2.2 Tests `components/draft-restore-banner.test.tsx` — rendu sans brouillon (null), rendu avec brouillon, clic Reprendre, clic Recommencer (4 tests)

- [ ] Task 3 — Hook useUndoableAction (AC: #3, #4)
  - [ ] 3.1 Creer `hooks/use-undo-action.ts` — `useUndoableAction(options)`. Utilise `toast()` de `@foxeo/ui` avec un bouton "Annuler" dans le contenu du toast. Gere le timer via `setTimeout` (defaut 5000ms). Si "Annuler" clique : appelle `undoAction()`, dismisses le toast. Si timer expire : pas d'action supplementaire.
  - [ ] 3.2 Tests `hooks/use-undo-action.test.ts` — execute action, affiche toast, clic annuler inverse, timer expire sans annulation, undo echoue (erreur toast), action principale echoue (5 tests)

- [ ] Task 4 — Integration undo dans les actions existantes (AC: #5)
  - [ ] 4.1 Modifier `components/document-list.tsx` — utiliser `useUndoableAction` pour le bouton Supprimer. Action : `deleteDocument(id)`. Undo action : re-creer le document est impossible (soft delete) — donc utiliser soft delete pattern.
  - [ ] 4.2 Ajouter colonne `deleted_at TIMESTAMP NULL` sur `documents` si pas deja presente (migration `00030_documents_soft_delete.sql`). Modifier `deleteDocument()` pour faire un soft delete (`deleted_at = NOW()`). Modifier `getDocuments()` pour filtrer `WHERE deleted_at IS NULL`. Undo = `UPDATE documents SET deleted_at = NULL`.
  - [ ] 4.3 Modifier `components/document-share-button.tsx` (story 4.3) — utiliser `useUndoableAction` pour le retrait de partage. Undo action : `shareDocument(documentId)`.
  - [ ] 4.4 Modifier `components/folder-tree.tsx` (story 4.4) — utiliser `useUndoableAction` pour la suppression de dossier. Undo action : re-creer le dossier avec les memes donnees.

- [ ] Task 5 — Integration autosave dans formulaires Documents (AC: #1, #2)
  - [ ] 5.1 Modifier `components/document-upload.tsx` — integrer `useDraftForm('document-upload', clientId, form)` + `DraftRestoreBanner`. Les champs sauvegardes : `name`, `tags` (PAS le fichier binaire — impossble dans localStorage).
  - [ ] 5.2 Modifier `components/create-folder-dialog.tsx` (story 4.4) — integrer `useDraftForm('create-folder', clientId, form)`.
  - [ ] 5.3 Tests updates pour `document-upload.test.tsx` — test autosave, test restauration brouillon (3 tests supplementaires)

- [ ] Task 6 — Composant UndoToast helper (AC: #3)
  - [ ] 6.1 Creer `utils/undo-toast.ts` — Helper `showUndoToast(message: string, onUndo: () => void, delay = 5000)` qui utilise le systeme de toasts de `@foxeo/ui` avec un bouton Annuler et un timer visuel (progress bar dans le toast). Retourne une fonction `dismiss()`.
  - [ ] 6.2 Tests `utils/undo-toast.test.ts` — affichage, clic undo, expiration (3 tests)

- [ ] Task 7 — Migration soft delete (AC: #5)
  - [ ] 7.1 Creer `supabase/migrations/00030_documents_soft_delete.sql` — `ALTER TABLE documents ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL`. Mettre a jour policies RLS pour filtrer `WHERE deleted_at IS NULL` dans les SELECT policies.
  - [ ] 7.2 Mettre a jour `DocumentDB` et `Document` types — ajouter `deletedAt: string | null`
  - [ ] 7.3 Mettre a jour `getDocuments()` — ajouter `.is('deleted_at', null)` dans la query
  - [ ] 7.4 Mettre a jour `deleteDocument()` — passer de DELETE a UPDATE SET `deleted_at = NOW()`
  - [ ] 7.5 Tests deleteDocument mis a jour — verifier soft delete (2 tests updates)

- [ ] Task 8 — Mise a jour barrel exports (AC: #6)
  - [ ] 8.1 Mettre a jour `index.ts` — exporter `useDraftForm`, `useUndoAction`, `DraftRestoreBanner`

- [ ] Task 9 — Documentation (AC: #6)
  - [ ] 9.1 Mettre a jour `docs/guide.md` — section autosave et annulation d'actions
  - [ ] 9.2 Mettre a jour `docs/faq.md` — FAQ : combien de temps dure le brouillon ? l'annulation est-elle possible apres fermeture ? quelles actions sont reversibles ?
  - [ ] 9.3 Mettre a jour `docs/flows.md` — flux autosave et undo

## Dev Notes

### Architecture — Regles critiques

- **Autosave = localStorage direct** : NE PAS utiliser Zustand. `react-hook-form watch()` + `useEffect` avec debounce 30s.
- **Undo = toast timer** : Le pattern undo est base sur un toast avec bouton "Annuler" actif 5 secondes. L'action est executee immediatement (optimistic), le undo annule.
- **Soft delete OBLIGATOIRE pour undo** : Sans soft delete, un document supprime est perdu et ne peut pas etre restaure. La migration 00030 est prerequise pour le undo de suppression.
- **Cle localStorage** : Format strict `draft:{formType}:{entityId}` — ex: `draft:document-upload:client-abc-123`.
- **Logging** : `[DOCUMENTS:DRAFT_SAVE]`, `[DOCUMENTS:DRAFT_RESTORE]`, `[DOCUMENTS:UNDO]`

### Pattern useDraftForm

```typescript
// hooks/use-draft-form.ts
import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'

export function useDraftForm<T extends FieldValues>(
  formType: string,
  entityId: string,
  form: UseFormReturn<T>
) {
  const draftKey = `draft:${formType}:${entityId}`
  const [hasDraft, setHasDraft] = useState(false)
  const [draftDate, setDraftDate] = useState<Date | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Detection brouillon au montage
  useEffect(() => {
    const raw = localStorage.getItem(draftKey)
    if (raw) {
      try {
        const { timestamp } = JSON.parse(raw)
        setHasDraft(true)
        setDraftDate(new Date(timestamp))
      } catch { localStorage.removeItem(draftKey) }
    }
  }, [draftKey])

  // Autosave toutes les 30 secondes via watch
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify({ values, timestamp: Date.now() }))
        console.info(`[DOCUMENTS:DRAFT_SAVE] Brouillon sauvegarde: ${draftKey}`)
      }, 30_000)
    })
    return () => { subscription.unsubscribe(); if (timerRef.current) clearTimeout(timerRef.current) }
  }, [form, draftKey])

  // Effacement apres soumission reussie
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      localStorage.removeItem(draftKey)
      setHasDraft(false)
    }
  }, [form.formState.isSubmitSuccessful, draftKey])

  const restoreDraft = () => {
    const raw = localStorage.getItem(draftKey)
    if (!raw) return
    const { values } = JSON.parse(raw)
    form.reset(values)
    setHasDraft(false)
    console.info(`[DOCUMENTS:DRAFT_RESTORE] Brouillon restaure: ${draftKey}`)
  }

  const clearDraft = () => {
    localStorage.removeItem(draftKey)
    setHasDraft(false)
  }

  return { hasDraft, draftDate, restoreDraft, clearDraft }
}
```

### Pattern useUndoableAction

```typescript
// hooks/use-undo-action.ts
import { toast } from '@foxeo/ui'
import { useRef } from 'react'

interface UseUndoableActionOptions {
  delay?: number
  successMessage?: string
  undoMessage?: string
}

export function useUndoableAction() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const execute = async <T>(
    action: () => Promise<T>,
    undoAction: () => Promise<void>,
    options: UseUndoableActionOptions = {}
  ) => {
    const { delay = 5000, successMessage = 'Action effectuee', undoMessage = 'Annulee' } = options

    let undoClicked = false

    // Executer l'action immediatement
    const result = await action()

    // Afficher le toast avec bouton Annuler
    const toastId = toast.success(successMessage, {
      duration: delay,
      action: {
        label: 'Annuler',
        onClick: async () => {
          undoClicked = true
          if (timerRef.current) clearTimeout(timerRef.current)
          await undoAction()
          toast.success(undoMessage)
          console.info('[DOCUMENTS:UNDO] Action annulee')
        }
      }
    })

    return result
  }

  return { execute }
}
```

### Pattern soft delete

```typescript
// actions/delete-document.ts (MODIFICATION — soft delete)
export async function deleteDocument(documentId: string): Promise<ActionResponse<void>> {
  // ... auth check ...

  // Soft delete au lieu de DELETE
  const { error } = await supabase
    .from('documents')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', documentId)

  if (error) return errorResponse('Erreur lors de la suppression', 'DB_ERROR', error)
  return successResponse(undefined)
}

// Undo = restauration
export async function restoreDocument(documentId: string): Promise<ActionResponse<void>> {
  const { error } = await supabase
    .from('documents')
    .update({ deleted_at: null })
    .eq('id', documentId)

  if (error) return errorResponse('Erreur lors de la restauration', 'DB_ERROR', error)
  return successResponse(undefined)
}
```

### Priorite des migrations

Les migrations doivent etre executees dans l'ordre :
- 00028 (story 4.4 — dossiers)
- 00029 (story 4.5 — last_synced_at)
- 00030 (story 4.6 — soft delete)

Verifier les migrations existantes avant de creer pour eviter les conflits de numerotation.

### Dependances existantes

- `deleteDocument()` dans `actions/delete-document.ts` — A MODIFIER pour soft delete
- `DocumentList` — A MODIFIER pour undo integration
- `DocumentShareButton` (story 4.3) — A MODIFIER pour undo sur retrait partage
- `FolderTree` (story 4.4) — A MODIFIER pour undo sur suppression dossier
- `DocumentUpload` — A MODIFIER pour autosave
- `react-hook-form` ^7.71.x — deja dans le projet
- Toast system `@foxeo/ui` — deja utilise dans les stories precedentes

### Anti-patterns — Interdit

- NE PAS stocker le fichier binaire dans le brouillon localStorage (impossble + limite 5Mo)
- NE PAS utiliser Zustand pour l'autosave des formulaires
- NE PAS implementer un "hard delete" si le undo doit fonctionner — soft delete obligatoire
- NE PAS afficher le timer undo en secondes en temps reel (trop de re-renders) — juste le bouton "Annuler"
- NE PAS oublier de cleanup les timers dans les useEffect (memory leak)

### Estimation tests

| Fichier | Tests |
|---------|-------|
| hooks/use-draft-form | 6 |
| hooks/use-undo-action | 5 |
| components/draft-restore-banner | 4 |
| utils/undo-toast | 3 |
| Updates document-upload | +3 |
| Updates delete-document | +2 |
| **Total nouveaux tests** | **~23** |

Objectif post-4.6 : **~1706 tests** (base ~1683 post-4.5).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4-gestion-documentaire-stories-detaillees.md#Story 4.6]
- [Source: docs/project-context.md]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md]
- [Source: _bmad-output/implementation-artifacts/4-2-visualisation-documents-viewer-html-telechargement-pdf.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

### File List
