import { describe, it, expect } from 'vitest'
import {
  Notification,
  NotificationTypeEnum,
  RecipientTypeEnum,
  CreateNotificationInput,
  MarkAsReadInput,
  GetNotificationsInput,
  NOTIFICATION_ICONS,
} from './notification.types'

describe('notification.types', () => {
  describe('RecipientTypeEnum', () => {
    it('should accept valid recipient types', () => {
      expect(RecipientTypeEnum.parse('client')).toBe('client')
      expect(RecipientTypeEnum.parse('operator')).toBe('operator')
    })

    it('should reject invalid recipient types', () => {
      expect(() => RecipientTypeEnum.parse('admin')).toThrow()
    })
  })

  describe('NotificationTypeEnum', () => {
    it('should accept all valid types', () => {
      const types = ['message', 'validation', 'alert', 'system', 'graduation', 'payment', 'inactivity_alert', 'csv_import_complete']
      types.forEach((t) => expect(NotificationTypeEnum.parse(t)).toBe(t))
    })

    it('should reject invalid types', () => {
      expect(() => NotificationTypeEnum.parse('unknown')).toThrow()
    })
  })

  describe('Notification schema', () => {
    const validNotification = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      recipientType: 'operator',
      recipientId: '550e8400-e29b-41d4-a716-446655440001',
      type: 'message',
      title: 'Test notification',
      body: 'Some body',
      link: '/chat',
      readAt: null,
      createdAt: '2026-02-17T10:00:00Z',
    }

    it('should parse valid notification', () => {
      const result = Notification.safeParse(validNotification)
      expect(result.success).toBe(true)
    })

    it('should accept null body and link', () => {
      const result = Notification.safeParse({ ...validNotification, body: null, link: null })
      expect(result.success).toBe(true)
    })

    it('should reject missing title', () => {
      const { title, ...noTitle } = validNotification
      const result = Notification.safeParse(noTitle)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateNotificationInput', () => {
    it('should accept valid input', () => {
      const result = CreateNotificationInput.safeParse({
        recipientType: 'client',
        recipientId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'validation',
        title: 'Brief validé',
      })
      expect(result.success).toBe(true)
    })

    it('should reject empty title', () => {
      const result = CreateNotificationInput.safeParse({
        recipientType: 'client',
        recipientId: '550e8400-e29b-41d4-a716-446655440000',
        type: 'validation',
        title: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('MarkAsReadInput', () => {
    it('should accept valid UUID', () => {
      const result = MarkAsReadInput.safeParse({
        notificationId: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid UUID', () => {
      const result = MarkAsReadInput.safeParse({ notificationId: 'bad' })
      expect(result.success).toBe(false)
    })
  })

  describe('GetNotificationsInput', () => {
    it('should accept valid input with defaults', () => {
      const result = GetNotificationsInput.safeParse({
        recipientId: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.offset).toBe(0)
        expect(result.data.limit).toBe(20)
      }
    })
  })

  describe('NOTIFICATION_ICONS', () => {
    it('should have an icon for each notification type', () => {
      const types = NotificationTypeEnum.options
      types.forEach((t) => {
        expect(NOTIFICATION_ICONS[t]).toBeDefined()
      })
    })
  })
})
