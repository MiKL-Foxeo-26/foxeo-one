/**
 * ZIP Generator — format ZIP "stored" (méthode 0, pas de compression) en Node.js natif.
 * Pas de dépendance externe. Produit un fichier .zip valide et décompressable.
 *
 * TODO Phase 2: Sync automatique via Supabase Edge Function
 * Trigger: UPDATE sur documents WHERE visibility='shared'
 * Edge Function: supabase/functions/sync-document/index.ts
 * - Récupère le fichier depuis Storage
 * - Écrit dans le dossier BMAD via API filesystem ou mount partagé
 * - Met à jour last_synced_at
 * Prérequis: accès réseau au dossier BMAD local (VPN, mount NFS, ou API agent local)
 */

export interface ZipFileEntry {
  name: string
  url: string
}

/** Table CRC-32 précalculée (constante IEEE 802.3) */
function buildCRC32Table(): Uint32Array {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[i] = c
  }
  return table
}

const CRC32_TABLE = buildCRC32Table()

/**
 * Calcule le CRC-32 d'un Uint8Array.
 * Implémentation standard de l'algorithme CRC-32 (IEEE 802.3).
 */
function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

/** Écrit un entier 16-bit little-endian dans buf à l'offset donné */
function writeUInt16LE(buf: Buffer, value: number, offset: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >>> 8) & 0xff
}

/** Écrit un entier 32-bit little-endian dans buf à l'offset donné */
function writeUInt32LE(buf: Buffer, value: number, offset: number): void {
  buf[offset] = value & 0xff
  buf[offset + 1] = (value >>> 8) & 0xff
  buf[offset + 2] = (value >>> 16) & 0xff
  buf[offset + 3] = (value >>> 24) & 0xff
}

interface LocalFileEntry {
  nameBytes: Buffer
  data: Buffer
  crc: number
  localHeaderOffset: number
}

/**
 * Génère un fichier ZIP (format stored) depuis une liste de fichiers téléchargés via URL.
 * @param files Liste de {name, url}
 * @returns Buffer contenant le ZIP complet
 * @throws Error si un fichier ne peut pas être téléchargé
 */
