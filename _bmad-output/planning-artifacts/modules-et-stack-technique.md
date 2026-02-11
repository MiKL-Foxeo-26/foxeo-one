# FOXEO - Modules & Stack Technique

**Date :** 25 Janvier 2026
**Dernière mise à jour :** 25 Janvier 2026 (Party Mode Session)
**Statut :** Document de référence pour l'implémentation
**Session :** Brainstorming modules + validation Gemini + recherches techniques + Party Mode

---

## Table des Matières

1. [Architecture Générale](#architecture-générale)
2. [Modules Socle](#modules-socle)
3. [Modules Dashboard Mère](#modules-dashboard-mère-mikl)
4. [Modules Dashboard Coaching](#modules-dashboard-coaching)
5. [Modules Dashboard Outil](#modules-dashboard-outil)
6. [Modules Spécifiques - Bibliothèque](#modules-spécifiques---bibliothèque)
7. [Stack Technique](#stack-technique)
8. [Décisions Architecturales](#décisions-architecturales)
9. [Solutions Techniques Détaillées](#solutions-techniques-détaillées)

---

## Architecture Générale

### Les 3 Dashboards - Nomenclature Officielle

| Dashboard | Nom Officiel | Utilisateur | Fonction | Agent IA | Couleur |
|-----------|--------------|-------------|----------|----------|---------|
| **Dashboard Mère** | **FOXEO-HUB** | MiKL | Cockpit central - gestion clients/projets | **Élio Hub** | Bordeaux Foncé `#6B1B1B` |
| **Dashboard Coaching** | **FOXEO-LAB** | Client en création | Accompagnement de l'idée au business | **Élio Lab** (LLM, accès contrôlé) | Vert Émeraude `#2E8B57` |
| **Dashboard Outil** | **FOXEO-ONE** | Client établi | Outil métier personnalisé | **Élio One** (support + évolutions) | Orange Foxeo `#F7931E` |

### Architecture des Agents IA

```
┌─────────────────────────────────────────────────────────────────────┐
│  🦉 ORPHEUS - CERVEAU FOXEO (BMAD/Cursor)                           │
├─────────────────────────────────────────────────────────────────────┤
│  • Agent BMAD dans Cursor, travaille avec MiKL                      │
│  • Connaissance complète de l'entreprise Foxeo                      │
│  • GÉNÈRE des documents sources pour alimenter les Élio :           │
│    - Estimations prix projets → Élio Hub fait les devis             │
│    - Docs techniques modules → Élio One accompagne les clients      │
│    - Retravaille docs brainstorming Lab → livrables clients         │
│  • NE S'ADRESSE PAS directement aux clients                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    génère documents
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  🦊 ÉLIO - 3 CONFIGURATIONS (dans Foxeo)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ÉLIO HUB (Foxeo-Hub) - Pour MiKL                                   │
│  ├── Récupère les docs Orpheus (estimations, specs...)              │
│  ├── Gère agenda, visios, devis, facturation                        │
│  ├── Orchestration des workflows Hub                                │
│  └── Interface quotidienne de MiKL                                  │
│                                                                     │
│  ÉLIO LAB (Foxeo-Lab) - Pour clients en création                    │
│  ├── Instance par CLIENT                                            │
│  ├── Guide bienveillant, accompagne la création                     │
│  ├── Génère docs brainstorming → envoyés à Orpheus                  │
│  ├── Reçoit les livrables retravaillés par Orpheus                  │
│  └── Connecté LLM = coûts, accès contrôlé par MiKL                  │
│                                                                     │
│  ÉLIO ONE (Foxeo-One) - Pour clients établis                        │
│  ├── Instance par CLIENT                                            │
│  ├── Récupère docs techniques générés par Orpheus                   │
│  ├── Accompagne le client dans l'utilisation de son outil           │
│  └── Support + demandes d'évolutions                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Flux de Documents Orpheus ↔ Élio

```
┌─────────────────────────────────────────────────────────────────────┐
│  FLUX DOCUMENTAIRES                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. ESTIMATION → DEVIS                                              │
│     Orpheus évalue prix projet                                      │
│           ↓                                                         │
│     Document estimation généré                                      │
│           ↓                                                         │
│     Élio Hub récupère → propose devis au client                     │
│                                                                     │
│  2. DOC TECHNIQUE → ACCOMPAGNEMENT                                  │
│     Orpheus génère doc technique (module/fonctionnalité)            │
│           ↓                                                         │
│     Document injecté dans Élio One du client                        │
│           ↓                                                         │
│     Élio One accompagne le client avec cette connaissance           │
│                                                                     │
│  3. BRAINSTORMING → LIVRABLE                                        │
│     Client fait brainstorming avec Élio Lab                         │
│           ↓                                                         │
│     Document brut généré                                            │
│           ↓                                                         │
│     MiKL + Orpheus retravaillent le document                        │
│           ↓                                                         │
│     Livrable final envoyé sur l'espace client                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Relation Lab ↔ One (Migration/Graduation)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PARCOURS CLIENT : LAB → ONE                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE CRÉATION (Lab actif)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🟢 FOXEO-LAB                                                │   │
│  │  ├── Élio Lab ACTIF (LLM connecté)                          │   │
│  │  ├── Parcours, devoirs, Validation Hub                       │   │
│  │  └── Tout est archivé en temps réel                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                           │                                         │
│                    🎓 GRADUATION                                    │
│                           ▼                                         │
│  PHASE ÉTABLIE (One actif)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🟠 FOXEO-ONE                                                │   │
│  │  ├── Élio One ACTIF (support + évolutions)                  │   │
│  │  ├── Modules métier, CRM, agenda...                         │   │
│  │  │                                                           │   │
│  │  └── 📂 ONGLET "HISTORIQUE LAB"                             │   │
│  │      ├── Tous les documents créés en Lab                    │   │
│  │      ├── Accès lecture                                      │   │
│  │      └── 🔒 Élio Lab DÉSACTIVÉ par défaut                   │   │
│  │          └── Réactivable par MiKL si besoin                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  RETOUR LABORATOIRE (si MiKL réactive)                              │
│  └── Élio Lab réactivé → nouveau cycle possible                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Multi-tenant

```
CODE SOURCE UNIQUE (Core)
        │
        ▼
┌─────────────────────────────────┐
│  Table: client_config           │
├─────────────────────────────────┤
│  client_id: "client_xyz"        │
│  dashboard_type: "coaching"     │
│  modules_actifs: [              │
│    "parcours", "chat",          │
│    "documents", "agenda"        │
│  ]                              │
│  theme: "light"                 │
│  custom_config: {...}           │
└─────────────────────────────────┘

→ Une mise à jour = déployée chez TOUS les clients instantanément
→ Personnalisation via configuration, pas via code custom
```

### Principe de Développement des Modules

```
┌─────────────────────────────────────────────────────────────────┐
│  MODULES SOCLE        │  Toujours présents, non désactivables  │
├─────────────────────────────────────────────────────────────────┤
│  MODULES MÉTIER       │  Standards, activables par dashboard   │
├─────────────────────────────────────────────────────────────────┤
│  MODULES SPÉCIFIQUES  │  Bibliothèque évolutive sur demande    │
└─────────────────────────────────────────────────────────────────┘

Règle d'or : On ne développe JAMAIS "au cas où"
→ Chaque module spécifique naît d'un besoin client réel
→ Une fois développé, il rejoint la bibliothèque réutilisable
```

---

## Modules Socle

**Présents dans les 3 dashboards - Non désactivables**

| Module | Description | Priorité |
|--------|-------------|----------|
| **Auth & Profil** | Connexion sécurisée, profil utilisateur, préférences personnelles | P1 |
| **Navigation** | Menu, sidebar, breadcrumbs | P1 |
| **Global Search** | Recherche globale type Raycast/Spotlight - navigation rapide | P1 |
| **Notifications** | Centre de notifications, badges, alertes - **configurable par l'utilisateur** | P1 |
| **Thème & UI** | Mode clair/sombre, responsive, accessibilité | P1 |
| **Aide & Onboarding** | Tooltips contextuels, guide premier lancement, FAQ | P1 |
| **Agent IA** | Élio Hub (Hub) / Élio Lab (Lab) / Élio One (One) - Chat IA contextuel | P1 |
| **Contexte Quotidien** | Météo, date, infos du jour, salutation personnalisée | P1 |

### Configuration Notifications (par utilisateur)

```yaml
notifications_config:
  sources:
    chat:
      enabled: true
      sound: true
      badge: true
      priority: "normal"
    validation_hub:
      enabled: true
      sound: true
      badge: true
      priority: "high"  # Alerte prioritaire
    systeme:
      enabled: true
      sound: false
      badge: true
      priority: "low"   # Silencieux

  quiet_hours:
    enabled: false
    start: "22:00"
    end: "08:00"
```

---

## Modules Dashboard Mère (MiKL)

**Agent IA : Élio Hub** - Assistant personnel qui connaît l'entreprise

| Module | Description | Priorité |
|--------|-------------|----------|
| **Clients** | Liste clients, fiches, statuts, filtres avancés | P1 |
| **CRM** | Fiche relationnelle complète (photo, anniversaire, notes perso, CV, parcours) | P1 |
| **Projets** | Suivi projets, étapes, progression, timeline | P1 |
| **Agenda** | Planning, RDV, synchro bidirectionnelle Google Calendar | P1 |
| **Visio** | Lancer/rejoindre réunions intégrées, enregistrement | P1 |
| **Transcription** | Retranscription auto des visios via API | P1 |
| **Chat Direct** | Communication MiKL ↔ Client | P1 |
| **Validation Hub** | File de validations en attente, workflow validation | P1 |
| **Facturation** | Devis, factures, paiements, compta (via Pennylane API v2) | P1 |
| **Documents** | Stockage, partage, versionnage, système de tags | P1 |
| **Audit & Logs** | Historique des actions, debug support client | P1 |
| **Analytics** | Stats CA, clients actifs, temps passé, projets | P2 |

### Détail Module Visio (Dashboard Mère)

```
┌─────────────────────────────────────────────────────────────┐
│  VISIO INTÉGRÉE                                             │
├─────────────────────────────────────────────────────────────┤
│  • Lancer une visio depuis la fiche client/projet           │
│  • Enregistrement automatique (opt-in)                      │
│  • Stockage → Supabase Storage                              │
│  • Transcription auto → Deepgram API                        │
│  • Résumé IA → Élio Hub génère un compte-rendu              │
│  • Actions extraites → Ajoutées au projet                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Modules Dashboard Coaching

**Agent IA : Élio Renardeau** - Guide bienveillant, accompagne la création

**Émotion cible :** *"Je ne suis pas seul. Tout avance. Je suis sur le bon chemin."*

| Module | Description | Priorité |
|--------|-------------|----------|
| **Parcours & Étape** | Progression globale visible + détail étape en cours + rôle du client | P1 |
| **Documents** | Système unifié avec tags : `Livrable`, `Ressource`, `Devoir`, `Archive` | P1 |
| **Chat** | Communication directe avec MiKL | P1 |
| **Agenda / RDV** | Prochain RDV visible, lien visio, historique | P1 |
| **Visio** | Rejoindre les visios avec MiKL (même techno que Dashboard Mère) | P1 |
| **Validation Hub (client)** | Bouton "Soumettre à MiKL", statut des soumissions | P1 |
| **Facturation (vue)** | Consulter ses factures, historique paiements | P1 |
| **Bien-être & Routine** | Conseils gestion stress, respiration, routines efficaces | P2 |

### Système Documents Unifié (Coaching)

Fusion Documents + Homework en un seul module avec tags :

```sql
-- Structure base de données
documents (
  id UUID PRIMARY KEY,
  client_id UUID,
  project_id UUID,

  -- Fichier
  file_name TEXT,
  file_path TEXT,  -- Supabase Storage
  file_size INTEGER,
  mime_type TEXT,

  -- Tags et type
  tags TEXT[],  -- ['phase_1', 'identite_visuelle']
  document_type ENUM('livrable', 'ressource', 'devoir', 'archive'),

  -- Spécifique devoirs
  is_homework BOOLEAN DEFAULT false,
  homework_due_date TIMESTAMP,
  homework_completed BOOLEAN DEFAULT false,
  homework_completed_at TIMESTAMP,

  -- Métadonnées
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**UI :**
```
┌─────────────────────────────────────────────────────────┐
│  📁 MES DOCUMENTS                        [+ Ajouter]    │
├─────────────────────────────────────────────────────────┤
│  Filtres: [Tous ▼] [Livrables] [Ressources] [Devoirs]  │
├─────────────────────────────────────────────────────────┤
│  📄 Brief Initial.pdf          Livrable    ✅ Validé   │
│  📄 Checklist positionnement   Devoir      ⏳ À faire  │
│  📄 Guide branding.pdf         Ressource   📖          │
│  🖼️ Logo_v2.png                Livrable    🆕 Nouveau  │
└─────────────────────────────────────────────────────────┘
```

---

## Modules Dashboard Outil

**Agent IA : Élio Adulte** - Assistant pro, efficace, support métier

**Émotion cible :** *"Mon outil est là, fiable, efficace. Je peux me concentrer sur mon business."*

| Module | Description | Priorité |
|--------|-------------|----------|
| **Dashboard Home** | Vue d'ensemble métier, KPIs configurables selon activité | P1 |
| **Clients (du client)** | Mini-CRM pour gérer SA propre clientèle | P1 |
| **Agenda** | Son planning personnel, synchro calendrier | P1 |
| **Documents** | Ses fichiers, modèles, classement par tags | P1 |
| **Chat** | Communication avec MiKL pour support/évolutions | P1 |
| **Visio** | Visio intégrée (même techno) | P1 |
| **Intégrations** | Connexions externes configurables (Google, LinkedIn...) | P1 |
| **Mémoire Coaching** | Accès aux docs/décisions de la phase coaching | P1 |
| **Évolutions** | Demander une évolution via Élio → workflow devis | P1 |
| **Facturation (propre)** | Générer SES devis/factures à SES clients | P2 |
| **[Modules Spécifiques]** | Activables depuis la bibliothèque | Sur demande |

---

## Modules Spécifiques - Bibliothèque

### Principe

```
CLIENT DEMANDE          DÉVELOPPEMENT           BIBLIOTHÈQUE
Module Qualiopi    →    Pour CE client    →    Disponible pour tous
                                               (réutilisable)
```

### Exemples de Modules Potentiels (à développer sur demande)

| Module | Vertical | Description |
|--------|----------|-------------|
| **Séances** | Coachs, thérapeutes | Gestion séances, suivi client, notes |
| **Parcours Qualiopi** | Formateurs | Audit, indicateurs, documents conformité |
| **Portfolio** | Créatifs | Galerie projets, présentation client |
| **Devis Travaux** | Artisans, archi | Chiffrage, métrés, suivi chantier |
| **Prise de RDV publique** | Tous | Calendly-like intégré |
| **Newsletter** | Marketing | Gestion liste, envoi campagnes |

### Gestion de la Bibliothèque

```yaml
# Configuration module spécifique
module_seances:
  name: "Séances"
  version: "1.0.0"
  description: "Gestion de séances pour coachs et thérapeutes"
  compatible_dashboards: ["outil"]
  dependencies: ["agenda", "clients"]
  created_for_client: "client_001"
  created_at: "2026-02-15"

  features:
    - Création séance (date, durée, type)
    - Notes de séance
    - Suivi progression client
    - Rappels automatiques
    - Facturation intégrée (optionnel)
```

---

## Stack Technique

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    FOXEO STACK                              │
├─────────────────────────────────────────────────────────────┤
│  FRONTEND           │  Next.js 16 + React 19 + Tailwind 4  │
│  UI COMPONENTS      │  shadcn/ui + 21st.dev + Radix UI     │
│  DATABASE           │  Supabase (PostgreSQL)               │
│  AUTH               │  Supabase Auth                       │
│  STORAGE            │  Supabase Storage + Google Drive     │
│  REALTIME / CHAT    │  Supabase Realtime                   │
│  PRISE DE RDV       │  Cal.com (self-hosted)               │
│  AUTO-COMPLETE      │  API INSEE (gratuit)                 │
│  VISIO              │  OpenVidu (self-hosted)              │
│  TRANSCRIPTION      │  Deepgram API (~$0.63/h avec diarisation) │
│  FACTURATION        │  Pennylane API v2 (SaaS cloud)       │
│  PAIEMENTS          │  Stripe (connecté à Pennylane) + virement IBAN + SEPA │
│  AGENTS IA          │  DeepSeek V3.2 (Élio) + Claude (Orpheus) │
│  HOSTING FRONT      │  Vercel                              │
│  HOSTING SERVICES   │  VPS (OpenVidu, Cal.com)             │
└─────────────────────────────────────────────────────────────┘
```

### Design System V1

```
┌─────────────────────────────────────────────────────────────┐
│  DESIGN STACK                                               │
├─────────────────────────────────────────────────────────────┤
│  COMPOSANTS                                                 │
│  ├── shadcn/ui (base solide, accessible)                   │
│  ├── 21st.dev (composants premium, animations)             │
│  │   └── NOTE: Composants payants → validation MiKL        │
│  │             au cas par cas avant utilisation            │
│  └── Radix UI (primitives accessibles)                     │
│                                                             │
│  STYLING : Tailwind CSS 4                                   │
│                                                             │
│  TYPOGRAPHIE (Charte Foxeo)                                │
│  ├── Poppins (titres, UI, boutons)                         │
│  └── Inter (corps de texte)                                │
│                                                             │
│  COULEURS PAR DASHBOARD                                     │
│  ├── FOXEO-HUB  → Bordeaux Foncé #6B1B1B                   │
│  ├── FOXEO-LAB  → Vert Émeraude  #2E8B57                   │
│  └── FOXEO-ONE  → Orange Foxeo   #F7931E                   │
│                                                             │
│  PRINCIPE V1                                                │
│  └── Template unique + couleur distinctive par dashboard   │
│      → Palettes détaillées à définir lors implémentation   │
└─────────────────────────────────────────────────────────────┘
```

### Stratégie de Développement

| Priorité | Approche |
|----------|----------|
| **1er** | Solution open source gratuite existante |
| **2ème** | Template/composant payant (si raisonnable) |
| **3ème** | Développement custom (dernier recours) |

---

## Décisions Architecturales

### 1. Multi-tenant avec Configuration

**Décision :** Un seul code source + table de configuration par client

**Avantages :**
- Une mise à jour = tous les clients mis à jour
- Pas de maintenance de branches multiples
- Personnalisation via config, pas via code

### 2. Notifications Configurables

**Décision :** L'utilisateur configure ses préférences de notifications

**Évite :** La pollution sonore Chat + Validation Hub + Système

### 3. Documents Unifiés avec Tags

**Décision :** Un seul module Documents avec système de tags

**Remplace :** Modules séparés Documents + Homework

### 4. Visio Open Source Intégrée

**Décision :** OpenVidu self-hosted

**Évite :** Coûts récurrents Daily.co / liens externes type Zoom

### 5. Facturation via Pennylane (mise a jour 11/02/2026)

**Décision :** Intégration Pennylane API v2 (SaaS cloud) — remplace Invoice Ninja

**Raisons du pivot :** Conformité facturation électronique sept. 2026 (native Pennylane), expert-comptable MiKL utilise Pennylane (source de vérité comptable unique), API plus riche (compta, FEC, balance, abonnements).

**Gère :** Devis, factures, abonnements récurrents, avoirs, comptabilité, export FEC. Paiements via Stripe (connecté à Pennylane) + virement IBAN Compte Pro + prélèvement SEPA. Synchronisation par polling Edge Function (cron 5min) — pas de webhooks publics.

### 6. Transcription API à l'Usage

**Décision :** Deepgram API (~$0.63/heure avec diarisation)

**Stratégie :**
- MVP : Deepgram avec 200$ crédit gratuit (~300h de visio gratuites)
- Post-crédit : Deepgram (~10€/mois) ou Whisper (~5€/mois)

**Pour :** TOUTES les visios clients (pas seulement la 1ère)

**Alternatives écartées :**
- OpenVidu STT : Non disponible en version Community (PRO/Enterprise only)
- DeepSeek V3 : Pas de capacité Speech-to-Text native

---

## Solutions Techniques Détaillées

### OpenVidu - Visio (Documentation Complète)

**Site :** https://openvidu.io/
**Version :** 3.5.0+ (Janvier 2026)
**Documentation :** https://openvidu.io/latest/docs/

#### Pourquoi OpenVidu

- Basé sur **LiveKit + mediasoup** (meilleurs stacks WebRTC open source)
- **100% compatible** avec tous les SDKs LiveKit
- Self-hosted **gratuit** (pas de coût par minute)
- **Enregistrement intégré** (Egress API)
- **Transcription intégrée** (Speech Processing Agent)
- Scalable : Single Node → Elastic → High Availability
- Support commercial disponible si besoin

#### Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OPENVIDU SERVER                                   │
│                        (self-hosted sur VPS)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐       │
│   │ DASHBOARD MÈRE  │    │ DASHBOARD       │    │ DASHBOARD       │       │
│   │     (MiKL)      │    │ COACHING        │    │ OUTIL           │       │
│   ├─────────────────┤    ├─────────────────┤    ├─────────────────┤       │
│   │ ✅ Visio        │    │ ✅ Visio        │    │ ✅ Visio        │       │
│   │ ✅ Enregistrement│    │ ❌ Pas d'enreg. │    │ ❌ Pas d'enreg. │       │
│   │ ✅ Transcription │    │ ❌ Pas de transc│    │ ❌ Pas de transc│       │
│   └─────────────────┘    └─────────────────┘    └─────────────────┘       │
│                                                                             │
│   PRINCIPE :                                                                │
│   • Visio : Même SDK pour tous les dashboards                              │
│   • Recording : Egress API appelé SEULEMENT depuis Dashboard Mère          │
│   • Transcription : Agent dispatché SEULEMENT pour les rooms Mère          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Configuration Différenciée par Dashboard

**Le point clé :** OpenVidu permet de contrôler **manuellement** quand activer l'enregistrement et la transcription via les APIs.

##### 1. Enregistrement (Egress API)

L'enregistrement n'est **pas automatique**. Il est déclenché par appel API.

```javascript
// backend/services/visio.service.js

import { EgressClient, EncodedFileOutput } from 'livekit-server-sdk';

const egressClient = new EgressClient(
  process.env.OPENVIDU_URL,
  process.env.OPENVIDU_API_KEY,
  process.env.OPENVIDU_API_SECRET
);

// Démarrer une visio AVEC enregistrement (Dashboard Mère uniquement)
async function startMeetingWithRecording(roomName, clientId) {
  // 1. Créer/rejoindre la room
  const room = await createRoom(roomName);

  // 2. Démarrer l'enregistrement (SEULEMENT pour Dashboard Mère)
  const fileOutput = new EncodedFileOutput({
    filepath: `recordings/${roomName}-{time}.mp4`,
    s3: {
      bucket: process.env.S3_BUCKET,
      accessKey: process.env.S3_ACCESS_KEY,
      secret: process.env.S3_SECRET_KEY,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.AWS_REGION
    }
  });

  const egress = await egressClient.startRoomCompositeEgress(roomName, { file: fileOutput });

  return { room, egressId: egress.egressId };
}

// Démarrer une visio SANS enregistrement (Dashboard Coaching/Outil)
async function startMeetingSimple(roomName) {
  return await createRoom(roomName);
}

// Arrêter l'enregistrement
async function stopRecording(egressId) {
  return await egressClient.stopEgress(egressId);
}
```

**Endpoints API :**
```
POST /recordings/start    → Démarrer enregistrement (+ roomName)
POST /recordings/stop     → Arrêter enregistrement (+ roomName)
GET  /recordings          → Lister enregistrements (?roomId=xxx)
GET  /recordings/:name    → Récupérer un enregistrement
DELETE /recordings/:name  → Supprimer un enregistrement
```

##### 2. Transcription (Agent Dispatch API)

La transcription utilise le **Speech Processing Agent** en mode **manual**.

**Configuration `agent-speech-processing.yaml` :**
```yaml
# Fichier de configuration de l'agent de transcription
enabled: true

speech_to_text:
  # Mode MANUAL = l'agent ne se connecte pas automatiquement
  processing: manual

  # Provider MVP : Vosk (gratuit, local)
  provider: vosk
  language: fr

  # Provider Production : Deepgram (payant, meilleure qualité)
  # provider: deepgram
  # api_key: ${DEEPGRAM_API_KEY}
  # language: fr
  # model: nova-2
  # punctuate: true
  # diarize: true  # Identifie qui parle
```

**Dispatching manuel de l'agent (côté backend) :**
```javascript
// backend/services/transcription.service.js

import { AgentDispatchClient } from 'livekit-server-sdk';

const agentDispatchClient = new AgentDispatchClient(
  process.env.OPENVIDU_URL,
  process.env.OPENVIDU_API_KEY,
  process.env.OPENVIDU_API_SECRET
);

// Dispatcher l'agent de transcription vers une room spécifique
// Appelé UNIQUEMENT depuis Dashboard Mère
async function startTranscription(roomName) {
  const dispatch = await agentDispatchClient.createDispatch(
    roomName,           // La room cible
    'speech-processing' // Nom de l'agent (doit matcher le fichier yaml)
  );

  return dispatch;
}
```

**Code complet côté backend :**
```javascript
// backend/api/meetings.js

// Route pour Dashboard Mère (avec recording + transcription)
app.post('/api/meetings/start-full', authenticateMikl, async (req, res) => {
  const { roomName, clientId } = req.body;

  // 1. Créer la room
  const room = await visioService.createRoom(roomName);

  // 2. Démarrer l'enregistrement
  const egress = await visioService.startRecording(roomName);

  // 3. Dispatcher l'agent de transcription
  const transcription = await transcriptionService.startTranscription(roomName);

  // 4. Sauvegarder les métadonnées en DB
  await db.meetings.create({
    roomName,
    clientId,
    egressId: egress.egressId,
    transcriptionDispatchId: transcription.id,
    startedAt: new Date(),
    dashboardType: 'mere'
  });

  res.json({ room, token: generateToken(roomName, 'mikl') });
});

// Route pour Dashboard Coaching/Outil (visio simple)
app.post('/api/meetings/start-simple', authenticateClient, async (req, res) => {
  const { roomName } = req.body;

  // Juste créer/rejoindre la room, pas d'enregistrement ni transcription
  const room = await visioService.createRoom(roomName);

  res.json({ room, token: generateToken(roomName, req.user.id) });
});
```

#### Providers de Transcription Supportés

OpenVidu supporte **18 providers** de Speech-to-Text :

| Provider | Type | Coût | Qualité | Recommandation |
|----------|------|------|---------|----------------|
| **Vosk** | Local/Open Source | Gratuit | Correcte | Dev/Test |
| **Deepgram** | Cloud API | ~$0.63/h (avec diarisation) | Excellente | **Production (200$ crédit)** |
| **OpenAI Whisper** | Cloud API | ~$0.36/h | Excellente | Alternative économique |
| **AssemblyAI** | Cloud API | ~$0.15/h | Très bonne | Budget serré |
| AWS Transcribe | Cloud API | ~$1.44/h | Bonne | Si déjà sur AWS |
| Google Cloud STT | Cloud API | ~$0.96/h | Bonne | Si déjà sur GCP |
| Azure Speech | Cloud API | Variable | Bonne | Si déjà sur Azure |
| + 11 autres... | | | | |

#### Stratégie de Transcription Progressive (Mise à jour 05/02/2026)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 : Lancement (Gratuit)                                              │
│  Provider: Deepgram API                                                     │
│  Coût: 0€ (200$ de crédit gratuit = ~300h de visio)                        │
│  Qualité: Excellente (speaker diarization, ponctuation)                     │
│  Durée estimée: ~20 mois à 15h/mois                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 2 : Post-crédit                                                      │
│  Option A: Rester sur Deepgram (~$0.63/h = ~$10/mois pour 15h)             │
│  Option B: Migrer vers Whisper (~$0.36/h = ~$5/mois) si pas besoin diarize │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Note :** Vosk (local/gratuit) réservé pour environnement de dev/test uniquement.

#### Workflow de Fallback (si agent instable)

Si l'agent OpenVidu de transcription pose problème, workflow **post-visio** :

```
VISIO TERMINÉE
      │
      ▼
Fichier MP4 enregistré (Supabase Storage)
      │
      ▼
Webhook OpenVidu déclenche Edge Function Supabase
      │
      ▼
Edge Function extrait l'audio et appelle Deepgram API
      │
      ▼
Transcription sauvegardée dans DB (table: meeting_transcripts)
      │
      ▼
Notification "Transcription prête" → Dashboard Mère
      │
      ▼
(Optionnel) Claude génère résumé + actions
```

**Code Edge Function Supabase :**
```javascript
// supabase/functions/process-recording/index.ts

import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  const { recordingUrl, meetingId } = await req.json();

  // 1. Télécharger l'audio depuis le recording
  const audioResponse = await fetch(recordingUrl);
  const audioBuffer = await audioResponse.arrayBuffer();

  // 2. Envoyer à Deepgram pour transcription
  const transcriptResponse = await fetch('https://api.deepgram.com/v1/listen', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${Deno.env.get('DEEPGRAM_API_KEY')}`,
      'Content-Type': 'audio/mp4'
    },
    body: audioBuffer
  });

  const { results } = await transcriptResponse.json();
  const transcript = results.channels[0].alternatives[0].transcript;

  // 3. Sauvegarder en DB
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_KEY')!
  );

  await supabase.from('meeting_transcripts').insert({
    meeting_id: meetingId,
    transcript,
    processed_at: new Date().toISOString()
  });

  // 4. Notifier
  await supabase.from('notifications').insert({
    user_id: 'mikl',
    type: 'transcription_ready',
    meeting_id: meetingId
  });

  return new Response(JSON.stringify({ success: true }));
});
```

#### Configuration Serveur OpenVidu

**Variables d'environnement `.env` :**
```bash
# OpenVidu Server
OPENVIDU_URL=https://openvidu.foxeo.io
OPENVIDU_API_KEY=your-api-key
OPENVIDU_API_SECRET=your-api-secret

# Stockage S3 (Supabase Storage compatible)
S3_ENDPOINT=https://xxx.supabase.co/storage/v1/s3
S3_ACCESS_KEY=your-supabase-access-key
S3_SECRET_KEY=your-supabase-secret-key
S3_BUCKET=visio-recordings
AWS_REGION=eu-west-1
RECORDINGS_PATH=recordings/

# Transcription (pour fallback ou agent)
DEEPGRAM_API_KEY=your-deepgram-key
```

**Docker Compose (déploiement local/dev) :**
```yaml
# docker-compose.openvidu.yml
version: '3.8'

services:
  openvidu:
    image: openvidu/openvidu-dev:3.5.0
    ports:
      - "4443:4443"
      - "7880:7880"
    environment:
      - OPENVIDU_SECRET=${OPENVIDU_API_SECRET}
      - OPENVIDU_RECORDING=true
      - OPENVIDU_RECORDING_PATH=/recordings
    volumes:
      - ./recordings:/recordings
      - ./agent-speech-processing.yaml:/opt/openvidu/config/agent-speech-processing.yaml
```

#### Ressources et Documentation

| Ressource | URL |
|-----------|-----|
| Documentation principale | https://openvidu.io/latest/docs/ |
| Agent Dispatch API | https://openvidu.io/latest/docs/ai/openvidu-agents/agent-dispatch/ |
| Speech Processing Agent | https://openvidu.io/3.3.0/docs/ai/openvidu-agents/speech-processing-agent/ |
| Recording Tutorial | https://openvidu.io/3.3.0/docs/tutorials/advanced-features/recording-basic-s3/ |
| Custom Agents | https://openvidu.io/latest/docs/ai/custom-agents/ |
| GitHub OpenVidu | https://github.com/OpenVidu/openvidu |
| GitHub Agents | https://github.com/OpenVidu/openvidu-agents |

#### Statut des Fonctionnalités IA

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Speech-to-Text (Vosk) | ✅ Stable | Open source, local, gratuit |
| Speech-to-Text (Cloud APIs) | ✅ Stable | Deepgram, OpenAI, etc. |
| Live Captions | ✅ Stable | Sous-titres temps réel |
| Recording (Egress) | ✅ Stable | MP4, S3, Azure |
| Translation | 🔄 En développement | Utiliser DeepL/GPT en post-process |
| Voice AI Agents | 🔄 En développement | Custom agents disponibles |

**Note importante :** Certains services IA OpenVidu sont encore en développement actif. La stratégie recommandée est d'utiliser les fonctionnalités stables (recording, STT basique) et de prévoir un workflow de fallback (transcription post-visio) pour la production initiale.

---

### Transcription Audio — Analyse Comparative (Mise à jour 05/02/2026)

**Contexte :** TOUTES les visios clients (pas seulement la 1ère) seront enregistrées et transcrites.

#### Comparatif des Solutions

| Solution | Prix/heure | Diarisation | Qualité FR | Recommandation |
|----------|------------|-------------|------------|----------------|
| **Deepgram** | ~0,63€ (avec diarisation) | ✅ Oui | ⭐⭐⭐⭐ | **MVP (crédit gratuit)** |
| **Whisper API** (OpenAI) | ~0,36€ | ❌ Non native | ⭐⭐⭐⭐ | Alternative économique |
| **OpenVidu STT** | PRO/Enterprise only | Variable | Variable | ❌ Non disponible en Community |
| **DeepSeek V3** | N/A | N/A | N/A | ❌ Pas de STT natif |

#### Deepgram — Solution Retenue

**Site :** https://deepgram.com/

**Pourquoi Deepgram :**
- Ultra rapide (1h audio → 20 secondes)
- **Speaker diarization inclus** (identifie qui parle)
- **200$ de crédit gratuit** (~300 heures de transcription)
- Volume discounts automatiques
- API simple
- Excellente qualité en français

**Tarification détaillée (2025-2026) :**

| Fonctionnalité | Prix/minute | Prix/heure |
|----------------|-------------|------------|
| Nova-2 (base) | $0.0092 | ~$0.55 |
| + Diarisation | $0.0013 | ~$0.08 |
| **Total avec diarisation** | **$0.0105** | **~$0.63** |

**Estimation coûts mensuels (20 visios × 45min = 15h) :**

| Phase | Coût |
|-------|------|
| Lancement (crédit 200$) | **0€** |
| Post-crédit | ~9,45€/mois |

**Stratégie progressive :**
1. **Phase 1** : Deepgram avec crédit gratuit (200$ = ~300h)
2. **Phase 2** : Rester sur Deepgram (~10€/mois) OU migrer vers Whisper (~5€/mois) si diarisation non nécessaire

**Intégration :**
```javascript
// Exemple d'appel API Deepgram avec diarisation
const response = await fetch('https://api.deepgram.com/v1/listen?diarize=true&language=fr&punctuate=true', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${DEEPGRAM_API_KEY}`,
    'Content-Type': 'audio/wav'
  },
  body: audioBuffer
});

const { results } = await response.json();
const transcript = results.channels[0].alternatives[0].transcript;
// Avec diarisation : results.channels[0].alternatives[0].words contient speaker_id
```

**Ressources :**
- Documentation : https://developers.deepgram.com/
- Pricing : https://deepgram.com/pricing

#### Whisper API — Alternative

**Site :** https://platform.openai.com/docs/guides/speech-to-text

**Prix :** $0.006/minute (~$0.36/heure)

**Avantages :**
- Prix plus bas que Deepgram
- Excellente qualité en français

**Inconvénients :**
- Pas de diarisation native (nécessite post-processing)

**Quand migrer vers Whisper :**
- Si le crédit Deepgram s'épuise ET que la diarisation n'est pas critique

---

### ~~Invoice Ninja~~ → Pennylane - Facturation (Mis a jour 11/02/2026)

> **PIVOT** : Invoice Ninja (self-hosted Docker) a ete remplace par Pennylane API v2 (SaaS cloud) le 11/02/2026.
> Raisons : conformite facturation electronique sept. 2026, expert-comptable MiKL sur Pennylane, API plus riche.
> La documentation Invoice Ninja ci-dessous est conservee a titre historique mais n'est plus applicable.

**Site :** https://www.pennylane.com/
**API :** https://pennylane.readme.io/docs/api-overview
**Version :** API v2 (recommandee, v1 deprecee)
**GitHub :** https://github.com/invoiceninja/invoiceninja
**Documentation API :** https://api-docs.invoicing.co/

#### Pourquoi Invoice Ninja

- **Open source**, self-hosted **gratuit**
- **API-first** : toutes les fonctionnalités accessibles via API REST
- **40+ gateways de paiement** (Stripe, PayPal, virement, chèque...)
- **Stripe Connect OAuth** intégré nativement
- Gestion **multi-devises** et **multi-entreprises**
- **Factures récurrentes** (abonnements)
- **Relances automatiques** avant/après échéance
- **App mobile** iOS/Android (Flutter)
- **Portail client** pour que les clients voient/paient leurs factures

#### Couverture des Besoins Foxeo

| Besoin Foxeo | Invoice Ninja | Endpoint API |
|--------------|---------------|--------------|
| Créer des devis | ✅ OUI | `POST /api/v1/quotes` |
| Créer des factures | ✅ OUI | `POST /api/v1/invoices` |
| Factures récurrentes | ✅ OUI | `POST /api/v1/recurring_invoices` |
| Gérer les clients | ✅ OUI | `POST /api/v1/clients` |
| Enregistrer les paiements | ✅ OUI | `POST /api/v1/payments` |
| Paiements Stripe | ✅ OUI | Stripe Connect OAuth |
| Paiements manuels | ✅ OUI | Marquage via API |
| Webhooks | ✅ OUI | Événements Stripe + internes |
| PDF des factures | ✅ OUI | `GET /api/v1/download/{id}` |
| Envoi email | ✅ OUI | `POST /api/v1/email_invoice` |
| Multi-devises | ✅ OUI | Support natif |
| Produits/Services | ✅ OUI | `POST /api/v1/products` |
| Dépenses | ✅ OUI | `POST /api/v1/expenses` |

#### Endpoints API Disponibles

```
BASE URL: /api/v1

┌─────────────────────────────────────────────────────────────────────────────┐
│  RESSOURCE              │  ENDPOINT                    │  MÉTHODES          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Clients                │  /api/v1/clients             │  GET, POST, PUT    │
│  Factures               │  /api/v1/invoices            │  GET, POST, PUT    │
│  Devis                  │  /api/v1/quotes              │  GET, POST, PUT    │
│  Factures récurrentes   │  /api/v1/recurring_invoices  │  GET, POST, PUT    │
│  Paiements              │  /api/v1/payments            │  GET, POST, PUT    │
│  Produits               │  /api/v1/products            │  GET, POST, PUT    │
│  Dépenses               │  /api/v1/expenses            │  GET, POST, PUT    │
│  Crédits                │  /api/v1/credits             │  GET, POST, PUT    │
│  Tâches                 │  /api/v1/tasks               │  GET, POST, PUT    │
│  Fournisseurs           │  /api/v1/vendors             │  GET, POST, PUT    │
│  Télécharger PDF        │  /api/v1/download/{id}       │  GET               │
│  Envoyer par email      │  /api/v1/email_invoice       │  POST              │
│  Upload documents       │  /api/v1/invoices/{id}/upload│  POST              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Opérations disponibles :**

| Opération | Méthode | Exemple |
|-----------|---------|---------|
| Lister | GET | `GET /api/v1/clients` |
| Lire un seul | GET | `GET /api/v1/invoices/1` |
| Créer | POST | `POST /api/v1/clients` |
| Modifier | PUT | `PUT /api/v1/clients/1` |
| Archiver | PUT | `PUT /api/v1/invoices/1?action=archive` |
| Supprimer | PUT | `PUT /api/v1/invoices/1?action=delete` |
| Restaurer | PUT | `PUT /api/v1/invoices/1?action=restore` |
| Convertir devis→facture | PUT | `PUT /api/v1/quotes/1?action=convert` |

#### Intégration Stripe

**Configuration :**
- Stripe Connect via **OAuth** (sécurisé, pas de clés API manuelles)
- Paramètres > Paramètres de paiement > Stripe Connect

**Webhooks Stripe supportés :**

| Événement | Usage |
|-----------|-------|
| `charge.succeeded` | Paiement réussi |
| `charge.failed` | Paiement échoué |
| `payment_intent.succeeded` | Intent de paiement réussi |
| `payment_intent.failed` | Intent de paiement échoué |
| `payment_intent.processing` | Paiement en cours |
| `payment_intent.partially_funded` | Paiement partiel |
| `customer.source.updated` | Mise à jour source client |
| `source.chargeable` | Source facturable |

**Auto-healing :** Les webhooks permettent de "réparer" automatiquement les transactions incomplètes si un client quitte avant la fin.

#### Gestion des Paiements Manuels (Virement, Chèque, Espèces)

```
CLIENT PAIE PAR VIREMENT
        │
        ▼
Réception sur compte bancaire
        │
        ▼
Appel API pour enregistrer le paiement
POST /api/v1/payments
        │
        ▼
Facture marquée "Payée" ✅
        │
        ▼
Webhook notifie Foxeo
```

**Code pour enregistrer un paiement manuel :**

```javascript
// backend/services/billing.service.js

async function recordManualPayment(invoiceId, amount, reference, type = 'bank_transfer') {
  const typeIds = {
    'bank_transfer': '1',
    'cash': '2',
    'check': '3',
    'credit': '4'
  };

  const response = await fetch(`${INVOICE_NINJA_URL}/api/v1/payments`, {
    method: 'POST',
    headers: {
      'X-API-TOKEN': INVOICE_NINJA_TOKEN,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: await getClientIdFromInvoice(invoiceId),
      invoices: [{ invoice_id: invoiceId, amount: amount }],
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      type_id: typeIds[type],
      transaction_reference: reference,
      private_notes: `Paiement ${type} enregistré le ${new Date().toLocaleDateString('fr-FR')}`
    })
  });

  return response.json();
}
```

#### Architecture d'Intégration Foxeo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FOXEO-ONE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   DASHBOARD MÈRE (MiKL)                                                     │
│   ├── UI Facturation Custom (React)                                         │
│   │   ├── Liste devis/factures                                             │
│   │   ├── Création devis → Conversion en facture                           │
│   │   ├── Suivi paiements (Stripe + manuels)                               │
│   │   ├── Relances automatiques                                            │
│   │   └── Rapports CA                                                      │
│   │                                                                         │
│   └── API Foxeo Backend (proxy vers Invoice Ninja)                         │
│       ├── POST /api/billing/quotes      → IN /api/v1/quotes                │
│       ├── POST /api/billing/invoices    → IN /api/v1/invoices              │
│       ├── POST /api/billing/payments    → IN /api/v1/payments              │
│       ├── GET  /api/billing/download/:id → IN /api/v1/download/:id         │
│       └── Webhooks listener             ← Invoice Ninja webhooks           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   DASHBOARD COACHING/OUTIL (Clients)                                        │
│   └── Vue "Mes Factures" (lecture seule)                                   │
│       ├── Liste factures du client                                         │
│       ├── Télécharger PDF                                                  │
│       ├── Statut paiement                                                  │
│       └── Lien de paiement Stripe (si impayé)                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   INVOICE NINJA (Backend - Docker)                                          │
│   ├── Base de données facturation                                          │
│   ├── Génération PDF                                                       │
│   ├── Stripe Connect OAuth                                                 │
│   ├── Envoi emails automatiques                                            │
│   ├── Relances programmées                                                 │
│   └── Webhooks → Foxeo                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Exemples de Code d'Intégration

**1. Créer un devis :**

```javascript
// backend/services/billing.service.js

const INVOICE_NINJA_URL = process.env.INVOICE_NINJA_URL;
const INVOICE_NINJA_TOKEN = process.env.INVOICE_NINJA_TOKEN;

const headers = {
  'X-API-TOKEN': INVOICE_NINJA_TOKEN,
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json'
};

async function createQuote(clientId, items, terms = "Devis valable 30 jours") {
  const response = await fetch(`${INVOICE_NINJA_URL}/api/v1/quotes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      client_id: clientId,
      line_items: items.map(item => ({
        product_key: item.name,
        notes: item.description,
        quantity: item.quantity,
        cost: item.price
      })),
      terms: terms,
      footer: "Merci pour votre confiance - MiKL / Foxeo",
      public_notes: "Ce devis est généré automatiquement depuis Foxeo-One"
    })
  });

  return response.json();
}
```

**2. Convertir un devis en facture :**

```javascript
async function convertQuoteToInvoice(quoteId) {
  const response = await fetch(
    `${INVOICE_NINJA_URL}/api/v1/quotes/${quoteId}?action=convert`,
    { method: 'PUT', headers }
  );

  return response.json();
}
```

**3. Envoyer une facture par email :**

```javascript
async function emailInvoice(invoiceId) {
  const response = await fetch(`${INVOICE_NINJA_URL}/api/v1/email_invoice`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      entity: 'invoice',
      entity_id: invoiceId,
      template: 'email_template_invoice'
    })
  });

  return response.json();
}
```

**4. Récupérer les factures d'un client :**

```javascript
async function getClientInvoices(clientId) {
  const response = await fetch(
    `${INVOICE_NINJA_URL}/api/v1/invoices?client_id=${clientId}&include=payments`,
    { method: 'GET', headers }
  );

  return response.json();
}
```

**5. Télécharger le PDF d'une facture :**

```javascript
async function downloadInvoicePdf(invoiceId) {
  const response = await fetch(
    `${INVOICE_NINJA_URL}/api/v1/download/${invoiceId}`,
    { method: 'GET', headers }
  );

  return response.blob(); // Retourne le PDF
}
```

**6. Webhook listener :**

```javascript
// backend/api/webhooks/invoice-ninja.js

