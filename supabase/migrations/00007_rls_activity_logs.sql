-- Migration: RLS policies for activity_logs
-- Story: 1.2 — Migrations Supabase fondation
-- Perimetre: UNIQUEMENT activity_logs (Story 1.5 traitera les autres tables)
-- Convention: {table}_{action}_{role}

-- Activer RLS sur activity_logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Fonction helper : extraire operator_id depuis les metadonnees auth.users
-- L'operator_id est stocke dans raw_app_meta_data.operator_id lors de la creation du user
CREATE OR REPLACE FUNCTION fn_get_operator_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT (raw_app_meta_data->>'operator_id')::UUID
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION fn_get_operator_id() IS 'Extrait operator_id depuis auth.users metadonnees pour les policies RLS';

-- Policy SELECT pour les operateurs : voient les logs de leurs clients + leurs propres logs
CREATE POLICY activity_logs_select_operator
  ON activity_logs
  FOR SELECT
  USING (
    -- L'operateur voit les logs ou l'acteur est un de ses clients
    actor_id IN (
      SELECT id FROM clients WHERE operator_id = fn_get_operator_id()
    )
    -- Ou l'acteur est l'operateur lui-meme
    OR actor_id = auth.uid()
  );

-- Policy INSERT pour les utilisateurs authentifies
CREATE POLICY activity_logs_insert_authenticated
  ON activity_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- AUCUNE policy SELECT pour les clients
-- Les clients ne voient PAS les activity_logs (table interne operateur)
-- Si un client tente un SELECT, il obtient un resultat vide grace au RLS
