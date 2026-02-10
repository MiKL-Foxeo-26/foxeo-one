import { describe, it, expect } from 'vitest'
import { successResponse, errorResponse } from './action-response'

describe('successResponse', () => {
  it('returns data with null error', () => {
    const result = successResponse({ id: '123', name: 'Test' })
    expect(result.data).toEqual({ id: '123', name: 'Test' })
    expect(result.error).toBeNull()
  })

  it('works with string data', () => {
    const result = successResponse('ok')
    expect(result.data).toBe('ok')
    expect(result.error).toBeNull()
  })

  it('works with array data', () => {
    const result = successResponse([1, 2, 3])
    expect(result.data).toEqual([1, 2, 3])
    expect(result.error).toBeNull()
  })
})

describe('errorResponse', () => {
  it('returns null data with error', () => {
    const result = errorResponse('Not found', 'NOT_FOUND')
    expect(result.data).toBeNull()
    expect(result.error).toEqual({
      message: 'Not found',
      code: 'NOT_FOUND',
      details: undefined,
    })
  })

  it('includes optional details', () => {
    const result = errorResponse('Validation failed', 'VALIDATION', {
      field: 'email',
    })
    expect(result.error?.details).toEqual({ field: 'email' })
  })
})
