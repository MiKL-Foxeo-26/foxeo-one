# Story 8.8: Élio One — Collecte d'évolutions & soumission Validation Hub

Status: ready-for-dev

## Story

As a **client One (établi)**,
I want **qu'Élio One collecte mon besoin d'évolution en quelques questions et le soumette automatiquement à MiKL via le Validation Hub**,
So that **je peux demander de nouvelles fonctionnalités sans effort et sans quitter ma conversation**.

## Acceptance Criteria

### AC1 : Détection besoin d'évolution (FR47)

**Given** un client One exprime un besoin d'évolution via Élio
**When** il écrit :
- "Je voudrais pouvoir envoyer des SMS de rappel"
- "On pourrait ajouter une fonction export Excel"

**Then** Élio One détecte l'intention d'évolution (mots-clés : "je voudrais", "on pourrait", "il faudrait", "ajouter", "nouveau") et passe en mode collecte

### AC2 : Collecte guidée (2-3 questions max)

**Given** Élio One a détecté un besoin d'évolution
**When** le mode collecte est activé
**Then** Élio pose les questions suivantes (une à la fois) :

1. **Question 1 (Clarification besoin)** :
> "D'accord, je comprends. Pouvez-vous me décrire plus précisément ce que vous attendez ? Par exemple, dans quel contexte vous utiliseriez cette fonction ?"

2. **Question 2 (Priorité)** :
> "Sur une échelle de 1 à 3, à quel point c'est urgent pour vous ? (1 = ce serait bien, 2 = ça me manque souvent, 3 = ça bloque mon activité)"

