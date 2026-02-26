-- Migration 00045: PostgreSQL functions for approve/reject validation requests
-- Story 7.3 — Validation & refus de demande avec commentaire
-- Uses atomic transactions for data consistency

-- ============================================================
-- FUNCTION: approve_validation_request
-- ============================================================

CREATE OR REPLACE FUNCTION approve_validation_request(
  p_request_id UUID,
  p_comment TEXT,
  p_operator_id UUID
) RETURNS validation_requests AS $$
DECLARE
  v_request validation_requests;
  v_client_auth_id UUID;
  v_next_step_id UUID;
BEGIN
  -- Lock and fetch the request (FOR UPDATE prevents concurrent modifications)
  SELECT * INTO v_request
  FROM validation_requests
  WHERE id = p_request_id
    AND operator_id = p_operator_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or unauthorized' USING ERRCODE = 'P0001';
  END IF;

  IF v_request.status NOT IN ('pending', 'needs_clarification') THEN
    RAISE EXCEPTION 'Request cannot be approved in status: %', v_request.status USING ERRCODE = 'P0002';
  END IF;

  -- Update the validation request
  UPDATE validation_requests
  SET
    status = 'approved',
    reviewer_comment = p_comment,
    reviewed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id
  RETURNING * INTO v_request;

  -- If brief_lab and step is associated, advance parcours
  IF v_request.type = 'brief_lab'
    AND v_request.step_id IS NOT NULL
    AND v_request.parcours_id IS NOT NULL
  THEN
    -- Mark the step as completed
    UPDATE parcours_steps
    SET status = 'completed', completed_at = NOW(), updated_at = NOW()
    WHERE id = v_request.step_id;

    -- Find next locked step (lowest step_number in same parcours)
    SELECT id INTO v_next_step_id
    FROM parcours_steps
    WHERE parcours_id = v_request.parcours_id
      AND status = 'locked'
    ORDER BY step_number ASC
    LIMIT 1;

    IF v_next_step_id IS NOT NULL THEN
      -- Advance to next step
      UPDATE parcours_steps
      SET status = 'current', updated_at = NOW()
      WHERE id = v_next_step_id;
    ELSE
      -- No more locked steps: mark parcours as completed
      UPDATE parcours
      SET status = 'termine', completed_at = NOW(), updated_at = NOW()
      WHERE id = v_request.parcours_id;
    END IF;
  END IF;

  -- Create notification for client
  SELECT auth_user_id INTO v_client_auth_id
  FROM clients
  WHERE id = v_request.client_id;

  IF v_client_auth_id IS NOT NULL THEN
    INSERT INTO notifications (recipient_type, recipient_id, type, title, body, link, created_at)
    VALUES (
      'client',
      v_client_auth_id,
      'validation',
      'Votre demande "' || v_request.title || '" a été validée !',
      p_comment,
      CASE WHEN v_request.type = 'brief_lab' THEN '/modules/parcours-lab' ELSE NULL END,
      NOW()
    );
  END IF;

  RETURN v_request;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNCTION: reject_validation_request
-- ============================================================

CREATE OR REPLACE FUNCTION reject_validation_request(
  p_request_id UUID,
  p_comment TEXT,
  p_operator_id UUID
) RETURNS validation_requests AS $$
DECLARE
  v_request validation_requests;
  v_client_auth_id UUID;
BEGIN
  -- Lock and fetch the request
  SELECT * INTO v_request
  FROM validation_requests
  WHERE id = p_request_id
    AND operator_id = p_operator_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or unauthorized' USING ERRCODE = 'P0001';
  END IF;

  IF v_request.status NOT IN ('pending', 'needs_clarification') THEN
    RAISE EXCEPTION 'Request cannot be rejected in status: %', v_request.status USING ERRCODE = 'P0002';
  END IF;

  -- Update the validation request
  UPDATE validation_requests
  SET
    status = 'rejected',
    reviewer_comment = p_comment,
    reviewed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id
  RETURNING * INTO v_request;

  -- Create notification for client
  SELECT auth_user_id INTO v_client_auth_id
  FROM clients
  WHERE id = v_request.client_id;

  IF v_client_auth_id IS NOT NULL THEN
    INSERT INTO notifications (recipient_type, recipient_id, type, title, body, link, created_at)
    VALUES (
      'client',
      v_client_auth_id,
      'validation',
      'MiKL a demandé des modifications sur "' || v_request.title || '"',
      p_comment,
      CASE WHEN v_request.type = 'brief_lab' THEN '/modules/parcours-lab' ELSE NULL END,
      NOW()
    );
  END IF;

  RETURN v_request;
END;
$$ LANGUAGE plpgsql;
