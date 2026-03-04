/**
 * State machine pour la collecte guidée de demandes d'évolution.
 * Story 8.8 — Task 2 (AC2)
 * Pure functions : pas de side effects, pas de dépendance serveur.
 */
import type { CommunicationProfileFR66 } from '../types/elio.types'

export type EvolutionCollectionState =
  | 'initial'
  | 'clarification'
  | 'priority'
  | 'summary'
  | 'cancelled'

export interface EvolutionCollectionData {
  state: EvolutionCollectionState
  initialRequest: string
  clarification?: string
  priority?: 1 | 2 | 3
  example?: string
}

/**
 * Retourne la question suivante selon l'état courant de la collecte.
 * Adapte le tutoiement/vouvoiement au profil de communication (AC2).
 */
export function getNextQuestion(
  state: EvolutionCollectionState,
  profile: CommunicationProfileFR66
): string {
  const tu = profile.tutoiement

  switch (state) {
    case 'initial':
      return tu
        ? "D'accord, je comprends. Peux-tu me décrire plus précisément ce que tu attends ? Par exemple, dans quel contexte tu utiliserais cette fonction ?"
        : "D'accord, je comprends. Pouvez-vous me décrire plus précisément ce que vous attendez ? Par exemple, dans quel contexte vous utiliseriez cette fonction ?"

    case 'clarification':
      return tu
        ? "Sur une échelle de 1 à 3, à quel point c'est urgent pour toi ? (1 = ce serait bien, 2 = ça me manque souvent, 3 = ça bloque mon activité)"
        : "Sur une échelle de 1 à 3, à quel point c'est urgent pour vous ? (1 = ce serait bien, 2 = ça me manque souvent, 3 = ça bloque mon activité)"

    case 'priority':
      return tu
        ? "As-tu un exemple concret d'un moment où tu as eu besoin de cette fonctionnalité ?"
        : "Avez-vous un exemple concret d'un moment où vous avez eu besoin de cette fonctionnalité ?"

    default:
      return ''
  }
}

/**
 * Extrait la priorité d'une réponse utilisateur.
 * Supporte : "1", "2", "3", ou texte contenant les labels.
 */
function extractPriority(response: string): 1 | 2 | 3 {
  const trimmed = response.trim()

  if (trimmed === '1' || trimmed.includes('ce serait bien')) return 1
  if (trimmed === '2' || trimmed.includes('manque souvent')) return 2
  if (trimmed === '3' || trimmed.includes('bloque')) return 3

  // Défaut à 1 si non reconnu
  return 1
}

/**
 * Avance la state machine d'un pas en intégrant la réponse utilisateur.
 * Retourne les données mises à jour (immutable).
 */
export function processResponse(
  data: EvolutionCollectionData,
  response: string
): EvolutionCollectionData {
  switch (data.state) {
    case 'initial':
      return {
        ...data,
        state: 'clarification',
        clarification: response.trim(),
      }

    case 'clarification':
      // State 'priority' = priority just collected, next question will ask for example
      return {
        ...data,
        state: 'priority',
        priority: extractPriority(response),
      }

    case 'priority':
      return {
        ...data,
        state: 'summary',
        example: response.trim(),
      }

    default:
      return data
  }
}

// Patterns d'annulation (Task 5.1)
const CANCEL_PATTERNS: RegExp[] = [
  /laisse tomber/i,
  /en fait non/i,
  /annule[rz]?/i,
  /tant pis/i,
  /\boublie\b(?!\s+pas)/i,
]

/**
 * Détecte si l'utilisateur veut annuler la collecte.
 * AC5 — "Non laisse tomber", "En fait non", "Annuler".
 */
export function isCancel(message: string): boolean {
  const msg = message.trim()
  if (!msg) return false
  return CANCEL_PATTERNS.some((p) => p.test(msg))
}
