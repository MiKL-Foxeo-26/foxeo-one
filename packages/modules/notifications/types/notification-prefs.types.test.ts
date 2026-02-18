import { describe, it, expect } from 'vitest'
import {
  NotificationPreference,
  NotificationPreferenceDB,
  UpdatePreferenceInput,
  SetOperatorOverrideInput,
  PREFERENCE_NOTIFICATION_TYPES,
  CRITICAL_INAPP_TYPES,
  NotificationPreferenceType,
} from './notification-prefs.types'

describe('NotificationPreference types', () => {
  it('NotificationPreferenceType enum contains all expected types', () => {
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('message')
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('validation')
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('alert')
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('system')
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('graduation')
    expect(PREFERENCE_NOTIFICATION_TYPES).toContain('payment')
  })

  it('CRITICAL_INAPP_TYPES contains system and graduation', () => {
    expect(CRITICAL_INAPP_TYPES).toContain('system')
    expect(CRITICAL_INAPP_TYPES).toContain('graduation')
    expect(CRITICAL_INAPP_TYPES).not.toContain('message')
  })

  it('NotificationPreference schema validates correct data', () => {
    const result = NotificationPreference.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440001',
      userType: 'client',
      userId: '550e8400-e29b-41d4-a716-446655440002',
      notificationType: 'message',
      channelEmail: true,
      channelInapp: true,
      operatorOverride: false,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
    })
    expect(result.success).toBe(true)
  })

  it('NotificationPreference schema rejects invalid user_type', () => {
    const result = NotificationPreference.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440001',
      userType: 'admin', // invalid
      userId: '550e8400-e29b-41d4-a716-446655440002',
      notificationType: 'message',
      channelEmail: true,
      channelInapp: true,
      operatorOverride: false,
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T10:00:00Z',
    })
    expect(result.success).toBe(false)
  })

  it('UpdatePreferenceInput schema validates minimal update', () => {
    const result = UpdatePreferenceInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440002',
      userType: 'client',
      notificationType: 'message',
      channelEmail: false,
    })
    expect(result.success).toBe(true)
  })

  it('UpdatePreferenceInput requires at least one channel update', () => {
    const result = UpdatePreferenceInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440002',
      userType: 'client',
      notificationType: 'message',
      // no channel fields
    })
    expect(result.success).toBe(false)
  })

  it('SetOperatorOverrideInput validates correctly', () => {
    const result = SetOperatorOverrideInput.safeParse({
      clientId: '550e8400-e29b-41d4-a716-446655440002',
      notificationType: 'message',
      operatorOverride: true,
    })
    expect(result.success).toBe(true)
  })
})
