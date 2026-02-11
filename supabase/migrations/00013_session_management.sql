-- Migration 00013: Session management functions
-- Story 1.6 — Gestion sessions avancee (multi-device, voir/revoquer, forcer deconnexion)
--
-- Fonctions SECURITY DEFINER pour acceder a auth.sessions (schema auth).
-- Permet aux clients de lister/revoquer leurs sessions et aux admins de forcer la deconnexion.
-- Convention: fn_* pour les utilitaires SECURITY DEFINER.

-- ============================================================
-- SESSION QUERY FUNCTION
-- ============================================================

-- fn_get_user_sessions: Retourne les sessions actives d'un utilisateur
-- GUARD: L'utilisateur ne peut voir que SES sessions, un admin peut voir celles de n'importe quel utilisateur
CREATE OR REPLACE FUNCTION fn_get_user_sessions(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER STABLE
SET search_path = public
AS $$
DECLARE
  v_sessions JSON;
BEGIN
  -- Guard: only own sessions or admin
  IF p_user_id != auth.uid() AND NOT is_admin() THEN
    RETURN '[]'::JSON;
  END IF;

  SELECT json_agg(row_to_json(s))
  INTO v_sessions
  FROM (
    SELECT
      id,
      created_at,
      updated_at,
      refreshed_at,
      user_agent,
      ip::TEXT,
      aal,
      not_after
    FROM auth.sessions
    WHERE user_id = p_user_id
      AND (not_after IS NULL OR not_after > NOW())
    ORDER BY updated_at DESC
  ) s;

  RETURN COALESCE(v_sessions, '[]'::JSON);
END;
$$;

COMMENT ON FUNCTION fn_get_user_sessions(UUID) IS 'SECURITY DEFINER: retourne les sessions actives d un utilisateur depuis auth.sessions';

-- ============================================================
-- SESSION REVOCATION FUNCTIONS
-- ============================================================

-- fn_revoke_session: Supprime une session specifique
-- GUARD: L'utilisateur ne peut supprimer que SES sessions, un admin peut supprimer n'importe quelle session
CREATE OR REPLACE FUNCTION fn_revoke_session(p_session_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the session's user_id
  SELECT user_id INTO v_user_id
  FROM auth.sessions
  WHERE id = p_session_id;

  -- Guard: session must exist
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Session not found');
  END IF;

  -- Guard: only own sessions or admin
  IF v_user_id != auth.uid() AND NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  DELETE FROM auth.sessions WHERE id = p_session_id;

  RETURN json_build_object('success', true);
END;
$$;

COMMENT ON FUNCTION fn_revoke_session(UUID) IS 'SECURITY DEFINER: supprime une session specifique de auth.sessions';

-- fn_revoke_other_sessions: Supprime toutes les sessions SAUF celle specifiee
-- GUARD: L'utilisateur ne peut supprimer que SES propres sessions
CREATE OR REPLACE FUNCTION fn_revoke_other_sessions(p_keep_session_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_deleted_count INT;
BEGIN
  -- Get the session's user_id to verify ownership
  SELECT user_id INTO v_user_id
  FROM auth.sessions
  WHERE id = p_keep_session_id;

  -- Guard: session must exist and belong to current user
  IF v_user_id IS NULL OR v_user_id != auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  DELETE FROM auth.sessions
  WHERE user_id = v_user_id
    AND id != p_keep_session_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN json_build_object('success', true, 'revokedCount', v_deleted_count);
END;
$$;

COMMENT ON FUNCTION fn_revoke_other_sessions(UUID) IS 'SECURITY DEFINER: supprime toutes les sessions sauf celle specifiee';

-- fn_admin_revoke_all_sessions: Supprime TOUTES les sessions d'un utilisateur
-- GUARD: Admin only — utilise par MiKL pour forcer la deconnexion d'un client
CREATE OR REPLACE FUNCTION fn_admin_revoke_all_sessions(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count INT;
BEGIN
  -- Guard: admin only
  IF NOT is_admin() THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized - admin only');
  END IF;

  DELETE FROM auth.sessions
  WHERE user_id = p_user_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN json_build_object('success', true, 'revokedCount', v_deleted_count);
END;
$$;

COMMENT ON FUNCTION fn_admin_revoke_all_sessions(UUID) IS 'SECURITY DEFINER: admin force-deconnexion — supprime toutes les sessions d un utilisateur';

-- ============================================================
-- GRANTS
-- ============================================================

GRANT EXECUTE ON FUNCTION fn_get_user_sessions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION fn_revoke_session(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION fn_revoke_other_sessions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION fn_admin_revoke_all_sessions(UUID) TO authenticated;
