# Story 4.5: Synchronisation documents vers dossier BMAD local

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **MiKL (operateur)**,
I want **que les documents valides soient automatiquement synchronises vers le dossier BMAD local du client**,
so that **Orpheus (dans Cursor) a toujours acces aux derniers documents valides sans manipulation manuelle**.

## Acceptance Criteria

1. **AC1 — Colonne last_synced_at** : La table `documents` est enrichie d'une colonne `last_synced_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL` pour tracer le statut de synchronisation. Migration `00029_documents_sync.sql`.

2. **AC2 — Bouton "Sync vers BMAD"** : Un bouton "Sync vers BMAD" dans le Hub (sur la page documents d'un client) telecharge un ZIP de tous les documents `visibility='shared'` du client (FR65, FR86). Server Action `syncDocumentsToZip(clientId)` genere le ZIP cote serveur, retourne une URL de telechargement temporaire. Toast "Archive ZIP prete au telechargement".

3. **AC3 — Trace de synchronisation** : Apres le ZIP genere, `last_synced_at` est mis a jour pour chaque document inclus. Un badge "Synce" avec date s'affiche dans la vue Hub sur les documents synchronises.

4. **AC4 — Fallback : pas de sync automatique** : La synchronisation automatique via Supabase Edge Function (trigger DB) est documentee comme future implementation (Phase 2). La story livre uniquement le mecanisme manuel (bouton ZIP) conforme au cas "dossier BMAD local non accessible depuis le serveur". Un commentaire dans le code indique le point d'extension pour la future Edge Function.

5. **AC5 — Log d'activite** : Chaque synchronisation est tracee dans la table `activity_logs` : `{ client_id, operator_id, action: 'documents_synced', metadata: { count: N, documentIds: [...] } }`.

6. **AC6 — Tests** : Tests unitaires co-localises pour toutes les nouvelles actions, hooks et composants. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration DB last_synced_at (AC: #1)
  - [ ] 1.1 Creer `supabase/migrations/00029_documents_sync.sql` — `ALTER TABLE documents ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE NULL`. Verifier le numero de migration existant avant.
  - [ ] 1.2 Mettre a jour `DocumentDB` et `Document` types dans `types/document.types.ts` — ajouter `lastSyncedAt: string | null`
  - [ ] 1.3 Mettre a jour `toDocument()` dans `utils/to-document.ts` — mapper `last_synced_at` → `lastSyncedAt`

- [ ] Task 2 — Server Action syncDocumentsToZip (AC: #2, #3, #5)
  - [ ] 2.1 Creer `actions/sync-documents-to-zip.ts` — `syncDocumentsToZip(clientId: string)` : auth operator, charge tous les docs `visibility='shared'` du client, genere les signed URLs Supabase Storage, cree une archive ZIP en memoire (pas de dep externe — utiliser `fflate` ou approche native Node.js `zlib`/`archiver`). Retourne `ActionResponse<{ zipUrl: string; count: number }>`.
  - [ ] 2.2 Creer `utils/zip-generator.ts` — helper generation ZIP depuis liste de fichiers { name, url }. Telecharge les fichiers via fetch depuis les signed URLs et les compresse.
  - [ ] 2.3 Mettre a jour `last_synced_at` pour chaque document inclus apres generation.
  - [ ] 2.4 Inserer dans `activity_logs` : `{ action: 'documents_synced', metadata: { count, documentIds } }`
  - [ ] 2.5 Tests `actions/sync-documents-to-zip.test.ts` — auth, non operator, client introuvable, 0 documents partages (vide), succes avec N documents, erreur Storage signed URL (6 tests)
  - [ ] 2.6 Tests `utils/zip-generator.test.ts` — liste vide, un fichier, plusieurs fichiers, erreur fetch (4 tests)

- [ ] Task 3 — Composant SyncToZipButton (AC: #2, #3)
  - [ ] 3.1 Creer `components/sync-to-zip-button.tsx` — Props : `clientId: string`, `documentCount: number`. Bouton "Sync vers BMAD ({N} docs partages)". Pendant generation : spinner + "Generation ZIP...". Apres succes : declenche telechargement automatique du ZIP via `URL.createObjectURL` + `<a download>`. Toast "Archive ZIP prete".
  - [ ] 3.2 Creer `components/document-sync-badge.tsx` — Badge compact "Synce le {date formatee}" si `lastSyncedAt` non null. Affiche en gris clair si > 7 jours.
  - [ ] 3.3 Tests `components/sync-to-zip-button.test.tsx` — rendu initial, clic declenche action, etat loading, succes telechargement, erreur toast (5 tests)
  - [ ] 3.4 Tests `components/document-sync-badge.test.tsx` — non synce (null), synce recent, synce > 7 jours (3 tests)

- [ ] Task 4 — Integration page Hub (AC: #2, #3)
  - [ ] 4.1 Modifier `apps/hub/app/(dashboard)/modules/documents/[clientId]/page.tsx` — ajouter `SyncToZipButton` dans la barre d'actions de la page (pres du bouton Upload)
  - [ ] 4.2 Modifier `components/document-list.tsx` — afficher `DocumentSyncBadge` dans la colonne Actions si `document.lastSyncedAt` non null ET context Hub
  - [ ] 4.3 Modifier `components/documents-page-client.tsx` — accepter prop `isOperator` et propager aux composants

- [ ] Task 5 — Hook useSyncDocuments (AC: #2)
  - [ ] 5.1 Creer `hooks/use-sync-documents.ts` — mutation TanStack Query pour `syncDocumentsToZip`, invalide `['documents', clientId]` apres succes
  - [ ] 5.2 Tests (mutation succes, mutation erreur, invalidation cache — 3 tests)

- [ ] Task 6 — Mise a jour barrel exports (AC: #6)
  - [ ] 6.1 Mettre a jour `index.ts` — exporter `syncDocumentsToZip`, `useSyncDocuments`, `SyncToZipButton`, `DocumentSyncBadge`

- [ ] Task 7 — Documentation (AC: #4, #6)
  - [ ] 7.1 Mettre a jour `docs/guide.md` — section "Synchroniser les documents vers BMAD" avec instructions utilisation ZIP
  - [ ] 7.2 Mettre a jour `docs/faq.md` — FAQ : quels documents sont inclus dans le ZIP ? comment utiliser avec Cursor/Orpheus ? qu'est-ce que la sync automatique (Phase 2) ?
  - [ ] 7.3 Mettre a jour `docs/flows.md` — flux sync manuelle ZIP + commentaire extension Edge Function Phase 2

## Dev Notes

### Architecture — Regles critiques

- **MODULE EXISTANT** : Etendre `packages/modules/documents/` uniquement.
- **Nouvelle migration** : `supabase/migrations/00029_documents_sync.sql` — ALTER TABLE uniquement, pas de nouvelle table.
- **Generation ZIP cote serveur** : La Server Action genere le ZIP en memoire. Ne pas stocker le ZIP dans Supabase Storage — le retourner directement dans la reponse (ou via un data URL temporaire).
- **Pas de Edge Function dans cette story** : La sync automatique (trigger DB → Edge Function → ecriture fichier) est Phase 2. Cette story livre uniquement le mecanisme manuel.
- **Limite de taille ZIP** : Si le total des fichiers > 50 Mo, logger un warning et inclure quand meme (ne pas bloquer). Documenter la limite dans le guide.
- **Logging** : `[DOCUMENTS:SYNC_ZIP]`

### Approche ZIP — lib recommandee

```typescript
// utils/zip-generator.ts
// Utiliser 'fflate' (legere, pas de dep native, fonctionne en Node.js edge)
// OU si indisponible : approche manuelle avec Buffer + zlib Node.js natif

// Verifier si fflate est deja dans les deps du projet
// Si non : installer UNIQUEMENT si ca ne casse pas le bundle (taille < 10ko gzip)
// Alternative sans dep : generer un tar.gz avec zlib Node.js natif

import { zipSync, strToU8 } from 'fflate' // ou solution native

export async function generateZipFromDocuments(
  files: Array<{ name: string; url: string }>
): Promise<Buffer> {
  const fileContents: Record<string, Uint8Array> = {}

  for (const file of files) {
    const response = await fetch(file.url)
    const arrayBuffer = await response.arrayBuffer()
    fileContents[file.name] = new Uint8Array(arrayBuffer)
  }

  const zipped = zipSync(fileContents)
  return Buffer.from(zipped)
}
```

### Pattern telechargement ZIP cote client

```typescript
// components/sync-to-zip-button.tsx
// La Server Action retourne un ArrayBuffer ou base64 encoded ZIP
// Le composant cree un Blob et declenche le telechargement

const handleSync = async () => {
  const result = await syncDocumentsToZip(clientId)
  if (result.error) { toast.error(result.error.message); return }

  // result.data.zipBase64 = base64 encoded ZIP
  const bytes = Buffer.from(result.data.zipBase64, 'base64')
  const blob = new Blob([bytes], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `documents-${clientId}-${new Date().toISOString().split('T')[0]}.zip`
  a.click()
  // Cleanup apres delai pour eviter race condition
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  toast.success(`Archive ZIP prete (${result.data.count} documents)`)
}
```

### Limites techniques connues

- **Server Action response size** : Next.js a une limite sur la taille des Server Action responses (~4Mo par defaut). Si le ZIP > 4Mo, utiliser une approche alternative : uploader le ZIP dans Supabase Storage temporaire (bucket `temp-exports`, expiration 10min) et retourner un signed URL.
- **Verifier la taille** : Calculer la taille totale avant generation. Si > 3Mo : approche Storage temporaire. Si < 3Mo : retourner directement en base64.

### Pattern activity_logs

```typescript
// Pattern etabli dans le projet pour les logs d'activite
await supabase.from('activity_logs').insert({
  client_id: clientId,
  operator_id: operator.id,
  action: 'documents_synced',
  metadata: {
    count: syncedDocumentIds.length,
    documentIds: syncedDocumentIds,
    syncedAt: new Date().toISOString(),
  },
})
```

### Extension Phase 2 — Edge Function (commentaire dans le code)

```typescript
// TODO Phase 2: Sync automatique via Supabase Edge Function
// Trigger: UPDATE sur documents WHERE visibility='shared'
// Edge Function: supabase/functions/sync-document/index.ts
// - Recupere le fichier depuis Storage
// - Ecrit dans le dossier BMAD via API filesystem ou mount partage
// - Met a jour last_synced_at
// Prerequis: acces reseau au dossier BMAD local (VPN, mount NFS, ou API agent local)
```

### Dependances existantes

- Table `documents` (migration 00027) — ajouter `last_synced_at`
- Table `activity_logs` — verifier l'existence et la structure avant insertion
- `getDocumentUrl()` / signed URLs pattern (story 4.2)
- Module `packages/modules/documents/` — stories 4.1, 4.2, 4.3, 4.4
- `@foxeo/types` — `ActionResponse`, `successResponse`, `errorResponse`
- `@foxeo/supabase` — `createServerSupabaseClient`

### Verification table activity_logs

Avant d'inserer dans `activity_logs`, verifier que la table existe :
```bash
grep -r "activity_logs" supabase/migrations/
```
Si elle n'existe pas : creer la table dans la migration 00029 ou documenter la dependency manquante.

### Anti-patterns — Interdit

- NE PAS stocker les ZIPs permanemment dans Supabase Storage (cout storage)
- NE PAS implémenter la Edge Function dans cette story (Phase 2)
- NE PAS bloquer l'interface pendant la generation ZIP > 3 secondes (utiliser useTransition)
- NE PAS inclure les documents `visibility='private'` dans le ZIP

### Estimation tests

| Fichier | Tests |
|---------|-------|
| actions/sync-documents-to-zip | 6 |
| utils/zip-generator | 4 |
| components/sync-to-zip-button | 5 |
| components/document-sync-badge | 3 |
| hooks/use-sync-documents | 3 |
| **Total nouveaux tests** | **~21** |

Objectif post-4.5 : **~1683 tests** (base ~1662 post-4.4).

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4-gestion-documentaire-stories-detaillees.md#Story 4.5]
- [Source: docs/project-context.md]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md]
- [Source: _bmad-output/implementation-artifacts/4-2-visualisation-documents-viewer-html-telechargement-pdf.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

### File List
