# Story 6.4: Élio Lab — Conversation guidée & adaptation au profil communication

Status: ready-for-dev

## Story

As a **client Lab**,
I want **converser avec Élio de façon guidée selon mon profil de communication et recevoir des réponses adaptées**,
So that **l'interaction est naturelle, personnalisée et m'aide efficacement dans mon parcours**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `communication_profiles` créée avec : id (UUID PK), client_id (FK clients NOT NULL UNIQUE), preferred_tone (TEXT CHECK 'formal'/'casual'/'technical'/'friendly' DEFAULT 'friendly'), preferred_length (TEXT CHECK 'concise'/'detailed'/'balanced' DEFAULT 'balanced'), interaction_style (TEXT CHECK 'directive'/'explorative'/'collaborative' DEFAULT 'collaborative'), context_preferences (JSONB DEFAULT '{}' — exemples, analogies, etc.), created_at, updated_at. RLS : `communication_profiles_select_owner`, `communication_profiles_update_owner`.

2. **AC2 — Profil initial** : À la première conversation Élio, dialog "Personnalisons Élio" avec 4 questions rapides : (1) Ton préféré (formel/casual/technique/amical), (2) Longueur réponses (concises/détaillées/équilibrées), (3) Style interaction (directif/exploratif/collaboratif), (4) Préférences contexte (exemples concrets / théorie / mix). Server Action `createCommunicationProfile()`. Skip possible → valeurs par défaut.

3. **AC3 — Injection profil dans prompts** : Quand client envoie message Élio, le profil est récupéré et injecté dans le system prompt API Claude : "Ton: [tone], Longueur: [length], Style: [style], Contexte: [preferences]". Élio adapte ses réponses en conséquence.

4. **AC4 — Conversation guidée** : Élio Lab propose des questions guidées selon l'étape du parcours en cours. Exemples : "Étape 1 — Définir ton projet : As-tu déjà une idée précise ou veux-tu explorer ?", "Étape 3 — Choix du nom : Veux-tu un nom descriptif ou créatif ?". Suggestions affichées en chips cliquables au-dessus du textarea.

5. **AC5 — Modification profil** : Dans paramètres utilisateur, section "Profil de communication Élio" — formulaire pour modifier les 4 préférences. Enregistrement → réapplique immédiatement dans les conversations.

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests RLS. Tests injection profil dans prompt. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00037_create_communication_profiles.sql`
  - [ ] 1.2 Table `communication_profiles` avec tous les champs
  - [ ] 1.3 Index : `idx_communication_profiles_client_id`
  - [ ] 1.4 Trigger updated_at
  - [ ] 1.5 RLS policies

- [ ] Task 2 — Server Actions (AC: #2, #5)
  - [ ] 2.1 `actions/create-communication-profile.ts` — Créer profil initial
  - [ ] 2.2 `actions/update-communication-profile.ts` — Modifier profil
  - [ ] 2.3 `actions/get-communication-profile.ts` — Récupérer profil

- [ ] Task 3 — Dialog personnalisation initiale (AC: #2)
  - [ ] 3.1 `components/personalize-elio-dialog.tsx` — Dialog 4 questions
  - [ ] 3.2 Détection première conversation (si profil inexistant)
  - [ ] 3.3 Enregistrement profil + fermeture dialog

- [ ] Task 4 — Injection profil dans prompts (AC: #3)
  - [ ] 4.1 Fonction helper `buildElioSystemPrompt(profile: CommunicationProfile, step?: ParcoursStep): string`
  - [ ] 4.2 Intégration dans le module Élio (Edge Function ou Server Action)
  - [ ] 4.3 Template prompt avec variables : tone, length, style, context

- [ ] Task 5 — Suggestions guidées (AC: #4)
  - [ ] 5.1 `components/elio-guided-suggestions.tsx` — Chips suggestions selon étape parcours
  - [ ] 5.2 Données suggestions stockées en JSON (par étape)
  - [ ] 5.3 Clic suggestion → remplit textarea + envoie message

- [ ] Task 6 — Paramètres profil communication (AC: #5)
  - [ ] 6.1 `apps/client/app/(dashboard)/settings/communication/page.tsx`
  - [ ] 6.2 Formulaire modification profil
  - [ ] 6.3 Toast confirmation + invalidation cache

- [ ] Task 7 — Tests (AC: #6)
  - [ ] 7.1 Tests Server Actions : createProfile, updateProfile
  - [ ] 7.2 Tests helper : buildElioSystemPrompt avec différents profils
  - [ ] 7.3 Tests composants : PersonalizeElioDialog, ElioGuidedSuggestions
  - [ ] 7.4 Tests RLS : client A ne voit pas profil client B

- [ ] Task 8 — Documentation (AC: #6)
  - [ ] 8.1 Documentation profil communication dans `docs/elio-customization.md`

## Dev Notes

### Architecture — Règles critiques

- **Nouveau module Élio** : Cette story prépare l'infrastructure, mais le module Élio complet est dans Epic 8. Créer `packages/modules/elio/` si pas déjà fait.
- **System prompt** : Le profil est injecté dans le system prompt de l'API Claude. Ne jamais exposer le profil côté client dans le prompt visible.
- **Suggestions guidées** : Basées sur l'étape du parcours en cours (`parcours_steps.step_number`).
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[ELIO:CREATE_PROFILE]`, `[ELIO:INJECT_PROFILE]`

