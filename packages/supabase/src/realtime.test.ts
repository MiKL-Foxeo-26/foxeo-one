import { describe, it, expect } from 'vitest'
import { CHANNEL_PATTERNS } from './realtime'

describe('CHANNEL_PATTERNS', () => {
  it('generates client notification channel', () => {
    expect(CHANNEL_PATTERNS.clientNotifications('abc-123')).toBe(
      'client:notifications:abc-123'
    )
  })

  it('generates chat room channel', () => {
    expect(CHANNEL_PATTERNS.chatRoom('client-456')).toBe(
      'chat:room:client-456'
    )
  })

  it('generates presence channel', () => {
    expect(CHANNEL_PATTERNS.presence('operator-1')).toBe(
      'presence:operator:operator-1'
    )
  })

  it('generates client config channel', () => {
    expect(CHANNEL_PATTERNS.clientConfig('client-789')).toBe(
      'client:config:client-789'
    )
  })
})
