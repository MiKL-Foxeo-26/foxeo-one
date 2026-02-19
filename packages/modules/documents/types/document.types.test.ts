import { describe, it, expect } from 'vitest'
import {
  ShareDocumentInput,
  UnshareDocumentInput,
  ShareDocumentsBatchInput,
} from './document.types'

const VALID_UUID = '00000000-0000-0000-0000-000000000001'
const VALID_UUID_2 = '00000000-0000-0000-0000-000000000002'

describe('ShareDocumentInput', () => {
  it('parses valid documentId', () => {
    const result = ShareDocumentInput.safeParse({ documentId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID documentId', () => {
    const result = ShareDocumentInput.safeParse({ documentId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })
})

describe('UnshareDocumentInput', () => {
  it('parses valid documentId', () => {
    const result = UnshareDocumentInput.safeParse({ documentId: VALID_UUID })
    expect(result.success).toBe(true)
  })

  it('rejects missing documentId', () => {
    const result = UnshareDocumentInput.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('ShareDocumentsBatchInput', () => {
  it('parses valid input', () => {
    const result = ShareDocumentsBatchInput.safeParse({
      documentIds: [VALID_UUID, VALID_UUID_2],
      clientId: VALID_UUID,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty documentIds array', () => {
    const result = ShareDocumentsBatchInput.safeParse({
      documentIds: [],
      clientId: VALID_UUID,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-UUID in documentIds', () => {
    const result = ShareDocumentsBatchInput.safeParse({
      documentIds: ['not-a-uuid'],
      clientId: VALID_UUID,
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing clientId', () => {
    const result = ShareDocumentsBatchInput.safeParse({
      documentIds: [VALID_UUID],
    })
    expect(result.success).toBe(false)
  })
})
