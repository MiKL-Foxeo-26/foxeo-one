'use client'

import { useState, useCallback } from 'react'
import { sendToElio } from '../actions/send-to-elio'
import type { DashboardType, ElioMessage, ElioError } from '../types/elio.types'

interface UseElioChatOptions {
  dashboardType: DashboardType
  clientId?: string
}

interface UseElioChatReturn {
  messages: ElioMessage[]
  isLoading: boolean
  error: ElioError | null
  sendMessage: (content: string) => Promise<void>
  retrySend: () => Promise<void>
  clearError: () => void
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useElioChat({ dashboardType, clientId }: UseElioChatOptions): UseElioChatReturn {
  const [messages, setMessages] = useState<ElioMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ElioError | null>(null)
  const [lastMessage, setLastMessage] = useState<string>('')

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setLastMessage(content)
      setError(null)

      const userMessage: ElioMessage = {
        id: makeId(),
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
        dashboardType,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      const { data, error: actionError } = await sendToElio(dashboardType, content, clientId)

      setIsLoading(false)

      if (actionError) {
        setError(actionError as ElioError)
        return
      }

      if (data) {
        setMessages((prev) => [...prev, data])
      }
    },
    [dashboardType, clientId, isLoading]
  )

  const retrySend = useCallback(async () => {
    if (!lastMessage) return
    await sendMessage(lastMessage)
  }, [lastMessage, sendMessage])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, retrySend, clearError }
}
