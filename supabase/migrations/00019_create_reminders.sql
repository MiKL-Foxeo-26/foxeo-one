-- Migration: Create reminders table
-- Story: 2.7 — Rappels personnels & calendrier deadlines
-- Date: 2026-02-15

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES operators(id),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_operator_id_due_date ON reminders(operator_id, due_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(operator_id, completed);

-- Create trigger for updated_at (reuse existing function from migration 00006)
CREATE TRIGGER trg_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- Enable RLS on reminders
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reminders
-- Operators can only see their own reminders
CREATE POLICY reminders_select_operator ON reminders
  FOR SELECT
  USING (operator_id = auth.uid() AND is_operator());

-- Operators can insert their own reminders
CREATE POLICY reminders_insert_operator ON reminders
  FOR INSERT
  WITH CHECK (operator_id = auth.uid() AND is_operator());

-- Operators can update their own reminders
CREATE POLICY reminders_update_operator ON reminders
  FOR UPDATE
  USING (operator_id = auth.uid() AND is_operator())
  WITH CHECK (operator_id = auth.uid() AND is_operator());

-- Operators can delete their own reminders
CREATE POLICY reminders_delete_operator ON reminders
  FOR DELETE
  USING (operator_id = auth.uid() AND is_operator());

-- Atomic toggle function for completed status (avoids race condition)
CREATE OR REPLACE FUNCTION toggle_reminder_completed(p_reminder_id UUID)
RETURNS SETOF reminders
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE reminders
  SET completed = NOT completed
  WHERE id = p_reminder_id
    AND operator_id = auth.uid()
  RETURNING *;
$$;
