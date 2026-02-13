# Story 8.4: Profil de communication — Stockage, affinement & transmission graduation

Status: ready-for-dev

## Story

As a **opérateur ou agent IA**,
I want **un système de profil de communication par client qui est stocké, affiné par Élio Lab, et transmis à Élio One lors de la graduation**,
So that **chaque client bénéficie d'une communication adaptée à son style tout au long de son parcours Foxeo**.

## Acceptance Criteria

### AC1 : Structure du profil de communication (FR66)

**Given** le système de profil de communication doit être formalisé
**When** la structure est mise en place
**Then** le profil de communication est stocké dans `client_configs.elio_config.communication_profile` avec la structure suivante :

```typescript
type CommunicationProfile = {
  levelTechnical: 'beginner' | 'intermediaire' | 'advanced'
  styleExchange: 'direct' | 'conversationnel' | 'formel'
  adaptedTone: 'formel' | 'pro_decontracte' | 'chaleureux' | 'coach'
  messageLength: 'court' | 'moyen' | 'detaille'
  tutoiement: boolean
  concreteExamples: boolean
  avoid: string[]          // ex: ["jargon technique", "questions ouvertes"]
  privilege: string[]      // ex: ["listes à puces", "questions fermées"]
  styleNotes: string       // notes libres
}
```

**And** un schéma Zod `communicationProfileSchema` valide cette structure
**And** un profil par défaut existe dans `@foxeo/utils` (DEFAULT_COMMUNICATION_PROFILE)

### AC2 : Injection du profil par MiKL (FR67)

**Given** Orpheus (hors périmètre applicatif) génère un profil de communication pour un client
**When** MiKL injecte ce profil via la fiche client (Story 6.6)
**Then** le profil est stocké dans `client_configs.elio_config.communication_profile`

**And** le profil est immédiatement utilisé par Élio Lab pour adapter ses réponses

### AC3 : Affinement par Élio Lab (FR67)

**Given** Élio Lab interagit avec un client pendant le parcours
**When** Élio Lab détecte des préférences de communication non explicites
**Then** le system prompt d'Élio Lab inclut une instruction d'observation :

- "Si tu détectes une préférence de communication (longueur, ton, style), note-la dans le champ metadata du message avec la clé 'profile_observation'"
- Exemples : "client préfère les listes", "client frustré par les questions répétitives", "client répond mieux le matin"

**And** ces observations sont stockées dans `elio_messages.metadata.profile_observation` (chaîne de texte libre)
**And** MiKL peut consulter ces observations dans la fiche client (section "Observations Élio")
**And** MiKL peut valider une observation pour l'intégrer au profil officiel (ajout dans `avoid` ou `privilege` ou `styleNotes`)

### AC4 : Adaptation des agents au profil (FR69)

**Given** tous les agents Élio doivent adapter leur ton selon le profil
**When** un message est envoyé à Élio (quel que soit le dashboard)
**Then** le system prompt construit par `config/system-prompts.ts` inclut le bloc suivant :

```
# Profil de communication du client
- Niveau technique : {levelTechnical}
- Style d'échange : {styleExchange}
- Ton adapté : {adaptedTone}
- Longueur des messages : {messageLength}
- Tutoiement : {oui/non}
- Exemples concrets : {oui/non}
- À éviter : {avoid.join(', ')}
- À privilégier : {privilege.join(', ')}
- Notes : {styleNotes}

Adapte TOUTES tes réponses selon ce profil.
```

**And** si aucun profil n'existe, le DEFAULT_COMMUNICATION_PROFILE est utilisé
**And** le profil est résolu par le hook `use-elio-config.ts` (Story 8.1)

### AC5 : Transmission à la graduation (FR68)

**Given** un client Lab est diplômé vers One
**When** la graduation est déclenchée (Epic 9)
**Then** le profil de communication est automatiquement transmis :

