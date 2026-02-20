/**
 * RLS Isolation Tests: Document Folders — Story 4.4
 *
 * Verifie qu'un client ne peut acceder qu'a ses propres dossiers.
 * Un client A ne voit JAMAIS les dossiers du client B.
 * L'operateur voit les dossiers de ses clients.
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

// Fixed UUIDs for folder test data
const FOLDER_IDS = {
  folderClientA: 'f0000000-0000-0000-0000-000000000001',
  folderClientB: 'f0000000-0000-0000-0000-000000000002',
} as const

describe.skipIf(!isSupabaseAvailable)('RLS: Document Folders Isolation', () => {
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

    // Seed test folders via service_role
    await serviceClient.from('document_folders').upsert([
      {
        id: FOLDER_IDS.folderClientA,
        client_id: TEST_IDS.clientA,
        operator_id: TEST_IDS.operatorA,
        name: 'Dossier Client A',
      },
      {
        id: FOLDER_IDS.folderClientB,
        client_id: TEST_IDS.clientB,
        operator_id: TEST_IDS.operatorB,
        name: 'Dossier Client B',
      },
    ])
  })

  afterAll(async () => {
    await serviceClient.from('document_folders').delete().in('id', Object.values(FOLDER_IDS))
    await cleanupRlsTestData()
  })

  it('Client A voit son propre dossier', async () => {
    const { data } = await clientASupabase
      .from('document_folders')
      .select('*')
      .eq('id', FOLDER_IDS.folderClientA)

    expect(data).toHaveLength(1)
    expect(data?.[0].name).toBe('Dossier Client A')
  })

  it('Client A ne voit PAS le dossier du Client B', async () => {
    const { data } = await clientASupabase
      .from('document_folders')
      .select('*')
      .eq('id', FOLDER_IDS.folderClientB)

    expect(data).toHaveLength(0)
  })

  it("Operateur A voit les dossiers de ses clients", async () => {
    const { data } = await operatorASupabase
      .from('document_folders')
      .select('*')
      .eq('client_id', TEST_IDS.clientA)

    expect(data).toHaveLength(1)
    expect(data?.[0].name).toBe('Dossier Client A')
  })
})
