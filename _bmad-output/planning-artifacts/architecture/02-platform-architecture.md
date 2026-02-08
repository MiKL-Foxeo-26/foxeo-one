# Starter Template & Platform Architecture

[< Retour à l'index](./index.md) | [< Section précédente](./01-project-context-analysis.md) | [Section suivante >](./03-core-decisions.md)

---

### Existing Foundation

Monorepo Turborepo existant avec packages partagés (`@foxeo/ui`, `@foxeo/utils`, `@foxeo/tsconfig`). Stack confirmée et à jour : Next.js 16.1, React 19, TypeScript, Tailwind CSS 4, Vitest.

**Versions cibles :**

| Package | Version actuelle | Cible | Action |
|---------|-----------------|-------|--------|
| Next.js | 16.1.1 | 16.1.x | A jour |
| Turborepo | ^2.3.0 | ^2.8.x | Mise à jour |
| React | 19.2.3 | 19.x | A jour |
| Tailwind CSS | 4.x | 4.x | A jour |
| @supabase/supabase-js | Non installé | ^2.95.x | A ajouter |
| @supabase/ssr | Non installé | Latest | A ajouter |

### Application Structure Decision

**Architecture retenue : 2 applications Next.js + catalogue de modules**

```
foxeo-dash/
├── apps/
│   ├── hub/                    # Foxeo-Hub (opérateur/admin)
│   └── client/                 # Foxeo-Client (dashboard unifié Lab+One)
│
├── packages/
│   ├── ui/                     # Design system partagé (shadcn/Radix)
│   ├── utils/                  # Utilitaires partagés
│   ├── tsconfig/               # Configs TypeScript
│   └── modules/                # CATALOGUE DE MODULES
│       ├── core-dashboard/     # Module de base (accueil, nav, profil)
│       ├── chat/               # Module chat (Élio + MiKL)
│       ├── documents/          # Module documents
│       ├── visio/              # Module visio
│       ├── crm/                # Module CRM
│       ├── formations/         # Module formations
│       ├── evenements/         # Module événements
│       ├── adhesions/          # Module adhésions
│       ├── facturation/        # Module facturation
│       ├── parcours-lab/       # Module parcours Lab
│       ├── validation-hub/     # Module Validation Hub
│       └── [futur-module]/     # Chaque nouveau besoin = nouveau package
```

**Rationale :**

- Hub et Client sont des audiences distinctes (admin vs utilisateur final)
- Déploiement indépendant : `hub.foxeo.io` / `app.foxeo.io`
- Sécurité simplifiée (pas de risque d'exposer des routes admin)
- Bundles optimisés (chaque app charge uniquement ce qu'elle utilise)
- Packages partagés assurent la cohérence entre les deux apps

### Architecture Plateforme Modulaire

**Principe fondamental : "Développer une fois, déployer partout"**

Le système repose sur 3 piliers :

#### Pilier 1 : Modèle de déploiement dual — Propriété client

**Principe fondamental : le client est propriétaire de sa solution.**

Le code développé dans le cadre du projet appartient au client. Foxeo conserve le droit de réutiliser les patterns et modules développés. Si le client quitte Foxeo One, il repart avec un outil opérationnel complet (hors modules service Foxeo : chat MiKL, visio, Élio — sauf si inclus dans le périmètre projet).

**3 modes de déploiement :**

| Cible | Modèle | Infrastructure | Propriété |
|-------|--------|----------------|-----------|
| **Hub** | Instance unique | 1 Vercel + 1 Supabase | Foxeo |
| **Lab** | Multi-tenant | 1 Vercel + 1 Supabase (partagé) | Foxeo |
| **One** | Instance par client | 1 Vercel + 1 Supabase **par client** | Client |

**Lab (multi-tenant — propriété Foxeo) :**

- Une seule instance déployée pour tous les clients Lab
- Isolation par `client_id` + Row Level Security (RLS)
- Configuration dynamique par client (modules actifs, parcours, thème)
- Les clients Lab ne possèdent pas l'outil — ils récupèrent uniquement leurs documents

**One (instance dédiée — propriété client) :**

- Chaque client One reçoit sa propre instance Vercel + son propre projet Supabase
- Pas de RLS inter-client nécessaire (base de données dédiée)
- Modules activés selon le périmètre projet (configuration par env variables)
- Le client peut récupérer le code et être indépendant si demandé
- Coût estimé par client : ~5-7€/mois sur tiers gratuits (Vercel Hobby + Supabase Free + VPS prorata + Élio)

**Hub (instance unique — Foxeo) :**

- Le Hub est multi-opérateur dès le départ (prépare la commercialisation)
- Table `operators` : MiKL = `operator_id: 1`
- Communique avec les instances Lab et One via **API REST + webhooks** (pas de DB partagée)

#### Pilier 2 : Catalogue de modules plug & play

Chaque module est un package autonome dans `packages/modules/` qui respecte un **contrat strict** :

```typescript
// Contrat Module — chaque module exporte un manifest
export interface ModuleManifest {
  id: string                    // Identifiant unique ('crm', 'formations', etc.)
  name: string                  // Nom affiché
  version: string               // Versioning sémantique
  description: string           // Description du module

  navigation: {                 // Entrée dans la sidebar
    icon: string                // Icône Lucide
    label: string               // Label affiché
    position: number            // Ordre dans la nav
  }

  routes: ModuleRoute[]         // Pages du module (lazy-loaded)
  apiRoutes: ModuleApiRoute[]   // Endpoints API
  requiredTables: string[]      // Tables DB nécessaires
  targets: ('hub' | 'client-lab' | 'client-one')[]  // Dashboards compatibles
  dependencies: string[]        // Dépendances sur d'autres modules
}
```

**Cycle de vie d'un module :**

1. **Développement** : Créer un nouveau package dans `packages/modules/[nom]/`
2. **Documentation** : Rédiger `docs/guide.md`, `docs/faq.md`, `docs/flows.md` (obligatoire, vérifié en CI)
3. **Enregistrement** : Le module s'auto-enregistre via son manifest
4. **Activation Lab** : Ajouter l'id dans la config client → déploiement automatique (tous les clients Lab en bénéficient)
5. **Activation One** : Ajouter l'id dans la config de l'instance → redéployer l'instance Vercel du client
6. **Mise à jour Lab** : Push git → deploy auto → tous les clients Lab avec ce module en bénéficient
7. **Mise à jour One** : Push git → redéployer l'instance Vercel du client spécifique
8. **Désactivation** : Retirer l'id de la config → le module disparaît de l'interface

#### Pilier 3 : Configuration-driven, pas code-driven

**Table client_config (Lab — DB partagée multi-tenant) :**

```sql
-- Dans la DB Lab partagée : détermine ce que chaque client Lab voit
CREATE TABLE client_config (
  client_id UUID PRIMARY KEY REFERENCES clients(id),
  operator_id UUID REFERENCES operators(id),

  -- Modules actifs
  active_modules TEXT[] DEFAULT ARRAY['core-dashboard', 'chat', 'documents', 'parcours-lab'],

  -- Type de dashboard
  dashboard_type TEXT DEFAULT 'lab',  -- 'lab' (fixe dans cette DB)

  -- Personnalisation
  theme_variant TEXT DEFAULT 'lab',   -- Palette vert émeraude
  custom_branding JSONB,              -- Logo, nom affiché

  -- Configuration Élio
  elio_config JSONB,                  -- Contexte, profil comm, tier

  -- Parcours Lab
  parcours_config JSONB,              -- Étapes, progression

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table client_config (One — DB dédiée par client) :**

```sql
-- Dans chaque DB One dédiée : un seul client, pas de RLS inter-client
CREATE TABLE client_config (
  client_id UUID PRIMARY KEY,         -- Un seul enregistrement dans cette DB

  -- Modules actifs (définis par le périmètre projet)
  active_modules TEXT[] DEFAULT ARRAY['core-dashboard', 'chat', 'documents'],

  -- Type de dashboard
  dashboard_type TEXT DEFAULT 'one',   -- 'one' (fixe)

  -- Personnalisation
  theme_variant TEXT DEFAULT 'one',    -- Palette orange
  custom_branding JSONB,               -- Logo, nom affiché

  -- Configuration Élio
  elio_config JSONB,                   -- Contexte, profil comm, tier

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Table client_instances (Hub — registre des instances) :**

```sql
-- Dans la DB Hub : registre de toutes les instances déployées
CREATE TABLE client_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  instance_type TEXT NOT NULL,          -- 'lab' | 'one'

  -- URLs de l'instance
  instance_url TEXT NOT NULL,           -- https://{slug}.foxeo.io
  supabase_url TEXT,                    -- URL Supabase de l'instance (One uniquement)
  vercel_project_id TEXT,               -- ID projet Vercel (One uniquement)

  -- Sécurité inter-instances
  instance_secret TEXT NOT NULL,        -- Secret HMAC pour communication signée

  -- Monitoring
  status TEXT DEFAULT 'active',         -- 'provisioning', 'active', 'suspended', 'archived'
  last_health_check TIMESTAMP,
  usage_metrics JSONB,                  -- Dernières métriques (DB rows, storage, bandwidth)
  alert_level TEXT DEFAULT 'none',      -- 'none', 'info', 'warning', 'critical'

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Flux "nouveau client Lab" :**

1. MiKL crée le client dans le Hub
2. Le Hub insère `clients` + `client_config` dans la DB Lab partagée
3. Le client reçoit ses identifiants → se connecte à `lab.foxeo.io`
4. Le middleware Auth lit `client_id` → charge `client_config` (RLS)
5. Le dashboard Lab s'affiche avec les modules du parcours

**Flux "nouveau client One" :**

1. MiKL crée le client dans le Hub
2. Script de provisioning : création projet Supabase + déploiement Vercel dédié
3. Configuration des env variables (Supabase URL, clés, modules actifs)
4. Le Hub enregistre l'URL de l'instance One (pour communication API)
5. Le client reçoit ses identifiants → se connecte à `{slug}.foxeo.io`
6. **Livrable obligatoire** : documentation d'utilisation de chaque module activé

**Flux "graduation Lab → One" :**

1. Le client Lab termine son parcours et choisit Foxeo One
2. Script de provisioning One (nouveau Supabase + nouveau Vercel)
3. Migration des données Lab pertinentes vers l'instance One dédiée
4. Archivage Lab accessible en lecture dans l'instance One (module historique-lab)

**Flux "ajouter un module" (Lab — multi-tenant) :**

1. MiKL dans le Hub : active le module pour le client
2. `UPDATE client_config SET active_modules = active_modules || ARRAY['formations']`
3. Au prochain chargement, le client voit le nouveau module

**Flux "ajouter un module" (One — instance dédiée) :**

1. Développement/personnalisation du module dans le monorepo
2. Redéploiement de l'instance Vercel du client avec le module ajouté
3. Migration Supabase sur l'instance du client si nécessaire
4. **Livrable obligatoire** : documentation module (guide.md, faq.md, flows.md)

**Flux "client quitte One" :**

1. Export des données depuis le Supabase du client
2. Le client repart avec : code source + base de données + documentation complète
3. Retrait des modules service Foxeo (chat MiKL, visio, Élio) — sauf si dans le périmètre projet
4. Le dossier BMAD reste propriété Foxeo — le client reçoit les documents stratégiques (brief, PRD, architecture)

#### Pilier 4 : Communication Hub ↔ Instances

Le Hub ne partage pas de base de données avec les instances One. Toute communication passe par des API sécurisées.

```typescript
// API Hub → Instance One (dans l'instance client)
// apps/client/app/api/hub/route.ts
export interface HubApiContract {
  'POST /api/hub/sync': {        // Hub push des mises à jour config
    body: { action: string; payload: unknown }
    response: { success: boolean }
  }
  'GET /api/hub/health': {       // Hub vérifie la santé de l'instance
    response: { status: 'ok' | 'degraded'; metrics: UsageMetrics }
  }
}

// Webhook Instance One → Hub (dans le Hub)
// apps/hub/app/api/webhooks/client-instance/route.ts
export interface ClientWebhookContract {
  'POST /api/webhooks/client-instance': {
    body: {
      instanceId: string
      event: 'usage_alert' | 'client_action' | 'health_report'
      data: unknown
    }
  }
}
```

**Sécurité inter-instances :**

- Chaque instance One possède un `INSTANCE_SECRET` partagé avec le Hub
- Toutes les requêtes Hub↔One sont signées (HMAC SHA-256)
- Le Hub maintient un registre des instances actives (`client_instances` table)

#### Pilier 5 : Documentation comme livrable obligatoire

Chaque fonctionnalité développée DOIT produire sa documentation. Cette documentation :
- Alimente la base de connaissances d'Élio One (assistant IA contextuel)
- Est accessible au client via son module documents
- Est incluse dans l'export si le client quitte One

**Structure documentation par module :**

```
packages/modules/[nom]/
├── docs/
│   ├── guide.md          # Guide utilisateur pas-à-pas
│   ├── faq.md            # Questions fréquentes
│   └── flows.md          # Diagrammes de flux / parcours utilisateur
```

#### Pilier 6 : Surveillance usage & upgrade automatique

Système de monitoring pour anticiper les dépassements de capacité sur les tiers gratuits.

```
┌─────────────────┐     Cron quotidien      ┌──────────────────┐
│  Edge Function  │ ──────────────────────► │  Check usage     │
│  (Supabase)     │                         │  par instance    │
└─────────────────┘                         └────────┬─────────┘
                                                     │
                                            ┌────────▼─────────┐
                                            │  Seuils atteints │
                                            │  60% → info      │
                                            │  80% → warning   │
                                            │  95% → critical  │
                                            └────────┬─────────┘
                                                     │
                                            ┌────────▼─────────┐
                                            │  Notification    │
                                            │  Hub + email     │
                                            └────────┬─────────┘
                                                     │
                                            ┌────────▼─────────┐
                                            │  Workflow        │
                                            │  Debrief client  │
                                            │  Accord upgrade  │
                                            │  Migration tier  │
                                            └──────────────────┘
```

**Métriques surveillées :**

| Métrique | Source | Seuil gratuit |
|----------|--------|---------------|
| Lignes DB | Supabase API | 500K rows |
| Storage fichiers | Supabase Storage | 1 GB |
| Bandwidth | Supabase | 2 GB/mois |
| Edge Function invocations | Supabase | 500K/mois |
| Vercel bandwidth | Vercel API | 100 GB/mois |