1. Le `communication_profile` de `client_configs.elio_config` est préservé tel quel (pas de copie — le même champ est lu par Élio One)
2. Les observations d'Élio Lab (stockées dans les metadata des messages) sont compilées dans un champ `communication_profile.lab_learnings: string[]`
3. L'historique des conversations Lab reste accessible (même table `elio_conversations`, filtre `dashboard_type='lab'`)

**And** Élio One utilise ce profil dès la première interaction post-graduation
**And** aucune rupture de ton n'est ressentie par le client

## Tasks / Subtasks

- [ ] **Task 1** : Créer le type `CommunicationProfile` (AC: #1, FR66)
  - [ ] 1.1 : Créer dans `packages/types/src/communication-profile.types.ts`
  - [ ] 1.2 : Définir tous les champs selon la structure
  - [ ] 1.3 : Créer le schéma Zod `communicationProfileSchema`

- [ ] **Task 2** : Créer le profil par défaut (AC: #1)
  - [ ] 2.1 : Créer dans `packages/utils/src/defaults.ts`
  - [ ] 2.2 : Exporter `DEFAULT_COMMUNICATION_PROFILE`

- [ ] **Task 3** : Ajouter le profil dans `client_configs.elio_config`
  - [ ] 3.1 : Modifier la structure `elio_config` (JSONB)
  - [ ] 3.2 : Ajouter `communication_profile` comme sous-objet
  - [ ] 3.3 : Migration Supabase pour ajouter le champ (si besoin)

- [ ] **Task 4** : Créer le formulaire d'injection profil (AC: #2, FR67 — Story 6.6)
  - [ ] 4.1 : Créer `components/communication-profile-form.tsx` (module CRM)
  - [ ] 4.2 : Form avec React Hook Form + Zod resolver
  - [ ] 4.3 : Champs : tous les champs de `CommunicationProfile`
  - [ ] 4.4 : Bouton "Enregistrer le profil"

- [ ] **Task 5** : Créer la Server Action pour sauvegarder le profil
  - [ ] 5.1 : Créer `actions/update-communication-profile.ts`
  - [ ] 5.2 : Validation avec `communicationProfileSchema`
  - [ ] 5.3 : Mise à jour de `client_configs.elio_config.communication_profile`
  - [ ] 5.4 : Invalider le cache `['elio-config']`

- [ ] **Task 6** : Ajouter l'instruction d'observation dans le system prompt Lab (AC: #3)
  - [ ] 6.1 : Modifier `config/system-prompts.ts` pour Lab
  - [ ] 6.2 : Ajouter le bloc d'instructions pour détecter les préférences
  - [ ] 6.3 : Stocker dans `elio_messages.metadata.profile_observation`

- [ ] **Task 7** : Créer la vue "Observations Élio" (AC: #3)
  - [ ] 7.1 : Créer `components/elio-observations.tsx` (module CRM — fiche client)
  - [ ] 7.2 : Afficher la liste des observations (fetch depuis `elio_messages`)
  - [ ] 7.3 : Bouton "Valider" pour intégrer une observation au profil officiel

- [ ] **Task 8** : Créer la Server Action pour intégrer une observation
  - [ ] 8.1 : Créer `actions/integrate-observation.ts`
  - [ ] 8.2 : Ajouter l'observation dans `avoid` ou `privilege` ou `styleNotes`
  - [ ] 8.3 : Mettre à jour `client_configs.elio_config.communication_profile`
  - [ ] 8.4 : Invalider le cache

- [ ] **Task 9** : Adapter le system prompt avec le profil (AC: #4, FR69)
  - [ ] 9.1 : Modifier `config/system-prompts.ts`
  - [ ] 9.2 : Injecter le profil dans le prompt (tous dashboards)
  - [ ] 9.3 : Utiliser DEFAULT_COMMUNICATION_PROFILE si aucun profil

- [ ] **Task 10** : Préparer la transmission graduation (AC: #5, FR68)
  - [ ] 10.1 : Aucune action nécessaire (même table `client_configs`)
  - [ ] 10.2 : Documenter le comportement dans `docs/flows.md`

- [ ] **Task 11** : Compiler les observations Lab en `lab_learnings` (AC: #5)
  - [ ] 11.1 : Créer la Server Action `compileLabLearnings(clientId)`
  - [ ] 11.2 : Fetch toutes les observations Lab
  - [ ] 11.3 : Ajouter dans `communication_profile.lab_learnings`
  - [ ] 11.4 : Appeler lors de la graduation (Epic 9)

- [ ] **Task 12** : Tests
  - [ ] 12.1 : Tester le schéma Zod (validation profil)
  - [ ] 12.2 : Tester l'injection profil (via formulaire)
  - [ ] 12.3 : Tester l'affinement (observations stockées)
  - [ ] 12.4 : Tester l'adaptation system prompt (profil injecté)

## Dev Notes

### Structure du profil

```typescript
// packages/types/src/communication-profile.types.ts
export interface CommunicationProfile {
  levelTechnical: 'beginner' | 'intermediaire' | 'advanced'
  styleExchange: 'direct' | 'conversationnel' | 'formel'
  adaptedTone: 'formel' | 'pro_decontracte' | 'chaleureux' | 'coach'
  messageLength: 'court' | 'moyen' | 'detaille'
  tutoiement: boolean
  concreteExamples: boolean
  avoid: string[]
  privilege: string[]
  styleNotes: string
  lab_learnings?: string[] // Compilé à la graduation
}

// Schéma Zod
import { z } from 'zod'

export const communicationProfileSchema = z.object({
  levelTechnical: z.enum(['beginner', 'intermediaire', 'advanced']),
  styleExchange: z.enum(['direct', 'conversationnel', 'formel']),
  adaptedTone: z.enum(['formel', 'pro_decontracte', 'chaleureux', 'coach']),
  messageLength: z.enum(['court', 'moyen', 'detaille']),
  tutoiement: z.boolean(),
  concreteExamples: z.boolean(),
  avoid: z.array(z.string()),
  privilege: z.array(z.string()),
  styleNotes: z.string(),
  lab_learnings: z.array(z.string()).optional(),
})
```

### Profil par défaut

```typescript
// packages/utils/src/defaults.ts
import { CommunicationProfile } from '@foxeo/types'

export const DEFAULT_COMMUNICATION_PROFILE: CommunicationProfile = {
  levelTechnical: 'intermediaire',
  styleExchange: 'conversationnel',
  adaptedTone: 'pro_decontracte',
  messageLength: 'moyen',
  tutoiement: false,
  concreteExamples: true,
  avoid: [],
  privilege: [],
  styleNotes: '',
}
```

### Injection dans le system prompt

```typescript
// config/system-prompts.ts
export function buildSystemPrompt(
  dashboardType: DashboardType,
  config: ElioConfig
): string {
  const profile = config.communicationProfile ?? DEFAULT_COMMUNICATION_PROFILE

  const profileBlock = `
# Profil de communication du client
- Niveau technique : ${profile.levelTechnical}
- Style d'échange : ${profile.styleExchange}
- Ton adapté : ${profile.adaptedTone}
- Longueur des messages : ${profile.messageLength}
- Tutoiement : ${profile.tutoiement ? 'oui' : 'non'}
- Exemples concrets : ${profile.concreteExamples ? 'oui' : 'non'}
- À éviter : ${profile.avoid.join(', ') || 'aucune restriction'}
- À privilégier : ${profile.privilege.join(', ') || 'pas de préférence'}
- Notes : ${profile.styleNotes || 'aucune'}

**IMPORTANT : Adapte TOUTES tes réponses selon ce profil.**
`

  // Construire le reste du prompt selon le dashboard
  // ...

  return basePrompt + profileBlock + dashboardSpecificPrompt
}
```

### Instruction d'observation pour Lab

```typescript
// config/system-prompts.ts - spécifique Lab
const labObservationInstructions = `
## Observation des préférences de communication

Pendant la conversation, observe le client et détecte ses préférences implicites :
- Préfère-t-il des messages courts ou détaillés ?
- Est-il plus réceptif à un ton formel ou décontracté ?
- Répond-il mieux aux questions ouvertes ou fermées ?
- A-t-il des frustrations récurrentes (questions répétitives, jargon technique) ?
- Y a-t-il des moments de la journée où il est plus réactif ?

**Si tu détectes une préférence claire**, note-la dans le champ metadata du message avec la clé "profile_observation".
Exemple : "Client préfère les listes à puces", "Client frustré par les questions ouvertes", "Client répond mieux le matin".

Ces observations aideront à affiner son profil de communication.
`
```

### Formulaire injection profil

```typescript
// components/communication-profile-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { communicationProfileSchema, CommunicationProfile } from '@foxeo/types'
import { Button, Input, Select, Checkbox, Textarea } from '@foxeo/ui'
import { updateCommunicationProfile } from '../actions/update-communication-profile'
import { toast } from '@foxeo/ui'

interface CommunicationProfileFormProps {
  clientId: string
  initialProfile?: CommunicationProfile
}

export function CommunicationProfileForm({
  clientId,
  initialProfile,
}: CommunicationProfileFormProps) {
  const form = useForm<CommunicationProfile>({
    resolver: zodResolver(communicationProfileSchema),
    defaultValues: initialProfile ?? DEFAULT_COMMUNICATION_PROFILE,
  })

  const onSubmit = async (data: CommunicationProfile) => {
    const result = await updateCommunicationProfile(clientId, data)
    if (result.error) {
      toast.error(result.error.message)
      return
    }
    toast.success('Profil de communication enregistré')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Niveau technique</label>
          <Select {...form.register('levelTechnical')}>
            <option value="beginner">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </Select>
        </div>

        <div>
          <label>Style d'échange</label>
          <Select {...form.register('styleExchange')}>
            <option value="direct">Direct</option>
            <option value="conversationnel">Conversationnel</option>
            <option value="formel">Formel</option>
          </Select>
        </div>

        <div>
          <label>Ton adapté</label>
          <Select {...form.register('adaptedTone')}>
            <option value="formel">Formel</option>
            <option value="pro_decontracte">Pro décontracté</option>
            <option value="chaleureux">Chaleureux</option>
            <option value="coach">Coach</option>
          </Select>
        </div>

        <div>
          <label>Longueur des messages</label>
          <Select {...form.register('messageLength')}>
            <option value="court">Court</option>
            <option value="moyen">Moyen</option>
            <option value="detaille">Détaillé</option>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Checkbox
          {...form.register('tutoiement')}
          label="Tutoiement"
        />
        <Checkbox
          {...form.register('concreteExamples')}
          label="Exemples concrets"
        />
      </div>

      <div>
        <label>À éviter (séparés par des virgules)</label>
        <Input
          {...form.register('avoid')}
          placeholder="jargon technique, questions ouvertes"
          onChange={(e) => {
            const values = e.target.value.split(',').map(v => v.trim())
            form.setValue('avoid', values)
          }}
        />
      </div>

      <div>
        <label>À privilégier (séparés par des virgules)</label>
        <Input
          {...form.register('privilege')}
          placeholder="listes à puces, questions fermées"
          onChange={(e) => {
            const values = e.target.value.split(',').map(v => v.trim())
            form.setValue('privilege', values)
          }}
        />
      </div>

      <div>
        <label>Notes libres</label>
        <Textarea
          {...form.register('styleNotes')}
          placeholder="Notes additionnelles sur le style de communication..."
          rows={3}
        />
      </div>

      <Button type="submit">Enregistrer le profil</Button>
    </form>
  )
}
```

### References

- [Source: Epic 8 — Story 8.4](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-84)
- [Source: PRD — FR66, FR67, FR68, FR69](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1
**FRs couvertes** : FR66 (stockage profil), FR67 (affinement), FR68 (transmission), FR69 (adaptation)
