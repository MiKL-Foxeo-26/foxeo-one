// Chat Module
export { manifest } from './manifest'

// Components
export { ChatWindow } from './components/chat-window'
export { ChatMessage } from './components/chat-message'
export { ChatInput } from './components/chat-input'
export { ChatList } from './components/chat-list'
export { ChatSkeleton } from './components/chat-skeleton'
export { UnreadBadge } from './components/unread-badge'

// Hooks
export { useChatMessages } from './hooks/use-chat-messages'
export { useConversations } from './hooks/use-conversations'
export { useChatRealtime } from './hooks/use-chat-realtime'

// Actions
export { sendMessage } from './actions/send-message'
export { getMessages } from './actions/get-messages'
export { getConversations } from './actions/get-conversations'
export { markMessagesRead } from './actions/mark-messages-read'

// Types
export type {
  Message,
  MessageDB,
  Conversation,
  SenderType,
  SendMessageInput,
  GetMessagesInput,
  MarkMessagesReadInput,
} from './types/chat.types'
