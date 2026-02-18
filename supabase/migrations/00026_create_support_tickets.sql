-- Migration: Create support_tickets table + RLS
-- Story: 3.7 — Support client, signalement de problèmes & aide en ligne
-- Date: 2026-02-18

-- ============================================================
-- 1. CREATE TABLE support_tickets
-- ============================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id     UUID        NOT NULL REFERENCES operators(id),
  type            TEXT        NOT NULL DEFAULT 'bug' CHECK (type IN ('bug', 'question', 'suggestion')),
  subject         TEXT        NOT NULL,
  description     TEXT        NOT NULL,
  screenshot_url  TEXT,
  status          TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE support_tickets IS
  'Tickets de support client — signalement de problèmes, questions, suggestions — Story 3.7';

-- ============================================================
-- 2. INDEX
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_support_tickets_client_id
  ON support_tickets(client_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_operator_id_status
  ON support_tickets(operator_id, status);

-- ============================================================
-- 3. TRIGGER updated_at
-- ============================================================

DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON support_tickets;

CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Client peut voir ses propres tickets
CREATE POLICY support_tickets_select_owner
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (is_owner(client_id));

-- Client peut créer un ticket
CREATE POLICY support_tickets_insert_authenticated
  ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (is_owner(client_id));

-- Opérateur peut voir les tickets de ses clients
CREATE POLICY support_tickets_select_operator
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (is_operator(operator_id));

-- Opérateur peut mettre à jour le statut des tickets de ses clients
CREATE POLICY support_tickets_update_operator
  ON support_tickets
  FOR UPDATE
  TO authenticated
  USING (is_operator(operator_id))
  WITH CHECK (is_operator(operator_id));
