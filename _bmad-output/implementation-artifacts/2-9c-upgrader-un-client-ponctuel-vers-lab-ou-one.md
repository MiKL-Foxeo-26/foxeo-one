# Story 2.9c: Upgrader un client Ponctuel vers Lab ou One

Status: done

## Story

As a **MiKL (opérateur)**,
I want **upgrader un client Ponctuel vers un parcours Lab ou un dashboard One**,
So that **je peux faire évoluer la relation client selon ses besoins**.

## Acceptance Criteria

1. **AC1 — Boutons upgrade** : Sur la fiche d'un client Ponctuel, boutons "Upgrader vers Lab" et "Upgrader vers One" (FR90). Boutons visibles uniquement si `client_type = 'ponctuel'`.

2. **AC2 — Dialog upgrade** : Dialog avec type cible pré-sélectionné selon le bouton cliqué. Configuration selon le type :
   - **Lab** : Sélection du template de parcours (réutiliser `AssignParcoursDialog` de Story 2.4), étapes à activer
   - **One** : Sélection des modules à activer, confirmation dashboard_type

3. **AC3 — Server Action `upgradeClient()`** : Met à jour `client_type` (ponctuel → complet ou direct_one). Met à jour `client_configs` : dashboard_type, active_modules ou parcours_config selon le type cible. Toast "Client upgradé vers Lab/One". Entrée `activity_logs` (action: `client_upgraded`). Invalidation cache.

4. **AC4 — Tests** : Tests unitaires co-localisés. Coverage >80%.

## Tasks / Subtasks

