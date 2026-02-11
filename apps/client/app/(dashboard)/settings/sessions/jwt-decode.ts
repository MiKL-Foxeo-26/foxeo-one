/**
 * Minimal JWT decode helper — extracts payload without verification.
 * Used only to read the session_id claim from the Supabase access token.
 * No external dependencies.
 */
export function jwtDecode(token: string): { session_id?: string; sub?: string; [key: string]: unknown } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    // Base64url → Base64 → decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(json)
  } catch {
    return null
  }
}
