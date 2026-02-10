-- Migration: Create updated_at trigger function + triggers
-- Story: 1.2 — Migrations Supabase fondation
-- Convention: fn_ prefix pour fonctions utilitaires, trg_{table}_{event} pour triggers
-- Applique UNIQUEMENT sur operators, clients, client_configs (pas consents ni activity_logs)

CREATE OR REPLACE FUNCTION fn_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_update_updated_at() IS 'Met a jour automatiquement updated_at sur UPDATE';

-- Trigger sur operators
CREATE TRIGGER trg_operators_updated_at
  BEFORE UPDATE ON operators
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- Trigger sur clients
CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- Trigger sur client_configs
CREATE TRIGGER trg_client_configs_updated_at
  BEFORE UPDATE ON client_configs
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();
