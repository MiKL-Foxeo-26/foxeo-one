-- Migration: Create client_notes table and add pinning/defer columns to clients
-- Story: 2.6 — Notes privées, épinglage & "à traiter plus tard"
-- Date: 2026-02-15

-- Create client_notes table
CREATE TABLE IF NOT EXISTS client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns to clients table for pinning and deferring
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deferred_until TIMESTAMPTZ;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_notes_client_id ON client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_operator_id ON client_notes(operator_id);
CREATE INDEX IF NOT EXISTS idx_clients_is_pinned ON clients(is_pinned);

-- Create trigger for updated_at on client_notes (reuse existing function)
CREATE TRIGGER trg_client_notes_updated_at
  BEFORE UPDATE ON client_notes
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- Enable RLS on client_notes
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_notes
-- Operators can only see their own notes
CREATE POLICY client_notes_select_operator ON client_notes
  FOR SELECT
  USING (operator_id = auth.uid() AND is_operator());

-- Operators can insert their own notes
CREATE POLICY client_notes_insert_operator ON client_notes
  FOR INSERT
  WITH CHECK (operator_id = auth.uid() AND is_operator());

-- Operators can update their own notes
CREATE POLICY client_notes_update_operator ON client_notes
  FOR UPDATE
  USING (operator_id = auth.uid() AND is_operator())
  WITH CHECK (operator_id = auth.uid() AND is_operator());

-- Operators can delete their own notes
CREATE POLICY client_notes_delete_operator ON client_notes
  FOR DELETE
  USING (operator_id = auth.uid() AND is_operator());
