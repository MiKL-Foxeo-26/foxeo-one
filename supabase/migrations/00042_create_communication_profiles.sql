-- Migration: Create communication_profiles table
-- Story: 6.4 — Élio Lab conversation guidée & adaptation au profil communication

CREATE TABLE communication_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  preferred_tone TEXT NOT NULL DEFAULT 'friendly'
    CHECK (preferred_tone IN ('formal', 'casual', 'technical', 'friendly')),
  preferred_length TEXT NOT NULL DEFAULT 'balanced'
    CHECK (preferred_length IN ('concise', 'detailed', 'balanced')),
  interaction_style TEXT NOT NULL DEFAULT 'collaborative'
    CHECK (interaction_style IN ('directive', 'explorative', 'collaborative')),
  context_preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_communication_profiles_client_id ON communication_profiles(client_id);

-- Trigger for updated_at
CREATE TRIGGER trg_communication_profiles_updated_at
  BEFORE UPDATE ON communication_profiles
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- Enable RLS
ALTER TABLE communication_profiles ENABLE ROW LEVEL SECURITY;

-- Client can select their own profile
CREATE POLICY communication_profiles_select_owner ON communication_profiles
  FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client can insert their own profile
CREATE POLICY communication_profiles_insert_owner ON communication_profiles
  FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Client can update their own profile
CREATE POLICY communication_profiles_update_owner ON communication_profiles
  FOR UPDATE
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));
