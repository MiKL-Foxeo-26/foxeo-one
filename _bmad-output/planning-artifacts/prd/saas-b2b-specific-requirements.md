# SaaS B2B Specific Requirements

## Modèle Multi-Tenancy

**Architecture retenue : Row-Level Security (RLS) Supabase**

| Aspect | Décision |
|--------|----------|
| Isolation données | RLS policies par `client_id` |
| Base unique | Oui — simplification maintenance |
| Scalabilité | Jusqu'à 100+ clients sans changement |
| Option enterprise | Instance dédiée négociable au cas par cas |

Chaque client ne peut accéder qu'à ses propres données. Les policies RLS garantissent l'isolation même en cas de faille applicative.

## Architecture Dashboard Unifiée

**Décision architecturale majeure** : Un dashboard client unique avec zones Lab et One accessibles conditionnellement, plutôt que deux applications séparées.

```
DASHBOARD CLIENT UNIFIÉ
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────── SECTIONS COMMUNES ───────────────────┐   │
│  │                                                          │   │
│  │  📁 MES DOCUMENTS        Tous les briefs, livrables     │   │
│  │  📹 MES VISIOS           Enregistrements + transcriptions│   │
│  │  💬 CHAT MIKL            Communication directe          │   │
│  │  🏠 ACCUEIL              Dashboard, notifications       │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────── SECTIONS CONTEXTUELLES ──────────────┐   │
│  │                                                          │   │
│  │  ┌─────────────┐              ┌─────────────┐           │   │
│  │  │  🧪 LAB     │              │  🚀 ONE     │           │   │
│  │  │             │              │             │           │   │
│  │  │ Parcours    │              │ Modules     │           │   │
│  │  │ création    │              │ métier      │           │   │
│  │  │             │              │             │           │   │
│  │  │ 💬 Élio Lab │              │ 💬 Élio One │           │   │
│  │  └─────────────┘              └─────────────┘           │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Sections Communes

| Section | Description |
|---------|-------------|
| **🏠 Accueil** | Dashboard, alertes, KPIs, notifications |
| **📁 Documents** | Tous les briefs et livrables — stockage unique accessible depuis Lab ou One |
| **📹 Visios** | Enregistrements, transcriptions, planning des visios avec MiKL |
| **💬 Chat MiKL** | Communication directe humaine, historique complet |

### Sections Contextuelles

| Section | Description |
|---------|-------------|
| **🧪 Lab** | Parcours création + Élio Lab (si actif) |
| **🚀 One** | Modules métier + Élio One (One ou One+ selon abonnement) |

### Matrice d'Accès Conditionnelle

| Profil Client | Lab | One | Élio |
|---------------|-----|-----|------|
| **Lab actif** | ✅ Complet | 🔒 Message teasing | Élio Lab |
| **Gradué Lab→One** | ✅ Consultation | ✅ Complet | Élio One |
| **Direct One** | 🔒 Message teasing | ✅ Complet | Élio One |

### Messages Teasing (UX)

**Client Lab qui clique sur ONE :**
> "🚀 **Bienvenue dans ton futur espace ONE !**
> Une fois ton parcours Lab terminé, tu accéderas ici à ton dashboard métier personnalisé avec Élio One, ton assistant qui connaît ton business.
> Continue ton parcours Lab pour débloquer cette partie !"

**Client One qui clique sur LAB :**
> "🧪 **Découvre le Lab Foxeo !**
> Tu as un nouveau projet en tête ? Une idée à structurer ? Le Lab t'accompagne de l'idée au business avec Élio Lab, ton partenaire de création.
> Curieux ? Contacte MiKL pour explorer cette aventure."

## Architecture des Communications

### Les 5 Canaux de Communication

| Canal | Emplacement | Usage |
|-------|-------------|-------|
| **📹 Visio** | Section Visios (commune) | Échanges synchrones MiKL ↔ Client |
| **💬 Chat MiKL** | Section commune | Échanges asynchrones MiKL ↔ Client |
| **💬 Élio Lab** | Section Lab | Accompagnement parcours IA |
| **💬 Élio One** | Section One | FAQ, guide, recherche (lecture seule) |
| **💬 Élio One+** | Section One | Actions sur fonctionnalités existantes |

### Section Visio — Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| Historique visios | Liste des visios passées avec MiKL |
| Enregistrements | Replay des visios (si enregistrées) |
| Transcriptions | Texte auto-généré, consultable |
| Prochaine visio | Affichage si une visio est planifiée |
| Demander une visio | Bouton → crée demande dans Validation Hub |

## Périmètre Élio — Clarification

**Élio Agent (One+) = Exécuteur, pas Créateur**

Élio One+ exécute les fonctionnalités DÉJÀ développées et déployées. Il ne crée pas de nouvelles fonctionnalités.

| Ce qu'Élio One+ FAIT | Ce qu'Élio One+ NE FAIT PAS |
|-------------------------|-------------------------------|
| Exécute les fonctionnalités déployées | Créer de nouvelles fonctionnalités |
| Interroge les données existantes | Modifier la structure des données |
| Génère des documents (templates existants) | Créer de nouveaux templates |
| Envoie des communications (circuits existants) | Créer de nouveaux circuits |
| Automatise des workflows configurés | Inventer de nouveaux workflows |

**Quand le client demande une fonctionnalité non existante :**

```
CLIENT: "Je voudrais pouvoir faire X"
         │
         ▼
