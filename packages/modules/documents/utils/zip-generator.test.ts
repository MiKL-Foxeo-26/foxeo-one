import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateZipFromDocuments } from './zip-generator'

// Signature ZIP : PK\x03\x04 (Local File Header) ou PK\x05\x06 (EOCD)
const EOCD_SIGNATURE = Buffer.from([0x50, 0x4b, 0x05, 0x06])
const LOCAL_HEADER_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04])

function mockFetch(data: ArrayBuffer) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    arrayBuffer: () => Promise.resolve(data),
  })
}

describe('generateZipFromDocuments', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('génère un ZIP vide valide pour une liste vide', async () => {
    const result = await generateZipFromDocuments([])

    expect(result).toBeInstanceOf(Buffer)
    // EOCD doit être présent (22 bytes pour un ZIP vide)
    expect(result.length).toBe(22)
    // Les 4 premiers bytes sont la signature EOCD
    expect(result.subarray(0, 4)).toEqual(EOCD_SIGNATURE)
  })

  it('génère un ZIP valide avec un seul fichier', async () => {
    const content = Buffer.from('Hello, World!')
    global.fetch = mockFetch(content.buffer as ArrayBuffer)

    const result = await generateZipFromDocuments([
      { name: 'test.txt', url: 'https://example.com/test.txt' },
    ])

    expect(result).toBeInstanceOf(Buffer)
    // Doit commencer par la signature Local File Header
    expect(result.subarray(0, 4)).toEqual(LOCAL_HEADER_SIGNATURE)
    // Le buffer doit contenir les données du fichier
    const resultStr = result.toString()
    expect(resultStr).toContain('test.txt')
    expect(resultStr).toContain('Hello, World!')
  })

  it('génère un ZIP valide avec plusieurs fichiers', async () => {
    const content1 = Buffer.from('Contenu fichier 1')
    const content2 = Buffer.from('Contenu fichier 2')

    let callCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      const data = callCount === 0 ? content1.buffer : content2.buffer
      callCount++
      return Promise.resolve({
        ok: true,
        status: 200,
        arrayBuffer: () => Promise.resolve(data),
      })
    })

    const result = await generateZipFromDocuments([
      { name: 'doc1.pdf', url: 'https://example.com/doc1.pdf' },
      { name: 'doc2.md', url: 'https://example.com/doc2.md' },
    ])

    expect(result).toBeInstanceOf(Buffer)
    expect(result.subarray(0, 4)).toEqual(LOCAL_HEADER_SIGNATURE)
    const resultStr = result.toString()
    expect(resultStr).toContain('doc1.pdf')
    expect(resultStr).toContain('doc2.md')
  })

  it('lève une erreur si le fetch échoue', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    })

    await expect(
      generateZipFromDocuments([
        { name: 'missing.pdf', url: 'https://example.com/missing.pdf' },
      ])
    ).rejects.toThrow('HTTP 404')
  })
})
