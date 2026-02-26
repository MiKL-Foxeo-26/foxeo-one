-- Migration: Extend notification types for parcours workflow
-- Story: 6.3 — Soumission de brief pour validation & notifications
-- Note: Adds success, info, warning, error types needed for parcours validation flow
--       Also retroactively supports types already used in Story 6.1 (complete-step)

-- Drop old constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Add extended constraint
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'message',
    'validation',
    'alert',
    'system',
    'graduation',
    'payment',
    'inactivity_alert',
    'csv_import_complete',
    'success',
    'info',
    'warning',
    'error'
  ));

COMMENT ON COLUMN notifications.type IS 'Type de notification: message, validation, alert, system, graduation, payment, inactivity_alert, csv_import_complete, success, info, warning, error';
