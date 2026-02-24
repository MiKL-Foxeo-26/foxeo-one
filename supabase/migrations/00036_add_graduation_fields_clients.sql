-- Migration: Add graduation fields to clients table
-- Story: 5.6 — Écran de graduation Lab vers One

-- 1. Add graduation columns to clients table
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS graduated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS graduation_screen_shown BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS graduation_message TEXT;

-- 2. Index for filtering clients by graduation date
CREATE INDEX IF NOT EXISTS idx_clients_graduated_at ON clients(graduated_at);
