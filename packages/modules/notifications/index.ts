// Notifications Module
export { manifest } from './manifest'

// Components
export { NotificationBadge } from './components/notification-badge'
export { NotificationCenter } from './components/notification-center'
export { NotificationItem } from './components/notification-item'
export { notifyToast } from './components/notification-toast'

// Hooks
export { useNotifications } from './hooks/use-notifications'
export { useUnreadCount } from './hooks/use-unread-count'
export { useNotificationsRealtime } from './hooks/use-notifications-realtime'

// Actions
export { getNotifications } from './actions/get-notifications'
export { getUnreadCount } from './actions/get-unread-count'
export { markAsRead } from './actions/mark-as-read'
export { markAllAsRead } from './actions/mark-all-as-read'
export { createNotification } from './actions/create-notification'

// Types
export type {
  Notification,
  NotificationDB,
  NotificationType,
  RecipientType,
  GetNotificationsInput,
  CreateNotificationInput,
  MarkAsReadInput,
} from './types/notification.types'

export { NOTIFICATION_ICONS } from './types/notification.types'
