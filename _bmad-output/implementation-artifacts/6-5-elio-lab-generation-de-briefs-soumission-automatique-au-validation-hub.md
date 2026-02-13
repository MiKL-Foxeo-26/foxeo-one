# Story 6.5: Élio Lab — Génération de briefs & soumission automatique au validation Hub

Status: ready-for-dev

## Story

As a **client Lab**,
I want **qu'Élio génère automatiquement mes briefs d'étape à partir de nos conversations et les soumette pour validation**,
So that **je gagne du temps et je suis guidé efficacement sans effort de rédaction manuel**.

## Acceptance Criteria

1. **AC1 — Pas de migration DB** : Réutilise les tables existantes : `parcours_steps`, `step_submissions`, `elio_conversations` (Epic 8.2, à créer si pas encore fait).

2. **AC2 — Commande génération** : Dans le chat Élio, bouton "Générer mon brief" visible uniquement si étape `current` et `validation_required = TRUE`. Clic → Élio analyse les derniers messages de la conversation + brief_template de l'étape + profil communication → génère brief complet.

3. **AC3 — Génération brief** : Server Action `generateBrief()` appelle API Claude avec prompt structuré : "Tu es Élio, l'assistant Lab. À partir de cette conversation : [messages], génère un brief professionnel pour l'étape [step.title]. Template : [step.brief_template]. Profil client : [profile]. Format : Markdown structuré." Réponse Claude = brief généré.

4. **AC4 — Aperçu et édition** : Dialog affiche brief généré avec preview markdown. Bouton "Éditer" → textarea éditable. Bouton "Régénérer" (redemande à Claude avec feedback "Améliore ceci..."). Bouton "Soumettre" → crée `step_submission` avec `submission_content = brief généré`.

