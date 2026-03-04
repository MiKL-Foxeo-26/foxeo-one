-- Migration: 00050_client_configs_elio_alerts_preferences.sql
-- Story 8.9c: Élio One+ — Alertes proactives
-- Adds elio_alerts_preferences JSONB column to client_configs
-- Structure: { alerts: ProactiveAlert[], max_per_day: 3, sent_today: 0, last_reset: 'YYYY-MM-DD' }

ALTER TABLE client_configs
  ADD COLUMN IF NOT EXISTS elio_alerts_preferences JSONB DEFAULT NULL;

COMMENT ON COLUMN client_configs.elio_alerts_preferences IS 'Préférences alertes proactives Élio One+ : { alerts: ProactiveAlert[], max_per_day: number, sent_today: number, last_reset: string }. NULL si non configuré.';

CREATE INDEX IF NOT EXISTS idx_client_configs_elio_alerts ON client_configs(elio_tier)
  WHERE elio_alerts_preferences IS NOT NULL;
