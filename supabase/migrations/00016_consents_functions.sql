-- Migration: Consent Functions
-- Story: 1.9 — Consentements & legal
-- Purpose: Create helper functions for consent verification

-- Function: has_ia_consent
-- Returns TRUE if the client has accepted IA processing (latest consent)
CREATE OR REPLACE FUNCTION has_ia_consent(p_client_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_accepted BOOLEAN;
BEGIN
  -- Fetch the latest IA processing consent for the client
  SELECT accepted INTO v_accepted
  FROM consents
  WHERE client_id = p_client_id
    AND consent_type = 'ia_processing'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Return FALSE if no consent found, otherwise return the accepted value
  RETURN COALESCE(v_accepted, FALSE);
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION has_ia_consent(UUID) TO authenticated;

-- Comment
COMMENT ON FUNCTION has_ia_consent(UUID) IS
  'Returns TRUE if client has accepted IA processing consent (latest). Returns FALSE if no consent or refused.';

-- Verify function works
DO $$
BEGIN
  -- Test function exists and is callable
  PERFORM has_ia_consent('00000000-0000-0000-0000-000000000000'::UUID);
  RAISE NOTICE 'Function has_ia_consent created successfully';
END;
$$;
