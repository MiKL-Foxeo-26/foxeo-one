# Foxeo One - Analyse de l'arborescence source

> Documentation générée le 2026-01-20 par BMM Document Project Workflow

## Structure complète

```
foxeo-one/
│
├── 📁 apps/                          # Applications (modules)
│   └── 📁 brief/                     # 🎯 MODULE BRIEF - App Next.js
│       ├── 📁 app/                   # Routes (App Router)
│       │   ├── 📁 api/               # API Routes (serveur)
│       │   │   ├── analyze/          # POST - Analyse IA contenu
│       │   │   │   └── route.ts
│       │   │   ├── evaluate/         # POST - Évaluation brief
│       │   │   │   └── route.ts
│       │   │   ├── health/           # GET - Health check providers
│       │   │   │   └── route.ts
│       │   │   ├── integrate-responses/ # POST - Intégration réponses
│       │   │   │   └── route.ts
│       │   │   └── questions/        # POST - Génération questions
│       │   │       └── route.ts
│       │   │
│       │   ├── 📁 historique/        # Page historique briefs
│       │   │   └── page.tsx
│       │   ├── 📁 nouveau/           # Création de brief
│       │   │   ├── 📁 analyse/       # Mode analyse IA
│       │   │   │   └── page.tsx
│       │   │   ├── 📁 guide/         # Mode guidé (4 questions)
│       │   │   │   └── page.tsx
│       │   │   └── page.tsx          # Sélection du mode
│       │   ├── 📁 settings/          # Paramètres
│       │   │   └── page.tsx
│       │   │
│       │   ├── globals.css           # Styles globaux Tailwind
│       │   ├── layout.tsx            # 🚀 ENTRY POINT - Layout racine
│       │   └── page.tsx              # Dashboard principal
│       │
│       ├── 📁 components/            # Composants React spécifiques
│       │   ├── 📁 brief/             # Composants Brief
│       │   │   ├── BriefActions.tsx
│       │   │   ├── BriefElementCard.tsx
│       │   │   ├── BriefList.tsx
│       │   │   ├── BriefPanel.tsx
│       │   │   ├── ClientInfoFields.tsx
│       │   │   ├── ClientResponseInput.tsx
│       │   │   ├── FollowUpQuestions.tsx
│       │   │   ├── FollowUpQuestions.test.tsx
│       │   │   ├── StatusBadge.tsx
│       │   │   └── index.ts
│       │   ├── 📁 dashboard/
│       │   │   ├── StatsRow.tsx
│       │   │   └── index.ts
│       │   ├── 📁 layout/
│       │   │   ├── OfflineAlert.tsx
│       │   │   └── index.ts
│       │   └── 📁 settings/
│       │       ├── ProviderHealthCheck.tsx
│       │       ├── ProviderSelector.tsx
│       │       └── index.ts
│       │
│       ├── 📁 contexts/              # React Context
│       │   ├── BriefContext.tsx      # Context principal
│       │   └── index.ts
│       │
│       ├── 📁 hooks/                 # Custom hooks
│       │   ├── index.ts
│       │   ├── use-mobile.ts
│       │   ├── useAIApi.ts
│       │   ├── useAIAvailability.ts
│       │   ├── useAutoSave.ts
│       │   ├── useBriefs.ts
│       │   ├── useDebouncedValue.ts
│       │   └── useSettings.ts
│       │
│       ├── 📁 lib/                   # Logique métier
│       │   ├── 📁 api/               # Client API
│       │   │   ├── client.ts
│       │   │   ├── client.test.ts
│       │   │   ├── helpers.ts
│       │   │   └── index.ts
│       │   ├── 📁 export/            # Export briefs
│       │   │   ├── formatBrief.ts
│       │   │   └── index.ts
│       │   ├── 📁 providers/         # 🤖 AI Providers (SERVER ONLY)
│       │   │   ├── index.ts          # Factory + Registry
│       │   │   ├── claude.ts         # Anthropic SDK
│       │   │   ├── gemini.ts         # Google AI SDK
│       │   │   ├── openai.ts         # OpenAI SDK
│       │   │   ├── types.ts          # Interfaces
│       │   │   └── utils.ts          # Helpers
│       │   ├── 📁 scoring/           # Calcul score BMAD
│       │   │   ├── calculateScore.ts
│       │   │   ├── calculateScore.test.ts
│       │   │   └── index.ts
│       │   ├── 📁 storage/           # Persistence localStorage
│       │   │   ├── briefs.ts
│       │   │   ├── index.ts
│       │   │   └── settings.ts
│       │   ├── 📁 utils/             # Utilitaires locaux
│       │   │   ├── brief.ts
│       │   │   └── index.ts
│       │   └── utils.ts
│       │
│       ├── 📁 types/                 # Types TypeScript
│       │   ├── api.ts                # Types API
│       │   ├── brief.ts              # Types + Schemas Zod Brief
│       │   └── index.ts
│       │
│       ├── components.json           # Config shadcn/ui
│       ├── next.config.ts            # Config Next.js
│       ├── package.json              # Dépendances module
│       ├── tsconfig.json             # Config TypeScript
│       └── vitest.config.ts          # Config tests (si présent)
│
├── 📁 packages/                      # Packages partagés
│   │
│   ├── 📁 ui/                        # 📦 @foxeo/ui - Design System
│   │   ├── 📁 src/
│   │   │   ├── alert.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── globals.css           # Styles CSS partagés
│   │   │   ├── index.ts              # Barrel export
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-mobile.ts         # Hook responsive
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── 📁 utils/                     # 📦 @foxeo/utils - Utilitaires
│   │   ├── 📁 src/
│   │   │   ├── cn.ts                 # Merge classnames
│   │   │   ├── date.ts               # Formatage dates
│   │   │   └── index.ts              # Barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── 📁 tsconfig/                  # 📦 @foxeo/tsconfig - Configs TS
│       ├── base.json                 # Config de base
│       ├── nextjs.json               # Config Next.js
│       ├── package.json
│       └── react-library.json        # Config librairies React
│
├── 📁 _bmad/                         # Configuration BMad Method
│   ├── 📁 bmm/                       # Module BMM
│   └── 📁 core/                      # Core BMad
│
├── 📁 _bmad-output/                  # Artefacts de planification
│   └── 📁 planning-artifacts/
│       └── bmm-workflow-status.yaml
│
├── 📁 docs/                          # 📄 Documentation (vous êtes ici)
│
├── 📁 node_modules/                  # Dépendances (ignoré)
│
├── .gitignore
├── package.json                      # 🚀 WORKSPACE ROOT
├── README.md                         # Documentation principale
└── turbo.json                        # Configuration Turborepo
```

