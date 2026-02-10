-- Migration: Create consents table
-- Story: 1.2 — Migrations Supabase fondation
-- IMMUTABLE: INSERT seulement, jamais UPDATE (exigence RGPD)
-- PAS de updated_at, PAS de trigger update

CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL
    CHECK (consent_type IN ('cgu', 'ia_processing')),
  accepted BOOLEAN NOT NULL,
  version TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consents_client_id ON consents(client_id);

COMMENT ON TABLE consents IS 'Traces de consentement RGPD — immutables (INSERT only)';
COMMENT ON COLUMN consents.consent_type IS 'cgu = conditions generales, ia_processing = traitement IA Elio';
COMMENT ON COLUMN consents.version IS 'Version du document accepte (ex: 1.0, 2.0)';
