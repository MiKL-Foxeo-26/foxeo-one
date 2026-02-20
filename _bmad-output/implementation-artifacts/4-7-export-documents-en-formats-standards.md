# Story 4.7: Export documents en formats standards

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **utilisateur (MiKL ou client)**,
I want **exporter mes documents et donnees en formats standards (CSV, JSON, PDF)**,
so that **je peux utiliser mes donnees en dehors de la plateforme et rester conforme aux obligations de portabilite**.

## Acceptance Criteria

1. **AC1 — Menu export** : Un bouton "Exporter" (avec icone Download) dans la barre d'actions de la liste de documents ouvre un menu `DropdownMenu` shadcn/ui proposant : "Telecharger en PDF" (document individuel uniquement), "Exporter la liste en CSV", "Exporter la liste en JSON" (FR150). Format par defaut : PDF pour document unique, CSV pour une liste.

2. **AC2 — Export PDF individuel** : Pour un document individuel : si PDF → telechargement direct via signed URL Supabase Storage. Si Markdown → generation serveur via `generatePdf()` existant (story 4.2). Le PDF inclut le branding Foxeo. Export < 5 secondes (NFR-P6).

3. **AC3 — Export CSV liste** : Server Action `exportDocumentsCSV(clientId, filters?)` genere un fichier CSV cote serveur. Colonnes : nom, type, taille (formatee), dossier, visibilite, date_creation, date_modification. Encodage UTF-8 avec BOM (compatibilite Excel). Telechargement automatique du fichier.

4. **AC4 — Export JSON liste** : Server Action `exportDocumentsJSON(clientId, filters?)` genere un fichier JSON structure avec les metadonnees completes. Format camelCase. Telechargement automatique.

5. **AC5 — Indicateur de progression** : Si l'export prend > 1 seconde, un indicateur "Export en cours..." s'affiche. L'utilisateur peut continuer a naviguer (generation en arriere-plan via `useTransition`).

