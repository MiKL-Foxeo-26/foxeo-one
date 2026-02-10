-- Migration: Create login_attempts table for brute force protection (NFR-S5)
-- Story 1.3: Authentification client

CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient lookups by email + time window
CREATE INDEX idx_login_attempts_email_time ON login_attempts (email, attempted_at);

-- RLS enabled but with server-side access policies
-- Server Actions use the anon key with cookies, so we need policies for authenticated access
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Server Actions need to read/write login attempts for brute force protection
-- These policies allow any authenticated or anon request (server-side only, not client-exposed)
CREATE POLICY login_attempts_insert_all ON login_attempts
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY login_attempts_select_all ON login_attempts
  FOR SELECT TO anon, authenticated
  USING (true);
