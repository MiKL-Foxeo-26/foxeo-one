/**
 * RLS Isolation Tests: Notification Preferences — Story 3.4
 *
 * Verifie qu'un client ne peut gerer que ses propres preferences.
 * Un client A ne voit JAMAIS les preferences du client B.
 * L'operateur peut lire et mettre a jour les preferences de ses clients (override).
 *
 * PREREQUIS: Supabase local en cours d'execution (`npx supabase start`)
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  seedRlsTestData,
  cleanupRlsTestData,
  createAuthenticatedClient,
  TEST_IDS,
  TEST_EMAILS,
} from './helpers/seed-rls-test-data'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isSupabaseAvailable = SUPABASE_ANON_KEY !== '' && SUPABASE_SERVICE_ROLE_KEY !== ''

describe.skipIf(!isSupabaseAvailable)('RLS: Notification Preferences Isolation', () => {
  let clientASupabase: SupabaseClient
  let clientBSupabase: SupabaseClient
  let operatorASupabase: SupabaseClient
  let serviceClient: SupabaseClient

  beforeAll(async () => {
    await seedRlsTestData()
    clientASupabase = await createAuthenticatedClient(TEST_EMAILS.clientA)
    clientBSupabase = await createAuthenticatedClient(TEST_EMAILS.clientB)
    operatorASupabase = await createAuthenticatedClient(TEST_EMAILS.operatorA)
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Seed test preferences via service_role
    await serviceClient.from('notification_preferences').upsert(
      [
        {
          user_type: 'client',
          user_id: TEST_IDS.clientA,
          notification_type: 'message',
          channel_email: true,
          channel_inapp: true,
          operator_override: false,
        },
        {
          user_type: 'client',
          user_id: TEST_IDS.clientB,
          notification_type: 'message',
          channel_email: false,
          channel_inapp: true,
          operator_override: false,
        },
      ],
      { onConflict: 'user_type,user_id,notification_type' }
    )
  }, 30_000)

  afterAll(async () => {
    await serviceClient
      .from('notification_preferences')
      .delete()
      .in('user_id', [TEST_IDS.clientA, TEST_IDS.clientB])
    await cleanupRlsTestData()
  }, 15_000)

  // --- ISOLATION CLIENT-to-CLIENT ---

  describe('client isolation on notification_preferences table', () => {
    it('client A can read their own preferences', async () => {
      const { data, error } = await clientASupabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', TEST_IDS.clientA)
        .eq('user_type', 'client')

      expect(error).toBeNull()
      expect(data!.length).toBeGreaterThan(0)
      expect(data![0].user_id).toBe(TEST_IDS.clientA)
    })

    it('client A gets empty result when querying client B preferences', async () => {
      const { data, error } = await clientASupabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', TEST_IDS.clientB)
        .eq('user_type', 'client')

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A sees only their own preferences when querying all', async () => {
      const { data, error } = await clientASupabase
        .from('notification_preferences')
        .select('*')

      expect(error).toBeNull()
      data!.forEach((pref) => {
        expect(pref.user_id).toBe(TEST_IDS.clientA)
      })
    })

    it('client A can update their own preference', async () => {
      const { error } = await clientASupabase
        .from('notification_preferences')
        .update({ channel_email: false })
        .eq('user_id', TEST_IDS.clientA)
        .eq('user_type', 'client')
        .eq('notification_type', 'message')

      expect(error).toBeNull()
    })

    it('client A cannot update client B preference', async () => {
      const { error, data } = await clientASupabase
        .from('notification_preferences')
        .update({ channel_email: false })
        .eq('user_id', TEST_IDS.clientB)
        .eq('user_type', 'client')
        .eq('notification_type', 'message')
        .select()

      // RLS silently returns empty result (no rows updated)
      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A can insert their own preferences', async () => {
      const { data, error } = await clientASupabase
        .from('notification_preferences')
        .upsert({
          user_type: 'client',
          user_id: TEST_IDS.clientA,
          notification_type: 'validation',
          channel_email: true,
          channel_inapp: true,
          operator_override: false,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data!.user_id).toBe(TEST_IDS.clientA)
    })

    it('client A cannot insert preferences for client B', async () => {
      const { error } = await clientASupabase
        .from('notification_preferences')
        .insert({
          user_type: 'client',
          user_id: TEST_IDS.clientB,
          notification_type: 'validation',
          channel_email: true,
          channel_inapp: true,
          operator_override: false,
        })

      // RLS violation
      expect(error).not.toBeNull()
    })
  })

  // --- OPERATEUR ACCESS ---

  describe('operator access on notification_preferences table', () => {
    it('operator A can read their client preferences', async () => {
      const { data, error } = await operatorASupabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', TEST_IDS.clientA)
        .eq('user_type', 'client')

      expect(error).toBeNull()
      expect(data!.length).toBeGreaterThan(0)
    })

    it('operator A can set operator_override on their client preference', async () => {
      const { error } = await operatorASupabase
        .from('notification_preferences')
        .update({ operator_override: true })
        .eq('user_id', TEST_IDS.clientA)
        .eq('user_type', 'client')
        .eq('notification_type', 'message')

      expect(error).toBeNull()
    })
  })

  // --- ANONYMOUS ---

  describe('unauthenticated access is blocked', () => {
    it('anonymous user cannot read notification_preferences', async () => {
      const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const { data, error } = await anonClient
        .from('notification_preferences')
        .select('*')

      if (error) {
        expect(error).not.toBeNull()
      } else {
        expect(data).toEqual([])
      }
    })
  })

  // --- SERVICE ROLE BYPASS ---

  describe('service_role bypasses RLS', () => {
    it('service_role can read all preferences', async () => {
      const { data, error } = await serviceClient
        .from('notification_preferences')
        .select('*')
        .in('user_id', [TEST_IDS.clientA, TEST_IDS.clientB])

      expect(error).toBeNull()
      expect(data!.length).toBeGreaterThan(0)
    })
  })
})
