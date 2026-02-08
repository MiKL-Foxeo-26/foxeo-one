/**
 * Utilitaires de formatage de dates
 */

/**
 * Formate une date en texte relatif (français)
 * - Date invalide: retourne "Date inconnue"
 * - Date future: retourne la date complète
 * - < 1 minute: "à l'instant"
 * - < 1 heure: "il y a X minutes"
 * - < 24 heures: "il y a X heures"
 * - < 7 jours: "il y a X jours"
 * - >= 7 jours: date complète "12 janvier 2026"
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);

  // Validation: vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return 'Date inconnue';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Gestion des dates futures
  if (diffMs < 0) {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "à l'instant";
  }

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? 'il y a 1 minute' : `il y a ${diffMinutes} minutes`;
  }

  if (diffHours < 24) {
    return diffHours === 1 ? 'il y a 1 heure' : `il y a ${diffHours} heures`;
  }

  if (diffDays < 7) {
    if (diffDays === 1) {
      return 'hier';
    }
    return `il y a ${diffDays} jours`;
  }

  // Date complète pour les dates plus anciennes
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formate une date en format court "12 jan. 2026"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formate une date en format complet "12 janvier 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Date inconnue';
  }
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
