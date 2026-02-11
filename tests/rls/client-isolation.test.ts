/**
 * RLS Isolation Tests: Client-to-Client — Story 1.5
 *
 * Verifie qu'un client ne peut acceder qu'a ses propres donnees.
 * Un client A ne voit JAMAIS les donnees du client B.
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

describe.skipIf(!isSupabaseAvailable)('RLS: Client-to-Client Isolation', () => {
  let clientASupabase: SupabaseClient
  let clientBSupabase: SupabaseClient
  let serviceClient: SupabaseClient

  beforeAll(async () => {
    await seedRlsTestData()
    clientASupabase = await createAuthenticatedClient(TEST_EMAILS.clientA)
    clientBSupabase = await createAuthenticatedClient(TEST_EMAILS.clientB)
    serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }, 30_000)

  afterAll(async () => {
    await cleanupRlsTestData()
  }, 15_000)

  // --- TABLE: clients ---

  describe('clients table', () => {
    it('client A can read their own record', async () => {
      const { data, error } = await clientASupabase
        .from('clients')
        .select('*')
        .eq('id', TEST_IDS.clientA)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].email).toBe(TEST_EMAILS.clientA)
    })

    it('client A gets empty result when querying client B record', async () => {
      const { data, error } = await clientASupabase
        .from('clients')
        .select('*')
        .eq('id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A sees only 1 record when querying all clients', async () => {
      const { data, error } = await clientASupabase
        .from('clients')
        .select('*')

      expect(error).toBeNull()
      // Client A should only see their own row
      expect(data!.length).toBe(1)
      expect(data![0].id).toBe(TEST_IDS.clientA)
    })

    it('client A cannot insert into clients table', async () => {
      const { data, error } = await clientASupabase
        .from('clients')
        .insert({
          operator_id: TEST_IDS.operatorA,
          email: 'hacker@test.com',
          name: 'Hacker',
          client_type: 'complet',
          status: 'active',
        })

      // RLS should prevent insert (is_admin() returns false for clients)
      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    it('client A cannot update client B record', async () => {
      const { data, error } = await clientASupabase
        .from('clients')
        .update({ name: 'Hacked' })
        .eq('id', TEST_IDS.clientB)
        .select()

      // No matching rows (RLS hides client B from client A)
      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  // --- TABLE: client_configs ---

  describe('client_configs table', () => {
    it('client A can read their own config', async () => {
      const { data, error } = await clientASupabase
        .from('client_configs')
        .select('*')
        .eq('client_id', TEST_IDS.clientA)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].dashboard_type).toBe('lab')
    })

    it('client A gets empty result when querying client B config', async () => {
      const { data, error } = await clientASupabase
        .from('client_configs')
        .select('*')
        .eq('client_id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A sees only 1 config when querying all configs', async () => {
      const { data, error } = await clientASupabase
        .from('client_configs')
        .select('*')

      expect(error).toBeNull()
      expect(data!.length).toBe(1)
      expect(data![0].client_id).toBe(TEST_IDS.clientA)
    })
  })

  // --- TABLE: consents ---

  describe('consents table', () => {
    it('client A can read their own consents', async () => {
      const { data, error } = await clientASupabase
        .from('consents')
        .select('*')

      expect(error).toBeNull()
      expect(data!.length).toBeGreaterThanOrEqual(1)
      // All returned consents should belong to client A
      for (const consent of data!) {
        expect(consent.client_id).toBe(TEST_IDS.clientA)
      }
    })

    it('client A gets empty result when filtering for client B consents', async () => {
      const { data, error } = await clientASupabase
        .from('consents')
        .select('*')
        .eq('client_id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A cannot insert a consent for client B', async () => {
      const { error } = await clientASupabase
        .from('consents')
        .insert({
          client_id: TEST_IDS.clientB,
          consent_type: 'cgu',
          accepted: true,
          version: '2.0',
        })

      // is_owner(client_id) returns false for client B
      expect(error).not.toBeNull()
    })
  })

  // --- SERVICE ROLE BYPASS ---

  describe('service_role bypasses RLS', () => {
    it('service_role can read all clients', async () => {
      const { data, error } = await serviceClient
        .from('clients')
        .select('*')
        .in('id', [TEST_IDS.clientA, TEST_IDS.clientB])

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })

    it('service_role can read all client_configs', async () => {
      const { data, error } = await serviceClient
        .from('client_configs')
        .select('*')
        .in('client_id', [TEST_IDS.clientA, TEST_IDS.clientB])

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })

    it('service_role can read all consents', async () => {
      const { data, error } = await serviceClient
        .from('consents')
        .select('*')
        .in('client_id', [TEST_IDS.clientA, TEST_IDS.clientB])

      expect(error).toBeNull()
      expect(data!.length).toBeGreaterThanOrEqual(2)
    })
  })
})