5. **AC5 — Soumission automatique** : Après soumission, flow identique Story 6.3 : notification MiKL, étape passe en `pending_validation`, client notifié. Possibilité de voir le brief soumis dans `/modules/parcours/steps/[stepNumber]/submission`.

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests génération brief (mock API Claude). Tests workflow complet. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Server Action génération (AC: #3)
  - [ ] 1.1 `actions/generate-brief.ts` — Récupère conversation + étape + profil → appelle API Claude
  - [ ] 1.2 Prompt structuré pour génération brief
  - [ ] 1.3 Parsing réponse Claude (markdown)

- [ ] Task 2 — Composants UI (AC: #2, #4)
  - [ ] 2.1 Bouton "Générer mon brief" dans composant chat Élio
  - [ ] 2.2 `components/generated-brief-dialog.tsx` — Dialog aperçu + édition + soumission
  - [ ] 2.3 Preview markdown du brief généré
  - [ ] 2.4 Textarea édition brief

- [ ] Task 3 — Intégration soumission (AC: #5)
  - [ ] 3.1 Réutiliser `submitStep()` de Story 6.3
  - [ ] 3.2 Passer `content = brief généré` au submit
  - [ ] 3.3 Redirection après soumission

- [ ] Task 4 — Tests (AC: #6)
  - [ ] 4.1 Tests Server Action : generateBrief (mock API Claude)
  - [ ] 4.2 Tests composants : GeneratedBriefDialog
  - [ ] 4.3 Tests intégration : génération → édition → soumission → validation

- [ ] Task 5 — Documentation (AC: #6)
  - [ ] 5.1 Mise à jour `docs/guide.md` module Élio

## Dev Notes

### Architecture — Règles critiques

- **Extension module Élio** : Pas de nouveau module, extend `packages/modules/elio/`.
- **API Claude** : Appel via Edge Function ou Server Action sécurisée. Ne jamais exposer la clé API côté client.
- **Conversation context** : Récupérer les N derniers messages (ex: 20) pour contexte suffisant sans exploser le token limit.
- **Édition** : Le client peut éditer le brief avant soumission. Important pour ownership.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[ELIO:GENERATE_BRIEF]`, `[ELIO:REGENERATE_BRIEF]`

### Server Action — Génération brief

```typescript
// actions/generate-brief.ts
'use server'
import { createServerSupabaseClient } from '@foxeo/supabase/server'
import type { ActionResponse } from '@foxeo/types'
import { successResponse, errorResponse } from '@foxeo/types'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function generateBrief(stepId: string): Promise<ActionResponse<{ brief: string }>> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return errorResponse('Non authentifié', 'UNAUTHORIZED')

  // Récupérer étape + client + profil
  const { data: step } = await supabase
    .from('parcours_steps')
    .select('*, parcours(client_id)')
    .eq('id', stepId)
    .single()

  if (!step) return errorResponse('Étape non trouvée', 'NOT_FOUND')

  const { data: profile } = await supabase
    .from('communication_profiles')
    .select('*')
    .eq('client_id', step.parcours.client_id)
    .single()

  // Récupérer derniers messages conversation (TODO: Story 8.2 créera table elio_conversations)
  // Pour l'instant, simuler ou récupérer depuis autre source
  const conversationContext = "Simulation conversation client..." // À remplacer par vraie récupération

  // Construire prompt
  const prompt = `Tu es Élio, l'assistant IA personnel du client dans son parcours Foxeo Lab.

Le client est à l'étape ${step.step_number} : "${step.title}".
Description de l'étape : ${step.description}

**Template du brief attendu :**
${step.brief_template || 'Brief libre'}

**Extrait de la conversation avec le client :**
${conversationContext}

**Profil de communication du client :**
- Ton : ${profile?.preferred_tone || 'friendly'}
- Longueur : ${profile?.preferred_length || 'balanced'}

**Tâche :**
À partir de cette conversation, génère un brief professionnel et structuré en markdown pour cette étape.
Le brief doit :
- Refléter les échanges et les décisions prises
- Être clair et actionnable pour MiKL qui va le valider
- Respecter le template si fourni
- Utiliser un format markdown (headings, listes, etc.)

Génère uniquement le brief, sans introduction ni commentaire additionnel.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const brief = message.content[0].type === 'text' ? message.content[0].text : ''

    console.log('[ELIO:GENERATE_BRIEF] Brief généré:', brief.substring(0, 100) + '...')

    return successResponse({ brief })
  } catch (error) {
    console.error('[ELIO:GENERATE_BRIEF] Error:', error)
    return errorResponse('Échec génération brief', 'API_ERROR', error)
  }
}
```

### Dialog aperçu brief

```typescript
// components/generated-brief-dialog.tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@foxeo/ui/components/dialog'
import { Button } from '@foxeo/ui/components/button'
import { Textarea } from '@foxeo/ui/components/textarea'
import { BriefMarkdownRenderer } from './brief-markdown-renderer'
import { submitStep } from '../actions/submit-step'
import { generateBrief } from '../actions/generate-brief'
import { toast } from '@foxeo/ui/components/use-toast'
import { useRouter } from 'next/navigation'

export function GeneratedBriefDialog({
  isOpen,
  onClose,
  stepId,
}: {
  isOpen: boolean
  onClose: () => void
  stepId: string
}) {
  const router = useRouter()
  const [brief, setBrief] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Génération initiale au montage
  useState(() => {
    if (isOpen && !brief) {
      handleGenerate()
    }
  }, [isOpen])

  const handleGenerate = async () => {
    setIsGenerating(true)
    const response = await generateBrief(stepId)

    if (response.error) {
      toast({ title: 'Erreur', description: response.error.message, variant: 'destructive' })
      setIsGenerating(false)
      return
    }

    setBrief(response.data.brief)
    setIsGenerating(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const response = await submitStep({ stepId, content: brief })

    if (response.error) {
      toast({ title: 'Erreur', description: response.error.message, variant: 'destructive' })
      setIsSubmitting(false)
      return
    }

    toast({ title: 'Brief soumis', description: 'MiKL va valider votre travail.' })
    onClose()
    router.push('/modules/parcours')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Votre brief généré par Élio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isGenerating ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
              <p className="mt-4 text-muted-foreground">Élio génère votre brief...</p>
            </div>
          ) : isEditing ? (
            <Textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <BriefMarkdownRenderer content={brief} />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Aperçu' : 'Éditer'}
            </Button>
            <Button variant="ghost" onClick={handleGenerate} disabled={isGenerating}>
              Régénérer
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !brief}>
              {isSubmitting ? 'Soumission...' : 'Soumettre pour validation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Bouton dans chat Élio

```typescript
// Intégration dans le composant chat Élio
export function ElioChatInput({ currentStep }: { currentStep?: ParcoursStep }) {
  const [showBriefDialog, setShowBriefDialog] = useState(false)

  const canGenerateBrief = currentStep?.status === 'current' && currentStep?.validation_required

  return (
    <div className="space-y-2">
      {canGenerateBrief && (
        <Button
          onClick={() => setShowBriefDialog(true)}
          variant="outline"
          className="w-full"
          size="sm"
        >
          ✨ Générer mon brief avec Élio
        </Button>
      )}

      <textarea placeholder="Message à Élio..." />

      <GeneratedBriefDialog
        isOpen={showBriefDialog}
        onClose={() => setShowBriefDialog(false)}
        stepId={currentStep?.id || ''}
      />
    </div>
  )
}
```

### Fichiers à créer

**Module Élio (extension) :**
```
packages/modules/elio/
├── actions/generate-brief.ts
└── components/generated-brief-dialog.tsx
```

### Fichiers à modifier

- Composant chat Élio : Ajouter bouton "Générer mon brief"
- `actions/submit-step.ts` (Story 6.3) : Déjà compatible, aucune modification

### Dépendances

- **Story 6.3** : `submitStep()`, table `step_submissions`
- **Story 6.4** : Table `communication_profiles`, helper `buildElioSystemPrompt()`
- **Story 6.1** : Table `parcours_steps`
- **Epic 8.2** : Table `elio_conversations` (à créer dans Epic 8 pour historique complet)
- API Claude (Anthropic)
- Package `@anthropic-ai/sdk`

### Anti-patterns — Interdit

- NE PAS générer le brief sans contexte conversation (sinon générique et inutile)
- NE PAS empêcher l'édition du brief (client doit pouvoir ajuster)
- NE PAS exposer la clé API Anthropic côté client (Server Action obligatoire)
- NE PAS soumettre automatiquement sans validation du client (ownership)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-6-*.md#Story 6.5]
- [Source: docs/project-context.md]
- [Anthropic API: https://docs.anthropic.com/]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
