/**
 * Presence types for Supabase Realtime Presence API.
 * AC1: Data tracked per user in the presence channel.
 */
export interface PresenceEntry {
  user_id: string
  user_type: 'client' | 'operator'
  online_at: string
}

/**
 * Supabase presenceState() returns a map of key → PresenceEntry[].
 * Key is the `config.presence.key` used when creating the channel (= userId).
 */
export type PresenceStateMap = Record<string, PresenceEntry[]>
