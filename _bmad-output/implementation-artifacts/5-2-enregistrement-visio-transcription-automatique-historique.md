# Story 5.2: Enregistrement visio, transcription automatique & historique

Status: ready-for-dev

## Story

As a **utilisateur (MiKL ou client)**,
I want **enregistrer automatiquement les visioconférences et obtenir une transcription textuelle**,
So that **je peux revoir la conversation et retrouver rapidement des informations importantes**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `meeting_recordings` créée avec : id (UUID PK), meeting_id (FK meetings NOT NULL ON DELETE CASCADE), recording_url (TEXT NOT NULL), recording_duration_seconds (INTEGER NOT NULL), file_size_bytes (BIGINT NOT NULL), transcript_url (TEXT nullable), transcription_status (TEXT CHECK 'pending'/'processing'/'completed'/'failed' DEFAULT 'pending'), transcription_language (TEXT DEFAULT 'fr'), created_at, updated_at. RLS : `meeting_recordings_select_owner`, `meeting_recordings_select_operator`.

2. **AC2 — Enregistrement OpenVidu** : Activer `recording: true` dans la config session OpenVidu. Démarrer enregistrement automatiquement au `startMeeting()`. Arrêter enregistrement à `endMeeting()`. Webhook OpenVidu notifie URL de l'enregistrement → Edge Function reçoit + stocke dans Supabase Storage bucket `recordings`.

3. **AC3 — Transcription automatique** : Edge Function `transcribe-recording` déclenchée automatiquement après upload. Utilise API Whisper (OpenAI) ou Deepgram. Résultat : fichier SRT ou TXT stocké dans Storage bucket `transcripts`. Mise à jour `meeting_recordings.transcript_url` + `transcription_status='completed'`.

4. **AC4 — Historique recordings** : Page Hub/Client : liste recordings d'un meeting. Colonnes : durée, taille, date, statut transcription. Actions : télécharger vidéo, télécharger transcription, lire en ligne (player vidéo).

5. **AC5 — Player vidéo** : Component `recording-player.tsx` avec player HTML5 ou React Player. Affichage transcription synchronisée (sous-titres). Navigation dans la transcription (clic sur ligne → seek vidéo au timestamp).

6. **AC6 — Tests** : Tests unitaires co-localisés. Tests RLS. Mock API Whisper. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00029_create_meeting_recordings.sql`
  - [ ] 1.2 Table `meeting_recordings`
  - [ ] 1.3 Index : `idx_meeting_recordings_meeting_id`, `idx_meeting_recordings_transcription_status`
  - [ ] 1.4 Trigger updated_at
  - [ ] 1.5 RLS policies

- [ ] Task 2 — Supabase Storage buckets (AC: #2, #3)
  - [ ] 2.1 Créer bucket `recordings` (public: false, RLS activé)
  - [ ] 2.2 Créer bucket `transcripts` (public: false, RLS activé)
  - [ ] 2.3 Policies Storage : client voit ses recordings, opérateur voit tous

- [ ] Task 3 — Edge Function webhook OpenVidu (AC: #2)
  - [ ] 3.1 `supabase/functions/openvidu-webhook/index.ts` — Reçoit événement `recordingStatusChanged`
  - [ ] 3.2 Télécharge recording depuis OpenVidu
  - [ ] 3.3 Upload vers Supabase Storage `recordings/`
  - [ ] 3.4 Insert `meeting_recordings` avec URL

- [ ] Task 4 — Edge Function transcription (AC: #3)
  - [ ] 4.1 `supabase/functions/transcribe-recording/index.ts` — Déclenchée par DB trigger ou schedule
  - [ ] 4.2 Appel API Whisper (OpenAI) ou Deepgram avec fichier audio
  - [ ] 4.3 Upload transcription vers `transcripts/`
  - [ ] 4.4 Update `meeting_recordings` : `transcript_url`, `transcription_status='completed'`

- [ ] Task 5 — Server Actions (AC: #4)
  - [ ] 5.1 `actions/get-meeting-recordings.ts` — Récupérer recordings d'un meeting (filtré par RLS)
  - [ ] 5.2 `actions/download-recording.ts` — Générer signed URL pour téléchargement
  - [ ] 5.3 `actions/download-transcript.ts` — Générer signed URL pour transcription

- [ ] Task 6 — Hooks TanStack Query (AC: #4)
  - [ ] 6.1 `hooks/use-meeting-recordings.ts` — queryKey `['meeting-recordings', meetingId]`

- [ ] Task 7 — Composants UI (AC: #4, #5)
  - [ ] 7.1 `components/recording-player.tsx` — Player vidéo + transcription synchronisée
  - [ ] 7.2 `components/recording-list.tsx` — Liste recordings d'un meeting
  - [ ] 7.3 `components/transcript-viewer.tsx` — Affichage transcription avec timestamps
  - [ ] 7.4 `components/recording-status-badge.tsx` — Badge statut transcription

- [ ] Task 8 — Intégration module visio (AC: #2)
  - [ ] 8.1 Modifier `actions/start-meeting.ts` — Activer recording dans config OpenVidu
  - [ ] 8.2 Modifier `actions/end-meeting.ts` — Arrêter recording OpenVidu
  - [ ] 8.3 Ajouter route `/modules/visio/[meetingId]/recordings` pour historique

- [ ] Task 9 — Tests (AC: #6)
  - [ ] 9.1 Tests Edge Functions : openvidu-webhook, transcribe-recording
  - [ ] 9.2 Tests Server Actions : getMeetingRecordings, downloadRecording
  - [ ] 9.3 Tests composants : RecordingPlayer, RecordingList
  - [ ] 9.4 Tests RLS : client A ne voit pas recordings client B
  - [ ] 9.5 Tests Storage : policies isolation

- [ ] Task 10 — Documentation (AC: #6)
  - [ ] 10.1 Mise à jour `docs/guide.md`, `faq.md` module visio
  - [ ] 10.2 Documentation config Whisper/Deepgram API

## Dev Notes

### Architecture — Règles critiques

- **Extension module visio** : Pas de nouveau module, extend `packages/modules/visio/`.
- **Webhook OpenVidu** : Sécurisé par secret partagé. Vérifier signature dans Edge Function.
- **Transcription async** : Ne pas bloquer l'enregistrement. Traiter en background avec retry.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[VISIO:RECORDING_WEBHOOK]`, `[VISIO:TRANSCRIBE]`

