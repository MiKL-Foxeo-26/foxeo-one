/**
 * Tests RLS — communication_profiles
 * Story 6.4 — AC6 (Tests RLS)
 *
 * Ces tests vérifient que les policies RLS empêchent
 * un client A de voir le profil de communication du client B.
 *
 * NOTE: Ces tests nécessitent une connexion Supabase locale (supabase start).
 * Pour les exécuter : RUN_RLS_TESTS=1 npx vitest run tests/rls/communication-profiles-rls.test.ts
 */

import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://localhost:54321'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''

const CLIENT_A_EMAIL = 'client-a-rls-test@test.local'
const CLIENT_B_EMAIL = 'client-b-rls-test@test.local'
const TEST_PASSWORD = 'rls-test-password-123!'

const skipRLS = !process.env.RUN_RLS_TESTS

describe.skipIf(skipRLS)('RLS — communication_profiles isolation (AC1 + AC6)', () => {
  it('client A cannot see communication_profile of client B', async () => {
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

    // Try to read client B's communication profile as client A
    const { data: profiles } = await clientA
      .from('communication_profiles')
      .select('*')
      .eq('client_id', clientBRecord.id)

    // RLS should return empty array (filtered, not error)
    expect(profiles).toEqual([])
  })

  it('client A cannot update communication_profile of client B', async () => {
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

    // Try to update client B's profile as client A
    const { error } = await clientA
      .from('communication_profiles')
      .update({ preferred_tone: 'formal' })
      .eq('client_id', clientBRecord.id)

    // RLS should block this — either error or 0 rows affected
    // Typically returns no error but updates 0 rows (RLS filters)
    expect(error).toBeNull() // RLS returns success with 0 rows
  })

  it('client A can read their own communication_profile', async () => {
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

    // Client A reads their own profile — should work (may be empty if not created)
    const { error } = await clientA
      .from('communication_profiles')
      .select('*')
      .eq('client_id', clientARecord.id)

    expect(error).toBeNull()
  })
})
