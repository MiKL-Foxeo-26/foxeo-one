-- Migration: Add lifecycle tracking columns to clients table
-- Story: 2.9a - Suspendre & réactiver un client
-- Date: 2026-02-16

-- Add suspended_at column for tracking suspension timestamp
ALTER TABLE clients ADD COLUMN suspended_at TIMESTAMPTZ;

-- Add archived_at column for tracking archival timestamp (prep for Story 2.9b)
ALTER TABLE clients ADD COLUMN archived_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN clients.suspended_at IS 'Date de dernière suspension du client';
COMMENT ON COLUMN clients.archived_at IS 'Date de clôture/archivage du client';
