'use client'

import { Button, Badge } from '@foxeo/ui'
import { useMarkNotificationRead } from '../hooks/use-notifications'
import type { Notification } from '../types/crm.types'

interface NotificationItemProps {
  notification: Notification
  onViewClient?: (clientId: string) => void
  onDeferClient?: (clientId: string) => void
}

const formatRelativeDate = (isoDate: string): string => {
  const now = new Date()
  const date = new Date(isoDate)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function NotificationItem({
  notification,
  onViewClient,
  onDeferClient,
}: NotificationItemProps) {
  const markRead = useMarkNotificationRead()

  const handleMarkRead = () => {
    markRead.mutate(notification.id)
  }

  const handleViewClient = () => {
    if (notification.entityId) {
      onViewClient?.(notification.entityId)
      if (!notification.read) {
        markRead.mutate(notification.id)
      }
    }
  }

  const handleDefer = () => {
    if (notification.entityId) {
      onDeferClient?.(notification.entityId)
      if (!notification.read) {
        markRead.mutate(notification.id)
      }
    }
  }

  return (
    <div
      className={`rounded-lg border p-3 space-y-2 ${
        notification.read ? 'opacity-60' : 'border-primary/30'
      }`}
      data-testid={`notification-item-${notification.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
            <p className="text-sm font-medium">{notification.title}</p>
          </div>
          {notification.message && (
            <p className="text-xs text-muted-foreground">
              {notification.message}
            </p>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatRelativeDate(notification.createdAt)}
        </span>
      </div>

      {notification.type === 'inactivity_alert' && notification.entityId && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewClient}
            data-testid="notification-view-client"
          >
            Voir la fiche
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDefer}
            data-testid="notification-defer-client"
          >
            À traiter plus tard
          </Button>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkRead}
              disabled={markRead.isPending}
              data-testid="notification-mark-read"
            >
              Ignorer
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

NotificationItem.displayName = 'NotificationItem'
