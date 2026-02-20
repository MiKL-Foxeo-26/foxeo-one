-- Migration: Create document_folders table
-- Story: 4.4 — Organisation en dossiers & recherche dans les documents
-- Date: 2026-02-20

-- ============================================================
-- 1. CREATE TABLE document_folders
-- ============================================================

CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) >= 1),
  parent_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE document_folders IS 'Dossiers pour organiser les documents par client';
COMMENT ON COLUMN document_folders.parent_id IS 'Sous-dossier : reference au dossier parent (null = racine)';

-- ============================================================
-- 2. INDEX
-- ============================================================

CREATE INDEX idx_document_folders_client_id ON document_folders(client_id);
CREATE INDEX idx_document_folders_operator_id ON document_folders(operator_id);

-- ============================================================
-- 3. FK dans documents (folder_id existe deja sans FK depuis 00027)
-- ============================================================

ALTER TABLE documents
  ADD CONSTRAINT fk_documents_folder_id
  FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL;

-- ============================================================
-- 4. RLS policies
-- ============================================================

ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;

-- Client voit ses propres dossiers
CREATE POLICY document_folders_select_owner ON document_folders
  FOR SELECT
  TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()));

-- Operateur voit les dossiers de ses clients
CREATE POLICY document_folders_select_operator ON document_folders
  FOR SELECT
  TO authenticated
  USING (operator_id IN (SELECT id FROM operators WHERE auth_user_id = auth.uid()));

-- Client ou operateur peut inserer un dossier (verifie que client_id ou operator_id appartient a l'utilisateur)
CREATE POLICY document_folders_insert_authenticated ON document_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    OR operator_id IN (SELECT id FROM operators WHERE auth_user_id = auth.uid())
  );

-- Client ou operateur peut renommer ses dossiers
CREATE POLICY document_folders_update_owner_operator ON document_folders
  FOR UPDATE
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    OR operator_id IN (SELECT id FROM operators WHERE auth_user_id = auth.uid())
  );

-- Client ou operateur peut supprimer ses dossiers
CREATE POLICY document_folders_delete_owner_operator ON document_folders
  FOR DELETE
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    OR operator_id IN (SELECT id FROM operators WHERE auth_user_id = auth.uid())
  );
