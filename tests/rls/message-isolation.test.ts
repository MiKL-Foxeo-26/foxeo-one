/**
 * RLS Isolation Tests: Messages — Story 3.1
 *
 * Verifie qu'un client ne peut acceder qu'a ses propres messages.
 * Un client A ne voit JAMAIS les messages du client B.
 * L'operateur voit les messages de ses propres clients.
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

// Fixed UUIDs for message test data
const MESSAGE_IDS = {
  messageForClientA: 'a0000000-0000-0000-0000-000000000001',
  messageForClientB: 'b0000000-0000-0000-0000-000000000001',
} as const

describe.skipIf(!isSupabaseAvailable)('RLS: Message Isolation', () => {
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

    // Seed test messages via service_role
    await serviceClient.from('messages').upsert([
      {
        id: MESSAGE_IDS.messageForClientA,
        client_id: TEST_IDS.clientA,
        operator_id: TEST_IDS.operatorA,
        sender_type: 'operator',
        content: 'Message from operator to client A',
      },
      {
        id: MESSAGE_IDS.messageForClientB,
        client_id: TEST_IDS.clientB,
        operator_id: TEST_IDS.operatorB,
        sender_type: 'operator',
        content: 'Message from operator to client B',
      },
    ], { onConflict: 'id' })
  }, 30_000)

  afterAll(async () => {
    // Cleanup messages
    await serviceClient
      .from('messages')
      .delete()
      .in('id', [MESSAGE_IDS.messageForClientA, MESSAGE_IDS.messageForClientB])
    await cleanupRlsTestData()
  }, 15_000)

  // --- ISOLATION CLIENT-to-CLIENT ---

  describe('client isolation on messages table', () => {
    it('client A can read their own messages', async () => {
      const { data, error } = await clientASupabase
        .from('messages')
        .select('*')
        .eq('client_id', TEST_IDS.clientA)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].id).toBe(MESSAGE_IDS.messageForClientA)
    })

    it('client A gets empty result when querying client B messages', async () => {
      const { data, error } = await clientASupabase
        .from('messages')
        .select('*')
        .eq('client_id', TEST_IDS.clientB)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('client A sees only their own messages when querying all messages', async () => {
      const { data, error } = await clientASupabase
        .from('messages')
        .select('*')

      expect(error).toBeNull()
      expect(data!.length).toBe(1)
      expect(data![0].client_id).toBe(TEST_IDS.clientA)
    })

    it('client B sees only their own messages', async () => {
      const { data, error } = await clientBSupabase
        .from('messages')
        .select('*')

      expect(error).toBeNull()
      expect(data!.length).toBe(1)
      expect(data![0].client_id).toBe(TEST_IDS.clientB)
    })
  })

  // --- OPERATEUR ACCESS ---

  describe('operator access on messages table', () => {
    it('operator A can read messages of their own client', async () => {
      const { data, error } = await operatorASupabase
        .from('messages')
        .select('*')
        .eq('client_id', TEST_IDS.clientA)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].client_id).toBe(TEST_IDS.clientA)
    })

    it('operator A can insert a message for their client', async () => {
      const { data, error } = await operatorASupabase
        .from('messages')
        .insert({
          client_id: TEST_IDS.clientA,
          operator_id: TEST_IDS.operatorA,
          sender_type: 'operator',
          content: 'Test message from operator A',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data!.sender_type).toBe('operator')

      // Cleanup
      if (data) {
        await serviceClient.from('messages').delete().eq('id', data.id)
      }
    })
  })

  // --- INSERT RESTRICTION ---

  describe('insert restrictions on messages table', () => {
    it('client A can insert a message for themselves', async () => {
      const { data, error } = await clientASupabase
        .from('messages')
        .insert({
          client_id: TEST_IDS.clientA,
          operator_id: TEST_IDS.operatorA,
          sender_type: 'client',
          content: 'Test message from client A',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).not.toBeNull()

      // Cleanup
      if (data) {
        await serviceClient.from('messages').delete().eq('id', data.id)
      }
    })

    it('unauthenticated user cannot read messages', async () => {
      const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const { data, error } = await anonClient
        .from('messages')
        .select('*')

      // Should return empty or error (RLS blocks anon)
      if (error) {
        expect(error).not.toBeNull()
      } else {
        expect(data).toEqual([])
      }
    })
  })

  // --- SERVICE ROLE BYPASS ---

  describe('service_role bypasses RLS on messages', () => {
    it('service_role can read all messages', async () => {
      const { data, error } = await serviceClient
        .from('messages')
        .select('*')
        .in('id', [MESSAGE_IDS.messageForClientA, MESSAGE_IDS.messageForClientB])

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })
  })
})
