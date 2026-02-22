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
2. Démarrer via `startMeeting()` → crée la session OpenVidu
3. Rejoindre la salle via `/modules/visio/[meetingId]`
4. Terminer via `endMeeting()` → calcule durée + ferme session
