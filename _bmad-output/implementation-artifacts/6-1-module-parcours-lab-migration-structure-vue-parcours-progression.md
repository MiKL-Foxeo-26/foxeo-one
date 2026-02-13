# Story 6.1: Module Parcours Lab — Migration, structure & vue parcours progression

Status: ready-for-dev

## Story

As a **client Lab**,
I want **visualiser mon parcours de création étape par étape avec ma progression**,
So that **je sais où j'en suis et ce qu'il me reste à faire pour atteindre mon objectif**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `parcours_steps` créée avec : id (UUID PK), parcours_id (FK parcours NOT NULL ON DELETE CASCADE), step_number (INTEGER NOT NULL), title (TEXT NOT NULL), description (TEXT NOT NULL), brief_template (TEXT nullable), status (TEXT CHECK 'locked'/'current'/'completed'/'skipped' DEFAULT 'locked'), completed_at (TIMESTAMPTZ nullable), validation_required (BOOLEAN DEFAULT TRUE), validation_id (FK validations nullable), created_at, updated_at. RLS : `parcours_steps_select_owner`, `parcours_steps_select_operator`. Note : La table `parcours` existe déjà depuis Story 2.4 (migration 00017).

2. **AC2 — Module Parcours structure** : Module `packages/modules/parcours/` structuré. Manifest id: `parcours`, targets: `['client-lab']`, requiredTables: `['parcours', 'parcours_templates', 'parcours_steps']`. Composants: parcours-overview, parcours-step-card, parcours-progress-bar. Hook: use-parcours. Actions: get-parcours, update-step-status, complete-step. Types: parcours.types.ts.

3. **AC3 — Vue d'ensemble parcours** : Page `/modules/parcours` affiche : titre du parcours, description, barre de progression (% complété), timeline verticale des étapes. Chaque étape : numéro, titre, statut (badge), icône selon statut. Étapes `locked` : grisées + cadenas. Étape `current` : highlight accent Lab (violet). Étapes `completed` : check vert.

4. **AC4 — Navigation étapes** : Clic sur étape `current` → redirection `/modules/parcours/steps/[stepNumber]` (vue détaillée). Clic sur étape `locked` → tooltip "Complétez l'étape X avant". Clic sur étape `completed` → vue détaillée en lecture seule.

5. **AC5 — Logique progression** : Quand une étape est complétée (`completeStep()`), la suivante passe de `locked` à `current`. Dernière étape complétée → notification MiKL + client "Parcours Lab terminé 🎉".

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests RLS. Tests logique progression. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00034_create_parcours_steps.sql`
  - [ ] 1.2 Table `parcours_steps` avec tous les champs
  - [ ] 1.3 Index : `idx_parcours_steps_parcours_id`, `idx_parcours_steps_status`
  - [ ] 1.4 Trigger updated_at
  - [ ] 1.5 RLS policies
  - [ ] 1.6 Fonction helper `create_parcours_steps_from_template()` (PLPGSQL) pour générer steps depuis template

- [ ] Task 2 — Module Parcours scaffold (AC: #2)
  - [ ] 2.1 `packages/modules/parcours/manifest.ts`
  - [ ] 2.2 `index.ts`, `package.json`, `tsconfig.json`
  - [ ] 2.3 `types/parcours.types.ts`
  - [ ] 2.4 `docs/guide.md`, `faq.md`, `flows.md`

- [ ] Task 3 — Server Actions (AC: #5)
  - [ ] 3.1 `actions/get-parcours.ts` — Récupérer parcours + steps (filtré par RLS)
  - [ ] 3.2 `actions/update-step-status.ts` — Changer statut étape
  - [ ] 3.3 `actions/complete-step.ts` — Compléter étape + unlock suivante + notifications
  - [ ] 3.4 `actions/skip-step.ts` — Marquer étape comme skipped (optionnel, selon règles métier)

- [ ] Task 4 — Hooks TanStack Query (AC: #3)
  - [ ] 4.1 `hooks/use-parcours.ts` — queryKey `['parcours', clientId]`
  - [ ] 4.2 `hooks/use-parcours-steps.ts` — queryKey `['parcours-steps', parcoursId]`

- [ ] Task 5 — Composants UI (AC: #3, #4)
  - [ ] 5.1 `components/parcours-overview.tsx` — Vue d'ensemble avec timeline
  - [ ] 5.2 `components/parcours-progress-bar.tsx` — Barre de progression (X/Y étapes, %)
  - [ ] 5.3 `components/parcours-step-card.tsx` — Card étape dans timeline
  - [ ] 5.4 `components/parcours-step-status-badge.tsx` — Badge statut
  - [ ] 5.5 `components/parcours-timeline.tsx` — Timeline verticale avec lignes de connexion

- [ ] Task 6 — Routes (AC: #3, #4)
  - [ ] 6.1 Client : `apps/client/app/(dashboard)/modules/parcours/page.tsx` — Vue d'ensemble
  - [ ] 6.2 Client : `apps/client/app/(dashboard)/modules/parcours/steps/[stepNumber]/page.tsx` — Vue détaillée étape
  - [ ] 6.3 Loading.tsx et error.tsx

- [ ] Task 7 — Tests (AC: #6)
  - [ ] 7.1 Tests Server Actions : getParcours, completeStep, logique unlock
  - [ ] 7.2 Tests composants : ParcoursOverview, ParcoursTimeline
  - [ ] 7.3 Tests RLS : client A ne voit pas parcours client B
  - [ ] 7.4 Tests progression : compléter step N → unlock step N+1

- [ ] Task 8 — Documentation (AC: #6)
  - [ ] 8.1 `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **NOUVEAU MODULE** : `packages/modules/parcours/` — `manifest.ts` en premier.
