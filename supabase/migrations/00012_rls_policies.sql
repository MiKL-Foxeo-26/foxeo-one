-- Migration 00012: RLS policies for operators, clients, client_configs, consents
-- Story 1.5 — RLS & isolation donnees multi-tenant
-- Convention: {table}_{action}_{role}
--
-- Tables deja protegees par RLS (hors scope de cette migration):
--   - activity_logs (00007)
--   - login_attempts (00008, SECURITY DEFINER functions)
--
-- NOTE: Aucune policy DELETE par design. Les suppressions de donnees passent
-- exclusivement par service_role (backend). Des policies DELETE seront ajoutees
-- dans des stories dediees si necessaire (ex: Story 2.9b cloture client).

-- ============================================================
-- TABLE: operators
-- ============================================================

ALTER TABLE operators ENABLE ROW LEVEL SECURITY;

-- Un operateur ne peut lire que son propre enregistrement
CREATE POLICY operators_select_self
  ON operators
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Un operateur peut modifier son propre enregistrement
-- (pour two_factor_enabled, mfa_metadata)
-- SECURITE: cette policy permet la modification de TOUTES les colonnes (y compris role).
-- Actuellement un seul operateur (MiKL), donc risque nul.
-- TODO (story future): ajouter un trigger BEFORE UPDATE pour interdire le changement de role
-- ou utiliser une fonction SECURITY DEFINER dediee pour les updates sensibles.
CREATE POLICY operators_update_self
  ON operators
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- ============================================================
-- TABLE: clients
-- ============================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Un client ne peut lire que sa propre fiche
CREATE POLICY clients_select_owner
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- Un operateur voit tous ses clients
CREATE POLICY clients_select_operator
  ON clients
  FOR SELECT
  TO authenticated
  USING (is_operator(operator_id));

-- Seul l'operateur peut modifier les fiches de ses clients
CREATE POLICY clients_update_operator
  ON clients
  FOR UPDATE
  TO authenticated
  USING (is_operator(operator_id))
  WITH CHECK (is_operator(operator_id));

-- Seul un admin/operateur peut creer un client
CREATE POLICY clients_insert_operator
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- TABLE: client_configs
-- ============================================================

ALTER TABLE client_configs ENABLE ROW LEVEL SECURITY;

-- Un client ne lit que sa propre config
CREATE POLICY client_configs_select_owner
  ON client_configs
  FOR SELECT
  TO authenticated
  USING (is_owner(client_id));

-- Un operateur voit les configs de ses clients
CREATE POLICY client_configs_select_operator
  ON client_configs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_configs.client_id
        AND is_operator(clients.operator_id)
    )
  );

-- Seul l'operateur peut modifier les configs de ses clients
CREATE POLICY client_configs_update_operator
  ON client_configs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_configs.client_id
        AND is_operator(clients.operator_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_configs.client_id
        AND is_operator(clients.operator_id)
    )
  );

-- Seul un admin/operateur peut creer une config
CREATE POLICY client_configs_insert_operator
  ON client_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- TABLE: consents
-- ============================================================

ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Un client ne voit que ses propres consentements
CREATE POLICY consents_select_owner
  ON consents
  FOR SELECT
  TO authenticated
  USING (is_owner(client_id));

-- Un operateur voit les consentements de ses clients
CREATE POLICY consents_select_operator
  ON consents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = consents.client_id
        AND is_operator(clients.operator_id)
    )
  );

-- Un client authentifie peut creer ses propres consentements
-- INSERT ONLY — pas d'UPDATE (table immutable per RGPD)
CREATE POLICY consents_insert_authenticated
  ON consents
  FOR INSERT
  TO authenticated
  WITH CHECK (is_owner(client_id));