### Base de données

**Migration `00037`** :
```sql
CREATE TABLE communication_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  preferred_tone TEXT NOT NULL DEFAULT 'friendly' CHECK (preferred_tone IN ('formal', 'casual', 'technical', 'friendly')),
  preferred_length TEXT NOT NULL DEFAULT 'balanced' CHECK (preferred_length IN ('concise', 'detailed', 'balanced')),
  interaction_style TEXT NOT NULL DEFAULT 'collaborative' CHECK (interaction_style IN ('directive', 'explorative', 'collaborative')),
  context_preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_communication_profiles_client_id ON communication_profiles(client_id);
```

**RLS policies** :
```sql
-- Client voit son profil
CREATE POLICY communication_profiles_select_owner ON communication_profiles FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client peut modifier son profil
CREATE POLICY communication_profiles_update_owner ON communication_profiles FOR UPDATE
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client peut créer son profil
CREATE POLICY communication_profiles_insert_owner ON communication_profiles FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));
```

### Helper — Build System Prompt

```typescript
// packages/modules/elio/utils/build-system-prompt.ts
import type { CommunicationProfile, ParcoursStep } from '../types'

export function buildElioSystemPrompt(
  profile: CommunicationProfile,
  step?: ParcoursStep
): string {
  const toneInstructions = {
    formal: "Adoptez un ton professionnel et formel.",
    casual: "Utilisez un ton décontracté et accessible.",
    technical: "Privilégiez un vocabulaire technique et précis.",
    friendly: "Soyez chaleureux et amical dans vos réponses.",
  }

  const lengthInstructions = {
    concise: "Répondez de façon concise (2-3 phrases maximum).",
    detailed: "Fournissez des réponses détaillées et exhaustives.",
    balanced: "Équilibrez concision et détails (4-6 phrases).",
  }

  const styleInstructions = {
    directive: "Donnez des instructions claires et des recommandations directes.",
    explorative: "Posez des questions pour explorer davantage les besoins.",
    collaborative: "Proposez des options et impliquez le client dans la décision.",
  }

  const contextInstructions = profile.context_preferences?.examples
    ? "Utilisez des exemples concrets pour illustrer vos propos."
    : profile.context_preferences?.theory
    ? "Fournissez des explications théoriques."
    : "Mélangez exemples et théorie."

  let stepContext = ""
  if (step) {
    stepContext = `\n\nLe client est actuellement à l'étape ${step.step_number} : "${step.title}". ${step.description}\n\nVotre rôle est de l'aider à progresser sur cette étape en particulier.`
  }

  return `Vous êtes Élio, l'assistant IA personnel du client dans son parcours Foxeo Lab.

**Profil de communication du client :**
- Ton : ${toneInstructions[profile.preferred_tone]}
- Longueur : ${lengthInstructions[profile.preferred_length]}
- Style : ${styleInstructions[profile.interaction_style]}
- Contexte : ${contextInstructions}
${stepContext}

Adaptez vos réponses selon ces préférences tout en restant utile et bienveillant.`
}
```

### Dialog personnalisation

