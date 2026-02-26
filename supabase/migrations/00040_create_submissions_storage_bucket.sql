-- Migration: Create submissions storage bucket
-- Story: 6.3 — Soumission de brief pour validation & notifications

-- 1. Create bucket (private, RLS activé)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'submissions',
  'submissions',
  false,
  10485760, -- 10MB max par fichier
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Client peut uploader ses propres fichiers
CREATE POLICY submissions_insert_owner ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- 3. Policy: Client peut voir ses propres fichiers
CREATE POLICY submissions_select_owner ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- 4. Policy: Opérateur voit tous les fichiers de ses clients
CREATE POLICY submissions_select_operator ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM clients WHERE operator_id = auth.uid()
    )
  );
