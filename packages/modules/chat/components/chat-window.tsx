'use client'

import { useCallback, useEffect, useRef } from 'react'
import { ScrollArea } from '@foxeo/ui'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatSkeleton } from './chat-skeleton'
import { PresenceIndicator } from './presence-indicator'
import { useChatMessages } from '../hooks/use-chat-messages'
import { useChatRealtime } from '../hooks/use-chat-realtime'
import { usePresenceStatus } from '../hooks/use-presence-status'
import type { SenderType } from '../types/chat.types'

interface ChatWindowProps {
  clientId: string
  operatorId: string
  currentUserType: SenderType
  onMarkRead?: (clientId: string) => void
}

export function ChatWindow({
  clientId,
  operatorId,
  currentUserType,
  onMarkRead,
}: ChatWindowProps) {
  const { messages, isPending, isSending, sendMessage } = useChatMessages(clientId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // AC3: Client sees operator presence status
  const operatorStatus = usePresenceStatus(operatorId)

  // Subscribe to realtime updates
  useChatRealtime(clientId)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Trigger mark as read when opening conversation or receiving new messages (debounced)
  const markReadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stableMarkRead = useCallback(() => {
    if (onMarkRead) onMarkRead(clientId)
  }, [clientId, onMarkRead])

  useEffect(() => {
    if (!onMarkRead || messages.length === 0) return
    if (markReadTimer.current) clearTimeout(markReadTimer.current)
    markReadTimer.current = setTimeout(stableMarkRead, 500)
    return () => {
      if (markReadTimer.current) clearTimeout(markReadTimer.current)
    }
  }, [clientId, stableMarkRead, messages.length, onMarkRead])

  function handleSend(content: string) {
    sendMessage({
      clientId,
      operatorId,
      senderType: currentUserType,
      content,
    })
  }

  if (isPending) {
    return <ChatSkeleton />
  }

  return (
    <div className="flex h-full flex-col" data-testid="chat-window">
      {/* AC3: Operator presence header — visible to client only */}
      {currentUserType === 'client' && (
        <div
          className="flex items-center gap-2 border-b px-4 py-2 text-sm text-muted-foreground"
          data-testid="operator-presence-header"
        >
          <PresenceIndicator status={operatorStatus} />
          {operatorStatus === 'online' ? (
            <span>Votre conseiller est en ligne</span>
          ) : (
            <span>Votre conseiller vous répondra dès que possible</span>
          )}
        </div>
      )}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
              Aucun message pour le moment. Démarrez la conversation !
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserType={currentUserType}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  )
}
