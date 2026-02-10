-- Migration 00009: Secure login_attempts RLS + fn_link_auth_user
-- Story 1.3 code-review fixes: M2 (permissive RLS) + H2 (signup client linking)

-- 1. Drop overly permissive RLS policies on login_attempts
--    These allowed anon to read ALL emails and DoS any account
DROP POLICY IF EXISTS login_attempts_insert_all ON login_attempts;
DROP POLICY IF EXISTS login_attempts_select_all ON login_attempts;

-- 2. fn_check_login_attempts: Check brute force lockout
--    Runs as function owner (bypasses RLS) so no direct table access needed
CREATE OR REPLACE FUNCTION fn_check_login_attempts(
  p_email TEXT,
  p_window_minutes INT DEFAULT 5,
  p_max_attempts INT DEFAULT 5
) RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_cutoff TIMESTAMPTZ;
  v_count INT;
  v_oldest TIMESTAMPTZ;
  v_lockout_end_epoch BIGINT;
  v_remaining_seconds INT;
BEGIN
  v_cutoff := NOW() - (p_window_minutes || ' minutes')::INTERVAL;

  SELECT COUNT(*) INTO v_count
  FROM login_attempts
  WHERE email = LOWER(p_email)
    AND success = false
    AND attempted_at >= v_cutoff;

  IF v_count >= p_max_attempts THEN
    SELECT attempted_at INTO v_oldest
    FROM login_attempts
    WHERE email = LOWER(p_email)
      AND success = false
      AND attempted_at >= v_cutoff
    ORDER BY attempted_at ASC
    LIMIT 1;

    v_lockout_end_epoch := EXTRACT(EPOCH FROM v_oldest + (p_window_minutes || ' minutes')::INTERVAL)::BIGINT;
    v_remaining_seconds := GREATEST(0, v_lockout_end_epoch - EXTRACT(EPOCH FROM NOW())::BIGINT);

    RETURN json_build_object('blocked', true, 'remainingSeconds', v_remaining_seconds);
  END IF;

  RETURN json_build_object('blocked', false, 'remainingSeconds', 0);
END;
$$;

-- 3. fn_record_login_attempt: Record a login attempt
CREATE OR REPLACE FUNCTION fn_record_login_attempt(
  p_email TEXT,
  p_ip_address TEXT DEFAULT 'unknown',
  p_success BOOLEAN DEFAULT false
) RETURNS VOID
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  INSERT INTO login_attempts (email, ip_address, success)
  VALUES (LOWER(p_email), p_ip_address, p_success);
END;
$$;

-- 4. fn_link_auth_user: Link Supabase auth user to pre-created client record
--    Called after signup to associate auth_user_id with client by email match
CREATE OR REPLACE FUNCTION fn_link_auth_user(
  p_auth_user_id UUID,
  p_email TEXT
) RETURNS JSON
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_client RECORD;
BEGIN
  UPDATE clients
  SET auth_user_id = p_auth_user_id, updated_at = NOW()
  WHERE email = LOWER(p_email)
    AND auth_user_id IS NULL
  RETURNING id, name INTO v_client;

  IF v_client.id IS NOT NULL THEN
    RETURN json_build_object('clientId', v_client.id, 'name', v_client.name);
  END IF;

  RETURN NULL;
END;
$$;

-- 5. Grant execute permissions
GRANT EXECUTE ON FUNCTION fn_check_login_attempts(TEXT, INT, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION fn_record_login_attempt(TEXT, TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION fn_link_auth_user(UUID, TEXT) TO anon, authenticated;
