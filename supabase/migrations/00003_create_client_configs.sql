-- Migration: Create client_configs table
-- Story: 1.2 — Migrations Supabase fondation
-- Convention: client_id comme PK+FK, ON DELETE CASCADE, JSONB DEFAULT '{}'

CREATE TABLE client_configs (
  client_id UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id),
  active_modules TEXT[] NOT NULL DEFAULT ARRAY['core-dashboard'],
  dashboard_type TEXT NOT NULL DEFAULT 'one'
    CHECK (dashboard_type IN ('hub', 'lab', 'one')),
  theme_variant TEXT DEFAULT 'one'
    CHECK (theme_variant IN ('hub', 'lab', 'one')),
  custom_branding JSONB NOT NULL DEFAULT '{}'::jsonb,
  elio_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  parcours_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE client_configs IS 'Configuration par client : modules actifs, theme, branding, Elio';
COMMENT ON COLUMN client_configs.active_modules IS 'Liste des modules actives pour ce client';
COMMENT ON COLUMN client_configs.dashboard_type IS 'hub, lab ou one — determine le theme et la densite';
COMMENT ON COLUMN client_configs.custom_branding IS 'Logo, couleurs, nom affiche personnalise';
COMMENT ON COLUMN client_configs.elio_config IS 'Configuration agent IA Elio : tier, profil comm, instructions';
COMMENT ON COLUMN client_configs.parcours_config IS 'Configuration parcours Lab : etapes, progression';
