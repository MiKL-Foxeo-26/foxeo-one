import { getConversations } from '@foxeo/modules-chat'
import { ChatPageClient } from './chat-page-client'

export default async function ChatPage() {
  const { data: conversations } = await getConversations()

  return <ChatPageClient initialConversations={conversations ?? []} />
}
