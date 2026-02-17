-- Migration: Inactivity alerting & notifications table
-- Story: 2.10 — Alertes inactivité Lab & import clients CSV
-- Date: 2026-02-17

-- ============================================================
-- 1. ALTER client_configs — inactivity tracking flag
-- ============================================================

ALTER TABLE client_configs ADD COLUMN inactivity_alert_sent BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN client_configs.inactivity_alert_sent IS 'Flag indiquant si une alerte inactivite a ete envoyee pour ce client. Reset automatique sur nouvelle activite.';

-- ============================================================
-- 2. ALTER operators — configurable threshold
-- ============================================================

ALTER TABLE operators ADD COLUMN inactivity_threshold_days INTEGER NOT NULL DEFAULT 7;

COMMENT ON COLUMN operators.inactivity_threshold_days IS 'Nombre de jours inactivite avant declenchement alerte (configurable par operateur, defaut: 7)';

-- ============================================================
-- 3. CREATE TABLE notifications
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  entity_type TEXT,
  entity_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_operator_unread ON notifications(operator_id, read, created_at DESC);
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);

COMMENT ON TABLE notifications IS 'Notifications operateur : alertes inactivite, resultats import, etc.';
COMMENT ON COLUMN notifications.type IS 'Type de notification (inactivity_alert, csv_import_complete, etc.)';
COMMENT ON COLUMN notifications.entity_type IS 'Type entite liee (client, import, etc.)';
COMMENT ON COLUMN notifications.entity_id IS 'ID entite liee';

-- ============================================================
-- 4. RLS policies — notifications
-- ============================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Un operateur ne lit que ses propres notifications
CREATE POLICY notifications_select_operator
  ON notifications
  FOR SELECT
  TO authenticated
  USING (is_operator(operator_id));

-- Un operateur peut mettre a jour ses propres notifications (marquer lu)
CREATE POLICY notifications_update_operator
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (is_operator(operator_id))
  WITH CHECK (is_operator(operator_id));

-- Un operateur/admin peut creer des notifications (self ou via Server Action)
-- Edge Function utilise service_role et bypass RLS
CREATE POLICY notifications_insert_operator
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (is_operator(operator_id));

-- ============================================================
-- 5. SQL function — get inactive Lab clients (for Edge Function)
-- ============================================================

CREATE OR REPLACE FUNCTION get_inactive_lab_clients(
  p_operator_id UUID,
  p_cutoff_date TIMESTAMPTZ
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  last_activity TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.email,
    COALESCE(
      (SELECT MAX(al.created_at) FROM activity_logs al
       WHERE al.entity_id = c.id AND al.entity_type = 'client'),
      c.created_at
    ) AS last_activity
  FROM clients c
  JOIN client_configs cc ON cc.client_id = c.id
  WHERE c.operator_id = p_operator_id
    AND c.status = 'active'
    AND cc.dashboard_type = 'lab'
    AND cc.inactivity_alert_sent = false
    AND COALESCE(
      (SELECT MAX(al.created_at) FROM activity_logs al
       WHERE al.entity_id = c.id AND al.entity_type = 'client'),
      c.created_at
    ) < p_cutoff_date;
END;
$$;

COMMENT ON FUNCTION get_inactive_lab_clients(UUID, TIMESTAMPTZ) IS 'Retourne les clients Lab inactifs depuis la date de coupure pour un operateur donne';
GRANT EXECUTE ON FUNCTION get_inactive_lab_clients(UUID, TIMESTAMPTZ) TO authenticated;

-- ============================================================
-- 6. Trigger — auto-reset inactivity flag on new activity
-- ============================================================

CREATE OR REPLACE FUNCTION fn_reset_inactivity_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.entity_type = 'client' AND NEW.entity_id IS NOT NULL THEN
    UPDATE client_configs
    SET inactivity_alert_sent = false
    WHERE client_id = NEW.entity_id
      AND inactivity_alert_sent = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_reset_inactivity_on_activity
  AFTER INSERT ON activity_logs
  FOR EACH ROW
  EXECUTE FUNCTION fn_reset_inactivity_alert();

COMMENT ON FUNCTION fn_reset_inactivity_alert() IS 'Reset automatique du flag inactivity_alert_sent quand une nouvelle activite est loguee pour un client';
