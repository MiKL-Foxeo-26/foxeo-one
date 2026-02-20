-- Migration: 00030_documents_soft_delete
-- Story: 4.6 — Autosave brouillons & undo actions récentes
-- Description: Add soft delete support to documents table for undo functionality

-- Add deleted_at column to documents table
ALTER TABLE documents
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- Update RLS policies to exclude soft-deleted documents from SELECT queries
-- Drop existing select policies first
DROP POLICY IF EXISTS documents_select_owner ON documents;
DROP POLICY IF EXISTS documents_select_shared ON documents;

-- Recreate select policy for owners (excluding deleted documents)
CREATE POLICY documents_select_owner ON documents
  FOR SELECT
  USING (
    client_id = (SELECT current_setting('app.client_id', TRUE))::UUID
    AND deleted_at IS NULL
  );

-- Recreate select policy for shared documents (excluding deleted documents)
CREATE POLICY documents_select_shared ON documents
  FOR SELECT
  USING (
    visibility = 'shared'
    AND deleted_at IS NULL
  );

-- Allow clients to soft-delete/restore their own uploaded documents
-- Required because soft delete uses UPDATE instead of DELETE
CREATE POLICY documents_update_client ON documents
  FOR UPDATE
  TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    AND uploaded_by = 'client'
  )
  WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    AND uploaded_by = 'client'
  );

-- Comment on the new column
COMMENT ON COLUMN documents.deleted_at IS 'Soft delete timestamp - when set, document is considered deleted but can be restored via undo action';
