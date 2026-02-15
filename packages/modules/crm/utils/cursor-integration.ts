/**
 * Cursor Integration Utilities
 * Provides functionality to open BMAD client folders in Cursor editor
 */

export const BMAD_BASE_PATH =
  process.env.NEXT_PUBLIC_BMAD_BASE_PATH || '/Users/mikl/bmad'

/**
 * Converts a string to kebab-case
 * Handles accents, special characters, and multiple spaces
 */
export function toKebabCase(str: string): string {
  if (!str) return ''

  // Normalize accents (NFD = decompose accented chars, then remove diacritics)
  const normalized = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  // Replace special chars and underscores with spaces
  const cleaned = normalized.replace(/[^a-z0-9\s-]/g, ' ')

  // Convert multiple spaces/hyphens to single hyphen, trim, remove trailing hyphens
  return cleaned
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Builds a client slug from name and optional company
 * Uses company name if provided, otherwise uses client name
 */
export function buildClientSlug(name: string, company?: string): string {
  const source = company || name
  return toKebabCase(source)
}

/**
 * Builds the full BMAD path for a client
 */
export function buildBmadPath(
  clientSlug: string,
  basePath: string = BMAD_BASE_PATH
): string {
  return `${basePath}/clients/${clientSlug}`
}

/**
 * Generates a cursor:// protocol URL from a file path
 */
export function buildCursorUrl(path: string): string {
  return `cursor://file/${path}`
}