```typescript
// components/personalize-elio-dialog.tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@foxeo/ui/components/dialog'
import { Button } from '@foxeo/ui/components/button'
import { RadioGroup, RadioGroupItem } from '@foxeo/ui/components/radio-group'
import { Label } from '@foxeo/ui/components/label'
import { createCommunicationProfile } from '../actions/create-communication-profile'
import { toast } from '@foxeo/ui/components/use-toast'

export function PersonalizeElioDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tone, setTone] = useState<string>('friendly')
  const [length, setLength] = useState<string>('balanced')
  const [style, setStyle] = useState<string>('collaborative')
  const [context, setContext] = useState<string>('mixed')

  const handleSubmit = async () => {
    const response = await createCommunicationProfile({
      preferred_tone: tone,
      preferred_length: length,
      interaction_style: style,
      context_preferences: { examples: context === 'examples', theory: context === 'theory' },
    })

    if (response.error) {
      toast({ title: 'Erreur', description: response.error.message, variant: 'destructive' })
      return
    }

    toast({ title: 'Profil créé', description: 'Élio va maintenant s\'adapter à vos préférences.' })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Personnalisons Élio 🤖</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question 1 : Ton */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Quel ton préférez-vous ?</Label>
            <RadioGroup value={tone} onValueChange={setTone}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friendly" id="tone-friendly" />
                <Label htmlFor="tone-friendly" className="font-normal">Amical et chaleureux</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="casual" id="tone-casual" />
                <Label htmlFor="tone-casual" className="font-normal">Décontracté</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formal" id="tone-formal" />
                <Label htmlFor="tone-formal" className="font-normal">Formel et professionnel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical" id="tone-technical" />
                <Label htmlFor="tone-technical" className="font-normal">Technique et précis</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2 : Longueur */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Longueur des réponses ?</Label>
            <RadioGroup value={length} onValueChange={setLength}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concise" id="length-concise" />
                <Label htmlFor="length-concise" className="font-normal">Concises (2-3 phrases)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="length-balanced" />
                <Label htmlFor="length-balanced" className="font-normal">Équilibrées (4-6 phrases)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="length-detailed" />
                <Label htmlFor="length-detailed" className="font-normal">Détaillées (paragraphes complets)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 3 : Style interaction */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Comment souhaitez-vous interagir ?</Label>
            <RadioGroup value={style} onValueChange={setStyle}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="directive" id="style-directive" />
                <Label htmlFor="style-directive" className="font-normal">Directif (recommandations claires)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="explorative" id="style-explorative" />
                <Label htmlFor="style-explorative" className="font-normal">Exploratif (questions pour creuser)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collaborative" id="style-collaborative" />
                <Label htmlFor="style-collaborative" className="font-normal">Collaboratif (options + co-décision)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 4 : Contexte */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Type d'explications ?</Label>
            <RadioGroup value={context} onValueChange={setContext}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="examples" id="context-examples" />
                <Label htmlFor="context-examples" className="font-normal">Exemples concrets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="theory" id="context-theory" />
                <Label htmlFor="context-theory" className="font-normal">Explications théoriques</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="context-mixed" />
                <Label htmlFor="context-mixed" className="font-normal">Mix des deux</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Passer</Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Suggestions guidées — Données

```typescript
// data/elio-suggestions.ts
export const ELIO_SUGGESTIONS_BY_STEP = {
  1: [
    "J'ai une idée précise, aide-moi à la structurer",
    "Je veux explorer plusieurs directions",
    "Aide-moi à identifier mes forces",
  ],
  2: [
    "Qui sont mes clients idéaux ?",
    "Quel problème est-ce que je résous ?",
    "Comment me différencier de la concurrence ?",
  ],
  3: [
    "Trouve-moi des noms créatifs",
    "Vérifie la disponibilité de ce nom",
    "Comment choisir entre plusieurs noms ?",
  ],
  // ... autres étapes
}
```

### Fichiers à créer

**Module Élio (scaffold si pas existant) :**
```
packages/modules/elio/
├── manifest.ts, index.ts, package.json, tsconfig.json
├── docs/guide.md, faq.md, flows.md
├── types/communication-profile.types.ts
├── actions/create-communication-profile.ts, update-communication-profile.ts, get-communication-profile.ts
├── utils/build-system-prompt.ts
├── components/personalize-elio-dialog.tsx, elio-guided-suggestions.tsx
└── data/elio-suggestions.ts
```

**Routes :**
- `apps/client/app/(dashboard)/settings/communication/page.tsx`

**Migration :**
- `supabase/migrations/00037_create_communication_profiles.sql`

### Fichiers à modifier

- Module Élio (Edge Function ou Server Action) : Intégrer `buildElioSystemPrompt()` dans les appels API Claude

### Dépendances

- **Story 6.1** : Table `parcours_steps` pour context étape en cours
- Table `clients`
- API Claude (Anthropic) pour Élio

### Anti-patterns — Interdit

- NE PAS exposer le profil dans le prompt visible côté client (sécurité)
- NE PAS ignorer le profil dans les réponses Élio (doit être effectif)
- NE PAS forcer la personnalisation (skip doit être possible)
- NE PAS stocker les conversations dans cette story (voir Epic 8.2)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-6-*.md#Story 6.4]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