- **Table existante** : `parcours` et `parcours_templates` existent déjà (Story 2.4). Cette story ajoute `parcours_steps`.
- **Targets** : Module client Lab uniquement (`client-lab`). MiKL voit les parcours depuis le CRM.
- **Progression linéaire** : Étapes débloquées une par une. Pas de parallélisation en V1.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[PARCOURS:COMPLETE_STEP]`, `[PARCOURS:UNLOCK_NEXT]`

### Base de données

**Migration `00034`** :
```sql
CREATE TABLE parcours_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcours_id UUID NOT NULL REFERENCES parcours(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  brief_template TEXT,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  validation_required BOOLEAN DEFAULT TRUE,
  validation_id UUID REFERENCES validations(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parcours_id, step_number)
);

CREATE INDEX idx_parcours_steps_parcours_id ON parcours_steps(parcours_id);
CREATE INDEX idx_parcours_steps_status ON parcours_steps(status);

-- Fonction helper pour créer les steps depuis le template
CREATE OR REPLACE FUNCTION create_parcours_steps_from_template(
  p_parcours_id UUID,
  p_steps JSONB
) RETURNS VOID AS $$
DECLARE
  step_data JSONB;
  step_idx INTEGER := 0;
BEGIN
  FOR step_data IN SELECT * FROM jsonb_array_elements(p_steps)
  LOOP
    step_idx := step_idx + 1;
    INSERT INTO parcours_steps (
      parcours_id,
      step_number,
      title,
      description,
      brief_template,
      status,
      validation_required
    ) VALUES (
      p_parcours_id,
      step_idx,
      step_data->>'title',
      step_data->>'description',
      step_data->>'brief_template',
      CASE WHEN step_idx = 1 THEN 'current' ELSE 'locked' END,
      COALESCE((step_data->>'validation_required')::BOOLEAN, TRUE)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

**RLS policies** :
```sql
-- Client voit ses parcours steps
CREATE POLICY parcours_steps_select_owner ON parcours_steps FOR SELECT
  USING (
    parcours_id IN (
      SELECT id FROM parcours WHERE client_id IN (
        SELECT id FROM clients WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Opérateur voit tous les parcours steps
CREATE POLICY parcours_steps_select_operator ON parcours_steps FOR SELECT
  USING (
    parcours_id IN (
      SELECT id FROM parcours JOIN clients ON parcours.client_id = clients.id WHERE clients.operator_id = auth.uid()
    )
  );
```

### Server Action — Compléter étape

```typescript
// actions/complete-step.ts
'use server'
import { createServerSupabaseClient } from '@foxeo/supabase/server'
import type { ActionResponse } from '@foxeo/types'
import { successResponse, errorResponse } from '@foxeo/types'

export async function completeStep(stepId: string): Promise<ActionResponse<{ nextStepUnlocked: boolean }>> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return errorResponse('Non authentifié', 'UNAUTHORIZED')

  // Récupérer l'étape + vérifier validation si requise
  const { data: step } = await supabase
    .from('parcours_steps')
    .select('*, parcours(id, client_id)')
    .eq('id', stepId)
    .single()

  if (!step) return errorResponse('Étape non trouvée', 'NOT_FOUND')

  if (step.validation_required && !step.validation_id) {
    return errorResponse('Cette étape nécessite une validation MiKL avant d\'être complétée', 'VALIDATION_REQUIRED')
  }

  // Marquer comme completed
  const { error: updateError } = await supabase
    .from('parcours_steps')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', stepId)

  if (updateError) return errorResponse('Échec mise à jour', 'DATABASE_ERROR', updateError)

  // Unlock étape suivante
  const nextStepNumber = step.step_number + 1
  const { data: nextStep } = await supabase
    .from('parcours_steps')
    .select('id')
    .eq('parcours_id', step.parcours_id)
    .eq('step_number', nextStepNumber)
    .single()

  let nextStepUnlocked = false
  if (nextStep) {
    await supabase
      .from('parcours_steps')
      .update({ status: 'current' })
      .eq('id', nextStep.id)

    nextStepUnlocked = true
  } else {
    // Dernière étape → parcours terminé
    await supabase
      .from('parcours')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', step.parcours_id)

    // Notification client + MiKL
    await supabase.from('notifications').insert([
      {
        recipient_type: 'client',
        recipient_id: step.parcours.client_id,
        type: 'success',
        title: 'Parcours Lab terminé ! 🎉',
        body: 'Félicitations, vous avez complété toutes les étapes de votre parcours.',
      },
      {
        recipient_type: 'operator',
        recipient_id: (await supabase.from('clients').select('operator_id').eq('id', step.parcours.client_id).single()).data?.operator_id,
        type: 'info',
        title: 'Parcours Lab terminé',
        body: `Le client a terminé son parcours Lab.`,
        link: `/modules/crm/clients/${step.parcours.client_id}`,
      }
    ])
  }

  console.log('[PARCOURS:COMPLETE_STEP] Step completed:', stepId, 'Next unlocked:', nextStepUnlocked)

  return successResponse({ nextStepUnlocked })
}
```

### Composant Timeline

```typescript
// components/parcours-timeline.tsx
'use client'
import { ParcoursStepCard } from './parcours-step-card'
import { cn } from '@foxeo/utils'

export function ParcoursTimeline({ steps }: { steps: ParcoursStep[] }) {
  return (
    <div className="space-y-8 relative">
      {/* Ligne verticale */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start gap-4">
          {/* Cercle numéro */}
          <div className={cn(
            "relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-background",
            step.status === 'completed' && "bg-green-500 text-white",
            step.status === 'current' && "bg-purple-600 text-white",
            step.status === 'locked' && "bg-muted text-muted-foreground",
            step.status === 'skipped' && "bg-orange-500 text-white"
          )}>
            {step.status === 'completed' ? (
              <CheckIcon className="w-8 h-8" />
            ) : step.status === 'locked' ? (
              <LockIcon className="w-6 h-6" />
            ) : (
              <span className="text-lg font-bold">{step.step_number}</span>
            )}
          </div>

          {/* Card étape */}
          <ParcoursStepCard step={step} />
        </div>
      ))}
    </div>
  )
}
```

### Module manifest

```typescript
export const manifest: ModuleManifest = {
  id: 'parcours',
  name: 'Parcours Lab',
  description: 'Accompagnement structuré de création pas à pas',
  version: '1.0.0',
  targets: ['client-lab'],
  navigation: { label: 'Mon Parcours', icon: 'map', position: 10 },
  routes: [
    { path: '/parcours', component: 'ParcoursOverviewPage' },
    { path: '/parcours/steps/:stepNumber', component: 'ParcoursStepDetailPage' },
  ],
  requiredTables: ['parcours', 'parcours_templates', 'parcours_steps'],
  dependencies: []
}
```

### Fichiers à créer

**Module parcours :**
```
packages/modules/parcours/
├── manifest.ts, index.ts, package.json, tsconfig.json
├── docs/guide.md, faq.md, flows.md
├── types/parcours.types.ts
├── actions/get-parcours.ts, update-step-status.ts, complete-step.ts, skip-step.ts
├── hooks/use-parcours.ts, use-parcours-steps.ts
└── components/parcours-overview.tsx, parcours-progress-bar.tsx, parcours-step-card.tsx, parcours-step-status-badge.tsx, parcours-timeline.tsx
```

**Routes :**
- `apps/client/app/(dashboard)/modules/parcours/page.tsx`
- `apps/client/app/(dashboard)/modules/parcours/steps/[stepNumber]/page.tsx`

**Migration :**
- `supabase/migrations/00034_create_parcours_steps.sql`

### Fichiers à modifier

Aucun (nouveau module indépendant).

### Dépendances

- **Story 2.4** : Tables `parcours`, `parcours_templates` (déjà créées)
- **Story 3.2** : Table `notifications` pour notifier fin parcours
- Table `clients`, `validations` (référence FK)

### Anti-patterns — Interdit

- NE PAS permettre de compléter une étape sans validation si `validation_required = TRUE`
- NE PAS permettre de sauter des étapes (sauf action explicite `skipStep()`)
- NE PAS stocker la progression dans le localStorage (source de vérité = DB)
- NE PAS afficher toutes les étapes débloquées d'un coup (progression linéaire)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-6-*.md#Story 6.1]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