app.post('/webhooks/invoice-ninja', async (req, res) => {
  const event = req.body;

  switch (event.event_type) {
    case 'payment.created':
      // Notifier MiKL d'un nouveau paiement
      await notificationService.send('mikl', {
        type: 'payment_received',
        title: 'Paiement reçu',
        message: `${event.data.client.name} a payé ${event.data.amount}€`,
        data: event.data
      });

      // Mettre à jour le statut dans Foxeo
      await projectService.updatePaymentStatus(
        event.data.invoice_id,
        'paid'
      );
      break;

    case 'invoice.sent':
      // Logger l'envoi
      await activityService.log('invoice_sent', event.data);
      break;

    case 'quote.approved':
      // Notification + conversion auto en facture si configuré
      await handleQuoteApproved(event.data);
      break;

    case 'invoice.late':
      // Créer une alerte de relance
      await alertService.createOverdueAlert(event.data);
      break;
  }

  res.status(200).send('OK');
});
```

#### Configuration Docker

```yaml
# docker-compose.invoice-ninja.yml
version: '3.8'

services:
  invoice-ninja:
    image: invoiceninja/invoiceninja:5
    ports:
      - "8080:80"
    environment:
      - APP_URL=https://billing.foxeo.io
      - APP_KEY=${INVOICE_NINJA_APP_KEY}
      - DB_HOST=db
      - DB_DATABASE=ninja
      - DB_USERNAME=ninja
      - DB_PASSWORD=${DB_PASSWORD}
      - MAIL_MAILER=smtp
      - MAIL_HOST=${SMTP_HOST}
      - MAIL_PORT=587
      - MAIL_USERNAME=${SMTP_USER}
      - MAIL_PASSWORD=${SMTP_PASS}
    volumes:
      - invoice-ninja-public:/var/www/app/public
      - invoice-ninja-storage:/var/www/app/storage
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=ninja
      - MYSQL_USER=ninja
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - invoice-ninja-db:/var/lib/mysql

