'use client'

import { useState, useCallback } from 'react'

export function useOptimisticLock(initialUpdatedAt: string) {
  const [originalUpdatedAt] = useState(initialUpdatedAt)
  const [isConflict, setIsConflict] = useState(false)
  const [conflictError, setConflictError] = useState<string | null>(null)

  const checkResponse = useCallback((response: { error?: { code?: string; message?: string } | null }) => {
    if (response.error?.code === 'CONFLICT') {
      setIsConflict(true)
      setConflictError(response.error.message ?? null)
      return true
    }
    return false
  }, [])

  const resolveConflict = useCallback(() => {
    setIsConflict(false)
    setConflictError(null)
  }, [])

  return { originalUpdatedAt, isConflict, conflictError, checkResponse, resolveConflict }
}
