-- Migration: Create meeting_recordings table for visio recording & transcription
-- Story: 5.2 — Enregistrement visio, transcription automatique & historique
-- Note: Story specified 00029 but sequence is at 00031; using 00032

-- 1. Table meeting_recordings
CREATE TABLE meeting_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  recording_duration_seconds INTEGER NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  transcript_url TEXT,
  transcription_status TEXT NOT NULL DEFAULT 'pending' CHECK (transcription_status IN ('pending', 'processing', 'completed', 'failed')),
  transcription_language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX idx_meeting_recordings_meeting_id ON meeting_recordings(meeting_id);
CREATE INDEX idx_meeting_recordings_transcription_status ON meeting_recordings(transcription_status);

-- 3. Trigger updated_at (reuse existing fn_update_updated_at from migration 00006)
CREATE TRIGGER trg_meeting_recordings_updated_at
  BEFORE UPDATE ON meeting_recordings
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_updated_at();

-- 4. RLS: Enable
ALTER TABLE meeting_recordings ENABLE ROW LEVEL SECURITY;

-- Client sees recordings of their own meetings
CREATE POLICY meeting_recordings_select_owner ON meeting_recordings FOR SELECT
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE client_id IN (
        SELECT id FROM clients WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Operator sees recordings of meetings they manage
CREATE POLICY meeting_recordings_select_operator ON meeting_recordings FOR SELECT
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE operator_id = auth.uid()
    )
  );

-- 5. Storage buckets for recordings and transcripts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('recordings', 'recordings', false, 524288000, ARRAY['video/mp4', 'video/webm', 'audio/webm']),
  ('transcripts', 'transcripts', false, 10485760, ARRAY['text/plain', 'text/srt', 'text/vtt'])
ON CONFLICT (id) DO NOTHING;

-- 6. Storage RLS policies
-- Client can read their own recordings
CREATE POLICY recordings_select_owner ON storage.objects FOR SELECT
  USING (
    bucket_id = 'recordings'
    AND (storage.foldername(name))[1] IN (
      SELECT m.session_id FROM meetings m
      WHERE m.client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
      AND m.session_id IS NOT NULL
    )
  );

-- Operator can read all recordings
CREATE POLICY recordings_select_operator ON storage.objects FOR SELECT
  USING (
    bucket_id = 'recordings'
    AND auth.uid() IN (SELECT id FROM operators)
  );

-- Client can read their own transcripts
CREATE POLICY transcripts_select_owner ON storage.objects FOR SELECT
  USING (
    bucket_id = 'transcripts'
    AND (
      REPLACE(name, '.srt', '') IN (
        SELECT mr.id::text FROM meeting_recordings mr
        JOIN meetings m ON mr.meeting_id = m.id
        WHERE m.client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
      )
    )
  );

-- Operator can read all transcripts
CREATE POLICY transcripts_select_operator ON storage.objects FOR SELECT
  USING (
    bucket_id = 'transcripts'
    AND auth.uid() IN (SELECT id FROM operators)
  );

-- Service role can INSERT meeting_recordings (Edge Functions: openvidu-webhook)
CREATE POLICY meeting_recordings_insert_service ON meeting_recordings FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Service role can UPDATE meeting_recordings (Edge Functions: transcribe-recording)
CREATE POLICY meeting_recordings_update_service ON meeting_recordings FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Service role can insert recordings and transcripts in storage (Edge Functions use service role)
CREATE POLICY recordings_insert_service ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recordings' AND auth.role() = 'service_role');

CREATE POLICY transcripts_insert_service ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'transcripts' AND auth.role() = 'service_role');
