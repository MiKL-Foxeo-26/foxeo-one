/**
 * RLS Isolation Tests: Reminders — Story 2.7
 *
 * Verifie qu'un operateur ne peut acceder qu'a ses propres reminders.
 * L'operateur A ne voit JAMAIS les reminders de l'operateur B.
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

describe.skipIf(!isSupabaseAvailable)('RLS: Reminders Operator Isolation', () => {
  let operatorASupabase: SupabaseClient
  let operatorBSupabase: SupabaseClient

  let reminderAId: string
  let reminderBId: string

  beforeAll(async () => {
    await seedRlsTestData()
    operatorASupabase = await createAuthenticatedClient(TEST_EMAILS.operatorA)
    operatorBSupabase = await createAuthenticatedClient(TEST_EMAILS.operatorB)

    // Create test reminders using service_role
    const { createClient } = await import('@supabase/supabase-js')
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY
    )

    // Reminder for operator A
    const { data: reminderA } = await serviceClient
      .from('reminders')
      .insert({
        operator_id: TEST_IDS.operatorA,
        client_id: TEST_IDS.clientA,
        title: 'Reminder A',
        due_date: new Date(Date.now() + 86400000).toISOString(), // +1 day
        completed: false,
      })
      .select()
      .single()

    // Reminder for operator B
    const { data: reminderB } = await serviceClient
      .from('reminders')
      .insert({
        operator_id: TEST_IDS.operatorB,
        client_id: TEST_IDS.clientB,
        title: 'Reminder B',
        due_date: new Date(Date.now() + 86400000).toISOString(),
        completed: false,
      })
      .select()
      .single()

    reminderAId = reminderA!.id
    reminderBId = reminderB!.id
  }, 30_000)

  afterAll(async () => {
    // Cleanup reminders using service_role
    const { createClient } = await import('@supabase/supabase-js')
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY
    )

    await serviceClient.from('reminders').delete().in('id', [reminderAId, reminderBId])

    await cleanupRlsTestData()
  }, 15_000)

  // --- TABLE: reminders ---

  describe('reminders table', () => {
    it('operator A sees only their own reminders', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .select('*')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].id).toBe(reminderAId)
      expect(data![0].operator_id).toBe(TEST_IDS.operatorA)
    })

    it('operator A cannot see operator B reminders', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .select('*')
        .eq('id', reminderBId)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('operator A can insert their own reminder', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .insert({
          operator_id: TEST_IDS.operatorA,
          client_id: TEST_IDS.clientA,
          title: 'New Reminder A',
          due_date: new Date(Date.now() + 172800000).toISOString(), // +2 days
          completed: false,
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeTruthy()
      expect(data!.title).toBe('New Reminder A')

      // Cleanup
      await operatorASupabase
        .from('reminders')
        .delete()
        .eq('id', data!.id)
    })

    it('operator A cannot insert reminder for operator B', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .insert({
          operator_id: TEST_IDS.operatorB, // Wrong operator_id
          client_id: TEST_IDS.clientB,
          title: 'Hacked Reminder',
          due_date: new Date().toISOString(),
          completed: false,
        })
        .select()

      // RLS should block this
      if (error) {
        expect(error).toBeTruthy()
      } else {
        expect(data).toEqual([])
      }
    })

    it('operator A can update their own reminder', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .update({ title: 'Updated Reminder A' })
        .eq('id', reminderAId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data!.title).toBe('Updated Reminder A')

      // Restore
      await operatorASupabase
        .from('reminders')
        .update({ title: 'Reminder A' })
        .eq('id', reminderAId)
    })

    it('operator A cannot update operator B reminder', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .update({ title: 'Hacked' })
        .eq('id', reminderBId)
        .select()

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('operator A can delete their own reminder', async () => {
      // Create temp reminder
      const { data: tempReminder } = await operatorASupabase
        .from('reminders')
        .insert({
          operator_id: TEST_IDS.operatorA,
          title: 'Temp Reminder',
          due_date: new Date().toISOString(),
        })
        .select()
        .single()

      // Delete it
      const { data, error } = await operatorASupabase
        .from('reminders')
        .delete()
        .eq('id', tempReminder!.id)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
    })

    it('operator A cannot delete operator B reminder', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .delete()
        .eq('id', reminderBId)
        .select()

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('operator A can toggle completed status on their reminder', async () => {
      const { data, error } = await operatorASupabase
        .from('reminders')
        .update({ completed: true })
        .eq('id', reminderAId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data!.completed).toBe(true)

      // Restore
      await operatorASupabase
        .from('reminders')
        .update({ completed: false })
        .eq('id', reminderAId)
    })
  })
})
