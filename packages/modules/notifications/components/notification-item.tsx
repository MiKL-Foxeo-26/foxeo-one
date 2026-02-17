'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markAsRead } from '../actions/mark-as-read'
import type { Notification } from '../types/notification.types'
import { NOTIFICATION_ICONS } from '../types/notification.types'

interface NotificationItemProps {
  notification: Notification
  recipientId: string
  onClose?: () => void
}

const ICON_MAP: Record<string, string> = {
  'message-circle': '💬',
  'check-circle': '✅',
  'alert-triangle': '⚠️',
  'info': 'ℹ️',
  'award': '🏆',
  'credit-card': '💳',
  'clock': '⏰',
  'file-check': '📋',
}

const formatRelativeDate = (isoDate: string): string => {
  const now = new Date()
  const date = new Date(isoDate)
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'À l\'instant'
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

export function NotificationItem({
  notification,
  recipientId,
  onClose,
}: NotificationItemProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const isUnread = !notification.readAt
  const iconName = NOTIFICATION_ICONS[notification.type] ?? 'info'
  const emoji = ICON_MAP[iconName] ?? '🔔'

  const markReadMutation = useMutation({
    mutationFn: () => markAsRead({ notificationId: notification.id }),
    onSuccess: (response) => {
      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ['notifications', recipientId] })
        queryClient.invalidateQueries({
          queryKey: ['notifications', recipientId, 'unread-count'],
        })
      }
    },
  })

  const handleClick = () => {
    if (isUnread) {
      markReadMutation.mutate()
    }
    if (notification.link) {
      onClose?.()
      router.push(notification.link)
    }
  }

  return (
    <button
      type="button"
      className={`w-full text-left p-3 hover:bg-accent/50 transition-colors ${
        isUnread ? 'bg-accent/20' : ''
      }`}
      onClick={handleClick}
      data-testid={`notification-item-${notification.id}`}
    >
      <div className="flex items-start gap-2">
        <span className="text-base mt-0.5">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isUnread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
            <p className="text-sm font-medium truncate">{notification.title}</p>
          </div>
          {notification.body && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {notification.body}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-1">
            {formatRelativeDate(notification.createdAt)}
          </p>
        </div>
      </div>
    </button>
  )
}

NotificationItem.displayName = 'NotificationItem'
