import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOptimisticLock } from './use-optimistic-lock'

describe('useOptimisticLock', () => {
  const initialUpdatedAt = '2026-02-18T10:00:00Z'

  it('should capture and expose originalUpdatedAt', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))
    expect(result.current.originalUpdatedAt).toBe(initialUpdatedAt)
  })

  it('should initialize isConflict as false', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))
    expect(result.current.isConflict).toBe(false)
  })

  it('should initialize conflictError as null', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))
    expect(result.current.conflictError).toBeNull()
  })

  it('should detect conflict via checkResponse when error code is CONFLICT', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))

    let isConflict: boolean
    act(() => {
      isConflict = result.current.checkResponse({
        error: { code: 'CONFLICT', message: 'Données modifiées' },
      })
    })

    expect(isConflict!).toBe(true)
    expect(result.current.isConflict).toBe(true)
    expect(result.current.conflictError).toBe('Données modifiées')
  })

  it('should return false from checkResponse when no conflict', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))

    let isConflict: boolean
    act(() => {
      isConflict = result.current.checkResponse({ error: null })
    })

    expect(isConflict!).toBe(false)
    expect(result.current.isConflict).toBe(false)
  })

  it('should return false from checkResponse for non-CONFLICT errors', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))

    let isConflict: boolean
    act(() => {
      isConflict = result.current.checkResponse({
        error: { code: 'DB_ERROR', message: 'Other error' },
      })
    })

    expect(isConflict!).toBe(false)
    expect(result.current.isConflict).toBe(false)
  })

  it('should resolve conflict and reset state', () => {
    const { result } = renderHook(() => useOptimisticLock(initialUpdatedAt))

    act(() => {
      result.current.checkResponse({
        error: { code: 'CONFLICT', message: 'Conflit détecté' },
      })
    })

    expect(result.current.isConflict).toBe(true)

    act(() => {
      result.current.resolveConflict()
    })

    expect(result.current.isConflict).toBe(false)
    expect(result.current.conflictError).toBeNull()
  })

  it('should preserve originalUpdatedAt across re-renders', () => {
    const { result, rerender } = renderHook(() => useOptimisticLock(initialUpdatedAt))

    expect(result.current.originalUpdatedAt).toBe(initialUpdatedAt)
    rerender()
    expect(result.current.originalUpdatedAt).toBe(initialUpdatedAt)
  })
})