6. **AC6 — Tests** : Tests unitaires co-localises pour toutes les nouvelles actions, hooks et composants. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Server Action exportDocumentsCSV (AC: #3)
  - [ ] 1.1 Creer `actions/export-documents-csv.ts` — `exportDocumentsCSV(clientId: string, filters?: DocumentFilters)` : auth, charge les documents RLS, genere le CSV avec BOM UTF-8, retourne `ActionResponse<{ csvContent: string; fileName: string }>`
  - [ ] 1.2 Creer `utils/csv-generator.ts` — `generateDocumentsCsv(documents: Document[], folders?: DocumentFolder[])` : genere le contenu CSV avec header, rows, BOM. Colonnes : nom, type, taille (via `formatFileSize()`), dossier, visibilite (Partage/Prive), date_creation, date_modification.
  - [ ] 1.3 Tests `actions/export-documents-csv.test.ts` — auth, 0 documents (CSV vide avec header), N documents, encodage BOM, nom fichier dynamique (5 tests)
  - [ ] 1.4 Tests `utils/csv-generator.test.ts` — liste vide, un document sans dossier, document avec dossier, caracteres speciaux dans le nom (echappement CSV), encodage BOM present (5 tests)

- [ ] Task 2 — Server Action exportDocumentsJSON (AC: #4)
  - [ ] 2.1 Creer `actions/export-documents-json.ts` — `exportDocumentsJSON(clientId: string, filters?: DocumentFilters)` : auth, charge les documents RLS, genere JSON structure, retourne `ActionResponse<{ jsonContent: string; fileName: string }>`
  - [ ] 2.2 Creer `utils/json-exporter.ts` — `generateDocumentsJson(documents: Document[], metadata?: ExportMetadata)` : JSON structure `{ exportedAt, clientId, totalCount, documents: [...] }`. Champs par document : id, name, fileType, fileSize, formattedSize, folderId, folderName, visibility, uploadedBy, createdAt, updatedAt.
  - [ ] 2.3 Tests `actions/export-documents-json.test.ts` — auth, liste vide, N documents, format camelCase, nom fichier (4 tests)
  - [ ] 2.4 Tests `utils/json-exporter.test.ts` — structure JSON valide, camelCase, champs requis presents (3 tests)

- [ ] Task 3 — Types DocumentFilters et ExportMetadata (AC: #3, #4)
  - [ ] 3.1 Ajouter dans `types/document.types.ts` : `DocumentFilters` (folderId?: string | null, visibility?: DocumentVisibility, uploadedBy?: UploadedBy), `ExportMetadata` (clientId: string, exportedAt: string, exportedBy: string)
  - [ ] 3.2 Ajouter `ExportDocumentsInput` Zod schema (clientId UUID, format enum 'csv'|'json'|'pdf')

- [ ] Task 4 — Hook useExportDocuments (AC: #3, #4, #5)
  - [ ] 4.1 Creer `hooks/use-export-documents.ts` — `useExportDocuments(clientId: string)`. Expose `exportCSV(filters?)`, `exportJSON(filters?)`. Chaque fonction : appelle la Server Action, puis declenche le telechargement navigateur via Blob + URL.createObjectURL. Gere `isPending` via `useTransition`.
  - [ ] 4.2 Tests `hooks/use-export-documents.test.ts` — export CSV succes + telechargement, export JSON succes + telechargement, etat pending, erreur (4 tests)

- [ ] Task 5 — Composant DocumentExportMenu (AC: #1, #2, #5)
  - [ ] 5.1 Creer `components/document-export-menu.tsx` — Props : `clientId: string`, `selectedDocument?: Document` (pour export individuel PDF). `DropdownMenu` shadcn/ui avec items : "Telecharger en PDF" (si `selectedDocument`), "Exporter la liste en CSV", "Exporter la liste en JSON". Affiche `Loader2` icone si `isPending`. Utilise `useExportDocuments`.
  - [ ] 5.2 Tests `components/document-export-menu.test.tsx` — rendu sans document selectionne (pas de PDF item), rendu avec document (PDF item present), clic CSV declenche export, clic JSON declenche export, clic PDF declenche generatePdf, etat loading (6 tests)

- [ ] Task 6 — Integration dans DocumentList et pages (AC: #1)
  - [ ] 6.1 Modifier `components/document-list.tsx` — ajouter `DocumentExportMenu` dans la barre d'outils au-dessus du tableau (a cote du bouton de recherche et d'upload)
  - [ ] 6.2 Mettre a jour `apps/hub/app/(dashboard)/modules/documents/[clientId]/page.tsx` — s'assurer que clientId est passe correctement a DocumentExportMenu
  - [ ] 6.3 Mettre a jour `apps/client/app/(dashboard)/modules/documents/page.tsx` — idem pour la vue client

- [ ] Task 7 — Mise a jour barrel exports (AC: #6)
  - [ ] 7.1 Mettre a jour `index.ts` — exporter `exportDocumentsCSV`, `exportDocumentsJSON`, `useExportDocuments`, `DocumentExportMenu` + nouveaux types

- [ ] Task 8 — Documentation (AC: #6)
  - [ ] 8.1 Mettre a jour `docs/guide.md` — section "Exporter vos documents"
  - [ ] 8.2 Mettre a jour `docs/faq.md` — FAQ : quels formats sont disponibles ? le CSV est-il compatible Excel ? l'export inclut-il les documents prives ?
  - [ ] 8.3 Mettre a jour `docs/flows.md` — flux export CSV, JSON, PDF

## Dev Notes

### Architecture — Regles critiques

- **MODULE EXISTANT** : Etendre `packages/modules/documents/` uniquement.
- **Aucune migration DB** : Cette story ne requiert pas de migration. Toutes les donnees necessaires sont deja dans `documents` et `document_folders`.
- **Generation cote serveur** : CSV et JSON generes dans Server Actions. Le client recoit une string et cree un Blob pour le telechargement.
- **Reutiliser `generatePdf()`** : L'export PDF individuel reutilise la Server Action `generatePdf()` de la story 4.2 — pas de duplication.
- **Logging** : `[DOCUMENTS:EXPORT_CSV]`, `[DOCUMENTS:EXPORT_JSON]`, `[DOCUMENTS:EXPORT_PDF]`

### Pattern generation CSV avec BOM UTF-8

```typescript
// utils/csv-generator.ts
export function generateDocumentsCsv(
  documents: Document[],
  folders: DocumentFolder[] = []
): string {
  const folderMap = new Map(folders.map(f => [f.id, f.name]))

  const headers = ['Nom', 'Type', 'Taille', 'Dossier', 'Visibilite', 'Date creation', 'Date modification']

  const rows = documents.map(doc => [
    escapeCsvValue(doc.name),
    escapeCsvValue(doc.fileType),
    escapeCsvValue(formatFileSize(doc.fileSize)), // @foxeo/utils
    escapeCsvValue(doc.folderId ? (folderMap.get(doc.folderId) ?? 'Inconnu') : 'Non classes'),
    escapeCsvValue(doc.visibility === 'shared' ? 'Partage' : 'Prive'),
    escapeCsvValue(formatDate(doc.createdAt)), // @foxeo/utils
    escapeCsvValue(formatDate(doc.updatedAt)),
  ])

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

  // BOM UTF-8 pour compatibilite Excel
  return '\uFEFF' + csvContent
}

function escapeCsvValue(value: string): string {
  // Echapper les guillemets et entourer si necessaire
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
```

### Pattern telechargement Blob cote client

```typescript
// hooks/use-export-documents.ts
const exportCSV = async (filters?: DocumentFilters) => {
  startTransition(async () => {
    const result = await exportDocumentsCSV(clientId, filters)
    if (result.error) { toast.error(result.error.message); return }

    const { csvContent, fileName } = result.data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName // ex: 'documents-client-abc-2026-02-19.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000) // cleanup race-safe (pattern 4.2)
    toast.success(`Export CSV telecharge (${result.data.count} documents)`)
    console.info(`[DOCUMENTS:EXPORT_CSV] ${result.data.count} documents exportes`)
  })
}
```

### Pattern JSON structure export

```typescript
// utils/json-exporter.ts
export function generateDocumentsJson(
  documents: Document[],
  metadata: ExportMetadata
): string {
  const payload = {
    exportedAt: metadata.exportedAt,
    exportedBy: metadata.exportedBy,
    clientId: metadata.clientId,
    totalCount: documents.length,
    documents: documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      formattedSize: formatFileSize(doc.fileSize), // @foxeo/utils
      folderId: doc.folderId,
      visibility: doc.visibility,
      uploadedBy: doc.uploadedBy,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  return JSON.stringify(payload, null, 2)
}
```

### Nom de fichier dynamique

```typescript
// Convention de nommage des fichiers exportes
const date = new Date().toISOString().split('T')[0] // '2026-02-19'
const csvFileName = `documents-${clientId.slice(0, 8)}-${date}.csv`
const jsonFileName = `documents-${clientId.slice(0, 8)}-${date}.json`
```

### Performance — NFR-P6

- Export < 5 secondes pour PDF (deja garanti par story 4.2)
- Export CSV/JSON < 2 secondes pour < 500 documents (genere en memoire, pas de IO disque)
- `useTransition` permet a l'UI de rester reactive pendant la generation
- Pour > 500 documents : logger un warning mais ne pas bloquer

### Dependances existantes

- `generatePdf()` (story 4.2) — reutilise directement pour PDF individuel
- `formatFileSize()` de `@foxeo/utils` — formatage taille
- `DocumentFolder` types (story 4.4) — pour la colonne dossier dans le CSV
- `getDocuments()` (story 4.1) — pour charger les documents
- `@foxeo/types` — `ActionResponse`, `successResponse`, `errorResponse`
- `@foxeo/supabase` — `createServerSupabaseClient`

### Anti-patterns — Interdit

- NE PAS dupliquer la logique de `generatePdf()` pour l'export PDF
- NE PAS stocker les fichiers CSV/JSON dans Supabase Storage (generes a la volee)
- NE PAS inclure les documents `deleted_at IS NOT NULL` dans les exports (soft delete story 4.6)
- NE PAS utiliser `JSON.stringify` directement sur les DocumentDB (snake_case) — toujours convertir en Document (camelCase) d'abord
- NE PAS oublier le BOM UTF-8 dans le CSV (sinon Excel affiche des caracteres corrompus pour les accents)

### Estimation tests

| Fichier | Tests |
|---------|-------|
| actions/export-documents-csv | 5 |
| actions/export-documents-json | 4 |
| utils/csv-generator | 5 |
| utils/json-exporter | 3 |
| hooks/use-export-documents | 4 |
| components/document-export-menu | 6 |
| **Total nouveaux tests** | **~27** |

Objectif post-4.7 : **~1733 tests** (base ~1706 post-4.6).

### Cloture Epic 4

Apres completion de la story 4.7, l'Epic 4 est complete. Toutes les 12 FRs couvertes :
FR62, FR63, FR64, FR65, FR86, FR107, FR135, FR136, FR144, FR145, FR146, FR150.

Penser a lancer le workflow `retrospective` pour l'Epic 4 apres completion.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-4-gestion-documentaire-stories-detaillees.md#Story 4.7]
- [Source: docs/project-context.md]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md]
- [Source: _bmad-output/implementation-artifacts/4-2-visualisation-documents-viewer-html-telechargement-pdf.md]
- [Source: _bmad-output/implementation-artifacts/4-4-organisation-en-dossiers-recherche-dans-les-documents.md]
- [Source: _bmad-output/implementation-artifacts/4-6-autosave-brouillons-undo-actions-recentes.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

### Completion Notes List

### File List
