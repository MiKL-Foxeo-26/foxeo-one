import type { CsvImportRow, CsvValidationResult } from '../types/crm.types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_CLIENT_TYPES = ['complet', 'direct_one', 'ponctuel']

/**
 * Valide une ligne CSV et retourne les erreurs éventuelles.
 */
export function validateCsvRow(row: CsvImportRow): CsvValidationResult {
  const errors: string[] = []

  // Champs obligatoires
  if (!row.name.trim()) {
    errors.push('Nom obligatoire')
  }

  if (!row.email.trim()) {
    errors.push('Email obligatoire')
  } else if (!isValidEmail(row.email)) {
    errors.push('Email invalide')
  }

  // Type client valide
  if (row.clientType && !VALID_CLIENT_TYPES.includes(row.clientType)) {
    errors.push(`Type client invalide (${VALID_CLIENT_TYPES.join(', ')})`)
  }

  return {
    row,
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Valide un tableau complet de lignes CSV.
 * Détecte aussi les emails en doublon dans le fichier lui-même.
 */
export function validateCsvRows(rows: CsvImportRow[]): CsvValidationResult[] {
  const seenEmails = new Map<string, number>()
  const results: CsvValidationResult[] = []

  for (const row of rows) {
    const result = validateCsvRow(row)

    // Vérifier doublons internes au fichier
    if (row.email.trim()) {
      const emailLower = row.email.toLowerCase()
      const firstSeen = seenEmails.get(emailLower)

      if (firstSeen !== undefined) {
        result.valid = false
        result.errors.push(`Email en doublon (déjà présent ligne ${firstSeen})`)
      } else {
        seenEmails.set(emailLower, row.lineNumber)
      }
    }

    results.push(result)
  }

  return results
}

/**
 * Marque les lignes dont l'email existe déjà en base.
 * Appelé après validation côté client, avant l'envoi au serveur.
 */
export function markDuplicateEmails(
  results: CsvValidationResult[],
  existingEmails: Set<string>
): CsvValidationResult[] {
  return results.map((result) => {
    if (existingEmails.has(result.row.email.toLowerCase())) {
      return {
        ...result,
        valid: false,
        errors: [...result.errors, 'Email déjà existant en base'],
      }
    }
    return result
  })
}

/**
 * Valide le format d'un email.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}
