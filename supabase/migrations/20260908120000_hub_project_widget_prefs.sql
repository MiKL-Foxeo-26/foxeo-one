-- ============================================================
-- Coin « Mes projets » de l'accueil du Hub — préférences d'affichage
-- ============================================================
-- MiKL choisit les tuiles qu'il veut voir sur son accueil. Une ligne = une tuile
-- (identifiée par sa clé du registre côté code) pour un opérateur donné.
--
-- Doctrine FORGE : la table ne connaît AUCUN projet en particulier. `widget_key`
-- est une chaîne libre du registre (ex. `menu-facile.contact_new`) ; ajouter un
-- projet ne demandera jamais de migration.
--
-- Absence de ligne = valeur par défaut du registre. On n'écrit donc que ce que
-- MiKL a explicitement changé.

CREATE TABLE IF NOT EXISTS hub_project_widget_prefs (
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  widget_key  TEXT NOT NULL,
  enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (operator_id, widget_key)
);

COMMENT ON TABLE hub_project_widget_prefs IS
  'Tuiles du coin « Mes projets » de l''accueil Hub, activées/désactivées par opérateur. widget_key vient du registre code, jamais d''une liste en dur en base.';

ALTER TABLE hub_project_widget_prefs ENABLE ROW LEVEL SECURITY;

-- Un opérateur ne voit et ne modifie que ses propres préférences.
DROP POLICY IF EXISTS hub_project_widget_prefs_all_operator ON hub_project_widget_prefs;
CREATE POLICY hub_project_widget_prefs_all_operator
  ON hub_project_widget_prefs
  FOR ALL
  USING (is_operator(operator_id))
  WITH CHECK (is_operator(operator_id));

-- Sans ce grant, la RLS n'est jamais atteinte : le rôle n'a tout simplement pas
-- le droit sur la table (piège déjà payé — cf. T-015).
GRANT SELECT, INSERT, UPDATE, DELETE ON hub_project_widget_prefs TO authenticated;