### Base de données

**Migration `00029`** :
```sql
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

CREATE INDEX idx_meeting_recordings_meeting_id ON meeting_recordings(meeting_id);
CREATE INDEX idx_meeting_recordings_transcription_status ON meeting_recordings(transcription_status);
```

**RLS policies** :
```sql
-- Client voit recordings de ses meetings
CREATE POLICY meeting_recordings_select_owner ON meeting_recordings FOR SELECT
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE client_id IN (
        SELECT id FROM clients WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Opérateur voit tous les recordings
CREATE POLICY meeting_recordings_select_operator ON meeting_recordings FOR SELECT
  USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE operator_id = auth.uid()
    )
  );
```

### Edge Function — OpenVidu Webhook

```typescript
// supabase/functions/openvidu-webhook/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const webhookSecret = Deno.env.get('OPENVIDU_WEBHOOK_SECRET')!

  // Vérifier signature webhook
  const signature = req.headers.get('x-openvidu-signature')
  // ... vérification signature ...

  const event = await req.json()

  if (event.event === 'recordingStatusChanged' && event.status === 'ready') {
    const { sessionId, id: recordingId, url, duration, size } = event

    // Télécharger recording depuis OpenVidu
    const openviduUrl = Deno.env.get('OPENVIDU_URL')!
    const openviduSecret = Deno.env.get('OPENVIDU_SECRET')!

    const recordingRes = await fetch(`${openviduUrl}/openvidu/api/recordings/${recordingId}`, {
      headers: { 'Authorization': `Basic ${btoa(`OPENVIDUAPP:${openviduSecret}`)}` }
    })

    const recordingBlob = await recordingRes.blob()

    // Upload vers Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const filename = `${sessionId}/${recordingId}.mp4`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recordings')
      .upload(filename, recordingBlob, { contentType: 'video/mp4' })

    if (uploadError) {
      console.error('[VISIO:RECORDING_WEBHOOK] Upload failed:', uploadError)
      return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 })
    }

    // Récupérer meeting_id depuis session_id
    const { data: meeting } = await supabase
      .from('meetings')
      .select('id')
      .eq('session_id', sessionId)
      .single()

    if (!meeting) {
      console.error('[VISIO:RECORDING_WEBHOOK] Meeting not found for session:', sessionId)
      return new Response(JSON.stringify({ error: 'Meeting not found' }), { status: 404 })
    }

    // Insert meeting_recordings
    await supabase.from('meeting_recordings').insert({
      meeting_id: meeting.id,
      recording_url: uploadData.path,
      recording_duration_seconds: Math.round(duration),
      file_size_bytes: size,
    })

    // Déclencher transcription (appel Edge Function)
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/transcribe-recording`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meetingId: meeting.id })
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ message: 'Event ignored' }), { status: 200 })
})
```

### Edge Function — Transcription

```typescript
// supabase/functions/transcribe-recording/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { meetingId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Récupérer recording
  const { data: recording, error } = await supabase
    .from('meeting_recordings')
    .select('*')
    .eq('meeting_id', meetingId)
    .eq('transcription_status', 'pending')
    .single()

  if (error || !recording) {
    return new Response(JSON.stringify({ error: 'Recording not found' }), { status: 404 })
  }

  // Marquer comme processing
  await supabase
    .from('meeting_recordings')
    .update({ transcription_status: 'processing' })
    .eq('id', recording.id)

  try {
    // Télécharger le fichier depuis Storage
    const { data: fileData } = await supabase.storage
      .from('recordings')
      .download(recording.recording_url)

    if (!fileData) throw new Error('Failed to download recording')

    // Appel API Whisper (OpenAI)
    const formData = new FormData()
    formData.append('file', fileData, 'audio.mp4')
    formData.append('model', 'whisper-1')
    formData.append('language', recording.transcription_language || 'fr')
    formData.append('response_format', 'srt') // ou 'vtt' pour WebVTT

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')!}`,
      },
      body: formData
    })

    const transcriptText = await whisperRes.text()

    // Upload transcription vers Storage
    const transcriptFilename = `${recording.id}.srt`
    const { data: transcriptUpload } = await supabase.storage
      .from('transcripts')
      .upload(transcriptFilename, new Blob([transcriptText], { type: 'text/plain' }))

    // Update recording
    await supabase
      .from('meeting_recordings')
      .update({
        transcript_url: transcriptUpload!.path,
        transcription_status: 'completed'
      })
      .eq('id', recording.id)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error('[VISIO:TRANSCRIBE] Error:', err)

    await supabase
      .from('meeting_recordings')
      .update({ transcription_status: 'failed' })
      .eq('id', recording.id)

    return new Response(JSON.stringify({ error: 'Transcription failed' }), { status: 500 })
  }
})
```

### Player vidéo avec transcription

```typescript
// components/recording-player.tsx
'use client'
import { useRef, useState } from 'react'
import ReactPlayer from 'react-player'

