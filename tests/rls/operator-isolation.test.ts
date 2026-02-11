/**
 * RLS Isolation Tests: Operator-to-Operator — Story 1.5
 *
 * Verifie qu'un operateur ne peut acceder qu'a ses propres clients.
 * L'operateur A ne voit JAMAIS les clients de l'operateur B.
 *
 * PREREQUIS: Supabase local en cours d'execution (`npx supabase start`)
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { type SupabaseClient } from '@supabase/supabase-js'
import {
  seedRlsTestData,
  cleanupRlsTestData,
  createAuthenticatedClient,
  TEST_IDS,
  TEST_EMAILS,
} from './helpers/seed-rls-test-data'

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isSupabaseAvailable = SUPABASE_ANON_KEY !== '' && SUPABASE_SERVICE_ROLE_KEY !== ''

describe.skipIf(!isSupabaseAvailable)('RLS: Operator-to-Operator Isolation', () => {
  let operatorASupabase: SupabaseClient
  let operatorBSupabase: SupabaseClient

  beforeAll(async () => {
    await seedRlsTestData()
    operatorASupabase = await createAuthenticatedClient(TEST_EMAILS.operatorA)
    operatorBSupabase = await createAuthenticatedClient(TEST_EMAILS.operatorB)
  }, 30_000)

  afterAll(async () => {
    await cleanupRlsTestData()
  }, 15_000)

  // --- TABLE: operators ---

  describe('operators table', () => {
    it('operator A can read their own record', async () => {
      const { data, error } = await operatorASupabase
        .from('operators')
        .select('*')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].id).toBe(TEST_IDS.operatorA)
      expect(data![0].email).toBe(TEST_EMAILS.operatorA)
    })

    it('operator A cannot see operator B record', async () => {
      const { data, error } = await operatorASupabase
        .from('operators')
        .select('*')
        .eq('id', TEST_IDS.operatorB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('operator A can update their own record', async () => {
      const { data, error } = await operatorASupabase
        .from('operators')
        .update({ name: 'RLS Test Operator A Updated' })
        .eq('id', TEST_IDS.operatorA)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].name).toBe('RLS Test Operator A Updated')

      // Restore original name
      await operatorASupabase
        .from('operators')
        .update({ name: 'RLS Test Operator A' })
        .eq('id', TEST_IDS.operatorA)
    })

    it('operator A cannot update operator B record', async () => {
      const { data, error } = await operatorASupabase
        .from('operators')
        .update({ name: 'Hacked' })
        .eq('id', TEST_IDS.operatorB)
        .select()

      // RLS hides operator B — no rows matched
      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  // --- TABLE: clients ---

  describe('clients table', () => {
    it('operator A sees only their own clients', async () => {
      const { data, error } = await operatorASupabase
        .from('clients')
        .select('*')

      expect(error).toBeNull()
      // Operator A should see client A (their client) via clients_select_operator
      const clientIds = data!.map((c: { id: string }) => c.id)
      expect(clientIds).toContain(TEST_IDS.clientA)
      expect(clientIds).not.toContain(TEST_IDS.clientB)
    })

    it('operator A cannot read client B record directly', async () => {
      const { data, error } = await operatorASupabase
        .from('clients')
        .select('*')
        .eq('id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('operator A can update their own client', async () => {
      const { data, error } = await operatorASupabase
        .from('clients')
        .update({ company: 'Updated Corp' })
        .eq('id', TEST_IDS.clientA)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].company).toBe('Updated Corp')

      // Restore
      await operatorASupabase
        .from('clients')
        .update({ company: null })
        .eq('id', TEST_IDS.clientA)
    })

    it('operator A cannot update client B', async () => {
      const { data, error } = await operatorASupabase
        .from('clients')
        .update({ name: 'Hacked' })
        .eq('id', TEST_IDS.clientB)
        .select()

      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  // --- TABLE: client_configs ---

  describe('client_configs table', () => {
    it('operator A sees only configs of their own clients', async () => {
      const { data, error } = await operatorASupabase
        .from('client_configs')
        .select('*')

      expect(error).toBeNull()
      const clientIds = data!.map((c: { client_id: string }) => c.client_id)
      expect(clientIds).toContain(TEST_IDS.clientA)
      expect(clientIds).not.toContain(TEST_IDS.clientB)
    })

    it('operator A cannot read config of client B', async () => {
      const { data, error } = await operatorASupabase
        .from('client_configs')
        .select('*')
        .eq('client_id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  // --- TABLE: consents ---

  describe('consents table', () => {
    it('operator A sees only consents of their own clients', async () => {
      const { data, error } = await operatorASupabase
        .from('consents')
        .select('*')

      expect(error).toBeNull()
      // All returned consents should belong to client A
      for (const consent of data!) {
        expect(consent.client_id).toBe(TEST_IDS.clientA)
      }
    })

    it('operator A cannot read consents of client B', async () => {
      const { data, error } = await operatorASupabase
        .from('consents')
        .select('*')
        .eq('client_id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })
})
