-- Migration: Create activity_logs table
-- Story: 1.2 — Migrations Supabase fondation
-- IMMUTABLE: Append-only, PAS de updated_at
-- Index pour requetes frequentes par acteur et par entite

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type TEXT NOT NULL
    CHECK (actor_type IN ('client', 'operator', 'system', 'elio')),
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_actor_created_at ON activity_logs(actor_id, created_at);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

COMMENT ON TABLE activity_logs IS 'Logs d''activite — append-only, table interne operateur';
COMMENT ON COLUMN activity_logs.actor_type IS 'client, operator, system ou elio';
COMMENT ON COLUMN activity_logs.entity_type IS 'Type entite : client, parcours, document, validation_request, payment, etc.';
