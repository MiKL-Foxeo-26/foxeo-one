# Flows — Module Visio

## Flow 1 : Planification d'un meeting (MiKL)

```
MiKL (Hub)
  │
  ├─ Ouvre le dialog "Planifier un meeting"
  │   └─ MeetingScheduleDialog
  │
  ├─ Renseigne titre, description, date/heure
  │
  ├─ Soumet → createMeeting() [Server Action]
  │   ├─ Valide les données (Zod)
  │   ├─ Insère en DB (status = 'scheduled')
  │   └─ Envoie notification au client
  │
  └─ Liste se rafraîchit (TanStack Query invalidation)
```

## Flow 2 : Démarrage d'un meeting (MiKL)

```
MiKL (Hub) — Meeting planifié
  │
  ├─ Clique "Démarrer le meeting"
  │
  ├─ startMeeting() [Server Action]
  │   ├─ Vérifie que le meeting est 'scheduled'
  │   ├─ Appelle getOpenViduToken() (Edge Function)
  │   │   ├─ Crée session OpenVidu (customSessionId)
  │   │   └─ Retourne { token, sessionId }
  │   ├─ Met à jour DB: status='in_progress', started_at, session_id
  │   └─ Retourne meeting mis à jour
  │
  └─ Redirige vers /modules/visio/[meetingId]
```

## Flow 3 : Rejoindre une salle de visio

```
Utilisateur (MiKL ou Client)
  │
  ├─ Navigue vers /modules/visio/[meetingId]
  │
  ├─ MeetingRoom monte → useOpenVidu(meetingId)
  │   ├─ connect() appelé au mount
  │   ├─ getOpenViduToken() [Server Action]
  │   │   └─ Edge Function → token OpenVidu
  │   ├─ OV.initSession()
  │   ├─ session.connect(token)
  │   ├─ OV.initPublisherAsync() → caméra locale
  │   └─ status: 'connecting' → 'connected'
  │
  ├─ Vidéo locale affichée
  ├─ Autres participants arrivent → streamCreated event
  └─ Participants distants affichés
```

## Flow 4 : Fin de meeting

```
MiKL (Hub) — Meeting en cours
  │
  ├─ Clique "Quitter" (MeetingControls)
  │
  ├─ handleLeave()
  │   ├─ session.disconnect() → WebRTC fermé
  │   └─ endMeeting() [Server Action]
  │       ├─ Vérifie status = 'in_progress'
  │       ├─ Calcule durée (ended_at - started_at)
  │       ├─ Met à jour DB: status='completed', ended_at, duration_seconds
  │       └─ Retourne meeting mis à jour
  │
  └─ Redirige vers /modules/visio
```

## Flow 5 : Enregistrement automatique (Story 5.2)

```
Meeting démarré (startMeeting)
  │
  ├─ Appel OpenVidu API: POST /recordings/start
  │   └─ session, outputMode=COMPOSED, hasAudio=true, hasVideo=true
  │
  ├─ Meeting en cours (audio/vidéo enregistrés par OpenVidu)
  │
  ├─ Meeting terminé (endMeeting)
  │   └─ Appel OpenVidu API: POST /recordings/stop/{sessionId}
  │
  ├─ OpenVidu envoie webhook: recordingStatusChanged (status=ready)
  │   └─ Edge Function: openvidu-webhook
  │       ├─ Vérifie signature webhook
  │       ├─ Télécharge recording depuis OpenVidu
  │       ├─ Upload vers Supabase Storage (bucket: recordings)
  │       ├─ Insert dans meeting_recordings (status=pending)
  │       └─ Trigger Edge Function: transcribe-recording (fire-and-forget)
  │
  └─ Edge Function: transcribe-recording
      ├─ Download recording depuis Storage
      ├─ Appel API Whisper (OpenAI) → format SRT
      ├─ Upload SRT vers Storage (bucket: transcripts)
      └─ Update meeting_recordings: transcript_url, status=completed
```

## Flow 6 : Consultation des enregistrements

```
Utilisateur (MiKL ou Client)
  │
  ├─ Navigue vers /modules/visio/[meetingId]/recordings
  │
  ├─ Server Component charge les recordings via getMeetingRecordings()
  │   └─ RLS filtre automatiquement (owner/operator)
  │
  ├─ Liste affichée: durée, taille, date, statut transcription
  │
  ├─ Actions disponibles:
  │   ├─ "Lire" → ouvre RecordingPlayer (vidéo + transcription synchronisée)
  │   ├─ "Vidéo" → downloadRecording() → signed URL → téléchargement
  │   └─ "Transcription" → downloadTranscript() → signed URL → téléchargement
  │
  └─ RecordingPlayer
      ├─ <video> HTML5 natif avec contrôles
      ├─ TranscriptViewer charge le SRT via signed URL
      ├─ Parse SRT → affiche lignes avec timestamps
      └─ Clic sur ligne → seek vidéo au timestamp correspondant
```

## Flow 7 : Isolation des recordings (RLS)

```
Client A (authentifié)
  │
  ├─ Tente de lire recordings du Client B
  │   └─ SELECT * FROM meeting_recordings WHERE meeting_id = <meeting_client_b>
  │
  ├─ RLS policy "meeting_recordings_select_owner" évalue:
  │   WHERE meeting_id IN (SELECT id FROM meetings
  │     WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()))
  │   → auth.uid() ≠ client_b.auth_user_id → AUCUN résultat
  │
  └─ Retourne [] — isolation garantie pour les recordings aussi
```

## Flow 8 : Isolation des données (RLS)

```
Client A (authentifié)
  │
  ├─ Tente de lire meetings du Client B
  │   └─ SELECT * FROM meetings WHERE client_id = <client_b_id>
  │
  ├─ RLS policy "meetings_select_owner" évalue:
  │   WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
  │   → auth.uid() ≠ client_b.auth_user_id → AUCUN résultat
  │
  └─ Retourne [] — isolation garantie
```