- [x] Task 1 — Server Action (AC: #3)
  - [x] 1.1 `actions/upgrade-client.ts` — Upgrade client_type + client_configs + activity log
  - [x] 1.2 Si Lab : créer parcours via logique partagée avec Story 2.4
  - [x] 1.3 Si One : mettre à jour active_modules et dashboard_type='one'

- [x] Task 2 — Types TypeScript (AC: #2)
  - [x] 2.1 Type `UpgradeClientInput` (clientId, targetType: 'complet' | 'direct_one', parcoursConfig?, modules?)
  - [x] 2.2 Schéma Zod

- [x] Task 3 — Composants UI (AC: #1, #2)
  - [x] 3.1 `components/upgrade-client-dialog.tsx` — Dialog avec deux onglets/modes : Lab ou One
  - [x] 3.2 Mode Lab : réutiliser composants parcours de Story 2.4 (`ParcoursStageList`, sélection template)
  - [x] 3.3 Mode One : liste de modules activables avec checkboxes (modules depuis `module_registry`)
  - [x] 3.4 Boutons upgrade conditionnels sur la fiche client

- [x] Task 4 — Intégration (AC: #1)
  - [x] 4.1 Ajouter les boutons upgrade dans la fiche client, section actions
  - [x] 4.2 Visible uniquement si `client_type === 'ponctuel'`

- [x] Task 5 — Tests (AC: #4)
  - [x] 5.1 Tests Server Action upgradeClient : vers Lab, vers One, client non-ponctuel rejeté
  - [x] 5.2 Tests composant UpgradeClientDialog : modes, soumission
  - [x] 5.3 Tests edge cases : upgrade vers Lab sans templates, modules invalides

- [x] Task 6 — Documentation (AC: #4)
  - [x] 6.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **Response format** : `{ data, error }` — JAMAIS throw.
- **Réutilisation** : Réutiliser la logique d'assignation parcours de Story 2.4 pour le mode Lab.
- **Logging** : `[CRM:UPGRADE_CLIENT]`

### Logique upgrade

**Vers Lab (`complet`)** :
```typescript
// 1. Update client_type
await supabase.from('clients').update({ client_type: 'complet' }).eq('id', clientId)

// 2. Update client_configs
await supabase.from('client_configs').update({
  dashboard_type: 'lab',
  parcours_config: { templateId, stages: activeStages }
}).eq('client_id', clientId)

// 3. Créer parcours (réutiliser logique Story 2.4)
await supabase.from('parcours').insert({
  client_id: clientId,
  template_id: templateId,
  operator_id: operatorId,
  active_stages: activeStages,
  status: 'en_cours'
})
```

**Vers One (`direct_one`)** :
```typescript
// 1. Update client_type
await supabase.from('clients').update({ client_type: 'direct_one' }).eq('id', clientId)

// 2. Update client_configs
await supabase.from('client_configs').update({
  dashboard_type: 'one',
  active_modules: selectedModules // ex: ['core-dashboard', 'documents', 'chat']
}).eq('client_id', clientId)
```

**Validation** : Refuser l'upgrade si `client_type !== 'ponctuel'` :
```typescript
if (client.client_type !== 'ponctuel') {
  return errorResponse('Seuls les clients Ponctuel peuvent être upgradés', 'VALIDATION_ERROR')
}
```

### Modules disponibles pour One

La liste des modules activables vient du `module_registry` (auto-découverte). Pour cette story, afficher les modules dont `targets` inclut `'client'` ou `'one'`.

**ATTENTION** : À ce stade du développement, peu de modules sont disponibles. Prévoir un état "Aucun module supplémentaire disponible" avec les modules de base (`core-dashboard`).

### Composants à réutiliser

- `ParcoursStageList` de Story 2.4 (pour mode Lab)
- `AssignParcoursDialog` — ou ses sous-composants (sélection template, étapes)
- Composants shadcn/ui : `<Dialog>`, `<Tabs>`, `<Checkbox>`, `<Button>`

### Fichiers à créer

- `packages/modules/crm/actions/upgrade-client.ts`
- `packages/modules/crm/components/upgrade-client-dialog.tsx`
- Tests co-localisés

### Fichiers à modifier

- `packages/modules/crm/types/crm.types.ts` (UpgradeClientInput)
- `packages/modules/crm/index.ts` (exports)
- Composant fiche client (boutons upgrade conditionnels)
- `packages/modules/crm/docs/guide.md`, `faq.md`, `flows.md`

### Dépendances

- **Story 2.4** : Tables parcours + parcours_templates (migration 00017) et composants parcours
- **Story 2.3** : Fiche client pour intégration boutons
- Table `clients` (migration 00002) et `client_configs` (migration 00003)

### Anti-patterns — Interdit

- NE PAS permettre l'upgrade d'un client non-ponctuel (valider côté serveur)
- NE PAS dupliquer la logique d'assignation parcours (réutiliser Story 2.4)
- NE PAS throw dans les Server Actions
- NE PAS hardcoder la liste des modules (charger depuis registry)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-2-*.md#Story 2.9c]
- [Source: _bmad-output/planning-artifacts/prd/types-de-clients.md]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

Aucun blocage. Test d'hoisting corrigé en remplaçant le pattern `vi.fn().mockResolvedValue(variable)` par une factory closure `vi.fn(() => Promise.resolve(...))`.

### Completion Notes List

- ✅ **Task 1** : `actions/upgrade-client.ts` — Server Action complète avec deux branches (Lab/One). Réutilise la logique d'insertion parcours de Story 2.4. Validation serveur : reject si `client_type !== 'ponctuel'`. Activity log `client_upgraded` inséré. `revalidatePath` sur `/crm` et `/crm/clients/{id}`.
- ✅ **Task 2** : `UpgradeClientInput` Zod schema ajouté dans `crm.types.ts`. Type union `complet | direct_one` pour `targetType`. `parcoursConfig` et `modules` optionnels.
- ✅ **Task 3** : `components/upgrade-client-dialog.tsx` — Dialog avec `Tabs` Lab/One. Mode Lab réutilise `ParcoursStageList` + template selection de `AssignParcoursDialog`. Mode One affiche les modules disponibles via `AVAILABLE_MODULES` (constant interne, core-dashboard requis).
- ✅ **Task 4** : `ClientLifecycleActions` modifié — boutons "Upgrader vers Lab" et "Upgrader vers One" conditionnels sur `clientType === 'ponctuel'` et `status === 'active'`.
- ✅ **Task 5** : 13 tests unitaires `upgradeClient`, 7 tests `UpgradeClientDialog`, 8 tests types `UpgradeClientInput`, 3 tests supplémentaires `ClientLifecycleActions`. Total 508 tests, 0 régression.
- ✅ **Task 6** : `guide.md`, `faq.md`, `flows.md` mis à jour avec flux Mermaid complet et 6 nouvelles questions FAQ.

### File List

- `packages/modules/crm/actions/upgrade-client.ts` (créé)
- `packages/modules/crm/actions/upgrade-client.test.ts` (créé)
- `packages/modules/crm/components/upgrade-client-dialog.tsx` (créé)
- `packages/modules/crm/components/upgrade-client-dialog.test.tsx` (créé)
- `packages/modules/crm/types/crm.types.ts` (modifié — UpgradeClientInput ajouté)
- `packages/modules/crm/types/crm.types.test.ts` (modifié — tests UpgradeClientInput)
- `packages/modules/crm/components/client-lifecycle-actions.tsx` (modifié — boutons upgrade)
- `packages/modules/crm/components/client-lifecycle-actions.test.tsx` (modifié — 3 tests ajoutés)
- `packages/modules/crm/index.ts` (modifié — exports UpgradeClientDialog, upgradeClient, UpgradeClientInput)
- `packages/modules/crm/docs/guide.md` (modifié)
- `packages/modules/crm/docs/faq.md` (modifié)
- `packages/modules/crm/docs/flows.md` (modifié)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modifié — in-progress → done)

### Code Review Record

**Reviewer model**: claude-sonnet-4-5-20250929 (adversarial code review workflow)

**8 findings — all fixed:**

1. **HIGH — Missing duplicate parcours check** : `upgradeToLab()` n'avait pas de vérification de parcours `en_cours` existant (contrairement à `assign-parcours.ts`). Ajout d'un `maybeSingle` check avant insertion.
2. **HIGH — Missing template existence validation** : `upgradeToLab()` n'avait pas de vérification que le `templateId` existe dans `parcours_templates`. Ajout d'un `single()` fetch avec gestion d'erreur `NOT_FOUND`.
3. **MEDIUM — Missing template name in parcours_config** : `parcours_config` ne contenait pas le `name` du template. Ajout de `name: template.name` pour cohérence avec `assign-parcours.ts`.
4. **MEDIUM — No server-side status check** : L'action ne vérifiait pas `status === 'active'` côté serveur. Ajout de la colonne `status` au SELECT + rejet si non-actif.
5. **MEDIUM — Tabs mock too simplistic** : Le mock `TabsContent` rendait tous les contenus simultanément. Corrigé avec un `currentTabValue` module-level pour ne rendre que l'onglet actif.
6. **MEDIUM — AVAILABLE_MODULES hardcoded** : Violation de l'anti-pattern « NE PAS hardcoder la liste des modules ». Remplacé par `getModulesForTarget('client-one')` du module registry.
7. **LOW — Weak test assertion for default modules** : `expect(mockConfigUpdate).toHaveBeenCalled()` trop faible. Renforcé avec `expect.objectContaining({ active_modules: ['core-dashboard'] })`.
8. **LOW — Pre-existing ClientTypeEnum `direct-one` vs `direct_one`** : Mismatch entre DB migration (`direct_one`) et TypeScript enum (`direct-one`). Corrigé dans 14 fichiers à travers le codebase.

**Fichiers supplémentaires modifiés par le code review (fix #8):**
- `packages/modules/crm/components/client-filters-panel.tsx`
- `packages/modules/crm/components/client-form.tsx`
- `packages/modules/crm/components/client-info-tab.tsx`
- `packages/modules/crm/components/client-header.tsx`
- `packages/modules/crm/components/client-list.tsx`
- `packages/modules/crm/components/client-list.test.tsx`
- `packages/modules/crm/components/time-per-client-table.tsx`
- `packages/modules/crm/components/time-per-client-table.test.tsx`
- `packages/modules/crm/actions/get-portfolio-stats.ts`
- `packages/modules/crm/actions/get-portfolio-stats.test.ts`
- `packages/modules/crm/actions/get-time-per-client.test.ts`
- `packages/utils/src/validation-schemas.ts`

**Final test run**: 109 test files, 1086 tests, 0 failures, 45 skipped (RLS)
