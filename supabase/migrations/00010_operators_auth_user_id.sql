-- Migration: Add auth_user_id and mfa_metadata to operators table
-- Story: 1.4 — Authentification MiKL (login + 2FA, middleware hub admin)
-- Convention: snake_case, TIMESTAMPTZ, gen_random_uuid()

-- Link operators to auth.users for authentication
ALTER TABLE operators ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id);
CREATE INDEX idx_operators_auth_user_id ON operators(auth_user_id);

-- Store MFA metadata (hashed recovery codes, enrollment status)
ALTER TABLE operators ADD COLUMN mfa_metadata JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN operators.auth_user_id IS 'Lien vers auth.users pour authentification Supabase';
COMMENT ON COLUMN operators.mfa_metadata IS 'Metadonnees MFA: recovery codes hashes, enrollment info';
