'use client'

import { useState } from 'react'
import { ChatList, ChatWindow, useConversations, markMessagesRead, type Message, type Conversation } from '@foxeo/modules-chat'
import { useQueryClient } from '@tanstack/react-query'

interface ChatConversationClientProps {
  clientId: string
  operatorId: string
  initialMessages: Message[]
}

export function ChatConversationClient({
  clientId,
  operatorId,
  initialMessages,
}: ChatConversationClientProps) {
  const [selectedClientId, setSelectedClientId] = useState(clientId)
  const queryClient = useQueryClient()
  const { data: conversations = [] } = useConversations()

  async function handleSelectClient(newClientId: string) {
    setSelectedClientId(newClientId)
    await markMessagesRead({ clientId: newClientId })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }

  async function handleMarkRead(cId: string) {
    await markMessagesRead({ clientId: cId })
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
  }

  return (
    <div className="flex h-full">
      {/* Sidebar — liste des conversations */}
      <aside className="w-80 shrink-0 border-r flex flex-col">
        <div className="border-b p-4">
          <h1 className="text-lg font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground">{conversations.length} conversation(s)</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatList
            selectedClientId={selectedClientId}
            onSelectClient={handleSelectClient}
          />
        </div>
      </aside>

      {/* Fenêtre chat principale */}
      <main className="flex flex-1 flex-col">
        <ChatWindow
          clientId={selectedClientId}
          operatorId={operatorId}
          currentUserType="operator"
          onMarkRead={handleMarkRead}
        />
      </main>
    </div>
  )
}
