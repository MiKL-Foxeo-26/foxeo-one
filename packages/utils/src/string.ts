/**
 * Utilitaires de manipulation de chaînes
 */

/**
 * Retourne les initiales d'un nom (max 2 caractères)
 * @example getInitials("Jean Dupont") → "JD"
 * @example getInitials("Marie") → "MA"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return name.slice(0, 2).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/**
 * Tronque un texte à la longueur donnée avec ellipsis
 * @example truncate("Bonjour monde", 8) → "Bonjour…"
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}