volumes:
  invoice-ninja-public:
  invoice-ninja-storage:
  invoice-ninja-db:
```

#### Variables d'Environnement

```bash
# Invoice Ninja
INVOICE_NINJA_URL=https://billing.foxeo.io
INVOICE_NINJA_TOKEN=your-api-token
INVOICE_NINJA_APP_KEY=base64:xxxxx

# Base de données
DB_PASSWORD=secure-password
DB_ROOT_PASSWORD=secure-root-password

# Email (pour envoi factures)
SMTP_HOST=smtp.example.com
SMTP_USER=billing@foxeo.io
SMTP_PASS=smtp-password
```

#### Fonctionnalités Bonus Incluses

| Fonctionnalité | Description |
|----------------|-------------|
| **Factures récurrentes** | Abonnements mensuels automatiques (parfait pour les 200-500€/mois) |
| **Rappels automatiques** | Relances avant/après échéance, configurables |
| **Portail client** | Les clients peuvent voir et payer leurs factures |
| **Multi-entreprise** | Si besoin de gérer plusieurs sociétés |
| **Templates PDF** | Personnalisation complète des factures/devis |
| **Rapports** | CA, impayés, projections, exports comptables |
| **App mobile** | iOS/Android pour MiKL (consulter factures en déplacement) |
| **Paiements partiels** | Gestion des acomptes |
| **Crédits** | Avoirs et remboursements |

#### Ressources et Documentation

| Ressource | URL |
|-----------|-----|
| Documentation principale | https://invoiceninja.github.io/ |
| API Reference | https://api-docs.invoicing.co/ |
| Swagger API v5 | https://app.swaggerhub.com/apis/invoiceninja/invoiceninja |
| Guide Stripe | https://invoiceninja.github.io/en/hosted-stripe/ |
| GitHub | https://github.com/invoiceninja/invoiceninja |
| Forum Support | https://forum.invoiceninja.com/ |

---

### Supabase - Backend

**Site :** https://supabase.com/

**Services utilisés :**

| Service | Usage |
|---------|-------|
| **Database** | PostgreSQL pour toutes les données |
| **Auth** | Authentification utilisateurs |
| **Storage** | Fichiers, documents, enregistrements visio |
| **Realtime** | Chat en temps réel |
| **Edge Functions** | Webhooks, triggers |

**Tarification :**
- Gratuit jusqu'à 500MB database, 1GB storage
- Pro : $25/mois (8GB database, 100GB storage)

**Ressources :**
- Documentation : https://supabase.com/docs
- GitHub : https://github.com/supabase/supabase

---

### Cal.com - Prise de Rendez-vous (Ajout 05/02/2026)

**Site :** https://cal.com/
**Version :** v4.x (Self-hosted)
**GitHub :** https://github.com/calcom/cal.com

#### Pourquoi Cal.com

- **Open source**, self-hosted **gratuit**
- Équivalent de Calendly
- Synchro bidirectionnelle Google Calendar
- Formulaires personnalisables à la réservation
- **Lien de visio custom** (notre lien Foxeo/OpenVidu au lieu de Meet/Zoom)
- API complète pour création de RDV depuis mobile
- Webhooks pour intégration avec Foxeo

#### Fonctionnalités Utilisées

| Fonctionnalité | Usage Foxeo |
|----------------|-------------|
| **Event Types** | Type "Visio Découverte" (1h) |
| **Booking Form** | Collecte Prénom, Nom, Email, Société |
| **Custom Video Link** | Lien vers `visio.foxeo.io/rdv/{room-id}` |
| **Webhooks** | Notification Foxeo à chaque réservation |
| **Google Calendar Sync** | Synchro bidirectionnelle agenda MiKL |
| **API** | Création RDV depuis Hub mobile |

#### Webhook Cal.com → Foxeo

```javascript
// POST /api/webhooks/calcom
{
  "triggerEvent": "BOOKING_CREATED",
  "payload": {
    "bookingId": 123,
    "eventTypeId": 1,
    "startTime": "2026-02-10T10:00:00Z",
    "endTime": "2026-02-10T11:00:00Z",
    "attendees": [{
      "email": "thomas@example.com",
      "name": "Thomas Martin",
      "timeZone": "Europe/Paris"
    }],
    "responses": {
      "prenom": "Thomas",
      "nom": "Martin",
      "societe": "ABC Coaching"
    }
  }
}
```

**Actions déclenchées par le webhook :**
1. Création fiche prospect dans Supabase
2. Création room OpenVidu unique
3. Génération lien visio personnalisé
4. Mise à jour Cal.com avec le lien visio

#### Configuration Docker

```yaml
# docker-compose.calcom.yml
version: '3.8'

