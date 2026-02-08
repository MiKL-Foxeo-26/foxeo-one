---
stepsCompleted: [1, 2, 3, "party-mode", "party-mode-2", "visual-design-session"]
inputDocuments:
  - "_bmad-output/analysis/foxeo-one-brainstorming-complet-final.md"
  - "_bmad-output/analysis/brainstorming-session-2026-01-23.md"
  - "_bmad-output/analysis/foxeo-one-resume-complet.md"
  - "docs/project-overview.md"
  - "docs/architecture.md"
  - "docs/source-tree-analysis.md"
  - "docs/component-inventory.md"
  - "documentation autre projet BMAD/charte-graphique-foxeo-2026-01-15.md"
partyModeSession: "2026-01-25"
---

# UX Design Specification - Foxeo

**Author:** MiKL
**Date:** 2026-01-24
**Dernière mise à jour:** 2026-02-08 (Alignement architecture instance-per-client, nomenclature, palette Minimal Futuriste)

---

## Executive Summary

### Project Vision

Foxeo est un écosystème de dashboards qui accompagne les entrepreneurs de l'idée au business opérationnel, via le modèle "Centaure" (IA + Humain) :
- **Élio** : Agent IA disponible 24/7 pour structurer et stimuler
- **MiKL** : Expertise humaine pour les validations stratégiques

Le client ne voit jamais "BMAD" — pour lui, c'est Élio qui l'accompagne.

### Ecosystem Architecture - Nomenclature Officielle

| Dashboard | Utilisateur | Fonction | Agent IA | Ambiance couleur |
|-----------|-------------|----------|----------|------------------|
| **FOXEO-HUB** | MiKL | Cockpit central, gestion clients, visio | **Élio Hub** | Bleu nuit + cuivre (Dark) |
| **FOXEO-LAB** | Client en création | Incubation, accompagnement, Validation Hub | **Élio Lab** (LLM) | Terracotta/Corail (Light) |
| **FOXEO-ONE** | Client établi | Outil métier personnalisé avec modules | **Élio One** | Orange vif + bleu-gris (Light) |

> **Note Orpheus (04/02/2026)** : Orpheus est l'agent BMAD dans Cursor, pas dans Foxeo. Il travaille avec MiKL pour générer des documents sources (estimations, docs techniques, livrables) qui alimentent ensuite les Élio.

> **Note nomenclature (25/01/2026)** : Les noms ont été finalisés lors de la session Party Mode. L'ancien "Foxeo-One" (cockpit MiKL) devient "Foxeo-Hub", et "Foxeo-Outil" devient "Foxeo-One".

> **Note architecturale (08/02/2026)** : Foxeo One utilise un modèle instance-per-client : chaque client One reçoit sa propre instance dédiée (Vercel + Supabase). Le Lab reste multi-tenant. Le client One est propriétaire de son code et de ses données.

### Target Users

**Profil principal :**
- Entrepreneurs (création ou établis)
- Niveaux tech variés, incluant novices
- Peu familiers avec l'IA — Élio doit rassurer
- Engagés si accompagnés par Élio

**Verticales cibles :** Coachs, consultants, agences boutique, architectes

### Key Design Challenges

1. **Accessibilité universelle** - Interface grand public, sans jargon
2. **Démystifier l'IA** - Élio = personnage rassurant
3. **Centralisation** - Hub unique, intégrations API/MCP/Open source
4. **Flexibilité parcours** - Changement Lab ↔ Outil possible
5. **Desktop first + Responsive** - Adapté mobile/tablette dès V1

### Design Opportunities

1. **Élio = documentation vivante**
2. **Onboarding progressif**
3. **Progression visible** (barres, célébrations)
4. **Validation Hub** comme workflow unique
5. **Templates + Modules activables** (anti-usine à gaz)

### Technical Decisions

- **Stockage BMAD** : DD externe + backup serveur distant
- **Visibilité client** : Jamais accès à BMAD, uniquement Élio
- **Visio** : Outil externe intégré, piloté depuis Foxeo-One
- **Création client** : Fiche auto-remplie par transcription visio
- **Responsive** : Dès la V1, app native mobile en V2/V3

---

## Core User Experience

### Defining Experience

**3 expériences distinctes, 1 écosystème cohérent :**

