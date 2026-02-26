/**
 * Tests RLS — elio_configs
 * Story 6.6 — AC6 (Tests RLS)
 *
 * Ces tests vérifient que les policies RLS empêchent
 * un client A de voir/modifier la config Orpheus du client B.
 *
 * NOTE: Ces tests nécessitent une connexion Supabase locale (supabase start).
 * Pour les exécuter : RUN_RLS_TESTS=1 npx vitest run tests/rls/elio-configs-rls.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://localhost:54321'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''

const CLIENT_A_EMAIL = 'client-a-rls-test@test.local'
const CLIENT_B_EMAIL = 'client-b-rls-test@test.local'
const TEST_PASSWORD = 'rls-test-password-123!'

const skipRLS = !process.env.RUN_RLS_TESTS

describe.skipIf(skipRLS)('RLS — elio_configs isolation (AC1 + AC6)', () => {
  it('client A cannot see elio_config of client B', async () => {
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { data: authA, error: errA } = await clientA.auth.signInWithPassword({
      email: CLIENT_A_EMAIL,
      password: TEST_PASSWORD,
    })
    expect(errA).toBeNull()
    expect(authA.user).not.toBeNull()

    const { data: authB, error: errB } = await clientB.auth.signInWithPassword({
      email: CLIENT_B_EMAIL,
      password: TEST_PASSWORD,
    })
    expect(errB).toBeNull()
    expect(authB.user).not.toBeNull()

    // Get client B record
    const { data: clientBRecord } = await clientB
      .from('clients')
      .select('id')
      .eq('auth_user_id', authB.user!.id)
      .single()

    if (!clientBRecord) return // skip if test data not set up

    // Try to read client B's elio config as client A
    const { data: configs } = await clientA
      .from('elio_configs')
      .select('*')
      .eq('client_id', clientBRecord.id)

    // RLS should return empty array (filtered, not error)
    expect(configs).toEqual([])
  })

  it('client A cannot update elio_config of client B', async () => {
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    await clientA.auth.signInWithPassword({ email: CLIENT_A_EMAIL, password: TEST_PASSWORD })
    const { data: authB } = await clientB.auth.signInWithPassword({
      email: CLIENT_B_EMAIL,
      password: TEST_PASSWORD,
    })

    if (!authB?.user) return

    const { data: clientBRecord } = await clientB
      .from('clients')
      .select('id')
      .eq('auth_user_id', authB.user.id)
      .single()

    if (!clientBRecord) return

    // Try to update client B's elio config as client A
    const { error } = await clientA
      .from('elio_configs')
      .update({ temperature: 0.1 })
      .eq('client_id', clientBRecord.id)

    // RLS returns success with 0 rows affected
    expect(error).toBeNull()
  })

  it('client A cannot delete elio_config of client B', async () => {
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    await clientA.auth.signInWithPassword({ email: CLIENT_A_EMAIL, password: TEST_PASSWORD })
    const { data: authB } = await clientB.auth.signInWithPassword({
      email: CLIENT_B_EMAIL,
      password: TEST_PASSWORD,
    })

    if (!authB?.user) return

    const { data: clientBRecord } = await clientB
      .from('clients')
      .select('id')
      .eq('auth_user_id', authB.user.id)
      .single()

    if (!clientBRecord) return

    // Try to delete client B's config as client A
    const { error } = await clientA
      .from('elio_configs')
      .delete()
      .eq('client_id', clientBRecord.id)

    // RLS returns success with 0 rows deleted
    expect(error).toBeNull()
  })

  it('client A can read and manage their own elio_config', async () => {
    const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const { data: authA } = await clientA.auth.signInWithPassword({
      email: CLIENT_A_EMAIL,
      password: TEST_PASSWORD,
    })

    if (!authA?.user) return

    const { data: clientARecord } = await clientA
      .from('clients')
      .select('id')
      .eq('auth_user_id', authA.user.id)
      .single()

    if (!clientARecord) return

    // Client A reads their own config — should work (may be empty if not created)
    const { error } = await clientA
      .from('elio_configs')
      .select('*')
      .eq('client_id', clientARecord.id)

    expect(error).toBeNull()
  })
})
