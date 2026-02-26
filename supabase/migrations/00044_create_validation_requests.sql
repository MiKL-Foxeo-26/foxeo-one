-- Migration 00044: Create validation_requests table + add avatar_url to clients
-- Story 7.1/7.2 — Module Validation Hub

-- ============================================================
-- 1. Add avatar_url to clients (referenced but missing)
-- ============================================================

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- 2. CREATE TABLE validation_requests
-- ============================================================

CREATE TABLE validation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE RESTRICT,
  parcours_id UUID REFERENCES parcours(id),
  step_id UUID REFERENCES parcours_steps(id),
  type TEXT NOT NULL CHECK (type IN ('brief_lab', 'evolution_one')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_ids UUID[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'needs_clarification')),
  reviewer_comment TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE validation_requests IS 'Demandes de validation soumises par les clients (briefs Lab, évolutions One)';
COMMENT ON COLUMN validation_requests.document_ids IS 'UUIDs des documents joints (table documents)';
COMMENT ON COLUMN validation_requests.step_id IS 'Étape de parcours associée si brief Lab';

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX idx_validation_requests_client_id ON validation_requests(client_id);
CREATE INDEX idx_validation_requests_operator_id ON validation_requests(operator_id);
CREATE INDEX idx_validation_requests_status ON validation_requests(status);
CREATE INDEX idx_validation_requests_submitted_at ON validation_requests(submitted_at);

-- ============================================================
-- 4. TRIGGER updated_at
-- ============================================================

CREATE TRIGGER trg_validation_requests_updated_at
  BEFORE UPDATE ON validation_requests
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- ============================================================
-- 5. RLS Policies
-- ============================================================

ALTER TABLE validation_requests ENABLE ROW LEVEL SECURITY;

-- Opérateur voit les demandes de ses clients
CREATE POLICY validation_requests_select_operator
  ON validation_requests
  FOR SELECT
  TO authenticated
  USING (is_operator(operator_id));

-- Opérateur peut mettre à jour le statut (valider/refuser/précisions)
CREATE POLICY validation_requests_update_operator
  ON validation_requests
  FOR UPDATE
  TO authenticated
  USING (is_operator(operator_id))
  WITH CHECK (is_operator(operator_id));

-- Client peut voir ses propres demandes
CREATE POLICY validation_requests_select_owner
  ON validation_requests
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE auth_user_id = auth.uid()
  ));

-- Client peut soumettre une demande
CREATE POLICY validation_requests_insert_owner
  ON validation_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id IN (
    SELECT id FROM clients WHERE auth_user_id = auth.uid()
  ));