| Dashboard | Action Core | Fréquence |
|-----------|-------------|-----------|
| **Foxeo-One** | Valider les soumissions Validation Hub + Traiter les messages | Quotidienne |
| **Foxeo-Lab** | Avancer sur les devoirs + Échanger avec Élio | Régulière (stimulée par Élio) |
| **Foxeo-One** | Gérer son activité (clients, RDV, factures) | Quotidienne |

### Platform Strategy

- **Web app responsive** (desktop first)
- **Souris/clavier prioritaire**, touch compatible
- **App native mobile** : V2/V3
- **Hors-ligne** : Non prévu en V1

### Effortless Interactions

| Ce qui doit être sans friction | Comment |
|-------------------------------|---------|
| **Créer un client** | Visio → Transcription → Fiche auto-remplie |
| **Valider une soumission** | 1 clic (Valider / Commenter / Vidéo) |
| **Voir où en est un client** | Barre de progression toujours visible |
| **Contacter MiKL** | Bouton "Soumettre" omniprésent |
| **Parler à Élio** | Chat accessible partout |

### Critical Success Moments

| Moment | Impact |
|--------|--------|
| **1ère visio** | Fiche client créée automatiquement → "C'est pro" |
| **1ère validation Validation Hub** | Client comprend le workflow → "Je suis accompagné" |
| **Graduation Lab → Outil** | Rituel de passage → "Mon business est prêt" |
| **Élio qui relance** | Client reste engagé → "Je ne suis pas seul" |

### Experience Principles

1. **Zéro friction pour les actions récurrentes** - Valider, répondre, avancer = 1-2 clics max
2. **Progression visible partout** - Le client sait toujours où il en est
3. **Élio omniprésent mais discret** - Disponible sans être intrusif
4. **MiKL en dernier recours** - Élio filtre et structure avant
5. **Pas de jargon, pas de complexité** - Interface accessible aux novices

---

## Architecture de Communication

### Canaux de Communication (2 systèmes distincts)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CÔTÉ CLIENT (Lab ou Outil)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐     ┌─────────────────────┐           │
│  │  💬 CHAT ÉLIO       │     │  💬 CHAT MIKL       │           │
│  │  (Assistant IA)     │     │  (Direct humain)    │           │
│  ├─────────────────────┤     ├─────────────────────┤           │
│  │ • Disponible 24/7   │     │ • Échanges directs  │           │
│  │ • Questions/Réponses│     │ • Screenshots       │           │
│  │ • Guidance          │     │ • Documents         │           │
│  │ • Structuration     │     │ • Précisions        │           │
│  │                     │     │                     │           │
│  │ ❌ MiKL n'y a PAS   │     │ ✅ MiKL y a accès   │           │
│  │    accès            │     │    complet          │           │
│  └──────────┬──────────┘     └─────────────────────┘           │
│             │                                                   │
│             ↓                                                   │
│  ┌─────────────────────┐                                       │
│  │ 📤 SOUMETTRE À MIKL │                                       │
│  │ (Validation Hub)     │                                       │
│  │ → Élio génère un    │                                       │
│  │   RÉSUMÉ            │                                       │
│  └─────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Règles de Communication

| Canal | Qui parle | Qui voit | Contenu type |
|-------|-----------|----------|--------------|
| **Chat Élio** | Client ↔ Élio | Client uniquement | Questions, réflexion, structuration |
| **Résumé Élio** | Élio → MiKL | MiKL (lecture) | Synthèse du travail client |
| **Chat MiKL** | MiKL ↔ Client | Les deux | Screenshots, précisions, échanges directs |
| **Visio** | MiKL ↔ Client | Les deux | Sessions planifiées, enregistrées |

### Core Communication Kit (Transversal)

Modules de communication présents sur tous les dashboards :

| Module | Description |
|--------|-------------|
| 💬 **Chat** | Élio (IA) + MiKL (direct), historique persistant |
| 📹 **Visio** | Intégré (OpenVidu, self-hosted), enregistrement, transcription auto |
| 📁 **Documents** | Upload/Download, versioning simple, organisé par étape |
| 🖼️ **Partage Média** | Screenshots, images, liens |

---

## Parcours Utilisateurs

### Phase 0 : Acquisition