export async function generateZipFromDocuments(files: ZipFileEntry[]): Promise<Buffer> {
  if (files.length === 0) {
    return buildEmptyZip()
  }

  const entries: LocalFileEntry[] = []
  const localParts: Buffer[] = []
  let currentOffset = 0

  // Suivi des noms pour éviter les doublons
  const nameOccurrences = new Map<string, number>()

  // Phase 1 : télécharger chaque fichier et construire les Local File Headers
  for (const file of files) {
    const response = await fetch(file.url)
    if (!response.ok) {
      throw new Error(
        `[DOCUMENTS:SYNC_ZIP] Échec fetch "${file.name}": HTTP ${response.status}`
      )
    }
    const arrayBuffer = await response.arrayBuffer()
    const data = Buffer.from(arrayBuffer)
    const checksum = crc32(new Uint8Array(data))

    // Dédoublonner le nom si déjà présent
    let uniqueName = file.name
    const count = nameOccurrences.get(file.name) ?? 0
    if (count > 0) {
      const ext = file.name.lastIndexOf('.')
      if (ext > 0) {
        uniqueName = `${file.name.slice(0, ext)} (${count + 1})${file.name.slice(ext)}`
      } else {
        uniqueName = `${file.name} (${count + 1})`
      }
    }
    nameOccurrences.set(file.name, count + 1)

    const nameBytes = Buffer.from(uniqueName, 'utf-8')

    // Local File Header (30 bytes + filename + data)
    const localHeader = Buffer.alloc(30)
    // PK\x03\x04 — signature Local File Header
    writeUInt32LE(localHeader, 0x04034b50, 0)
    // Version nécessaire pour extraire : 20 (2.0)
    writeUInt16LE(localHeader, 20, 4)
    // Flags généraux : 0 (aucun)
    writeUInt16LE(localHeader, 0, 6)
    // Méthode de compression : 0 (stored)
    writeUInt16LE(localHeader, 0, 8)
    // Last mod file time : 0
    writeUInt16LE(localHeader, 0, 10)
    // Last mod file date : 0
    writeUInt16LE(localHeader, 0, 12)
    // CRC-32
    writeUInt32LE(localHeader, checksum, 14)
    // Compressed size
    writeUInt32LE(localHeader, data.length, 18)
    // Uncompressed size
    writeUInt32LE(localHeader, data.length, 22)
    // Filename length
    writeUInt16LE(localHeader, nameBytes.length, 26)
    // Extra field length : 0
    writeUInt16LE(localHeader, 0, 28)

    entries.push({
      nameBytes,
      data,
      crc: checksum,
      localHeaderOffset: currentOffset,
    })

    const localPart = Buffer.concat([localHeader, nameBytes, data])
    localParts.push(localPart)
    currentOffset += localPart.length
  }

  // Phase 2 : construire le Central Directory
  const centralParts: Buffer[] = []
  for (const entry of entries) {
    const centralRecord = Buffer.alloc(46)
    // PK\x01\x02 — signature Central Directory File Header
    writeUInt32LE(centralRecord, 0x02014b50, 0)
    // Version faite par : 20
    writeUInt16LE(centralRecord, 20, 4)
    // Version nécessaire pour extraire : 20
    writeUInt16LE(centralRecord, 20, 6)
    // Flags généraux : 0
    writeUInt16LE(centralRecord, 0, 8)
    // Méthode : 0 (stored)
    writeUInt16LE(centralRecord, 0, 10)
    // Last mod time : 0
    writeUInt16LE(centralRecord, 0, 12)
    // Last mod date : 0
    writeUInt16LE(centralRecord, 0, 14)
    // CRC-32
    writeUInt32LE(centralRecord, entry.crc, 16)
    // Compressed size
    writeUInt32LE(centralRecord, entry.data.length, 20)
    // Uncompressed size
    writeUInt32LE(centralRecord, entry.data.length, 24)
    // Filename length
    writeUInt16LE(centralRecord, entry.nameBytes.length, 28)
    // Extra field length : 0
    writeUInt16LE(centralRecord, 0, 30)
    // File comment length : 0
    writeUInt16LE(centralRecord, 0, 32)
    // Disk number start : 0
    writeUInt16LE(centralRecord, 0, 34)
    // Internal attributes : 0
    writeUInt16LE(centralRecord, 0, 36)
    // External attributes : 0
    writeUInt32LE(centralRecord, 0, 38)
    // Relative offset of local header
    writeUInt32LE(centralRecord, entry.localHeaderOffset, 42)

    centralParts.push(Buffer.concat([centralRecord, entry.nameBytes]))
  }

  // Phase 3 : End of Central Directory Record
  const centralDir = Buffer.concat(centralParts)
  const eocd = Buffer.alloc(22)
  // PK\x05\x06 — signature EOCD
  writeUInt32LE(eocd, 0x06054b50, 0)
  // Disk number : 0
  writeUInt16LE(eocd, 0, 4)
  // Start disk : 0
  writeUInt16LE(eocd, 0, 6)
  // Entries on disk
  writeUInt16LE(eocd, entries.length, 8)
  // Total entries
  writeUInt16LE(eocd, entries.length, 10)
  // Size of central directory
  writeUInt32LE(eocd, centralDir.length, 12)
  // Offset of central directory (début, après les local entries)
  writeUInt32LE(eocd, currentOffset, 16)
  // Comment length : 0
  writeUInt16LE(eocd, 0, 20)

  return Buffer.concat([...localParts, centralDir, eocd])
}

/** Retourne un fichier ZIP vide valide (0 fichiers) */
function buildEmptyZip(): Buffer {
  const eocd = Buffer.alloc(22)
  writeUInt32LE(eocd, 0x06054b50, 0)
  writeUInt16LE(eocd, 0, 4)
  writeUInt16LE(eocd, 0, 6)
  writeUInt16LE(eocd, 0, 8)
  writeUInt16LE(eocd, 0, 10)
  writeUInt32LE(eocd, 0, 12)
  writeUInt32LE(eocd, 0, 16)
  writeUInt16LE(eocd, 0, 20)
  return eocd
}