3. **Question 3 (optionnelle, si le besoin n'est pas clair)** :
> "Avez-vous un exemple concret d'un moment où vous avez eu besoin de cette fonctionnalité ?"

**And** Élio pose les questions une à une, en attendant la réponse
**And** le nombre de questions est limité à 3 maximum (pas d'interrogatoire)
**And** le ton s'adapte au profil de communication du client

### AC3 : Génération mini-brief structuré

**Given** Élio One a collecté les réponses du client (2-3 questions posées)
**When** la collecte est terminée
**Then** Élio génère un mini-brief structuré :

```
J'ai bien compris votre demande. Voici le résumé que je vais envoyer à MiKL :

---
**Demande d'évolution : {titre auto-généré}**
- Besoin : {description structurée}
- Contexte : {réponse question 1}
- Priorité client : {1/2/3}
- Exemple concret : {réponse question 3 si posée}
---

Vous validez ? Je l'envoie à MiKL pour évaluation.
```

**And** le client peut valider ("Oui envoie") ou modifier ("Change le titre" / "Ajoute que...")

### AC4 : Soumission au Validation Hub

**Given** le client valide le mini-brief
**When** Élio One soumet la demande
**Then** les opérations suivantes sont effectuées :

1. Un enregistrement est créé dans `validation_requests` avec :
   - `type='evolution_one'`
   - `title={titre auto-généré}`
   - `content={mini-brief structuré}`
   - `client_id`, `operator_id`
   - `status='pending'`

2. Une notification est envoyée à MiKL : "Nouvelle demande d'évolution de {client} — {titre}"

3. Élio confirme au client :
> "C'est envoyé ! MiKL va examiner votre demande et vous tiendra informé."

**And** le mini-brief est stocké dans `elio_messages.metadata.evolution_brief: true`
**And** le cache TanStack Query est invalidé pour `['validation-requests']`

### AC5 : Annulation et détection fonctionnalité existante

**Given** le client veut annuler pendant la collecte
**When** il écrit "Non laisse tomber" ou "En fait non"
**Then** Élio One sort du mode collecte :
> "Pas de souci ! N'hésitez pas si vous changez d'avis."

**And** aucune demande n'est créée dans `validation_requests`

**Given** Élio One détecte une demande d'évolution mais le besoin est déjà couvert
**When** le LLM identifie que la fonctionnalité existe déjà (dans la documentation modules actifs)
**Then** Élio One répond :
> "En fait, cette fonctionnalité existe déjà ! Voici comment y accéder : {instructions}"

**And** aucune collecte d'évolution n'est lancée
**And** Élio bascule en mode FAQ/guidance (FR45, FR46)

## Tasks / Subtasks

- [ ] **Task 1** : Créer la détection intention "évolution" (AC: #1, FR47)
  - [ ] 1.1 : Modifier `utils/detect-intent.ts`
  - [ ] 1.2 : Patterns : "je voudrais", "on pourrait", "il faudrait", "ajouter", "nouveau"
  - [ ] 1.3 : Extraire le besoin exprimé

- [ ] **Task 2** : Créer le système de collecte guidée (AC: #2)
  - [ ] 2.1 : Créer `utils/evolution-collection.ts`
  - [ ] 2.2 : State machine : initial → clarification → priorité → exemple (optionnel) → summary
  - [ ] 2.3 : Adapter les questions au profil de communication
  - [ ] 2.4 : Limite 3 questions max

- [ ] **Task 3** : Créer la génération du mini-brief (AC: #3)
  - [ ] 3.1 : Créer `actions/generate-evolution-brief.ts`
  - [ ] 3.2 : Auto-générer le titre (résumé en 5-8 mots)
  - [ ] 3.3 : Structurer le contenu : Besoin, Contexte, Priorité, Exemple
  - [ ] 3.4 : Afficher le mini-brief pour validation

- [ ] **Task 4** : Créer la Server Action soumission (AC: #4)
  - [ ] 4.1 : Créer `actions/submit-evolution-request.ts`
  - [ ] 4.2 : Créer l'entrée dans `validation_requests` avec `type='evolution_one'`
  - [ ] 4.3 : Créer la notification pour MiKL
  - [ ] 4.4 : Stocker `metadata.evolution_brief: true` dans le message Élio
  - [ ] 4.5 : Invalider le cache `['validation-requests']`
  - [ ] 4.6 : Confirmer au client

- [ ] **Task 5** : Implémenter l'annulation (AC: #5)
  - [ ] 5.1 : Détecter "Non laisse tomber", "En fait non", "Annuler"
  - [ ] 5.2 : Sortir du mode collecte
  - [ ] 5.3 : Message de confirmation

- [ ] **Task 6** : Détecter fonctionnalité existante (AC: #5)
  - [ ] 6.1 : Vérifier si le besoin correspond à un module actif
  - [ ] 6.2 : Répondre avec instructions (mode FAQ)
  - [ ] 6.3 : Ne pas lancer la collecte

- [ ] **Task 7** : Intégrer dans `send-to-elio.ts`
  - [ ] 7.1 : Détecter intention "évolution"
  - [ ] 7.2 : Lancer la collecte guidée
  - [ ] 7.3 : Gérer la state machine (questions → réponses)
  - [ ] 7.4 : Générer et afficher le mini-brief

- [ ] **Task 8** : Tests
  - [ ] 8.1 : Tester détection intention évolution
  - [ ] 8.2 : Tester collecte guidée (2-3 questions)
  - [ ] 8.3 : Tester génération mini-brief
  - [ ] 8.4 : Tester soumission (création validation_request, notification)
  - [ ] 8.5 : Tester annulation
  - [ ] 8.6 : Tester détection fonctionnalité existante

## Dev Notes

### State machine collecte évolution

```typescript
// utils/evolution-collection.ts
export type EvolutionCollectionState =
  | 'initial'
  | 'clarification'
  | 'priority'
  | 'example'
  | 'summary'
  | 'cancelled'

export interface EvolutionCollectionData {
  state: EvolutionCollectionState
  initialRequest: string
  clarification?: string
  priority?: 1 | 2 | 3
  example?: string
}

export function getNextQuestion(
  state: EvolutionCollectionState,
  profile: CommunicationProfile
): string {
  const tutoiement = profile.tutoiement

  switch (state) {
    case 'initial':
      return tutoiement
        ? "D'accord, je comprends. Peux-tu me décrire plus précisément ce que tu attends ? Par exemple, dans quel contexte tu utiliserais cette fonction ?"
        : "D'accord, je comprends. Pouvez-vous me décrire plus précisément ce que vous attendez ? Par exemple, dans quel contexte vous utiliseriez cette fonction ?"

    case 'clarification':
      return tutoiement
        ? "Sur une échelle de 1 à 3, à quel point c'est urgent pour toi ? (1 = ce serait bien, 2 = ça me manque souvent, 3 = ça bloque mon activité)"
        : "Sur une échelle de 1 à 3, à quel point c'est urgent pour vous ? (1 = ce serait bien, 2 = ça me manque souvent, 3 = ça bloque mon activité)"

    case 'priority':
      // Question optionnelle : exemple concret (seulement si priorité 2 ou 3)
      return tutoiement
        ? "As-tu un exemple concret d'un moment où tu as eu besoin de cette fonctionnalité ?"
        : "Avez-vous un exemple concret d'un moment où vous avez eu besoin de cette fonctionnalité ?"

    default:
      return ''
  }
}

export function generateEvolutionBrief(data: EvolutionCollectionData): string {
  // Auto-générer le titre (résumé en 5-8 mots)
  const title = `Ajout fonctionnalité : ${data.initialRequest.substring(0, 50)}`

  const priorityLabel = {
    1: 'Basse (ce serait bien)',
    2: 'Moyenne (ça me manque souvent)',
    3: 'Haute (ça bloque mon activité)',
  }[data.priority ?? 1]

  return `
**Demande d'évolution : ${title}**

- **Besoin** : ${data.clarification ?? data.initialRequest}
- **Contexte** : ${data.clarification}
- **Priorité client** : ${priorityLabel}
${data.example ? `- **Exemple concret** : ${data.example}` : ''}
  `.trim()
}
```

### Server Action soumission

```typescript
// actions/submit-evolution-request.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'

export async function submitEvolutionRequest(
  clientId: string,
  title: string,
  content: string
): Promise<ActionResponse<boolean>> {
  const supabase = createServerClient()

  // 1. Récupérer l'opérateur du client
  const { data: client } = await supabase
    .from('clients')
    .select('operator_id, name')
    .eq('id', clientId)
    .single()

  if (!client) {
    return { data: null, error: { message: 'Client non trouvé', code: 'NOT_FOUND' } }
  }

  // 2. Créer la demande dans validation_requests
  const { error: requestError } = await supabase
    .from('validation_requests')
    .insert({
      client_id: clientId,
      operator_id: client.operator_id,
      type: 'evolution_one',
      title,
      content,
      status: 'pending',
    })

  if (requestError) {
    return { data: null, error: { message: 'Erreur création demande', code: 'DB_ERROR' } }
  }

  // 3. Notification MiKL
  await supabase.from('notifications').insert({
    user_id: client.operator_id,
    type: 'validation_request',
    title: `Nouvelle demande d'évolution de ${client.name}`,
    content: title,
    link: '/modules/validation-hub',
  })

  return { data: true, error: null }
}
```

### Détection fonctionnalité existante

```typescript
// utils/detect-existing-feature.ts
export function checkIfFeatureExists(
  request: string,
  activeModulesDoc: string
): { exists: boolean; instructions?: string } {
  // Parser la documentation modules actifs
  const lowerRequest = request.toLowerCase()
  const lowerDoc = activeModulesDoc.toLowerCase()

  // Exemples de patterns
  const smsPatterns = ['sms', 'envoi sms', 'message sms']
  const calendarPatterns = ['calendrier', 'événement', 'agenda', 'réservation']
  const exportPatterns = ['export', 'télécharger', 'exporter']

  // Check SMS
  if (smsPatterns.some(p => lowerRequest.includes(p))) {
    if (lowerDoc.includes('module sms') || lowerDoc.includes('envoi de sms')) {
      return {
        exists: true,
        instructions: 'Allez dans "Modules" → "SMS" pour envoyer des SMS groupés.',
      }
    }
  }

  // Check Calendrier
  if (calendarPatterns.some(p => lowerRequest.includes(p))) {
    if (lowerDoc.includes('calendrier') || lowerDoc.includes('agenda')) {
      return {
        exists: true,
        instructions: 'Allez dans "Modules" → "Agenda" pour créer des événements.',
      }
    }
  }

  // Check Export
  if (exportPatterns.some(p => lowerRequest.includes(p))) {
    if (lowerDoc.includes('export')) {
      return {
        exists: true,
        instructions: 'La plupart des modules ont un bouton "Exporter" en haut à droite.',
      }
    }
  }

  return { exists: false }
}
```

### References

- [Source: Epic 8 — Story 8.8](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-88)
- [Source: PRD — FR47](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.4, 8.7
**FRs couvertes** : FR47 (collecte évolutions)