```
Prospect découvre MiKL (Site, LinkedIn, Bouche-à-oreille)
                    ↓
         Prise de RDV (lien calendrier)
```

### Phase 1 : Qualification (Foxeo-One)

```
• Visio intégrée dans Foxeo-One
• Enregistrement + Transcription auto
• Création fiche client (CRM auto-rempli)
• Création dossier BMAD (invisible client)
                    ↓
🎯 DÉCISION MiKL : Quel parcours ?
   [A] Direct → Foxeo-One
   [B] Incubation → Foxeo-Lab
```

### Parcours A : Direct (Client mûr → Foxeo-One)

```
PHASE 2: CONFIGURATION
├─→ MiKL configure le dashboard
│   • Sélection template
│   • Activation modules selon besoin
│   • Personnalisation (nom, logo, couleurs)
├─→ Devis + Paiement setup

PHASE 3: ONBOARDING
├─→ Client reçoit ses accès
├─→ Session formation (visio)
│   • Tour du dashboard
│   • Présentation Élio
│   • Questions/Réponses

PHASE 4: UTILISATION AUTONOME
├─→ Client gère son activité
├─→ Élio disponible pour aide
├─→ Chat MiKL si besoin précis

PHASE 5: ÉVOLUTIONS (Boucle continue)
├─→ Nouveau besoin → Élio structure
├─→ Soumettre via Validation Hub
├─→ MiKL évalue (micro-évolution ou devis)
```

### Parcours B : Incubation (Client en création → Foxeo-Lab → Foxeo-One)

```
PHASE 2: ONBOARDING FOXEO-LAB
├─→ MiKL configure le dashboard Lab
├─→ Définition des étapes du parcours
├─→ Client reçoit ses accès
├─→ 1ère connexion guidée par Élio

PHASE 3: INCUBATION (Boucle répétée)
│
│  CLIENT travaille avec Élio
│  • Répond aux questions
│  • Complète ses "devoirs"
│  • Consulte documents partagés
│           ↓
│  CLIENT soumet à MiKL (Validation Hub)
│  • Élio prépare un résumé
│  • Notification dans Foxeo-One
│           ↓
│  MiKL valide/commente/visio
│  • ✅ Validation → Étape suivante
│  • 💬 Commentaire → Chat/Screenshot
│  • 📹 Visio → RDV planifié
│           ↓
│  (Répéter jusqu'à graduation)

PHASE 4: GRADUATION
├─→ Toutes les étapes validées
├─→ Rituel de passage (célébration)
├─→ Migration vers Foxeo-One
│   • Mémoire Lab conservée
│   • Nouveaux modules activés

PHASE 5: CLIENT ÉTABLI
└─→ (Voir Parcours A - Phase 4+)
```

### Parcours MiKL : Journée type sur Foxeo-One

```
🌅 MATIN - Prise de poste
├─→ Vue Accueil :
│   • Agenda du jour (RDV visio)
│   • Actions prioritaires
│   • Messages non lus
│   • Validations en attente (Validation Hub)
├─→ Traitement des urgences
│   • 🔴 Messages urgents → Réponse Chat
│   • 🔴 Validations critiques → Valider/Commenter

📋 MATINÉE - Travail client
├─→ Visio planifiée
│   • Lancer depuis Foxeo-One
│   • Enregistrement auto
│   • Post-visio : fiche client, décision parcours
├─→ Validations Validation Hub
│   • Lire résumé Élio
│   • Décider : ✅ | 💬 | 📹

🔧 APRÈS-MIDI - Production
├─→ Travail sur projets clients
├─→ Envoi via Chat (screenshots, docs)
├─→ Suivi des clients (% avancement)
├─→ Visios planifiées

📊 FIN DE JOURNÉE
├─→ Check final (messages, validations)
└─→ Agenda du lendemain
```

---

## Élio : Architecture et Fonctions

### Double Casquette Élio Outil

| Mode | Déclencheur | Action |
|------|-------------|--------|
| 🎓 **GUIDE** | "Comment je fais...", "Ça ne marche pas..." | Élio RÉPOND directement |
| 🚀 **ÉVOLUTION** | "Je voudrais ajouter...", "On pourrait..." | Élio STRUCTURE → Validation Hub |

### Matrice des Fonctions par Dashboard

