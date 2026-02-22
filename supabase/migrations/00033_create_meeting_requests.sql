-- Migration 00033: meeting_requests table (Story 5.3)
-- Demande de visio, prise de RDV (Cal.com) & salle d'attente

CREATE TABLE meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id),
  requested_slots JSONB NOT NULL,
  selected_slot TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  message TEXT,
  meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_meeting_requests_client_id ON meeting_requests(client_id);
CREATE INDEX idx_meeting_requests_operator_id_status ON meeting_requests(operator_id, status);

-- updated_at trigger
CREATE TRIGGER trg_meeting_requests_updated_at
  BEFORE UPDATE ON meeting_requests
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- RLS
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Client voit ses demandes
CREATE POLICY meeting_requests_select_owner ON meeting_requests FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Opérateur voit les demandes qui lui sont adressées
CREATE POLICY meeting_requests_select_operator ON meeting_requests FOR SELECT
  USING (operator_id = auth.uid());

-- Client peut créer ses propres demandes
CREATE POLICY meeting_requests_insert_client ON meeting_requests FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Seul l'opérateur peut modifier (accepter/refuser)
CREATE POLICY meeting_requests_update_operator ON meeting_requests FOR UPDATE
  USING (operator_id = auth.uid());
