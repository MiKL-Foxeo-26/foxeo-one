# Story 2.9c: Upgrader un client Ponctuel vers Lab ou One

Status: ready-for-dev

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

- [ ] Task 1 — Server Action (AC: #3)
  - [ ] 1.1 `actions/upgrade-client.ts` — Upgrade client_type + client_configs + activity log
  - [ ] 1.2 Si Lab : créer parcours via logique partagée avec Story 2.4
  - [ ] 1.3 Si One : mettre à jour active_modules et dashboard_type='one'

- [ ] Task 2 — Types TypeScript (AC: #2)
  - [ ] 2.1 Type `UpgradeClientInput` (clientId, targetType: 'complet' | 'direct_one', parcoursConfig?, modules?)
  - [ ] 2.2 Schéma Zod

- [ ] Task 3 — Composants UI (AC: #1, #2)
  - [ ] 3.1 `components/upgrade-client-dialog.tsx` — Dialog avec deux onglets/modes : Lab ou One
  - [ ] 3.2 Mode Lab : réutiliser composants parcours de Story 2.4 (`ParcoursStageList`, sélection template)
  - [ ] 3.3 Mode One : liste de modules activables avec checkboxes (modules depuis `module_registry`)
  - [ ] 3.4 Boutons upgrade conditionnels sur la fiche client

- [ ] Task 4 — Intégration (AC: #1)
  - [ ] 4.1 Ajouter les boutons upgrade dans la fiche client, section actions
  - [ ] 4.2 Visible uniquement si `client_type === 'ponctuel'`

- [ ] Task 5 — Tests (AC: #4)
  - [ ] 5.1 Tests Server Action upgradeClient : vers Lab, vers One, client non-ponctuel rejeté
  - [ ] 5.2 Tests composant UpgradeClientDialog : modes, soumission
  - [ ] 5.3 Tests edge cases : upgrade vers Lab sans templates, modules invalides

- [ ] Task 6 — Documentation (AC: #4)
  - [ ] 6.1 MAJ `docs/guide.md`, `faq.md`, `flows.md`

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

### Debug Log References

### Completion Notes List

### File List