| Fonction | Foxeo-Lab | Foxeo-One |
|----------|-----------|-------------|
| **Guidance projet** | ✅ Principal | ❌ |
| **Questions de découverte** | ✅ Principal | ❌ |
| **Suivi des devoirs** | ✅ Principal | ❌ |
| **Guide d'utilisation** | ⚪ Basique | ✅ Principal |
| **Support technique** | ⚪ Basique | ✅ Principal |
| **Structuration évolutions** | ❌ | ✅ Principal |
| **Validation Hub** | ✅ Soumettre étapes | ✅ Soumettre évolutions |
| **Mode Challenger** | ✅ Pousse à réfléchir | ⚪ Léger |

### Système d'Escalade Élio → MiKL

```
CLIENT pose une question
        ↓
🦊 ÉLIO cherche dans sa base
        ↓
   Trouvé ?
   ├─→ ✅ OUI → Répond au client
   └─→ ❌ NON ou INCERTAIN
              ↓
   🦊 ÉLIO propose l'escalade :
   "Je ne suis pas sûr... Tu veux que je contacte MiKL ?"
   [Oui]  [Non, ça va]
              ↓ (si oui)
   📨 NOTIFICATION dans Foxeo-One
   • Question du client
   • Contexte conversation
   → MiKL répond via Chat direct
```

### Pipeline Documentation Auto (BMAD → Élio)

```
📦 DÉVELOPPEMENT MODULE (avec BMAD)
        ↓
📄 GÉNÉRATION AUTO
   • Documentation technique
   • Flowcharts d'utilisation
   • FAQ anticipées
   • Cas d'erreurs courants
        ↓
🦊 INJECTION ÉLIO CLIENT
   • Doc ajoutée à sa base de connaissance
   • Indexation pour recherche
   • Prêt à guider
```

### Cycle de Vie de la Connaissance Élio

1. **CRÉATION** (Dev avec BMAD)
   - Module développé
   - Doc technique auto-générée (module-doc.md, module-flow.md, module-faq.md)

2. **INJECTION** (Déploiement)
   - Doc transférée à Élio client
   - Base de connaissance enrichie

3. **UTILISATION** (Runtime)
   - Client pose questions
   - Élio cherche et répond
   - Escalade si besoin

4. **ENRICHISSEMENT** (Feedback loop)
   - Questions non résolues → MiKL répond
   - MiKL peut enrichir la doc
   - Élio apprend pour la prochaine fois

---

## Décisions Party Mode (25/01/2026)

### Nomenclature Finalisée

| Ancien nom | Nouveau nom | Rôle |
|------------|-------------|------|
| Dashboard Mère / Foxeo-One | **FOXEO-HUB** | Cockpit MiKL |
| Dashboard Coaching / Foxeo-Lab | **FOXEO-LAB** | Incubation clients |
| Dashboard Outil | **FOXEO-ONE** | Outil métier clients |

### Design System V1

