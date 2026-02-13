# Story 8.7: Élio One — Chat, FAQ, guidance dashboard & héritage Lab

Status: ready-for-dev

## Story

As a **client One (établi)**,
I want **converser avec Élio One qui répond à mes questions sur les fonctionnalités, me guide dans mon dashboard et connaît mon historique Lab**,
So that **j'ai un assistant qui me connaît et m'aide à utiliser efficacement mes outils métier**.

## Acceptance Criteria

### AC1 : Interface chat Élio One (FR44)

**Given** un client One accède au module Élio dans son dashboard
**When** le chat Élio One se charge
**Then** l'interface unifiée `elio-chat.tsx` s'affiche avec `dashboardType='one'` :

- **Palette One** : orange vif + bleu-gris (dark mode)
- **Header** : "Élio — Votre assistant" avec avatar Élio One
- **Zone de chat** avec historique
- **Champ de saisie** avec placeholder adapté au profil communication
- **Panneau de conversations** latéral (Story 8.2)

**And** le message d'accueil adapté au profil s'affiche :
- Si config custom (Story 6.6) : utilise `custom_prompts.greeting`
- Sinon : "Bonjour ! Je suis Élio, votre assistant. Comment puis-je vous aider ?" (vouvoiement par défaut)

**And** le first token de réponse apparaît en moins de 3 secondes (NFR-P3)

### AC2 : FAQ et aide fonctionnalités (FR45)

**Given** le client One pose une question sur une fonctionnalité
**When** il écrit "Comment je crée un événement ?" ou "À quoi sert le module calendrier ?"
**Then** Élio One répond en s'appuyant sur la documentation des modules actifs :

- Le system prompt inclut la documentation de chaque module actif du client (injectée par MiKL via FR43, Epic 10)
- La documentation suit la structure : description, paramètres, questions_client_possibles, problèmes_courants
- Élio répond avec des instructions claires et contextuelles

**And** si la question concerne un module non activé, Élio répond :
> "Cette fonctionnalité n'est pas encore activée pour vous. Vous pouvez demander à MiKL de l'activer."

### AC3 : Guidance navigation dashboard (FR46)

**Given** le client One demande de l'aide pour naviguer
**When** il écrit "Où sont mes factures ?" ou "Comment je vois mes documents ?"
**Then** Élio One guide le client :

- Explication du chemin de navigation
- Description de ce qu'il va trouver à cet endroit
- Ton adapté au profil de communication

**And** le system prompt inclut une cartographie des modules et routes du dashboard One

### AC4 : Héritage contexte Lab (FR51)

**Given** un client a été diplômé du Lab vers One
**When** il utilise Élio One pour la première fois
**Then** Élio One hérite du contexte Lab :

1. Le profil de communication est déjà en place (FR68, Story 8.4) — pas de rupture de ton
2. Les conversations Lab restent consultables (dans la liste des conversations, filtrées par `dashboard_type='lab'`, affichées dans une section "Historique Lab")
3. Les briefs Lab validés sont référençables par Élio One : "D'après votre brief sur le branding, vous aviez mentionné..."
4. Les décisions de MiKL pendant le Lab sont connues d'Élio One (intégrées dans le system prompt via `parcours_context`)

**And** Élio One ne repose jamais les mêmes questions que pendant le Lab
**And** le ton est cohérent avec celui utilisé pendant le parcours Lab

### AC5 : Escalade vers MiKL (hors périmètre)

**Given** le client One pose une question hors du périmètre d'Élio (fonctionnalité inexistante, question trop complexe)
**When** la confiance de la réponse est basse
**Then** Élio One propose l'escalade vers MiKL :

> "Je ne suis pas certain de pouvoir vous aider là-dessus. Voulez-vous que je transmette votre question à MiKL ?"

**And** si le client accepte : une notification est envoyée à MiKL avec le contexte (question + historique récent)
**And** le même mécanisme d'escalade que Story 6.4 (Lab) est réutilisé

## Tasks / Subtasks

