-- Migration: add archiving fields for Story 9.5c (RGPD anonymisation)
-- Adds retention_until, previous_status columns and 'deleted' status enum value

-- Add columns to clients table
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS retention_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS previous_status TEXT;

-- Add 'archived' and 'deleted' enum values (archived may already exist)
ALTER TYPE client_status ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE client_status ADD VALUE IF NOT EXISTS 'deleted';

-- Index for cleanup cron: efficiently find clients whose retention has expired
CREATE INDEX IF NOT EXISTS idx_clients_retention_until
  ON clients(retention_until)
  WHERE status = 'archived';

-- Comment on columns
COMMENT ON COLUMN clients.retention_until IS 'RGPD: date after which client data will be anonymized (set when status→archived)';
COMMENT ON COLUMN clients.previous_status IS 'Status before archiving, used to restore on reactivation';
