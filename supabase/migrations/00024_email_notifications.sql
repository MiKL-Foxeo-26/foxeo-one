-- Migration: Email notifications preferences + trigger
-- Story: 3.3 — Notifications email transactionnelles
-- Date: 2026-02-17

-- ============================================================
-- 1. ADD email preferences column to clients
-- ============================================================

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN clients.email_notifications_enabled IS
  'Préférence email du client — par défaut activé (Story 3.4 ajoute le UI)';

-- ============================================================
-- 2. ADD email preferences column to operators
-- ============================================================

ALTER TABLE operators
  ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN operators.email_notifications_enabled IS
  'Préférence email de l''opérateur — par défaut activé (Story 3.4 ajoute le UI)';

-- ============================================================
-- 3. CREATE trigger function (pg_net + Edge Function)
-- ============================================================

-- Requires pg_net extension (enabled in Supabase by default)
-- Enable if not already: CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_send_email_on_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  edge_url TEXT;
  service_key TEXT;
BEGIN
  -- Read config from app settings
  edge_url := current_setting('app.settings.edge_function_url', true);
  service_key := current_setting('app.settings.service_role_key', true);

  -- Only call Edge Function if settings are configured
  IF edge_url IS NULL OR service_key IS NULL THEN
    RAISE WARNING '[EMAIL:TRIGGER] Missing app.settings.edge_function_url or service_role_key — email skipped';
    RETURN NEW;
  END IF;

  -- Async HTTP POST via pg_net (non-blocking — in-app notification unaffected)
  PERFORM net.http_post(
    url := edge_url || '/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object('notificationId', NEW.id)
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Fail silently: in-app notification MUST NOT be blocked by email failure
    RAISE WARNING '[EMAIL:TRIGGER] pg_net call failed for notification %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- ============================================================
-- 4. CREATE trigger on notifications table
-- ============================================================

DROP TRIGGER IF EXISTS trg_send_email_on_notification ON notifications;

CREATE TRIGGER trg_send_email_on_notification
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_email_on_notification();

COMMENT ON TRIGGER trg_send_email_on_notification ON notifications IS
  'Déclenche l''envoi email asynchrone via Edge Function send-email';

-- ============================================================
-- 5. INDEX for email failure monitoring (activity_logs)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_activity_logs_email_failed
  ON activity_logs(action, created_at DESC)
  WHERE action = 'email_failed';

COMMENT ON INDEX idx_activity_logs_email_failed IS
  'Index pour le monitoring des échecs email (Story 3.3 — Task 5.2)';
