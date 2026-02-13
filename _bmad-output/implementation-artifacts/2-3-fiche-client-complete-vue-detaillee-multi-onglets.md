# Story 2.3: Fiche client complète (vue détaillée multi-onglets)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **MiKL (opérateur)**,
I want **consulter la fiche complète d'un client avec ses informations, son historique, ses documents et ses échanges dans une vue à onglets**,
so that **j'ai une vision 360° de chaque client sans naviguer entre plusieurs pages**.

## Acceptance Criteria

**Given** MiKL clique sur un client dans la liste CRM
**When** la fiche client se charge (`/modules/crm/clients/[clientId]`)
**Then** la page affiche un header avec : nom du client, entreprise, type (badge couleur), statut (badge), date de création (FR4)
**And** un skeleton loader s'affiche pendant le chargement
**And** les données sont fetched via TanStack Query avec queryKey `['client', clientId]`

**Given** la fiche client est chargée
**When** MiKL visualise la fiche
**Then** 4 onglets sont disponibles : Informations, Historique, Documents, Échanges
**And** l'onglet actif est "Informations" par défaut
**And** l'état de l'onglet actif est géré via URL query param (`?tab=informations`) pour permettre le partage de lien

**Given** l'onglet "Informations" est actif
**When** MiKL le consulte
**Then** il voit : coordonnées complètes (nom, email, téléphone, entreprise, secteur), type de client, statut actuel, parcours Lab assigné (si applicable), modules One actifs (si applicable), date de création, dernière activité
**And** un bouton "Modifier" permet d'éditer les informations (formulaire de Story 2.2)

**Given** l'onglet "Historique" est actif
**When** MiKL le consulte
**Then** il voit une timeline chronologique des événements du client : création du compte, changements de statut, validations Hub, visios, passages Lab vers One
**And** la timeline est ordonnée du plus récent au plus ancien
**And** les données proviennent de la table `activity_logs` (créée en Story 1.2)
**And** le composant `ClientTimeline` (packages/modules/crm/components/client-timeline.tsx) affiche les événements

**Given** l'onglet "Documents" est actif
**When** MiKL le consulte
**Then** il voit la liste des documents partagés avec ce client (briefs, livrables, rapports)
**And** chaque document affiche : nom, type, date, statut (visible/non visible par le client)
**And** cette vue requête Supabase directement (table `documents`, filtre par client_id) — pas d'import du module Documents

**Given** l'onglet "Échanges" est actif
**When** MiKL le consulte
**Then** il voit l'historique des échanges : messages chat récents, résumés Élio, notifications échangées
**And** un lien rapide "Ouvrir le chat" redirige vers le module Chat avec le contexte client

## Tasks / Subtasks

