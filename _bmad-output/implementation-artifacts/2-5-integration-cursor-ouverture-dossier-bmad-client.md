# Story 2.5: Intégration Cursor (ouverture dossier BMAD client)

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **ouvrir le dossier BMAD d'un client directement dans Cursor depuis la fiche CRM**,
So that **je peux travailler avec Orpheus sur les documents du client sans quitter mon flux de travail**.

## Acceptance Criteria

1. **AC1 — Bouton "Ouvrir dans Cursor"** : Sur la fiche client, un bouton "Ouvrir dans Cursor" (FR7) génère un lien `cursor://file/` pointant vers le dossier BMAD du client. Le chemin est construit depuis une convention configurable (défaut : `{bmad_base_path}/clients/{client_slug}/`). Le `client_slug` est dérivé du nom de l'entreprise ou du nom client (kebab-case).

2. **AC2 — Dossier inexistant** : Si le dossier BMAD du client n'existe pas encore, un message informe l'utilisateur. Un bouton "Copier le chemin" copie le chemin attendu dans le presse-papier. Des instructions indiquent comment initialiser le dossier BMAD.

3. **AC3 — Fallback protocole non supporté** : Si le protocole `cursor://` n'est pas supporté par le navigateur, un fallback affiche le chemin complet avec un bouton "Copier dans le presse-papier" et un message expliquant comment ouvrir manuellement dans Cursor.

4. **AC4 — Tests** : Tests unitaires co-localisés pour tous les composants/utilitaires. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Configuration chemin BMAD (AC: #1)
  - [ ] 1.1 Ajouter constante `BMAD_BASE_PATH` configurable dans `packages/modules/crm/utils/cursor-integration.ts`
  - [ ] 1.2 Fonction `buildClientSlug(name: string, company?: string): string` — kebab-case du nom entreprise ou nom client
  - [ ] 1.3 Fonction `buildBmadPath(clientSlug: string, basePath?: string): string` — construit le chemin complet
  - [ ] 1.4 Fonction `buildCursorUrl(path: string): string` — génère `cursor://file/{path}`

- [ ] Task 2 — Composant CursorButton (AC: #1, #2, #3)
  - [ ] 2.1 `components/cursor-button.tsx` — Bouton principal avec icône Cursor
  - [ ] 2.2 Détection support protocole custom via `window.open()` avec timeout fallback
  - [ ] 2.3 État "dossier inexistant" : message info + bouton "Copier le chemin"
  - [ ] 2.4 État "protocole non supporté" : chemin complet affiché + bouton copier + instructions manuelles
  - [ ] 2.5 Utiliser `navigator.clipboard.writeText()` pour la copie, toast "Chemin copié"

- [ ] Task 3 — Intégration fiche client (AC: #1)
  - [ ] 3.1 Ajouter le bouton CursorButton dans le header de la fiche client (Story 2.3)
  - [ ] 3.2 Passer le client (name, company) en props pour construire le slug

- [ ] Task 4 — Tests (AC: #4)
  - [ ] 4.1 Tests unitaires `cursor-integration.test.ts` : buildClientSlug, buildBmadPath, buildCursorUrl
  - [ ] 4.2 Tests composant `cursor-button.test.tsx` : render, clic, copie presse-papier, fallback
  - [ ] 4.3 Tests edge cases : noms avec caractères spéciaux, accents, espaces

- [ ] Task 5 — Documentation (AC: #4)
  - [ ] 5.1 Mettre à jour `docs/guide.md` avec section Cursor
  - [ ] 5.2 Mettre à jour `docs/faq.md` avec questions Cursor

## Dev Notes

### Architecture — Règles critiques

- **Pas de Server Action nécessaire** : Cette story est purement côté client (protocole URL + clipboard).
- **Composant client** : `CursorButton` est `'use client'` car il utilise `window`, `navigator.clipboard`.
- **Pas de migration DB** : Aucune donnée à stocker. Le chemin est calculé dynamiquement.

### Construction du slug client

```typescript
// packages/modules/crm/utils/cursor-integration.ts
import { toKebabCase } from '@foxeo/utils' // ou implémentation locale

export const BMAD_BASE_PATH = process.env.NEXT_PUBLIC_BMAD_BASE_PATH || '/Users/mikl/bmad'

export function buildClientSlug(name: string, company?: string): string {
  const source = company || name
  return toKebabCase(source) // ex: "Mon Entreprise" → "mon-entreprise"
}

export function buildBmadPath(clientSlug: string, basePath = BMAD_BASE_PATH): string {
  return `${basePath}/clients/${clientSlug}`
}

export function buildCursorUrl(path: string): string {
  return `cursor://file/${path}`
}
```

**Attention kebab-case** : Gérer les accents (normalisation NFD + suppression diacritiques), les caractères spéciaux, les espaces multiples. Utiliser `@foxeo/utils` si `toKebabCase` existe, sinon créer dans `packages/modules/crm/utils/`.

### Détection protocole custom

Le protocole `cursor://` n'est pas détectable de manière fiable. Stratégie :
1. Tenter `window.open(cursorUrl)` ou `window.location.href = cursorUrl`
2. Si aucune réponse dans 2 secondes (heuristique), afficher le fallback
3. Alternative : détecter via `navigator.registerProtocolHandler` (limité)

**Recommandation** : Utiliser `window.location.href = cursorUrl` avec un `setTimeout` de 1.5s qui affiche le fallback si la page est toujours visible (l'app n'a pas pris le focus).

### Composants shadcn/ui à utiliser

- `<Button>` pour le bouton principal
- `<Tooltip>` pour info-bulle sur hover
- `<Alert>` pour le message dossier inexistant / protocole non supporté
- Toast via le système existant pour confirmation copie

### Fichiers à créer

- `packages/modules/crm/utils/cursor-integration.ts`
- `packages/modules/crm/utils/cursor-integration.test.ts`
- `packages/modules/crm/components/cursor-button.tsx`
- `packages/modules/crm/components/cursor-button.test.tsx`

### Fichiers à modifier

- `packages/modules/crm/index.ts` (ajouter exports)
- Composant header fiche client (Story 2.3) pour intégrer CursorButton

### Patterns existants à réutiliser

- Toast notifications via `@foxeo/ui`
- Palette Hub Cyan/Turquoise
- Skeleton loaders si nécessaire (ici peu probable)
- Tests co-localisés `.test.ts(x)` à côté du source

### Dépendances avec autres stories

- **Story 2.3** : Le bouton s'intègre dans le header de la fiche client. Si 2.3 pas implémentée, créer le composant standalone.
- Aucune dépendance DB ou migration.

### Anti-patterns — Interdit

- NE PAS créer d'API Route pour cette fonctionnalité (tout est côté client)
- NE PAS stocker le chemin BMAD en DB (calculé dynamiquement)
- NE PAS utiliser `any` pour les types clipboard

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.5]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
