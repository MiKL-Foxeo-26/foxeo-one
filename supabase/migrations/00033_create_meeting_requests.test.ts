import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

const MIGRATIONS_DIR = __dirname
const sql = readFileSync(join(MIGRATIONS_DIR, '00033_create_meeting_requests.sql'), 'utf-8')

describe('Migration 00033: meeting_requests table', () => {
  it('creates meeting_requests table with correct columns', () => {
    expect(sql).toContain('CREATE TABLE meeting_requests')
    expect(sql).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()')
    expect(sql).toContain('client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE')
    expect(sql).toContain('operator_id UUID NOT NULL REFERENCES operators(id)')
    expect(sql).toContain('requested_slots JSONB NOT NULL')
    expect(sql).toContain('selected_slot TIMESTAMPTZ')
    expect(sql).toContain('message TEXT')
    expect(sql).toContain('meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL')
    expect(sql).toContain('created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()')
    expect(sql).toContain('updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()')
  })

  it('has CHECK constraint on status with correct values', () => {
    expect(sql).toMatch(/status\s+TEXT\s+NOT\s+NULL\s+DEFAULT\s+'pending'/)
    expect(sql).toMatch(/CHECK\s*\(status\s+IN\s*\('pending',\s*'accepted',\s*'rejected',\s*'completed'\)\)/)
  })

  it('creates correct indexes', () => {
    expect(sql).toContain('CREATE INDEX idx_meeting_requests_client_id ON meeting_requests(client_id)')
    expect(sql).toContain('CREATE INDEX idx_meeting_requests_operator_id_status ON meeting_requests(operator_id, status)')
  })

  it('creates updated_at trigger', () => {
    expect(sql).toContain('CREATE TRIGGER trg_meeting_requests_updated_at')
    expect(sql).toContain('BEFORE UPDATE ON meeting_requests')
    expect(sql).toContain('EXECUTE FUNCTION fn_update_updated_at()')
  })

  it('enables RLS on meeting_requests', () => {
    expect(sql).toContain('ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY')
  })

  it('creates meeting_requests_select_owner policy', () => {
    expect(sql).toContain('CREATE POLICY meeting_requests_select_owner ON meeting_requests')
    expect(sql).toContain('FOR SELECT')
  })

  it('creates meeting_requests_select_operator policy', () => {
    expect(sql).toContain('CREATE POLICY meeting_requests_select_operator ON meeting_requests')
    expect(sql).toContain('FOR SELECT')
  })

  it('creates meeting_requests_insert_client policy', () => {
    expect(sql).toContain('CREATE POLICY meeting_requests_insert_client ON meeting_requests')
    expect(sql).toContain('FOR INSERT')
  })

  it('creates meeting_requests_update_operator policy', () => {
    expect(sql).toContain('CREATE POLICY meeting_requests_update_operator ON meeting_requests')
    expect(sql).toContain('FOR UPDATE')
  })

  it('has exactly 4 RLS policies', () => {
    const policyMatches = sql.match(/CREATE POLICY meeting_requests_/g)
    expect(policyMatches).toHaveLength(4)
  })
})
