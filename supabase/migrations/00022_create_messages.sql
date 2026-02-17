-- Migration: Create messages table
-- Story: 3.1 — Module Chat messagerie temps réel MiKL-client
-- Date: 2026-02-17

-- ============================================================
-- 1. CREATE TABLE messages
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE RESTRICT,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'operator')),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE messages IS 'Messages du chat MiKL-client — append-only, seul read_at est modifiable';
COMMENT ON COLUMN messages.sender_type IS 'Expediteur : client ou operator';
COMMENT ON COLUMN messages.read_at IS 'Timestamp de lecture, null = non lu';

-- ============================================================
-- 2. INDEX
-- ============================================================

CREATE INDEX idx_messages_client_id_created_at ON messages(client_id, created_at);
CREATE INDEX idx_messages_operator_id ON messages(operator_id);

-- ============================================================
-- 3. RLS policies
-- ============================================================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Client ne voit que ses propres messages
CREATE POLICY messages_select_owner ON messages
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE auth_user_id = auth.uid()
  ));

-- Opérateur voit messages de ses clients
CREATE POLICY messages_select_operator ON messages
  FOR SELECT
  TO authenticated
  USING (operator_id IN (
    SELECT id FROM operators WHERE auth_user_id = auth.uid()
  ));

-- Client peut insérer un message pour sa propre conversation (sender_type = 'client')
CREATE POLICY messages_insert_client ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (sender_type = 'client' AND client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    ))
    OR
    (sender_type = 'operator' AND operator_id IN (
      SELECT id FROM operators WHERE auth_user_id = auth.uid()
    ))
  );

-- Opérateur peut marquer comme lu les messages de ses clients
CREATE POLICY messages_update_operator ON messages
  FOR UPDATE
  TO authenticated
  USING (operator_id IN (
    SELECT id FROM operators WHERE auth_user_id = auth.uid()
  ))
  WITH CHECK (operator_id IN (
    SELECT id FROM operators WHERE auth_user_id = auth.uid()
  ));

-- Client peut marquer comme lu les messages de l'opérateur dans sa conversation
CREATE POLICY messages_update_client ON messages
  FOR UPDATE
  TO authenticated
  USING (
    sender_type = 'operator'
    AND client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    sender_type = 'operator'
    AND client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. Supabase Realtime publication
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