- [ ] **Task 1** : Configurer la palette One dans `elio-chat.tsx` (AC: #1, FR44)
  - [ ] 1.1 : Vérifier que `dashboardType='one'` applique la palette orange/bleu-gris
  - [ ] 1.2 : Tester le header "Élio — Votre assistant"
  - [ ] 1.3 : Tester le placeholder adapté au profil

- [ ] **Task 2** : Créer le message d'accueil One (AC: #1)
  - [ ] 2.1 : Vérifier `custom_prompts.greeting` dans config si existe
  - [ ] 2.2 : Sinon utiliser message par défaut adapté au profil (tutoiement/vouvoiement)

- [ ] **Task 3** : Créer la documentation modules actifs (AC: #2, FR45)
  - [ ] 3.1 : Structure : description, paramètres, questions_client_possibles, problèmes_courants
  - [ ] 3.2 : Stocker dans `client_configs.modules_documentation` (JSON)
  - [ ] 3.3 : Injectée par MiKL via Story 10.3

- [ ] **Task 4** : Adapter le system prompt One avec modules actifs (AC: #2)
  - [ ] 4.1 : Modifier `config/system-prompts.ts` pour One
  - [ ] 4.2 : Charger la documentation modules actifs depuis config
  - [ ] 4.3 : Injecter dans le system prompt
  - [ ] 4.4 : Message si module non activé

- [ ] **Task 5** : Créer la cartographie routes dashboard One (AC: #3, FR46)
  - [ ] 5.1 : Créer `config/one-navigation-map.ts`
  - [ ] 5.2 : Cartographie : modules → routes → descriptions
  - [ ] 5.3 : Intégrer dans le system prompt One

- [ ] **Task 6** : Implémenter l'héritage contexte Lab (AC: #4, FR51)
  - [ ] 6.1 : Profil communication déjà en place (Story 8.4) — rien à faire
  - [ ] 6.2 : Conversations Lab accessibles via filtre `dashboard_type='lab'`
  - [ ] 6.3 : Section "Historique Lab" dans la liste conversations

- [ ] **Task 7** : Référencer les briefs Lab dans le system prompt One (AC: #4)
  - [ ] 7.1 : Charger les briefs Lab validés depuis `validation_requests`
  - [ ] 7.2 : Injecter dans le system prompt : "Briefs Lab du client : {liste}"
  - [ ] 7.3 : Élio peut référencer ces briefs dans ses réponses

- [ ] **Task 8** : Intégrer le parcours_context dans le system prompt (AC: #4)
  - [ ] 8.1 : Charger `client_configs.elio_config.parcours_context`
  - [ ] 8.2 : Injecter dans le system prompt : "Décisions MiKL pendant le Lab : {contexte}"

- [ ] **Task 9** : Créer le mécanisme d'escalade vers MiKL (AC: #5)
  - [ ] 9.1 : Créer `actions/escalate-to-mikl.ts`
  - [ ] 9.2 : Créer une notification pour MiKL
  - [ ] 9.3 : Inclure : question client + historique récent
  - [ ] 9.4 : Confirmation au client : "Question transmise à MiKL"

- [ ] **Task 10** : Détecter la faible confiance dans la réponse
  - [ ] 10.1 : Analyser la réponse LLM (mots-clés : "je ne suis pas sûr", "peut-être")
  - [ ] 10.2 : Proposer l'escalade si confiance basse
  - [ ] 10.3 : Attendre confirmation client

- [ ] **Task 11** : Tests
  - [ ] 11.1 : Tester FAQ (module actif, module non actif)
  - [ ] 11.2 : Tester guidance navigation
  - [ ] 11.3 : Tester héritage Lab (profil, conversations, briefs)
  - [ ] 11.4 : Tester escalade MiKL

## Dev Notes

### Cartographie navigation One

```typescript
// config/one-navigation-map.ts
export const ONE_NAVIGATION_MAP = `
# Modules et routes du dashboard One

## Dashboard principal
- **Accueil** : / → Vue d'ensemble, actions rapides, statistiques

## Modules de base (toujours actifs)
- **Profil** : /profil → Vos informations, préférences
- **Documents** : /modules/documents → Vos documents, livrables Lab
- **Support** : /support → Aide, contact MiKL

## Modules optionnels (selon configuration)
- **Calendrier** : /modules/agenda → Événements, réservations
- **Membres** : /modules/membres → Gestion des membres (associations)
- **Facturation** : /modules/facturation → Factures, devis, paiements
- **SMS** : /modules/sms → Envoi de SMS groupés
- **Présences** : /modules/presences → Feuilles d'émargement (cours, formations)

**Note** : Si un module n'est pas activé, vous pouvez demander à MiKL de l'ajouter.
`
```

### Héritage Lab — Section conversations

```typescript
// components/conversation-list.tsx
export function ConversationList({ dashboardType }: { dashboardType: DashboardType }) {
  const { data: conversations } = useElioConversations(userId, dashboardType)

  // Filtrer conversations par dashboard_type
  const currentConversations = conversations?.filter(c => c.dashboardType === dashboardType)
  const labConversations = conversations?.filter(c => c.dashboardType === 'lab')

  return (
    <div>
      <h3>Conversations actuelles</h3>
      {currentConversations?.map(c => <ConversationItem key={c.id} {...c} />)}

      {labConversations && labConversations.length > 0 && (
        <>
          <hr className="my-4" />
          <h3 className="text-sm text-muted-foreground">Historique Lab</h3>
          {labConversations.map(c => <ConversationItem key={c.id} {...c} isArchived />)}
        </>
      )}
    </div>
  )
}
```

### Injection briefs Lab dans system prompt

```typescript
// config/system-prompts.ts - spécifique One
async function buildOneSystemPrompt(config: ElioConfig, clientId: string): Promise<string> {
  const basePrompt = buildBasePrompt(config)

  // 1. Documentation modules actifs
  const modulesDoc = config.modules_documentation ?? ''

  // 2. Navigation map
  const navigationMap = ONE_NAVIGATION_MAP

  // 3. Briefs Lab (si client diplômé)
  let labBriefsContext = ''
  if (config.parcours_context) {
    const { data: briefs } = await supabase
      .from('validation_requests')
      .select('title, content')
      .eq('client_id', clientId)
      .eq('type', 'brief_lab')
      .eq('status', 'approved')

    if (briefs && briefs.length > 0) {
      labBriefsContext = `
## Briefs Lab validés du client

${briefs.map(b => `- **${b.title}** : ${b.content.substring(0, 200)}...`).join('\n')}

**Important** : Tu peux référencer ces briefs dans tes réponses pour montrer que tu connais le contexte du client.
`
    }
  }

  // 4. Parcours context (décisions MiKL)
  const parcoursContext = config.parcours_context
    ? `\n## Décisions MiKL pendant le Lab\n${config.parcours_context}\n`
    : ''

  return `${basePrompt}

## Modules actifs et documentation
${modulesDoc}

## Navigation dashboard
${navigationMap}

${labBriefsContext}
${parcoursContext}

**Ton rôle** : Aider le client à utiliser efficacement son dashboard One, en t'appuyant sur sa configuration, son historique Lab et son profil de communication.
`
}
```

### Mécanisme escalade MiKL

```typescript
// actions/escalate-to-mikl.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'

export async function escalateToMiKL(
  clientId: string,
  question: string,
  recentMessages: string[]
): Promise<ActionResponse<boolean>> {
  const supabase = createServerClient()

  // 1. Récupérer l'opérateur du client
  const { data: client } = await supabase
    .from('clients')
    .select('operator_id, name, email')
    .eq('id', clientId)
    .single()

  if (!client) {
    return { data: null, error: { message: 'Client non trouvé', code: 'NOT_FOUND' } }
  }

  // 2. Créer une notification pour MiKL
  const { error: notifError } = await supabase
    .from('notifications')
    .insert({
      user_id: client.operator_id,
      type: 'elio_escalation',
      title: `Question de ${client.name}`,
      content: `Élio One a escaladé une question :\n\n"${question}"\n\nHistorique récent :\n${recentMessages.join('\n')}`,
      link: `/modules/crm/clients/${clientId}`,
    })

  if (notifError) {
    return { data: null, error: { message: 'Erreur notification', code: 'DB_ERROR' } }
  }

  return { data: true, error: null }
}
```

### Détection faible confiance

```typescript
// utils/detect-low-confidence.ts
export function detectLowConfidence(response: string): boolean {
  const lowConfidencePatterns = [
    /je ne suis pas (sûr|certain)/i,
    /peut-être/i,
    /il est possible que/i,
    /je pense que/i,
    /probablement/i,
    /je ne connais pas/i,
    /je n'ai pas (accès|les informations)/i,
  ]

  return lowConfidencePatterns.some(pattern => pattern.test(response))
}
```

### References

- [Source: Epic 8 — Story 8.7](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-87)
- [Source: PRD — FR44, FR45, FR46, FR51](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.2, 8.4 (profil communication)
**FRs couvertes** : FR44 (chat One), FR45 (FAQ), FR46 (guidance), FR51 (héritage Lab)
