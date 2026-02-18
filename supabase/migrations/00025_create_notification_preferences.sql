-- Migration: Create notification_preferences table + RLS
-- Story: 3.4 — Préférences de notification (client & MiKL)
-- Date: 2026-02-18

-- ============================================================
-- 1. CREATE TABLE notification_preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type         TEXT        NOT NULL CHECK (user_type IN ('client', 'operator')),
  user_id           UUID        NOT NULL,
  notification_type TEXT        NOT NULL CHECK (notification_type IN (
    'message', 'validation', 'alert', 'system', 'graduation',
    'payment', 'inactivity_alert', 'csv_import_complete'
  )),
  channel_email     BOOLEAN     NOT NULL DEFAULT true,
  channel_inapp     BOOLEAN     NOT NULL DEFAULT true,
  operator_override BOOLEAN     NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_preferences_unique UNIQUE (user_type, user_id, notification_type)
);

COMMENT ON TABLE notification_preferences IS
  'Préférences de notification par utilisateur et type — Story 3.4';

COMMENT ON COLUMN notification_preferences.operator_override IS
  'Quand true, l''opérateur force la notification quel que soit le choix du client';

-- ============================================================
-- 2. INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user
  ON notification_preferences(user_type, user_id);

-- ============================================================
-- 3. TRIGGER updated_at
-- ============================================================

DROP TRIGGER IF EXISTS trg_notification_preferences_updated_at ON notification_preferences;

CREATE TRIGGER trg_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- ---
-- Policies CLIENT : gère ses propres préférences (user_type='client')
-- is_owner(user_id) vérifie que clients.id = user_id AND clients.auth_user_id = auth.uid()
-- ---

CREATE POLICY notification_preferences_select_owner
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'client' AND is_owner(user_id)
  );

CREATE POLICY notification_preferences_insert_owner
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_type = 'client' AND is_owner(user_id)
  );

CREATE POLICY notification_preferences_update_owner
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING  (user_type = 'client' AND is_owner(user_id))
  WITH CHECK (user_type = 'client' AND is_owner(user_id));

-- ---
-- Policies OPERATOR : gère ses propres préférences (user_type='operator')
-- ---

CREATE POLICY notification_preferences_select_operator_self
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'operator' AND EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = notification_preferences.user_id
        AND operators.auth_user_id = auth.uid()
    )
  );

CREATE POLICY notification_preferences_insert_operator_self
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_type = 'operator' AND EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = notification_preferences.user_id
        AND operators.auth_user_id = auth.uid()
    )
  );

CREATE POLICY notification_preferences_update_operator_self
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (
    user_type = 'operator' AND EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = notification_preferences.user_id
        AND operators.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_type = 'operator' AND EXISTS (
      SELECT 1 FROM operators
      WHERE operators.id = notification_preferences.user_id
        AND operators.auth_user_id = auth.uid()
    )
  );

-- ---
-- Policies OPERATOR sur les préférences des CLIENTS (pour override)
-- L'opérateur peut lire/modifier les prefs de ses propres clients
-- ---

CREATE POLICY notification_preferences_select_operator_on_client
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = notification_preferences.user_id
        AND is_operator(clients.operator_id)
    )
  );

CREATE POLICY notification_preferences_insert_operator_on_client
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = notification_preferences.user_id
        AND is_operator(clients.operator_id)
    )
  );

CREATE POLICY notification_preferences_update_operator_on_client
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = notification_preferences.user_id
        AND is_operator(clients.operator_id)
    )
  )
  WITH CHECK (
    user_type = 'client' AND EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = notification_preferences.user_id
        AND is_operator(clients.operator_id)
    )
  );
