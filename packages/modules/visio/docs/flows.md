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

## Flow 5 : Isolation des données (RLS)

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