ÉLIO: "Je ne peux pas faire ça directement, mais je peux
       transmettre ta demande à MiKL. Tu veux que je prépare ça ?"
         │
         ▼
ÉLIO collecte (2-3 questions max) → DEMANDE D'ÉVOLUTION
         │
         ▼
VALIDATION HUB → MIKL évalue → Devis → Facturation
```

## Matrice RBAC (Permissions)

| Rôle | Périmètre | Capacités |
|------|-----------|-----------|
| **Admin (MiKL)** | Global | Hub, tous clients, Validation Hub, activation/désactivation Lab/One |
| **Client** | Son espace | Sections communes + zones débloquées selon parcours |

## Tiers d'Abonnement (Révisé)

**3 offres simplifiées :**

| Tier | Prix | Élio | Inclus |
|------|------|------|--------|
| **Ponctuel** | TJM | ❌ | 1 mois maintenance + documentation technique |
| **Lab** | 199€ (forfait) | Élio Lab | Dashboard Lab + Élio Lab + visios MiKL |
| **Essentiel** | 49€/mois | Élio One | Maintenance continue, mises à jour, Élio assistant |
| **Agentique** | 99€/mois | Élio One+ | Maintenance continue, mises à jour, Élio agentique |

**Politique** : Aucune limite de stockage ou d'usage. Différenciation uniquement sur les capacités Élio. Lab 199€ déduits du setup si le client passe sur One.

**Tarification Setup — "Devis Juste"** : Le setup (Ponctuel, Essentiel, Agentique) est facturé au TJM après une analyse précise du projet. Chaque devis est détaillé module par module, transparent sur les coefficients (complexité, urgence). Le client comprend chaque ligne — pas de forfait générique.

### Capacités Élio par Tier

| Élio One (49€) | Élio One+ (99€) |
|------------------|-------------------|
| FAQ intelligente | Tout One + |
| Guide fonctionnalités | Actions réelles (envoi mails, génération docs) |
| Demandes d'évolution | Alertes proactives |
| Recherche simple (lecture seule) | Automatisations sur fonctionnalités existantes |

## Stratégie d'Intégrations

**Philosophie modulaire Foxeo :**
> Chaque intégration développée pour un client devient un module réutilisable du catalogue Foxeo.

| Intégration | Priorité | Statut |
|-------------|----------|--------|
| Stripe | P1 | MVP — Paiements, checkout |
| Email transactionnel | P1 | MVP — Resend ou Sendgrid (à décider) |
| Calendrier | À évaluer | Selon besoins clients |
| Export comptable | À évaluer | Format standard FR |
| Webhooks sortants | P2 | V2 |

**Critères de sélection** : Prioriser outils gratuits ou à haute valeur ajoutée. Construire au fur et à mesure selon besoins réels.

## Exigences de Conformité

| Domaine | Exigence | Approche |
|---------|----------|----------|
| **RGPD** | Données personnelles FR | Obligatoire MVP |
| **Hébergement** | Souveraineté France | VPS FR en V2+ |
| **Facturation électronique** | PDP obligatoire sept. 2026 | Intégrer solution certifiée (pas de dev maison) |
| **Qualiopi** | Module organismes formation | Optionnel, développé pour cas client |

**Note facturation** : La réglementation française impose dès septembre 2026 le passage par une Plateforme de Dématérialisation Partenaire (PDP) agréée. Recommandation : intégrer une solution certifiée (Pennylane, Tiime, etc.) plutôt que développer un module maison.

## Considérations Techniques SaaS B2B

| Aspect | Approche |
|--------|----------|
| Sessions | Access token 1h, refresh 30j, inactivité 8h |
| 2FA | Obligatoire MiKL, optionnel clients |
| Audit trail | Actions critiques loguées |
| Backup | Quotidien auto Supabase, cold backup hebdo |
| Rate limiting | Par utilisateur, à calibrer selon usage |

---
