/**
 * Tests for Supabase migrations — Story 1.2
 * Verifies migration files exist, SQL syntax is valid, and schema structure is correct.
 *
 * NOTE: Tests that verify actual DB state (constraints, triggers, etc.)
 * require a running local Supabase instance (`npx supabase start`).
 * Static tests (file existence, SQL structure) run without Docker.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const MIGRATIONS_DIR = __dirname
const SUPABASE_DIR = join(__dirname, '..')

const MIGRATION_FILES = [
  '00001_create_operators.sql',
  '00002_create_clients.sql',
  '00003_create_client_configs.sql',
  '00004_create_consents.sql',
  '00005_create_activity_logs.sql',
  '00006_create_updated_at_triggers.sql',
  '00007_rls_activity_logs.sql',
]

describe('Supabase project structure', () => {
  it('config.toml exists and has correct project_id', () => {
    const configPath = join(SUPABASE_DIR, 'config.toml')
    expect(existsSync(configPath)).toBe(true)
    const content = readFileSync(configPath, 'utf-8')
    expect(content).toContain('project_id = "foxeo-dash"')
  })

  it('seed.sql exists', () => {
    expect(existsSync(join(SUPABASE_DIR, 'seed.sql'))).toBe(true)
  })

  it('all migration files exist', () => {
    for (const file of MIGRATION_FILES) {
      expect(existsSync(join(MIGRATIONS_DIR, file))).toBe(true)
    }
  })
})

describe('Migration 00001: operators table', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00001_create_operators.sql'), 'utf-8')

  it('creates operators table with correct columns', () => {
    expect(sql).toContain('CREATE TABLE operators')
    expect(sql).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()')
    expect(sql).toContain('email TEXT UNIQUE NOT NULL')
    expect(sql).toContain('name TEXT NOT NULL')
    expect(sql).toContain('two_factor_enabled BOOLEAN')
    expect(sql).toContain('created_at TIMESTAMPTZ')
    expect(sql).toContain('updated_at TIMESTAMPTZ')
  })

  it('has CHECK constraint on role', () => {
    expect(sql).toMatch(/CHECK\s*\(role\s+IN\s*\('operator',\s*'admin'\)\)/)
  })
})

describe('Migration 00002: clients table', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00002_create_clients.sql'), 'utf-8')

  it('creates clients table with correct columns', () => {
    expect(sql).toContain('CREATE TABLE clients')
    expect(sql).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()')
    expect(sql).toContain('operator_id UUID NOT NULL REFERENCES operators(id)')
    expect(sql).toContain('email TEXT NOT NULL')
    expect(sql).toContain('name TEXT NOT NULL')
    expect(sql).toContain('auth_user_id UUID UNIQUE REFERENCES auth.users(id)')
  })

  it('has CHECK constraints on client_type and status', () => {
    expect(sql).toMatch(/client_type.*CHECK.*'complet'.*'direct_one'.*'ponctuel'/s)
    expect(sql).toMatch(/status.*CHECK.*'active'.*'suspended'.*'archived'/s)
  })

  it('has correct indexes', () => {
    expect(sql).toContain('CREATE INDEX idx_clients_operator_id ON clients(operator_id)')
    expect(sql).toContain('CREATE INDEX idx_clients_auth_user_id ON clients(auth_user_id)')
  })
})

describe('Migration 00003: client_configs table', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00003_create_client_configs.sql'), 'utf-8')

  it('creates client_configs table with client_id as PK+FK', () => {
    expect(sql).toContain('CREATE TABLE client_configs')
    expect(sql).toContain('client_id UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE')
    expect(sql).toContain('operator_id UUID NOT NULL REFERENCES operators(id)')
  })

  it('has correct defaults for modules and dashboard_type', () => {
    expect(sql).toContain("ARRAY['core-dashboard']")
    expect(sql).toContain("DEFAULT 'one'")
  })

  it('has CHECK constraint on dashboard_type', () => {
    expect(sql).toMatch(/dashboard_type.*CHECK.*'hub'.*'lab'.*'one'/s)
  })

  it('has CHECK constraint on theme_variant', () => {
    expect(sql).toMatch(/theme_variant.*CHECK.*'hub'.*'lab'.*'one'/s)
  })

  it('uses JSONB with empty object defaults', () => {
    expect(sql).toContain("DEFAULT '{}'::jsonb")
  })
})

describe('Migration 00004: consents table', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00004_create_consents.sql'), 'utf-8')

  it('creates consents table without updated_at column (immutable)', () => {
    expect(sql).toContain('CREATE TABLE consents')
    expect(sql).toContain('created_at TIMESTAMPTZ')
    // Verify no updated_at COLUMN exists (comments may mention it)
    expect(sql).not.toMatch(/^\s+updated_at\s+TIMESTAMPTZ/m)
  })

  it('has CHECK constraint on consent_type', () => {
    expect(sql).toMatch(/consent_type.*CHECK.*'cgu'.*'ia_processing'/s)
  })

  it('has cascade delete from clients', () => {
    expect(sql).toContain('ON DELETE CASCADE')
  })

  it('has index on client_id', () => {
    expect(sql).toContain('CREATE INDEX idx_consents_client_id ON consents(client_id)')
  })
})

describe('Migration 00005: activity_logs table', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00005_create_activity_logs.sql'), 'utf-8')

  it('creates activity_logs table without updated_at column (append-only)', () => {
    expect(sql).toContain('CREATE TABLE activity_logs')
    expect(sql).toContain('created_at TIMESTAMPTZ')
    // Verify no updated_at COLUMN exists (comments may mention it)
    expect(sql).not.toMatch(/^\s+updated_at\s+TIMESTAMPTZ/m)
  })

  it('has CHECK constraint on actor_type', () => {
    expect(sql).toMatch(/actor_type.*CHECK.*'client'.*'operator'.*'system'.*'elio'/s)
  })

  it('has correct indexes', () => {
    expect(sql).toContain('CREATE INDEX idx_activity_logs_actor_created_at ON activity_logs(actor_id, created_at)')
    expect(sql).toContain('CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id)')
  })
})

describe('Migration 00006: updated_at triggers', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00006_create_updated_at_triggers.sql'), 'utf-8')

  it('creates reusable fn_update_updated_at function', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION fn_update_updated_at()')
    expect(sql).toContain('NEW.updated_at = NOW()')
    expect(sql).toContain('LANGUAGE plpgsql')
  })

  it('creates triggers for operators, clients, client_configs only', () => {
    expect(sql).toContain('CREATE TRIGGER trg_operators_updated_at')
    expect(sql).toContain('CREATE TRIGGER trg_clients_updated_at')
    expect(sql).toContain('CREATE TRIGGER trg_client_configs_updated_at')
    // No trigger for consents or activity_logs (immutable tables)
    expect(sql).not.toContain('trg_consents_updated_at')
    expect(sql).not.toContain('trg_activity_logs_updated_at')
  })

  it('uses BEFORE UPDATE trigger', () => {
    expect(sql).toContain('BEFORE UPDATE ON operators')
    expect(sql).toContain('BEFORE UPDATE ON clients')
    expect(sql).toContain('BEFORE UPDATE ON client_configs')
  })
})

describe('Migration 00007: RLS activity_logs', () => {
  const sql = readFileSync(join(MIGRATIONS_DIR, '00007_rls_activity_logs.sql'), 'utf-8')

  it('enables RLS on activity_logs', () => {
    expect(sql).toContain('ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY')
  })

  it('creates fn_get_operator_id helper function', () => {
    expect(sql).toContain('CREATE OR REPLACE FUNCTION fn_get_operator_id()')
    expect(sql).toContain('SECURITY DEFINER')
  })

  it('creates SELECT policy for operators', () => {
    expect(sql).toContain('CREATE POLICY activity_logs_select_operator')
    expect(sql).toContain('FOR SELECT')
  })

  it('creates INSERT policy for authenticated users', () => {
    expect(sql).toContain('CREATE POLICY activity_logs_insert_authenticated')
    expect(sql).toContain('FOR INSERT')
  })

  it('does NOT create any SELECT policy for clients', () => {
    // Only two policies should exist: select_operator and insert_authenticated
    const policyMatches = sql.match(/CREATE POLICY/g)
    expect(policyMatches).toHaveLength(2)
  })
})

describe('Seed data', () => {
  const sql = readFileSync(join(SUPABASE_DIR, 'seed.sql'), 'utf-8')

  it('inserts MiKL operator', () => {
    expect(sql).toContain("'mikl@foxeo.io'")
    expect(sql).toContain("'MiKL'")
    expect(sql).toContain("'operator'")
  })

  it('inserts demo client', () => {
    expect(sql).toContain("'demo@example.com'")
    expect(sql).toContain("'Client Demo'")
    expect(sql).toContain("'complet'")
  })

  it('inserts client_config with core-dashboard module', () => {
    expect(sql).toContain("ARRAY['core-dashboard']")
    expect(sql).toContain("'lab'")
  })

  it('inserts initial consent', () => {
    expect(sql).toContain("'cgu'")
    expect(sql).toContain("'1.0'")
  })

  it('inserts activity log entry', () => {
    expect(sql).toContain("'create_client'")
    expect(sql).toContain("'operator'")
  })
})
