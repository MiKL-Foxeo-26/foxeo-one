import { describe, it, expect } from 'vitest'
import {
  validateFile,
  formatFileSize,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from './file-validation'

// Helper to create a mock File
function createMockFile(name: string, size: number, type = 'application/octet-stream'): File {
  const buffer = new ArrayBuffer(size)
  return new File([buffer], name, { type })
}

describe('validateFile', () => {
  it('accepts valid PDF file', () => {
    const file = createMockFile('rapport.pdf', 1024 * 1024) // 1 Mo
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid DOCX file', () => {
    const file = createMockFile('document.docx', 500 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid XLSX file', () => {
    const file = createMockFile('data.xlsx', 2 * 1024 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid PNG image', () => {
    const file = createMockFile('photo.png', 3 * 1024 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid JPG image', () => {
    const file = createMockFile('photo.jpg', 500 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid JPEG image', () => {
    const file = createMockFile('photo.jpeg', 500 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid SVG file', () => {
    const file = createMockFile('logo.svg', 50 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid MD file', () => {
    const file = createMockFile('readme.md', 10 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid TXT file', () => {
    const file = createMockFile('notes.txt', 5 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts valid CSV file', () => {
    const file = createMockFile('data.csv', 1 * 1024 * 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('rejects EXE file (invalid type)', () => {
    const file = createMockFile('malware.exe', 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Type de fichier non autorisé')
  })

  it('rejects ZIP file (invalid type)', () => {
    const file = createMockFile('archive.zip', 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Type de fichier non autorisé')
  })

  it('rejects JS file (invalid type)', () => {
    const file = createMockFile('script.js', 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
  })

  it('rejects file without extension', () => {
    const file = createMockFile('noextension', 1024)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Type de fichier non autorisé')
  })

  it('rejects MIME type mismatch (extension spoofing)', () => {
    // A .pdf file with image/jpeg MIME type
    const buffer = new ArrayBuffer(1024)
    const file = new File([buffer], 'fake.pdf', { type: 'image/jpeg' })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('MIME invalide')
  })

  it('accepts when MIME type matches extension category', () => {
    const buffer = new ArrayBuffer(1024)
    const file = new File([buffer], 'photo.png', { type: 'image/png' })
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('accepts when MIME type is empty (no browser detection)', () => {
    // Some browsers may not set file.type
    const buffer = new ArrayBuffer(1024)
    const file = new File([buffer], 'doc.pdf', { type: '' })
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('rejects file exceeding MAX_FILE_SIZE', () => {
    const file = createMockFile('huge.pdf', MAX_FILE_SIZE + 1)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('trop volumineux')
    expect(result.error).toContain('10 Mo')
  })

  it('accepts file exactly at MAX_FILE_SIZE', () => {
    const file = createMockFile('exact.pdf', MAX_FILE_SIZE)
    expect(validateFile(file)).toEqual({ valid: true })
  })

  it('rejects empty file (0 bytes)', () => {
    const file = createMockFile('empty.pdf', 0)
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('vide')
  })

  it('is case-insensitive for extensions', () => {
    const file = createMockFile('report.PDF', 1024)
    expect(validateFile(file)).toEqual({ valid: true })
  })
})

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 o')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 o')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 Ko')
    expect(formatFileSize(1536)).toBe('1.5 Ko')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 Mo')
    expect(formatFileSize(5.5 * 1024 * 1024)).toBe('5.5 Mo')
  })
})

describe('Constants', () => {
  it('MAX_FILE_SIZE is 10 Mo', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024)
  })

  it('ALLOWED_FILE_TYPES contains all required types', () => {
    const required = ['pdf', 'docx', 'xlsx', 'png', 'jpg', 'jpeg', 'svg', 'md', 'txt', 'csv']
    for (const type of required) {
      expect(ALLOWED_FILE_TYPES).toContain(type)
    }
  })
})
