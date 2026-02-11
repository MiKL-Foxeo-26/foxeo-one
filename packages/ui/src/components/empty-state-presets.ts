/**
 * Presets pour EmptyState — états vides réutilisables
 */

type EmptyStatePreset = {
  title: string
  description?: string
}

export const EMPTY_SEARCH: EmptyStatePreset = {
  title: 'Aucun résultat trouvé',
  description: 'Essayez de modifier vos critères de recherche ou d\'ajuster les filtres.',
}

export const EMPTY_LIST: EmptyStatePreset = {
  title: 'Aucun élément',
  description: 'Cette liste est vide pour le moment.',
}

export const EMPTY_ERROR: EmptyStatePreset = {
  title: 'Impossible de charger le contenu',
  description: 'Une erreur s\'est produite. Veuillez réessayer.',
}
