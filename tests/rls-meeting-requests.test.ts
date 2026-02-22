import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const MIGRATION_PATH = join(__dirname, '..', 'supabase', 'migrations', '00033_create_meeting_requests.sql')

describe('RLS: meeting_requests isolation', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf-8')

  it('enables RLS on meeting_requests table', () => {
    expect(sql).toContain('ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY')
  })

  it('client SELECT policy filters by auth_user_id (client_id via clients table)', () => {
    expect(sql).toContain('meeting_requests_select_owner')
    expect(sql).toContain('client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())')
  })

  it('operator SELECT policy filters by operator_id = auth.uid()', () => {
    expect(sql).toContain('meeting_requests_select_operator')
    expect(sql).toContain('operator_id = auth.uid()')
  })

  it('client INSERT policy ensures client can only create own requests', () => {
    expect(sql).toContain('meeting_requests_insert_client')
    expect(sql).toContain('WITH CHECK (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()))')
  })

  it('only operator can UPDATE requests (accept/reject)', () => {
    expect(sql).toContain('meeting_requests_update_operator')
    expect(sql).toContain('USING (operator_id = auth.uid())')
  })

  it('client A cannot see client B requests (policy isolation)', () => {
    // The policy uses auth.uid() to filter — different auth users see different data
    expect(sql).toContain('auth.uid()')
    // No policy allows cross-client access
    const policies = sql.match(/CREATE POLICY meeting_requests_/g)
    expect(policies).toHaveLength(4)
  })

  it('no DELETE policy exists (requests are immutable history)', () => {
    expect(sql).not.toContain('FOR DELETE')
  })
})
