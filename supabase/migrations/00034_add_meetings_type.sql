-- Migration: Add type and metadata columns to meetings table
-- Story: 5.4 — Flux post-visio — Onboarding prospect
-- Note: 00031 is taken by create_meetings; using 00034

-- 1. Add type column to meetings
ALTER TABLE meetings
  ADD COLUMN type TEXT NOT NULL DEFAULT 'standard'
    CHECK (type IN ('standard', 'prospect', 'onboarding', 'support')),
  ADD COLUMN metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

-- Index for filtering by type
CREATE INDEX idx_meetings_type ON meetings(type);

-- 2. Add 'prospect' to clients.status constraint
-- Drop the existing inline check constraint (auto-named by Postgres)
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_status_check;
ALTER TABLE clients ADD CONSTRAINT clients_status_check
  CHECK (status IN ('active', 'suspended', 'archived', 'prospect'));