export function RecordingPlayer({ recordingUrl, transcriptUrl }: { recordingUrl: string; transcriptUrl?: string }) {
  const playerRef = useRef<ReactPlayer>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [transcript, setTranscript] = useState<Array<{ start: number; end: number; text: string }>>([])

  // Parser SRT → JSON
  useEffect(() => {
    if (!transcriptUrl) return
    fetch(transcriptUrl)
      .then(res => res.text())
      .then(parseSRT)
      .then(setTranscript)
  }, [transcriptUrl])

  const seekTo = (seconds: number) => {
    playerRef.current?.seekTo(seconds, 'seconds')
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <ReactPlayer
          ref={playerRef}
          url={recordingUrl}
          controls
          width="100%"
          height="auto"
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
        />
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {transcript.map((line, i) => (
          <button
            key={i}
            onClick={() => seekTo(line.start)}
            className={cn(
              'block w-full text-left px-3 py-2 hover:bg-accent',
              currentTime >= line.start && currentTime <= line.end && 'bg-accent'
            )}
          >
            <span className="text-xs text-muted-foreground">{formatTimestamp(line.start)}</span>
            <p className="text-sm">{line.text}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Fichiers à créer

**Module visio (extension) :**
```
packages/modules/visio/
├── actions/get-meeting-recordings.ts, download-recording.ts, download-transcript.ts
├── hooks/use-meeting-recordings.ts
├── components/recording-player.tsx, recording-list.tsx, transcript-viewer.tsx, recording-status-badge.tsx
└── utils/parse-srt.ts
```

**Edge Functions :**
- `supabase/functions/openvidu-webhook/index.ts`
- `supabase/functions/transcribe-recording/index.ts`

**Migration :**
- `supabase/migrations/00029_create_meeting_recordings.sql`

**Routes :**
- `apps/hub/app/(dashboard)/modules/visio/[meetingId]/recordings/page.tsx`
- `apps/client/app/(dashboard)/modules/visio/[meetingId]/recordings/page.tsx`

### Fichiers à modifier

- `packages/modules/visio/actions/start-meeting.ts` — Activer recording
- `packages/modules/visio/actions/end-meeting.ts` — Arrêter recording
- `docker/openvidu/docker-compose.yml` — Ajouter config webhook

### Dépendances

- **Story 5.1** : Table `meetings`, module visio, OpenVidu
- OpenAI API (Whisper) ou Deepgram API
- Package `react-player` pour le player vidéo
- Supabase Storage buckets `recordings`, `transcripts`

### Anti-patterns — Interdit

- NE PAS stocker les vidéos en base de données (Storage uniquement)
- NE PAS bloquer l'enregistrement si transcription échoue (async)
- NE PAS exposer les URLs de recordings publiquement (signed URLs)
- NE PAS oublier de nettoyer les recordings OpenVidu locaux après upload (disk space)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-*.md#Story 5.2]
- [Source: docs/project-context.md]
- [OpenVidu Recording: https://docs.openvidu.io/en/stable/advanced-features/recording/]
- [OpenAI Whisper API: https://platform.openai.com/docs/guides/speech-to-text]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
