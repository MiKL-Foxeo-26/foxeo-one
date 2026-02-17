'use client'

import { Avatar, AvatarFallback, Badge, Skeleton } from '@foxeo/ui'
import { cn } from '@foxeo/utils'
import { useConversations } from '../hooks/use-conversations'
import type { Conversation } from '../types/chat.types'

interface ChatListProps {
  selectedClientId?: string
  onSelectClient: (clientId: string) => void
}

function formatLastMessageTime(isoDate: string | null): string {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' })
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50',
        isSelected && 'bg-muted'
      )}
      data-testid="conversation-item"
      aria-selected={isSelected}
    >
      <Avatar className="mt-0.5 h-10 w-10 shrink-0">
        <AvatarFallback>{getInitials(conversation.clientName)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">{conversation.clientName}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatLastMessageTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">
            {conversation.lastMessage ?? 'Aucun message'}
          </span>
          {conversation.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="h-5 min-w-5 shrink-0 px-1 text-xs"
              aria-label={`${conversation.unreadCount} non lus`}
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

export function ChatList({ selectedClientId, onSelectClient }: ChatListProps) {
  const { data: conversations, isPending } = useConversations()

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 p-2" data-testid="chat-list-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground text-sm p-4">
        Aucun client trouvé.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0.5 p-2 overflow-y-auto" data-testid="chat-list">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.clientId}
          conversation={conversation}
          isSelected={selectedClientId === conversation.clientId}
          onClick={() => onSelectClient(conversation.clientId)}
        />
      ))}
    </div>
  )
}