## Répertoires critiques

### apps/brief/app/

**Rôle** : Routes Next.js App Router
- Point d'entrée principal : `layout.tsx`
- Gestion des routes côté client et serveur
- API Routes pour les appels IA

### apps/brief/lib/providers/

**Rôle** : Abstraction des providers IA
- Pattern Factory pour instanciation
- Support multi-provider (Claude, OpenAI, Gemini)
- **⚠️ SERVER ONLY** : Ne jamais importer côté client

### apps/brief/contexts/

**Rôle** : État global de l'application
- `BriefContext` : Gestion des briefs, settings, loading

### packages/ui/src/

**Rôle** : Design system partagé
- Composants basés sur Radix UI
- Styles via Tailwind CSS + CVA
- Réutilisables par tous les modules

### packages/utils/src/

**Rôle** : Utilitaires partagés
- Fonctions helper communes
- Évite la duplication de code

## Fichiers d'entrée par partie

| Partie | Fichier d'entrée | Description |
|--------|------------------|-------------|
| **brief** | `apps/brief/app/layout.tsx` | Layout racine Next.js |
| **ui** | `packages/ui/src/index.ts` | Barrel export composants |
| **utils** | `packages/utils/src/index.ts` | Barrel export utilitaires |
| **tsconfig** | `packages/tsconfig/base.json` | Config TS de base |

## Organisation des tests

```
apps/brief/
├── components/
│   └── brief/
│       └── FollowUpQuestions.test.tsx  # Test composant
├── lib/
│   ├── api/
│   │   └── client.test.ts              # Test client API
│   └── scoring/
│       └── calculateScore.test.ts      # Test scoring
```

**Framework** : Vitest + Testing Library
**Pattern** : Colocation (tests à côté des sources)

## Conventions de nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase | `BriefPanel.tsx` |
| Hooks | camelCase avec use | `useBriefs.ts` |
| Utilitaires | camelCase | `calculateScore.ts` |
| Types | PascalCase | `Brief`, `BriefElement` |
| Routes API | kebab-case | `integrate-responses/` |
| Packages | kebab-case | `@foxeo/ui` |
