-- Migration: Create meetings table for visio module
-- Story: 5.1 — Module Visio — Migration, salle de visio OpenVidu
-- Note: Story specified 00028 but that sequence is taken; using 00031

CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  session_id TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  recording_url TEXT,
  transcript_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meetings_client_id ON meetings(client_id);
CREATE INDEX idx_meetings_operator_id ON meetings(operator_id);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_scheduled_at ON meetings(scheduled_at);

-- Trigger updated_at (reuse existing fn_update_updated_at from migration 00006)
CREATE TRIGGER trg_meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- RLS: Enable
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Client sees their own meetings
CREATE POLICY meetings_select_owner ON meetings FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Operator sees all meetings of their clients
CREATE POLICY meetings_select_operator ON meetings FOR SELECT
  USING (operator_id = auth.uid());

-- Authenticated user can create
CREATE POLICY meetings_insert_authenticated ON meetings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only operator can update
CREATE POLICY meetings_update_operator ON meetings FOR UPDATE
  USING (operator_id = auth.uid());
