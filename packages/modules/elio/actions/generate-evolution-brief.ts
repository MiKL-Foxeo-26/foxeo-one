import type { EvolutionCollectionData } from '../utils/evolution-collection'

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Basse (ce serait bien)',
  2: 'Moyenne (ça me manque souvent)',
  3: 'Haute (ça bloque mon activité)',
}

export interface EvolutionBrief {
  title: string
  content: string
  displayText: string
}

/**
 * Génère un mini-brief structuré à partir des données collectées.
 * Story 8.8 — Task 3 (AC3)
 */
export function generateEvolutionBrief(data: EvolutionCollectionData): EvolutionBrief {
  // Task 3.2 — Auto-générer le titre (résumé en ~5-8 mots)
  const title = `Ajout fonctionnalité : ${data.initialRequest.substring(0, 50)}`

  const priorityLabel = PRIORITY_LABELS[data.priority ?? 1]

  // Task 3.3 — Structurer le contenu
  let content = `**Demande d'évolution : ${title}**\n\n`
  content += `- **Besoin** : ${data.initialRequest}\n`
  content += `- **Contexte** : ${data.clarification ?? data.initialRequest}\n`
  content += `- **Priorité client** : ${priorityLabel}\n`

  if (data.example) {
    content += `- **Exemple concret** : ${data.example}\n`
  }

  // Task 3.4 — Texte d'affichage avec demande de validation
  const displayText = `J'ai bien compris votre demande. Voici le résumé que je vais envoyer à MiKL :\n\n---\n${content.trim()}\n---\n\nVous validez ? Je l'envoie à MiKL pour évaluation.`

  return { title, content: content.trim(), displayText }
}
