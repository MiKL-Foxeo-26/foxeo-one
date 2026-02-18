/**
 * RLS Isolation Tests: Documents — Story 4.1
 *
 * Verifie qu'un client ne peut acceder qu'a ses propres documents.
 * Un client A ne voit JAMAIS les documents prives du client B.
 * L'operateur voit tous les documents de ses clients.
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

// Fixed UUIDs for document test data
const DOC_IDS = {
  privateDocClientA: 'd0000000-0000-0000-0000-000000000001',
  sharedDocClientA: 'd0000000-0000-0000-0000-000000000002',
  privateDocClientB: 'd0000000-0000-0000-0000-000000000003',
  operatorDocClientA: 'd0000000-0000-0000-0000-000000000004',
} as const

describe.skipIf(!isSupabaseAvailable)('RLS: Document Isolation', () => {
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

    // Seed test documents via service_role
    await serviceClient.from('documents').upsert([
      {
        id: DOC_IDS.privateDocClientA,
        client_id: TEST_IDS.clientA,
        operator_id: TEST_IDS.operatorA,
        name: 'private-doc-A.pdf',
        file_path: `${TEST_IDS.operatorA}/${TEST_IDS.clientA}/private-doc-A.pdf`,
        file_type: 'pdf',
        file_size: 1024,
        visibility: 'private',
        uploaded_by: 'client',
      },
      {
        id: DOC_IDS.sharedDocClientA,
        client_id: TEST_IDS.clientA,
        operator_id: TEST_IDS.operatorA,
        name: 'shared-doc-A.pdf',
        file_path: `${TEST_IDS.operatorA}/${TEST_IDS.clientA}/shared-doc-A.pdf`,
        file_type: 'pdf',
        file_size: 2048,
        visibility: 'shared',
        uploaded_by: 'operator',
      },
      {
        id: DOC_IDS.privateDocClientB,
        client_id: TEST_IDS.clientB,
        operator_id: TEST_IDS.operatorB,
        name: 'private-doc-B.pdf',
        file_path: `${TEST_IDS.operatorB}/${TEST_IDS.clientB}/private-doc-B.pdf`,
        file_type: 'pdf',
        file_size: 512,
        visibility: 'private',
        uploaded_by: 'client',
      },
      {
        id: DOC_IDS.operatorDocClientA,
        client_id: TEST_IDS.clientA,
        operator_id: TEST_IDS.operatorA,
        name: 'operator-private-A.pdf',
        file_path: `${TEST_IDS.operatorA}/${TEST_IDS.clientA}/operator-private-A.pdf`,
        file_type: 'pdf',
        file_size: 4096,
        visibility: 'private',
        uploaded_by: 'operator',
      },
    ])
  })

  afterAll(async () => {
    // Cleanup documents
    await serviceClient.from('documents').delete().in('id', Object.values(DOC_IDS))
    await cleanupRlsTestData()
  })

  // ============================================================
  // Client A — sees own docs (private client uploads + shared)
  // ============================================================

  it('Client A sees own private document (uploaded by client)', async () => {
    const { data } = await clientASupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.privateDocClientA)

    expect(data).toHaveLength(1)
    expect(data?.[0].name).toBe('private-doc-A.pdf')
  })

  it('Client A sees shared documents', async () => {
    const { data } = await clientASupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.sharedDocClientA)

    expect(data).toHaveLength(1)
    expect(data?.[0].name).toBe('shared-doc-A.pdf')
  })

  it('Client A does NOT see operator private documents', async () => {
    const { data } = await clientASupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.operatorDocClientA)

    expect(data).toHaveLength(0)
  })

  // ============================================================
  // Client B — isolation from Client A
  // ============================================================

  it('Client B does NOT see Client A private documents', async () => {
    const { data } = await clientBSupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.privateDocClientA)

    expect(data).toHaveLength(0)
  })

  it('Client B does NOT see Client A shared documents', async () => {
    const { data } = await clientBSupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.sharedDocClientA)

    expect(data).toHaveLength(0)
  })

  it('Client B sees own private document', async () => {
    const { data } = await clientBSupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.privateDocClientB)

    expect(data).toHaveLength(1)
    expect(data?.[0].name).toBe('private-doc-B.pdf')
  })

  // ============================================================
  // Operator A — sees all docs of their clients
  // ============================================================

  it('Operator A sees all documents of Client A (private + shared + operator)', async () => {
    const { data } = await operatorASupabase
      .from('documents')
      .select('*')
      .eq('client_id', TEST_IDS.clientA)

    expect(data).toHaveLength(3)
    const names = data?.map((d: { name: string }) => d.name).sort()
    expect(names).toEqual(['operator-private-A.pdf', 'private-doc-A.pdf', 'shared-doc-A.pdf'])
  })

  it('Operator A does NOT see Client B documents (different operator)', async () => {
    const { data } = await operatorASupabase
      .from('documents')
      .select('*')
      .eq('id', DOC_IDS.privateDocClientB)

    expect(data).toHaveLength(0)
  })
})
