'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChatList, useConversations, type Conversation } from '@foxeo/modules-chat'

interface ChatPageClientProps {
  initialConversations: Conversation[]
}

export function ChatPageClient({ initialConversations }: ChatPageClientProps) {
  const router = useRouter()
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>()

  const { data: conversations = initialConversations } = useConversations()

  function handleSelectClient(clientId: string) {
    setSelectedClientId(clientId)
    router.push(`/modules/chat/${clientId}`)
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

      {/* Zone principale — placeholder quand aucune conversation sélectionnée */}
      <main className="flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">Sélectionnez une conversation pour commencer</p>
        </div>
      </main>
    </div>
  )
}