services:
  calcom:
    image: calcom/cal.com:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - NEXTAUTH_SECRET=${CALCOM_SECRET}
      - CALENDSO_ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - NEXT_PUBLIC_WEBAPP_URL=https://rdv.foxeo.io
    volumes:
      - calcom-data:/app/data
    depends_on:
      - db

volumes:
  calcom-data:
```

#### Ressources

| Ressource | URL |
|-----------|-----|
| Documentation | https://cal.com/docs |
| Self-hosting Guide | https://cal.com/docs/self-hosting |
| API Reference | https://cal.com/docs/api-reference |
| GitHub | https://github.com/calcom/cal.com |

---

### API INSEE - Auto-completion Entreprise (Ajout 05/02/2026)

**Site :** https://api.insee.fr/
**Coût :** Gratuit (API publique)

#### Usage dans Foxeo

Lors du formulaire pré-visio, le client saisit son SIRET. L'API INSEE retourne automatiquement :

| Donnée | Champ API |
|--------|-----------|
| Raison sociale | `uniteLegale.denominationUniteLegale` |
| Adresse | `adresseEtablissement.*` |
| Code NAF | `uniteLegale.activitePrincipaleUniteLegale` |
| Libellé NAF | (lookup local) |
| Date création | `uniteLegale.dateCreationUniteLegale` |
| Effectifs | `uniteLegale.trancheEffectifsUniteLegale` |

#### Exemple d'Appel

```javascript
// GET https://api.insee.fr/entreprises/sirene/V3/siret/{siret}
const response = await fetch(
  `https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`,
  {
    headers: {
      'Authorization': `Bearer ${INSEE_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const data = await response.json();
const etablissement = data.etablissement;

return {
  raisonSociale: etablissement.uniteLegale.denominationUniteLegale,
  adresse: formatAdresse(etablissement.adresseEtablissement),
  codeNaf: etablissement.uniteLegale.activitePrincipaleUniteLegale,
  dateCreation: etablissement.uniteLegale.dateCreationUniteLegale
};
```

#### Temps de Réponse

~200ms en moyenne

---

## Annexes

### Sources des Recherches

**Visio Open Source :**
- https://openvidu.io/
- https://jitsi.org/
- https://livekit.io/
- https://bloggeek.me/webrtc-open-source-media-servers-github-2024/

**Facturation Open Source :**
- https://github.com/invoiceninja/invoiceninja
- https://craterapp.com/
- https://solidinvoice.co/

**Transcription API :**
- https://deepgram.com/pricing
- https://www.assemblyai.com/
- https://brasstranscripts.com/blog/openai-whisper-api-pricing-2025-self-hosted-vs-managed

---

## Historique des Décisions

| Date | Décision | Contexte |
|------|----------|----------|
| 23/01/2026 | Architecture 3 dashboards | Brainstorming initial |
| 23/01/2026 | Agent Élio (renardeau/adulte) | Brainstorming + validation Gemini |
| 23/01/2026 | Validation Hub workflow | Brainstorming + validation Gemini |
| 25/01/2026 | Agent Élio Hub pour Dashboard Hub | Session modules |
| 25/01/2026 | Multi-tenant architecture | Validation Gemini |
| 25/01/2026 | OpenVidu pour visio | Recherche technique |
| 25/01/2026 | Deepgram pour transcription | Recherche technique |
| 25/01/2026 | Invoice Ninja pour facturation | Recherche technique |
| 25/01/2026 | Supabase comme backend | Validation Gemini |
| 25/01/2026 | Documents unifiés avec tags | Validation Gemini |
| 25/01/2026 | OpenVidu config différenciée par dashboard | Analyse doc OpenVidu |
| 25/01/2026 | Agent Dispatch API pour transcription manuelle | Analyse doc OpenVidu |
| 25/01/2026 | Egress API pour recording Dashboard Mère only | Analyse doc OpenVidu |
| 25/01/2026 | Stratégie transcription : Vosk MVP → Deepgram Prod | Analyse doc OpenVidu |
| 25/01/2026 | Workflow fallback transcription post-visio | Anticipation stabilité agents |
| 25/01/2026 | Invoice Ninja API v5 validée pour facturation | Analyse doc API Invoice Ninja |
| 25/01/2026 | Stripe Connect OAuth via Invoice Ninja | Analyse doc API Invoice Ninja |
| 25/01/2026 | Paiements manuels via API /payments | Analyse doc API Invoice Ninja |
| 25/01/2026 | Webhooks Invoice Ninja → Foxeo | Analyse doc API Invoice Ninja |
| 25/01/2026 | **Nomenclature officielle** : Foxeo-Hub / Foxeo-Lab / Foxeo-One | Party Mode Session |
| 25/01/2026 | **Couleurs dashboards** : Hub=#6B1B1B, Lab=#2E8B57, One=#F7931E | Party Mode Session |
| 25/01/2026 | **Élio Hub** = agent MiKL pour Dashboard Hub | Party Mode Session |
| 04/02/2026 | **CORRECTION** : Orpheus = BMAD/Cursor uniquement, pas Foxeo | Session wireframes |
| 25/01/2026 | **Élio** = 2 configs (Lab: guide création LLM / One: support+évolutions) | Party Mode Session |
| 25/01/2026 | **Migration Lab→One** : Lab accessible depuis One, Élio Lab désactivable | Party Mode Session |
| 25/01/2026 | **Design stack** : shadcn/ui + 21st.dev (payants validés au cas par cas) | Party Mode Session |
| 25/01/2026 | **Template V1** : unique + couleur distinctive par dashboard | Party Mode Session |
| 25/01/2026 | **Stockage serveur** : décision en attente (consultation ami dev) | Party Mode Session |
| 05/02/2026 | **Cal.com** pour prise de RDV (self-hosted) | Party Mode Architecture |
| 05/02/2026 | **API INSEE** pour auto-complete SIRET → infos entreprise | Party Mode Architecture |
| 05/02/2026 | **Flux onboarding client** : QR/LinkedIn/Site → Cal.com → Pré-visio → Visio → Post-visio Hub | Party Mode Architecture |
| 05/02/2026 | **4 statuts prospects** : Chaud/Tiède/Froid/Non avec emails et relances adaptés | Party Mode Architecture |
| 05/02/2026 | **Salle d'attente pré-visio** : formulaire obligatoire (tel, SIRET ou ville) | Party Mode Architecture |
| 05/02/2026 | **Agents IA** : DeepSeek V3.2 (Élio) + Claude (Orpheus) | Party Mode Architecture |
| 05/02/2026 | **Transcription** : Deepgram retenu (~0.63€/h avec diarisation, 200$ crédit gratuit) | Analyse comparative transcription |
| 05/02/2026 | **OpenVidu STT** : Non disponible en Community (PRO/Enterprise only) | Analyse comparative transcription |
| 05/02/2026 | **DeepSeek STT** : Non supporté (pas de Speech-to-Text natif) | Analyse comparative transcription |
| 05/02/2026 | **Whisper API** : Alternative économique (~0.36€/h) si diarisation non nécessaire | Analyse comparative transcription |
| 05/02/2026 | **Toutes visios transcrites** : Pas seulement 1ère visio, TOUTES les visios clients | Analyse comparative transcription |

---

*Document généré le 25 Janvier 2026*
*Dernière mise à jour : 05 Février 2026 (Analyse Transcription)*
*Sessions : Définition modules + Stack technique + Analyse OpenVidu + Analyse Invoice Ninja API + Party Mode + Party Mode Architecture + Analyse Transcription*
