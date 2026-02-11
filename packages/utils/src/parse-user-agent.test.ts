import { describe, it, expect } from 'vitest'
import { parseUserAgent, maskIpAddress } from './parse-user-agent'

describe('parseUserAgent', () => {
  describe('browser detection', () => {
    it('detects Chrome on Windows', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Chrome 120')
    })

    it('detects Firefox on Linux', () => {
      const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Firefox 121')
    })

    it('detects Safari on macOS', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Safari 17')
    })

    it('detects Edge on Windows', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Edge 120')
    })

    it('detects Opera', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Opera 106')
    })

    it('detects Samsung Browser', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36'
      const result = parseUserAgent(ua)
      expect(result.browser).toBe('Samsung Browser 23')
    })

    it('returns "Navigateur inconnu" for empty string', () => {
      const result = parseUserAgent('')
      expect(result.browser).toBe('Navigateur inconnu')
    })
  })

  describe('OS detection', () => {
    it('detects Windows 10/11', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0'
      expect(parseUserAgent(ua).os).toBe('Windows 10/11')
    })

    it('detects macOS with version', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
      expect(parseUserAgent(ua).os).toBe('macOS 10.15')
    })

    it('detects iOS from iPhone', () => {
      const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      expect(parseUserAgent(ua).os).toBe('iOS 17.2')
    })

    it('detects iPadOS', () => {
      const ua = 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      expect(parseUserAgent(ua).os).toBe('iPadOS 17.2')
    })

    it('detects Android with version', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
      expect(parseUserAgent(ua).os).toBe('Android 14')
    })

    it('detects Linux', () => {
      const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0'
      expect(parseUserAgent(ua).os).toBe('Linux')
    })

    it('detects Chrome OS', () => {
      const ua = 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 Chrome/120.0.0.0'
      expect(parseUserAgent(ua).os).toBe('Chrome OS')
    })
  })

  describe('device type detection', () => {
    it('detects desktop from Windows UA', () => {
      const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0'
      expect(parseUserAgent(ua).deviceType).toBe('desktop')
    })

    it('detects desktop from macOS UA', () => {
      const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
      expect(parseUserAgent(ua).deviceType).toBe('desktop')
    })

    it('detects mobile from iPhone UA', () => {
      const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'
      expect(parseUserAgent(ua).deviceType).toBe('mobile')
    })

    it('detects mobile from Android Mobile UA', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
      expect(parseUserAgent(ua).deviceType).toBe('mobile')
    })

    it('detects tablet from iPad UA', () => {
      const ua = 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
      expect(parseUserAgent(ua).deviceType).toBe('tablet')
    })

    it('detects tablet from Android Tablet UA (no Mobile)', () => {
      const ua = 'Mozilla/5.0 (Linux; Android 14; SM-X800) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
      expect(parseUserAgent(ua).deviceType).toBe('tablet')
    })

    it('returns unknown for empty UA', () => {
      expect(parseUserAgent('').deviceType).toBe('unknown')
    })
  })

  it('preserves raw user agent', () => {
    const ua = 'Mozilla/5.0 Test Agent'
    expect(parseUserAgent(ua).rawUserAgent).toBe(ua)
  })
})

describe('maskIpAddress', () => {
  it('masks IPv4 last two octets', () => {
    expect(maskIpAddress('192.168.1.42')).toBe('192.168.*.*')
  })

  it('masks IPv4 with different address', () => {
    expect(maskIpAddress('10.0.0.1')).toBe('10.0.*.*')
  })

  it('masks IPv6 after third block', () => {
    expect(maskIpAddress('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe('2001:0db8:85a3:****')
  })

  it('returns empty string for empty input', () => {
    expect(maskIpAddress('')).toBe('')
  })

  it('returns empty string for null-like input', () => {
    expect(maskIpAddress(undefined as unknown as string)).toBe('')
  })

  it('handles localhost IPv4', () => {
    expect(maskIpAddress('127.0.0.1')).toBe('127.0.*.*')
  })
})
