-- Migration 00043: Create elio_configs table
-- Story 6.6: Élio Lab — Configuration Orpheus

CREATE TABLE elio_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514'
    CHECK (model IN ('claude-haiku-4-20250122', 'claude-sonnet-4-20250514', 'claude-opus-4-20250514')),
  temperature NUMERIC NOT NULL DEFAULT 1.0
    CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER NOT NULL DEFAULT 1500
    CHECK (max_tokens >= 100 AND max_tokens <= 8000),
  custom_instructions TEXT,
  enabled_features JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_elio_configs_client_id ON elio_configs(client_id);

-- Trigger updated_at
CREATE TRIGGER trg_elio_configs_updated_at
  BEFORE UPDATE ON elio_configs
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- RLS: enable
ALTER TABLE elio_configs ENABLE ROW LEVEL SECURITY;

-- Client voit sa config
CREATE POLICY elio_configs_select_owner ON elio_configs
  FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client peut créer sa config
CREATE POLICY elio_configs_insert_owner ON elio_configs
  FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client peut modifier sa config
CREATE POLICY elio_configs_update_owner ON elio_configs
  FOR UPDATE
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client peut supprimer sa config (reset)
CREATE POLICY elio_configs_delete_owner ON elio_configs
  FOR DELETE
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));
