-- Migration: Add onboarding fields to clients table
-- Story: 5.5 — Écran de bienvenue, première connexion & tutoriel Lab

-- 1. Add onboarding columns to clients table
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS first_login_at TIMESTAMPTZ;

-- 2. Index for filtering clients by onboarding status
CREATE INDEX IF NOT EXISTS idx_clients_onboarding_completed ON clients(onboarding_completed);

-- 3. Data migration: clients created before this migration are considered already onboarded
UPDATE clients SET onboarding_completed = TRUE WHERE created_at < NOW();
