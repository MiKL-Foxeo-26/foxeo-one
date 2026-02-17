import type { CsvImportRow } from '../types/crm.types'

const EXPECTED_HEADERS = ['nom', 'email', 'entreprise', 'telephone', 'secteur', 'type_client']

/**
 * Parse un contenu CSV en tableau de CsvImportRow.
 * Gère : BOM UTF-8, retours chariot \r\n, guillemets, lignes vides.
 * Parsing côté client uniquement (pas de round-trip serveur pour l'aperçu).
 */
export function parseCsv(content: string): CsvImportRow[] {
  // Supprimer BOM UTF-8 si présent
  const cleaned = content.replace(/^\uFEFF/, '')

  const lines = splitCsvLines(cleaned)
  if (lines.length < 2) {
    return []
  }

  // Parse headers (première ligne)
  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase())

  // Valider la présence des headers attendus
  const headerMap: Record<string, number> = {}
  for (const expected of EXPECTED_HEADERS) {
    const idx = headers.indexOf(expected)
    if (idx !== -1) {
      headerMap[expected] = idx
    }
  }

  // Parser les lignes de données
  const rows: CsvImportRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Ignorer les lignes vides

    const values = parseCsvLine(line)

    rows.push({
      lineNumber: i + 1,
      name: getField(values, headerMap, 'nom'),
      email: getField(values, headerMap, 'email'),
      company: getField(values, headerMap, 'entreprise'),
      phone: getField(values, headerMap, 'telephone'),
      sector: getField(values, headerMap, 'secteur'),
      clientType: normalizeClientType(getField(values, headerMap, 'type_client')),
    })
  }

  return rows
}

/**
 * Récupère la valeur d'un champ depuis le tableau de valeurs selon le header map.
 */
function getField(
  values: string[],
  headerMap: Record<string, number>,
  header: string
): string {
  const idx = headerMap[header]
  if (idx === undefined || idx >= values.length) return ''
  return values[idx].trim()
}

/**
 * Normalise la valeur type_client vers les enums acceptés.
 */
function normalizeClientType(value: string): string {
  const normalized = value.toLowerCase().trim()
  const mapping: Record<string, string> = {
    'complet': 'complet',
    'direct_one': 'direct_one',
    'direct one': 'direct_one',
    'directone': 'direct_one',
    'ponctuel': 'ponctuel',
  }
  return mapping[normalized] ?? 'ponctuel'
}

/**
 * Découpe le contenu CSV en lignes, en respectant les guillemets multilignes.
 */
function splitCsvLines(content: string): string[] {
  const lines: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (char === '"') {
      inQuotes = !inQuotes
      current += char
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Gérer \r\n
      if (char === '\r' && content[i + 1] === '\n') {
        i++
      }
      lines.push(current)
      current = ''
    } else {
      current += char
    }
  }

  // Dernière ligne (sans newline final)
  if (current) {
    lines.push(current)
  }

  return lines
}

/**
 * Parse une ligne CSV en tenant compte des guillemets.
 * Gère : "valeur,avec,virgules", "valeur avec ""guillemets""", valeur simple.
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        // Guillemet double échappé "" → un seul "
        if (line[i + 1] === '"') {
          current += '"'
          i += 2
          continue
        }
        // Fin du champ entre guillemets
        inQuotes = false
        i++
        continue
      }
      current += char
      i++
    } else {
      if (char === '"') {
        inQuotes = true
        i++
        continue
      }
      if (char === ',') {
        fields.push(current)
        current = ''
        i++
        continue
      }
      current += char
      i++
    }
  }

  // Dernier champ
  fields.push(current)

  return fields
}

/**
 * Génère le contenu du template CSV à télécharger.
 */
export function generateCsvTemplate(): string {
  return 'nom,email,entreprise,telephone,secteur,type_client\nJean Dupont,jean@example.com,Mon Entreprise,0612345678,Tech,complet\nMarie Martin,marie@example.com,Son Entreprise,,Commerce,ponctuel\n'
}
