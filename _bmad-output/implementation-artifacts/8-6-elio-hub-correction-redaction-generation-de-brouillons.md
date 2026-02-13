# Story 8.6: Élio Hub — Correction rédaction & génération de brouillons

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **qu'Élio Hub corrige et adapte mes textes au profil de communication du client, et génère des brouillons de réponses**,
So that **ma communication avec les clients est toujours professionnelle et adaptée à leur personnalité**.

## Acceptance Criteria

### AC1 : Correction et adaptation de texte au profil client (FR24)

**Given** MiKL veut corriger et adapter un texte au profil d'un client
**When** il écrit dans le chat Élio Hub un message comme :
- "Corrige ça pour Thomas : salu thomas, je tenvoi le devis cmme convenu"
- "Adapte ce texte pour Sandrine : Voici le devis demandé."

**Then** Élio Hub :

1. Identifie le client mentionné dans le message
2. Charge le profil de communication du client (`client_configs.elio_config.communication_profile`)
3. Corrige l'orthographe, la grammaire et la ponctuation
4. Adapte le ton selon le profil (tutoiement/vouvoiement, longueur, style)
5. Répond avec le texte corrigé et adapté, clairement délimité :

```
Voici la version corrigée et adaptée au profil de Thomas :

---
Salut Thomas ! Je t'envoie le devis comme convenu. Dis-moi si t'as des questions !
---

J'ai corrigé l'orthographe et adapté au profil "décontracté + tutoiement" de Thomas.
```

**And** MiKL peut copier le texte corrigé en un clic (bouton "Copier")
**And** si le client n'est pas trouvé, Élio demande :
> "Quel client ? Je n'ai pas trouvé '{nom}' dans ta base."

### AC2 : Génération de brouillon de réponse (FR25)

**Given** MiKL veut générer un brouillon de réponse
**When** il demande :
- "Génère un email pour Sandrine pour lui dire que son devis est prêt"
- "Écris une réponse Validation Hub pour Thomas"

**Then** Élio Hub :

1. Identifie le client et le type de communication (email, message Validation Hub, chat)
2. Charge le profil de communication du client
3. Charge le contexte récent (derniers échanges, dernières demandes)
4. Génère un brouillon complet adapté :

```
Voici un brouillon pour Sandrine :

---
Objet : Votre devis est prêt

Bonjour Sandrine,

J'ai le plaisir de vous informer que le devis pour l'ajout du module SMS a été finalisé. Vous le trouverez en pièce jointe.

N'hésitez pas à me contacter si vous avez des questions.

Cordialement,
MiKL — Foxeo
---

J'ai utilisé le ton "formel + vouvoiement" du profil de Sandrine. Tu veux modifier quelque chose ?
```

**And** le brouillon est affiché dans une bulle spéciale avec les boutons :
- **"Copier"** — copie dans le presse-papier
- **"Modifier"** — MiKL peut demander des ajustements ("Plus court", "Ajoute une mention sur le délai")
- **"Envoyer"** — si c'est un message chat, possibilité d'envoyer directement via le module chat (Epic 3)

**And** les brouillons générés sont stockés dans `elio_messages.metadata.draft_type: 'email' | 'validation_hub' | 'chat'`

### AC3 : Ajustements sur un brouillon

**Given** MiKL demande des ajustements sur un brouillon
**When** il écrit :
- "Plus court"
- "Ajoute la date de livraison"
- "Passe au tutoiement"

**Then** Élio Hub régénère le brouillon en tenant compte de la modification demandée