- [ ] Créer la page route fiche client (AC: #1)
  - [ ] Créer `apps/hub/app/(dashboard)/modules/crm/clients/[clientId]/page.tsx` (Server Component)
  - [ ] Extraire `clientId` depuis params Next.js
  - [ ] Fetch data client via Server Component (pattern RSC preferred pour première charge)
  - [ ] Si client non trouvé ou pas d'accès: afficher erreur 404
  - [ ] Créer `apps/hub/app/(dashboard)/modules/crm/clients/[clientId]/loading.tsx` avec skeleton

- [ ] Créer la Server Action `getClient` (AC: #1)
  - [ ] Créer `packages/modules/crm/actions/get-client.ts`
  - [ ] Signature: `getClient(clientId: string): Promise<ActionResponse<Client>>`
  - [ ] Query Supabase `clients` + join `client_configs` pour récupérer toute la config
  - [ ] Filtrer par RLS (automatique) + vérifier ownership explicite
  - [ ] Transformer snake_case → camelCase
  - [ ] Retourner format `{ data, error }`

- [ ] Créer le hook TanStack Query (AC: #1)
  - [ ] Créer `packages/modules/crm/hooks/use-client.ts`
  - [ ] `useClient(clientId: string)` avec `useQuery(['client', clientId], ...)`
  - [ ] Prefetch intelligent: précharger au hover dans la liste (Story 2.1)

- [ ] Créer le composant header fiche client (AC: #1)
  - [ ] Créer `packages/modules/crm/components/client-header.tsx`
  - [ ] Afficher: nom (h1), entreprise (subtitle), badges type et statut (couleur selon valeur)
  - [ ] Date de création formatée (ex: "Client depuis le 15 janvier 2026")
  - [ ] Bouton actions: "Modifier", menu dropdown avec actions rapides (Story 2.6+)
  - [ ] Palette Hub Cyan/Turquoise

- [ ] Créer le système d'onglets (AC: #2)
  - [ ] Créer `packages/modules/crm/components/client-tabs.tsx`
  - [ ] Utiliser `Tabs` component de @foxeo/ui (Radix UI)
  - [ ] 4 onglets: Informations, Historique, Documents, Échanges
  - [ ] Synchroniser onglet actif avec URL query param `?tab=...` (Next.js useSearchParams + useRouter)
  - [ ] Onglet par défaut: "informations" si query param absent
  - [ ] Lazy-load contenu de chaque onglet (pas de fetch si onglet pas consulté)

- [ ] Implémenter l'onglet "Informations" (AC: #3)
  - [ ] Créer `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Sections:
    - **Coordonnées**: nom, email, téléphone, entreprise, secteur (layout 2 colonnes)
    - **Configuration**: type de client (badge), statut (badge), date création, dernière activité
    - **Parcours Lab**: si applicable, afficher nom du parcours + progression (barre)
    - **Modules One**: si applicable, liste des modules actifs (badges cliquables)
  - [ ] Bouton "Modifier" en haut à droite → ouvre dialog `ClientForm` en mode édition (Story 2.2)
  - [ ] Utiliser composants Card, Badge, Separator de @foxeo/ui

- [ ] Implémenter l'onglet "Historique" (AC: #4)
  - [ ] Créer `packages/modules/crm/components/client-timeline.tsx`
  - [ ] Créer Server Action `getClientActivityLogs(clientId: string)` dans `packages/modules/crm/actions/get-activity-logs.ts`
  - [ ] Query table `activity_logs` filtrée par `client_id`, ordonnée par `created_at DESC`
  - [ ] Types d'événements:
    - `client_created`: "Client créé"
    - `status_changed`: "Statut changé de X à Y"
    - `validation_submitted`: "Brief soumis pour validation"
    - `validation_approved`: "Brief approuvé par MiKL"
    - `visio_completed`: "Visio terminée (durée: X min)"
    - `graduated_to_one`: "Client gradué vers One"
  - [ ] Timeline composant: icône + titre + description + date relative (ex: "il y a 2 jours")
  - [ ] Hook: `useClientActivityLogs(clientId)` avec TanStack Query `['activity-logs', clientId]`
  - [ ] Pagination si > 50 événements (load more button)

- [ ] Implémenter l'onglet "Documents" (AC: #5)
  - [ ] Créer `packages/modules/crm/components/client-documents-tab.tsx`
  - [ ] Créer Server Action `getClientDocuments(clientId: string)` dans `packages/modules/crm/actions/get-client-documents.ts`
  - [ ] Query table `documents` filtrée par `client_id` (table créée en Epic 4, migration 00006)
  - [ ] Si table `documents` pas encore créée: afficher message "Aucun document disponible" (stub pour Epic 4)
  - [ ] Colonnes: nom, type (brief/livrable/rapport), date upload, visibilité client (toggle)
  - [ ] Lien "Voir le document" → redirige vers module Documents (Epic 4)
  - [ ] Hook: `useClientDocuments(clientId)` avec TanStack Query `['client-documents', clientId]`

- [ ] Implémenter l'onglet "Échanges" (AC: #6)
  - [ ] Créer `packages/modules/crm/components/client-exchanges-tab.tsx`
  - [ ] Créer Server Action `getClientExchanges(clientId: string)` dans `packages/modules/crm/actions/get-client-exchanges.ts`
  - [ ] Query table `messages` filtrée par `client_id`, ordonné par date DESC, limité à 20 derniers
  - [ ] Afficher résumé: date, type (message/notification/résumé Élio), extrait contenu (100 premiers caractères)
  - [ ] Bouton CTA: "Ouvrir le chat complet" → redirige vers `/modules/chat?clientId=...` (Epic 3)
  - [ ] Si module Chat pas encore implémenté: afficher placeholder "Chat disponible prochainement"
  - [ ] Hook: `useClientExchanges(clientId)` avec TanStack Query `['client-exchanges', clientId]`

- [ ] Gérer les états de chargement et erreurs (AC: tous)
  - [ ] Skeleton loader par onglet (différent selon contenu)
  - [ ] Error boundary pour chaque onglet (si un onglet crash, les autres restent fonctionnels)
  - [ ] État vide par onglet:
    - Historique: "Aucune activité enregistrée"
    - Documents: "Aucun document partagé"
    - Échanges: "Aucun échange pour le moment"

- [ ] Intégration avec le bouton "Modifier" (AC: #3)
  - [ ] Importer `ClientForm` de Story 2.2
  - [ ] Passer `defaultValues` avec données client actuelles
  - [ ] Après update réussi: invalider cache `['client', clientId]` + toast success
  - [ ] Dialog ferme automatiquement après succès

- [ ] Tests unitaires et d'intégration (AC: tous)
  - [ ] Créer `packages/modules/crm/components/client-tabs.test.tsx`
    - Test changement onglet → URL query param mis à jour
    - Test chargement depuis URL avec query param → bon onglet actif
    - Test lazy-load contenu (pas de fetch si onglet pas visité)
  - [ ] Créer `packages/modules/crm/components/client-timeline.test.tsx`
    - Test rendu événements
    - Test ordre chronologique décroissant
    - Test format date relative
  - [ ] Créer `packages/modules/crm/actions/get-client.test.ts`
    - Test format retour `{ data, error }`
    - Test RLS: operator A ne voit que ses clients
    - Test join client_configs
  - [ ] Créer `packages/modules/crm/actions/get-activity-logs.test.ts`
    - Test filtrage par client_id
    - Test ordre DESC
    - Test RLS
  - [ ] Test e2e (Playwright): cliquer client liste → fiche chargée → switch onglets → données correctes

- [ ] Documentation (AC: tous)
  - [ ] Mettre à jour `docs/guide.md`: section "Consulter la fiche d'un client" avec captures des 4 onglets
  - [ ] Mettre à jour `docs/faq.md`: "Comment voir l'historique d'un client?", "Où trouver les documents partagés?"
  - [ ] Mettre à jour `docs/flows.md`: diagramme "Navigation fiche client multi-onglets"

## Dev Notes

### Architecture Patterns

**Data Fetching Pattern:**
- **Server Component** pour la page route (`page.tsx`) — première charge des données client
- **TanStack Query** pour les données des onglets (lazy-load au clic)
- **Server Actions** pour chaque endpoint de données: `getClient`, `getClientActivityLogs`, `getClientDocuments`, `getClientExchanges`
- Format de retour: `{ data, error }` partout

**State Management:**
- **Server data** (client, logs, docs, échanges) → TanStack Query uniquement
- **UI state** (onglet actif) → URL query param (Next.js `useSearchParams`, `useRouter`)
- **Dialog open/close** (formulaire édition) → state local React

**Realtime (optionnel pour v1, prévu Epic 3):**
- Invalider cache TanStack Query quand nouveau message ou log ajouté
- Écouter channel `client:updates:${clientId}` avec Supabase Realtime
- `queryClient.invalidateQueries(['client', clientId])` sur event

**Auth & Security:**
- **RLS** : Policies existantes sur `clients`, `activity_logs`, `documents`, `messages` filtrent par `operator_id`
- **Ownership check** : Les Server Actions vérifient que le client appartient bien à l'operator authentifié
- **Error handling** : Si client non trouvé ou accès refusé → 404 page

### Source Tree Components to Touch

**New Files:**
```
apps/hub/app/(dashboard)/modules/crm/clients/[clientId]/
├── page.tsx                              # NEW: Page route fiche client
└── loading.tsx                           # NEW: Skeleton loader

packages/modules/crm/
├── components/
│   ├── client-header.tsx                 # NEW: Header fiche (nom, badges, actions)
│   ├── client-header.test.tsx            # NEW: Tests
│   ├── client-tabs.tsx                   # NEW: Système onglets avec URL sync
│   ├── client-tabs.test.tsx              # NEW: Tests
│   ├── client-info-tab.tsx               # NEW: Onglet Informations
│   ├── client-info-tab.test.tsx          # NEW: Tests
│   ├── client-timeline.tsx               # NEW: Onglet Historique (timeline)
│   ├── client-timeline.test.tsx          # NEW: Tests
│   ├── client-documents-tab.tsx          # NEW: Onglet Documents
│   ├── client-documents-tab.test.tsx     # NEW: Tests
│   ├── client-exchanges-tab.tsx          # NEW: Onglet Échanges
│   └── client-exchanges-tab.test.tsx     # NEW: Tests
├── actions/
│   ├── get-client.ts                     # NEW: Server Action fetch client complet
│   ├── get-client.test.ts                # NEW: Tests
│   ├── get-activity-logs.ts              # NEW: Server Action fetch historique
│   ├── get-activity-logs.test.ts         # NEW: Tests
│   ├── get-client-documents.ts           # NEW: Server Action fetch documents
│   ├── get-client-documents.test.ts      # NEW: Tests
│   ├── get-client-exchanges.ts           # NEW: Server Action fetch échanges
│   └── get-client-exchanges.test.ts      # NEW: Tests
├── hooks/
│   ├── use-client.ts                     # NEW: useQuery wrapper
│   ├── use-client.test.ts                # NEW: Tests
│   ├── use-client-activity-logs.ts       # NEW: useQuery wrapper
│   ├── use-client-documents.ts           # NEW: useQuery wrapper
│   └── use-client-exchanges.ts           # NEW: useQuery wrapper
```

**Modified Files:**
```
packages/modules/crm/components/client-list.tsx  # ADD: Prefetch au hover (optimisation)
packages/modules/crm/types/crm.types.ts          # ADD: ActivityLog, ClientDocument, ClientExchange types
```

**Database Dependencies:**
- Table `clients` (migration 00001) ✓
- Table `client_configs` (migration 00002) ✓
- Table `activity_logs` (migration 00003, créée Story 1.2) ✓
- Table `documents` (migration 00006, Epic 4) — stub si pas encore créée
- Table `messages` (migration 00008, Epic 3) — stub si pas encore créée

### Testing Standards Summary

**Tests obligatoires:**
1. **Unit tests** (Vitest)
   - Composants: rendu, interactions, changement d'onglet, sync URL
   - Actions: format retour, RLS, transformation camelCase
   - Hooks: queryKey correct, cache invalidation

2. **Integration tests**
   - Flux complet: clic client liste → fiche chargée → switch onglets → données correctes
   - Test lazy-load: onglet pas consulté = pas de fetch

3. **E2E tests** (Playwright)
   - Navigation depuis liste → fiche → 4 onglets fonctionnels
   - URL query param: partage lien avec onglet spécifique → bon onglet ouvert

4. **RLS tests** (Supabase)
   - Operator A ne peut pas voir fiche client de operator B
   - Activity logs filtrés par operator (via client_id → operator_id)

**Coverage target:** >80% sur actions/, hooks/, components/

### Project Structure Notes

**Alignement avec structure unifiée:**
- Route dynamique Next.js: `[clientId]/page.tsx` ✓
- Server Component pour page route (pattern RSC) ✓
- TanStack Query pour lazy-load des onglets ✓
- Tests co-localisés: `*.test.tsx` à côté des sources ✓

**Conventions de nommage respectées:**
- Tables DB: `clients`, `activity_logs`, `documents`, `messages` (snake_case pluriel) ✓
- Colonnes DB: `client_id`, `created_at` (snake_case) ✓
- Types TS: `ActivityLog`, `ClientDocument` (PascalCase) ✓
- Composants: `ClientHeader`, `ClientTabs`, `ClientTimeline` (PascalCase) ✓
- Fichiers: `client-header.tsx`, `use-client.ts` (kebab-case) ✓
- Actions: `getClient()`, `getClientActivityLogs()` (camelCase verbe d'action) ✓

**URL Pattern:**
- Fiche client: `/modules/crm/clients/[clientId]`
- Onglets via query param: `?tab=informations` | `?tab=historique` | `?tab=documents` | `?tab=echanges`
- Exemple complet: `/modules/crm/clients/550e8400-e29b-41d4-a716-446655440000?tab=historique`

**Pas de conflit détecté.** Structure conforme aux patterns d'implémentation.

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-gestion-de-la-relation-client-crm-hub-stories-detaillees.md#Story-2.3]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md#Data-Fetching-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md#State-Management]
- [Source: _bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md#FR4]
- [Source: CLAUDE.md#Data-Fetching-Server-Component-for-read-data]
- [Source: CLAUDE.md#State-Management-strict-separation]

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent during implementation_

### Debug Log References

_To be filled by dev agent during implementation_

### Completion Notes List

_To be filled by dev agent during implementation_

### File List

_To be filled by dev agent during implementation_