| Élément | Décision |
|---------|----------|
| **Composants** | shadcn/ui + 21st.dev (payants validés au cas par cas) + Radix UI |
| **Typographie** | Poppins (titres/UI) + Inter (corps) - Charte Foxeo |
| **Template** | Unique pour les 3 dashboards, couleur distinctive |
| **Générateur thèmes** | [tweakcn.com](https://tweakcn.com) avec logo Foxeo |
| **Format couleurs** | OKLCH (Tailwind CSS v4 ready) |

#### Densité par Dashboard

| Dashboard | Densité | Justification |
|-----------|---------|---------------|
| Hub | Compact | MiKL traite beaucoup d'info — densité élevée |
| Lab | Spacieux | Client en création — espace pour réfléchir |
| One | Confortable | Usage quotidien — équilibre lisibilité/densité |

#### Direction Stylistique - "Minimal Futuriste" (Session 30/01/2026)

**Décision validée avec MiKL** : Style **Minimal Futuriste** pour tous les dashboards.

##### Caractéristiques visuelles clés

| Élément | Description |
|---------|-------------|
| **Mode** | Dark mode pour les 3 dashboards (confirmé) |
| **Fond** | Noir profond (#020402 ou similaire) |
| **Différenciation** | Couleur d'accent dominante unique par dashboard |
| **Accents** | Couleurs néon/vives sur fond sombre |
| **Typographie** | Fine, moderne, hiérarchie claire |
| **Data viz** | Sparklines, graphiques épurés, indicateurs de tendance |
| **Espace** | Beaucoup d'espace négatif |
| **Effets** | Glow subtils, gradients discrets (à explorer en phase détaillée) |

##### Références Dribbble validées

| Design | Designer | Éléments inspirants | Lien |
|--------|----------|---------------------|------|
| **Crypto Wallet Dashboard** | Kris Anfalova (42.8k vues) | Fond noir #020402, vert néon #68EF48, sparklines, boutons glow | [Voir](https://dribbble.com/shots/26467254) |
| **Futuristic AI Dashboard** | Atif Nadeem | Fond violet gradient, sidebar dark, KPI cards, avatar AI | [Voir](https://dribbble.com/shots/26348101) |

##### Palette couleurs - Proposition à affiner

| Dashboard | Couleur dominante proposée | Vibe/Association |
|-----------|---------------------------|------------------|
| **FOXEO-HUB** | Cyan/Turquoise | Tech, productivité, contrôle central |
| **FOXEO-LAB** | Violet/Purple | Créativité, innovation, incubation |
| **FOXEO-ONE** | Vert émeraude ou Orange | Stabilité, croissance, confiance |

> **Note** : Les couleurs exactes seront définies lors de la création des wireframes détaillés. La base reste un fond noir profond commun avec la couleur d'accent qui différencie chaque espace.

##### Outils de design identifiés

- **shadcn/ui** : Composants de base
- **21st.dev** : Composants premium (au cas par cas)
- **Tremor** : Blocs dashboard (300+ blocks, même stack React/Tailwind/Radix)
- **tweakcn.com** : Générateur de thèmes
- **Dribbble** : Inspiration visuelle

#### Palettes par Dashboard (Mise à jour 25/01/2026 - À REVOIR)

> **⚠️ Note 30/01/2026** : Ces palettes initiales seront révisées pour correspondre au style "Minimal Futuriste" décidé. Garder comme référence historique.

| Dashboard | Ambiance | Primary (Dark) | Mode par défaut |
|-----------|----------|----------------|-----------------|
| **FOXEO-HUB** | Bleu nuit + cuivre | `oklch(0.3640 0.0489 211)` | Dark |
| **FOXEO-LAB** | Terracotta/Corail | `oklch(0.6541 0.1270 33)` | Dark |
| **FOXEO-ONE** | Orange vif + bleu-gris | `oklch(0.7175 0.1747 50)` | Dark |

#### Préférence de thème

- **Mode par défaut** : Dark pour les 3 dashboards
- **Toggle utilisateur** : Oui, chaque utilisateur peut basculer en Light mode
- **Persistance** : Préférence sauvegardée par utilisateur

#### Fichier de référence

**📁 Thèmes CSS complets :** `_bmad-output/planning-artifacts/design-system-themes.css`

Contient pour chaque dashboard :
- Variables CSS complètes (light + dark mode)
- Couleurs : background, foreground, primary, secondary, accent, muted, destructive, border, input, ring, charts (x5), sidebar
- Typographie : font-sans (Poppins), font-serif (Inter), font-mono
- Ombres : shadow-2xs à shadow-2xl
- Radius et spacing
- Mappings `@theme inline` pour Tailwind v4

#### Particularités par thème

| Thème | Radius | Font Mono | Ombres |
|-------|--------|-----------|--------|
| **HUB** | 0.375rem | Geist Mono | Subtiles, bleutées |
| **LAB** | 0.5rem | monospace | Chaudes (#3D1B16) |
| **ONE** | 0.5rem | JetBrains Mono | Neutres (#000000) |

### Architecture Agents IA

| Agent | Dashboard | Rôle | Notes |
|-------|-----------|------|-------|
| **Orpheus** | Cursor/BMAD (hors interface) | Assistant stratégique MiKL | Ne fait pas partie de l'interface client |
| **Élio Lab** | Lab | Guide création, challenger | LLM connecté, accès contrôlé par MiKL |
| **Élio One** | One | Support + demandes évolutions | Pas de LLM création, mode support |

### Migration Lab → One

- Le client garde accès à son dashboard Lab depuis One (onglet "Historique Lab")
- Tous les documents créés en Lab sont accessibles en lecture
- Élio Lab est **désactivé par défaut** après graduation
- MiKL peut **réactiver** Élio Lab si le client a besoin d'un retour au laboratoire
- Archivage complet côté Hub : docs, chats, transcriptions, données externes

### Stockage (Décision 30/01/2026)

- **Base de données** : Supabase
- **Fichiers** : Supabase Storage (V1)
- **Architecture** : Supabase gère les données structurées et le stockage fichiers

---

## Flux Onboarding Client (Session 05/02/2026)

### Vue d'Ensemble du Parcours Prospect

**Décisions validées en Party Mode avec l'Architecte :**

```
Points d'entrée          Prise de RDV       Pré-visio          Visio           Post-visio
─────────────────────────────────────────────────────────────────────────────────────────
QR Code ──┐
LinkedIn ─┼──▶ Cal.com ──▶ Salle d'attente ──▶ OpenVidu ──▶ Hub MiKL
Site ─────┤              (formulaire +        (enregistré)   (choix statut)
Mobile ───┘              API INSEE)
```

### Expérience Prise de RDV

| Point d'entrée | Destination | UX |
|----------------|-------------|-----|
| QR Code carte | Cal.com Foxeo | Scan → Page RDV directe |
| Lien LinkedIn | Cal.com Foxeo | Clic → Page RDV |
| Bouton site | Cal.com Foxeo | Clic → Page RDV |
| MiKL mobile | Hub Foxeo | Création manuelle |

**Informations collectées (légères) :** Prénom, Nom, Email, Société (optionnel)

### Expérience Salle d'Attente (Pré-visio)

**Timing :** Le client arrive 5 minutes avant le RDV pour remplir le formulaire complémentaire.

**Principe UX :** "C'est la seule fois qu'on vous le demande" — rassurer le client que tout le reste sera automatique.

**Informations collectées :**
- Téléphone (obligatoire)
- SIRET si entreprise (obligatoire) → auto-complete via API INSEE
- OU Ville si pas d'entreprise (obligatoire)
- Consentement enregistrement (obligatoire, avec explication du bénéfice : "Vous recevrez la transcription")

### Expérience Post-Visio (MiKL)

**Interface Hub post-visio :**
1. Résumé généré par Élio Hub (modifiable)
2. Choix du statut : 🟢 Chaud / 🟡 Tiède / 🟠 Froid / 🔴 Non
3. Aperçu email adapté au statut
4. Options : Envoyer maintenant / Programmer / Standby

**Comportements par statut :**

| Statut | Email | Relance | CRM |
|--------|-------|---------|-----|
| 🟢 Chaud | Résumé + Création espace | Non | → Client |
| 🟡 Tiède | Résumé commercial | Auto J+X | Prospect chaud |
| 🟠 Froid | Résumé + "À dispo" | Non | Prospect froid |
| 🔴 Non | Remerciement + transcription | Non | Prospect fermé |

### Expérience Première Connexion Client

À la première connexion (après création du compte) :
- **Modale d'onboarding Élio** qui accueille le client
- Explication du fonctionnement de l'espace
- Orientation vers les premières actions

**Référence complète :** `_bmad-output/planning-artifacts/prd/architecture-flux-onboarding-client.md`

---

## Prochaines Étapes

- [x] ~~Finaliser le nom de Foxeo-Outil~~ → Renommé **FOXEO-ONE** ✅
- [x] ~~Définir les palettes couleurs détaillées~~ → Thèmes tweakcn générés ✅ (25/01/2026)
- [ ] Retravailler le design des dashboards avec les 2 chats distincts
- [ ] **Créer wireframes détaillés style "Minimal Futuriste"** (Foxeo-Hub, Foxeo-Lab, Foxeo-One)
- [ ] **Affiner les palettes couleurs** (cyan/violet/vert sur base noir profond)
- [ ] **Explorer animations et détails composants** (glow, transitions)
- [ ] Spécifier le template de documentation BMAD pour Élio
- [ ] Importer Orpheus depuis le projet BMAD existant
- [ ] Configurer les 3 agents Élio (Hub, Lab, One)
- [x] ~~Finaliser la décision stockage serveur~~ → Supabase + Supabase Storage ✅ (30/01/2026)