**And** le nouveau brouillon remplace l'ancien dans la conversation (ou s'affiche en dessous avec mention "Version 2")
**And** le contexte de la conversation est conservé (Élio sait qu'on parle du même brouillon)

## Tasks / Subtasks

- [ ] **Task 1** : Créer la détection d'intention "correction" et "génération brouillon"
  - [ ] 1.1 : Modifier `utils/detect-intent.ts`
  - [ ] 1.2 : Ajouter pattern "Corrige ça pour {client}"
  - [ ] 1.3 : Ajouter pattern "Génère un {type} pour {client}"
  - [ ] 1.4 : Extraire : client name, type communication, texte original

- [ ] **Task 2** : Créer la Server Action `correctAndAdaptText()` (AC: #1, FR24)
  - [ ] 2.1 : Créer `actions/correct-and-adapt-text.ts`
  - [ ] 2.2 : Rechercher le client par nom
  - [ ] 2.3 : Charger le profil de communication
  - [ ] 2.4 : Appeler DeepSeek pour correction + adaptation
  - [ ] 2.5 : Retourner `{ data: correctedText, error: null }`

- [ ] **Task 3** : Créer la Server Action `generateDraft()` (AC: #2, FR25)
  - [ ] 3.1 : Créer `actions/generate-draft.ts`
  - [ ] 3.2 : Rechercher le client par nom
  - [ ] 3.3 : Charger le profil de communication
  - [ ] 3.4 : Charger le contexte récent (derniers échanges, demandes)
  - [ ] 3.5 : Appeler DeepSeek pour génération brouillon
  - [ ] 3.6 : Retourner `{ data: draft, error: null }`

- [ ] **Task 4** : Créer le composant `draft-display.tsx` (AC: #2)
  - [ ] 4.1 : Créer le composant bulle spéciale brouillon
  - [ ] 4.2 : Bouton "Copier" (copie dans presse-papier)
  - [ ] 4.3 : Bouton "Modifier" (permet ajustements)
  - [ ] 4.4 : Bouton "Envoyer" (si type=chat, envoi direct)

- [ ] **Task 5** : Ajouter `draft_type` dans `elio_messages.metadata`
  - [ ] 5.1 : Modifier le type `ElioMessageMetadata.draftType`
  - [ ] 5.2 : Stocker le type lors de la génération

- [ ] **Task 6** : Implémenter les ajustements de brouillon (AC: #3)
  - [ ] 6.1 : Détecter les demandes d'ajustement ("Plus court", "Ajoute...")
  - [ ] 6.2 : Régénérer le brouillon avec la modification
  - [ ] 6.3 : Afficher "Version 2" si nouveau brouillon
  - [ ] 6.4 : Conserver le contexte de conversation

- [ ] **Task 7** : Intégrer dans `send-to-elio.ts`
  - [ ] 7.1 : Détecter intention "correction" ou "génération"
  - [ ] 7.2 : Appeler la Server Action correspondante
  - [ ] 7.3 : Retourner le résultat formaté

- [ ] **Task 8** : Tests
  - [ ] 8.1 : Tester correction texte (orthographe, grammaire, adaptation profil)
  - [ ] 8.2 : Tester génération brouillon (email, validation hub, chat)
  - [ ] 8.3 : Tester ajustements (plus court, ajoute info, change ton)
  - [ ] 8.4 : Tester client non trouvé

## Dev Notes

### Prompts pour correction et adaptation

```typescript
// config/correction-prompts.ts
export function buildCorrectionPrompt(
  originalText: string,
  clientProfile: CommunicationProfile
): string {
  return `
Tu es un assistant de rédaction professionnelle.

**Tâche** : Corrige et adapte le texte suivant au profil de communication du client.

**Texte original** :
${originalText}

**Profil de communication du client** :
- Niveau technique : ${clientProfile.levelTechnical}
- Style d'échange : ${clientProfile.styleExchange}
- Ton adapté : ${clientProfile.adaptedTone}
- Longueur des messages : ${clientProfile.messageLength}
- Tutoiement : ${clientProfile.tutoiement ? 'oui' : 'non'}
- Exemples concrets : ${clientProfile.concreteExamples ? 'oui' : 'non'}
- À éviter : ${clientProfile.avoid.join(', ')}
- À privilégier : ${clientProfile.privilege.join(', ')}
- Notes : ${clientProfile.styleNotes}

**Instructions** :
1. Corrige l'orthographe, la grammaire et la ponctuation
2. Adapte le ton selon le profil (tutoiement/vouvoiement, longueur, style)
3. Respecte les préférences (à éviter, à privilégier)
4. Retourne le texte corrigé suivi d'une brève explication des changements

**Format de réponse** :
---
[Texte corrigé et adapté]
---

[Explication des changements]
`
}
```

```typescript
// config/draft-prompts.ts
export function buildDraftPrompt(
  draftType: 'email' | 'validation_hub' | 'chat',
  clientProfile: CommunicationProfile,
  context: {
    clientName: string
    subject: string
    recentMessages?: string[]
    recentRequests?: string[]
  }
): string {
  const typeInstructions = {
    email: `Génère un email professionnel avec objet et signature`,
    validation_hub: `Génère une réponse pour le Validation Hub (ton pro mais chaleureux)`,
    chat: `Génère un message de chat (conversationnel)`,
  }

  return `
Tu es un assistant de rédaction professionnelle pour MiKL.

**Tâche** : ${typeInstructions[draftType]}

**Client** : ${context.clientName}
**Sujet** : ${context.subject}

**Profil de communication du client** :
- Niveau technique : ${clientProfile.levelTechnical}
- Style d'échange : ${clientProfile.styleExchange}
- Ton adapté : ${clientProfile.adaptedTone}
- Longueur des messages : ${clientProfile.messageLength}
- Tutoiement : ${clientProfile.tutoiement ? 'oui' : 'non'}
- Exemples concrets : ${clientProfile.concreteExamples ? 'oui' : 'non'}
- À éviter : ${clientProfile.avoid.join(', ')}
- À privilégier : ${clientProfile.privilege.join(', ')}

${context.recentMessages ? `**Derniers échanges** :\n${context.recentMessages.join('\n')}` : ''}
${context.recentRequests ? `**Dernières demandes** :\n${context.recentRequests.join('\n')}` : ''}

**Instructions** :
1. Génère un brouillon complet et professionnel
2. Adapte le ton selon le profil de communication
3. Utilise le contexte récent si pertinent
4. ${draftType === 'email' ? 'Inclus un objet clair et une signature "MiKL — Foxeo"' : ''}

**Format de réponse** :
---
[Brouillon généré]
---

[Note sur le profil utilisé]
`
}
```

### Server Action correction

```typescript
// actions/correct-and-adapt-text.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'
import { buildCorrectionPrompt } from '../config/correction-prompts'

export async function correctAndAdaptText(
  clientName: string,
  originalText: string
): Promise<ActionResponse<string>> {
  const supabase = createServerClient()

  // 1. Rechercher le client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*, client_configs!inner(elio_config)')
    .ilike('name', `%${clientName}%`)
    .single()

  if (clientError || !client) {
    return {
      data: null,
      error: {
        message: `Je n'ai pas trouvé de client "${clientName}" dans ta base. Tu veux vérifier l'orthographe ?`,
        code: 'CLIENT_NOT_FOUND',
      },
    }
  }

  // 2. Charger le profil de communication
  const profile = client.client_configs.elio_config?.communication_profile ?? DEFAULT_COMMUNICATION_PROFILE

  // 3. Construire le prompt
  const prompt = buildCorrectionPrompt(originalText, profile)

  // 4. Appeler DeepSeek
  const { data, error } = await supabase.functions.invoke('elio-chat', {
    body: { systemPrompt: '', message: prompt },
  })

  if (error) {
    return {
      data: null,
      error: { message: 'Erreur lors de la correction', code: 'LLM_ERROR' },
    }
  }

  return { data: data.content, error: null }
}
```

### Composant draft-display.tsx

```typescript
// components/draft-display.tsx
'use client'

import { useState } from 'react'
import { Copy, Edit, Send } from 'lucide-react'
import { Button } from '@foxeo/ui'
import { toast } from '@foxeo/ui'

interface DraftDisplayProps {
  draft: string
  draftType: 'email' | 'validation_hub' | 'chat'
  onModify?: (instruction: string) => void
  onSend?: () => void
}

export function DraftDisplay({ draft, draftType, onModify, onSend }: DraftDisplayProps) {
  const [modifyMode, setModifyMode] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(draft)
    toast.success('Copié dans le presse-papier')
  }

  return (
    <div className="border-2 border-primary/20 rounded-lg p-4 my-4 bg-primary/5">
      <div className="mb-2 text-sm font-medium text-primary">
        Brouillon généré ({draftType === 'email' ? 'Email' : draftType === 'validation_hub' ? 'Validation Hub' : 'Chat'})
      </div>

      <div className="bg-card rounded p-4 mb-3 whitespace-pre-wrap">
        {draft}
      </div>

      {modifyMode ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Que veux-tu modifier ? (ex: Plus court, Ajoute la date de livraison)"
            className="w-full px-3 py-2 border rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onModify) {
                onModify(e.currentTarget.value)
                setModifyMode(false)
                e.currentTarget.value = ''
              }
            }}
            autoFocus
          />
          <button
            className="text-sm text-muted-foreground"
            onClick={() => setModifyMode(false)}
          >
            Annuler
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copier
          </Button>
          <Button size="sm" variant="outline" onClick={() => setModifyMode(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          {draftType === 'chat' && onSend && (
            <Button size="sm" onClick={onSend}>
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
```

### References

- [Source: Epic 8 — Story 8.6](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-86)
- [Source: PRD — FR24, FR25](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.4 (profil communication), 8.5
**FRs couvertes** : FR24 (correction adaptation), FR25 (génération brouillons)
