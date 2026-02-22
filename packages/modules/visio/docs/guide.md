# Guide — Module Visio

## Vue d'ensemble

Le module Visio permet aux utilisateurs Foxeo (MiKL et clients) de lancer des visioconférences directement depuis la plateforme, sans quitter l'écosystème.

La technologie sous-jacente est **OpenVidu CE** (open source, auto-hébergé), qui utilise WebRTC pour la communication en temps réel.

## Fonctionnalités

- **Liste des meetings** : Hub (tous les clients) et Client (ses propres meetings)
- **Salle de visio** : caméra locale + participants distants
- **Contrôles** : micro on/off, caméra on/off, partage d'écran, quitter
- **États** : scheduled → in_progress → completed / cancelled
- **Sécurité** : token OpenVidu généré côté serveur (Edge Function), secret jamais exposé au client

## Architecture

```
Client Browser          Next.js Server          Supabase          OpenVidu
     │                       │                     │                  │
     ├─ MeetingRoom ─────────┤                     │                  │
     │   useOpenVidu()        │                     │                  │
     │   connect() ──────────► getOpenViduToken()   │                  │
     │                       │── invoke Edge Fn ───►│                  │
     │                       │                     ├── call OpenVidu ─►│
     │                       │                     │◄─ token ──────────┤
     │                       │◄── { token, id } ───┤                  │
     │◄──── token ────────────┤                     │                  │
     │── OV.initSession() ────────────────────────────────────────────►│
     │   session.connect(token)                                         │
```

## Utilisation — Hub

Page : `/modules/visio`

- Liste tous les meetings de tous les clients
- Filtres disponibles : par statut
- Accès salle : bouton "Rejoindre" sur meetings `in_progress`

## Utilisation — Client (Lab/One)

Page : `/modules/visio`

- Liste uniquement ses propres meetings (RLS automatique)
- Bouton "Rejoindre" sur meetings actifs

## Démarrer un meeting

1. Créer via `createMeeting()` (Server Action)
2. Démarrer via `startMeeting()` → crée la session OpenVidu + active l'enregistrement
3. Rejoindre la salle via `/modules/visio/[meetingId]`
4. Terminer via `endMeeting()` → arrête enregistrement + calcule durée + ferme session

## Enregistrements et transcription (Story 5.2)

### Vue d'ensemble

Les visioconférences sont automatiquement enregistrées. Après chaque meeting, l'enregistrement est stocké dans Supabase Storage et une transcription automatique est générée via l'API Whisper (OpenAI).

### Architecture

```
OpenVidu                    Supabase Edge Functions              Supabase
  │                              │                                  │
  ├─ Recording ready ───────────► openvidu-webhook                  │
  │                              │── download from OpenVidu         │
  │                              │── upload to Storage (recordings) │
  │                              │── insert meeting_recordings ────►│
  │                              │── trigger transcribe-recording   │
  │                              │                                  │
  │                              ├─ transcribe-recording            │
  │                              │── download from Storage          │
  │                              │── call Whisper API               │
  │                              │── upload SRT to Storage          │
  │                              │── update transcription_status ──►│
```

### Fonctionnalités recordings

- **Enregistrement automatique** : démarre avec `startMeeting()`, s'arrête avec `endMeeting()`
- **Stockage sécurisé** : bucket `recordings` privé, accès via signed URLs
- **Transcription automatique** : API Whisper, format SRT, langue configurable
- **Player vidéo** : lecture en ligne avec transcription synchronisée
- **Historique** : page `/modules/visio/[meetingId]/recordings`
- **Téléchargement** : vidéo et transcription via signed URLs (1h validité)

### Configuration requise

Variables d'environnement pour les Edge Functions :
- `OPENVIDU_WEBHOOK_SECRET` — secret de vérification webhook
- `OPENVIDU_URL` — URL du serveur OpenVidu
- `OPENVIDU_SECRET` — secret OpenVidu (API)
- `OPENAI_API_KEY` — clé API pour Whisper
- `SUPABASE_SERVICE_ROLE_KEY` — pour accès Storage depuis Edge Functions

### Statuts transcription

| Statut | Description |
|--------|-------------|
| `pending` | Enregistrement uploadé, transcription en file d'attente |
| `processing` | Transcription en cours via Whisper |
| `completed` | Transcription terminée, SRT disponible |
| `failed` | Erreur de transcription (retry possible) |
