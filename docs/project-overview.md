# Foxeo One - Vue d'ensemble du projet

> Documentation générée le 2026-01-20 par BMM Document Project Workflow

## Résumé exécutif

**Foxeo One** est un dashboard professionnel modulaire conçu comme une plateforme "Lego" où chaque module (app) peut être ajouté indépendamment tout en partageant des composants et utilitaires communs.

### Caractéristiques principales

- **Architecture modulaire** : Monorepo Turborepo permettant l'ajout facile de nouveaux modules
- **Premier module** : Brief - Application de génération de briefs optimisée pour la méthode BMAD
- **Multi-AI** : Support de 3 providers IA (Claude, OpenAI, Gemini) avec pattern factory
- **UI partagée** : Design system basé sur shadcn/ui et Radix UI

## Classification du projet

| Attribut | Valeur |
|----------|--------|
| Type de repository | Monorepo (Turborepo) |
| Nombre de parties | 4 (1 app + 3 packages) |
| Langage principal | TypeScript |
| Framework principal | Next.js 16 |
| Pattern architectural | Component-based + Context API |

## Structure du repository

```
foxeo-one/
├── apps/
│   └── brief/              # 🎯 Module Brief (Next.js 16)
│       ├── app/            # Routes App Router
│       ├── components/     # Composants spécifiques Brief
│       ├── contexts/       # React Context (BriefContext)
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Logique métier
│       │   ├── api/        # Client API
│       │   ├── export/     # Export (MD, TXT)
│       │   ├── providers/  # AI Providers (Claude, OpenAI, Gemini)
│       │   ├── scoring/    # Calcul de score BMAD
│       │   └── storage/    # Persistence localStorage
│       └── types/          # Types TypeScript
│
├── packages/
│   ├── ui/                 # 📦 @foxeo/ui - Design system
│   │   └── src/            # 14 composants (shadcn/ui)
│   ├── utils/              # 📦 @foxeo/utils - Utilitaires
│   │   └── src/            # cn, formatDate, etc.
│   └── tsconfig/           # 📦 @foxeo/tsconfig - Configs TS
│
├── _bmad/                  # Configuration BMad Method
├── _bmad-output/           # Artefacts de planification
├── docs/                   # 📄 Documentation projet (vous êtes ici)
│
├── turbo.json              # Configuration Turborepo
└── package.json            # Workspace root
```

## Stack technologique

### Core

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 16.1.1 | Framework web (App Router) |
| React | 19.2.3 | UI Library |
| TypeScript | 5.x | Langage |
| Tailwind CSS | 4.x | Styling |
| Turborepo | 2.3.0 | Build system monorepo |

### AI & Validation

| Technologie | Version | Usage |
|-------------|---------|-------|
| @anthropic-ai/sdk | 0.71.2 | Claude API |
| openai | 6.16.0 | OpenAI API |
| @google/generative-ai | 0.24.1 | Gemini API |
| Zod | 4.3.5 | Schema validation |

### UI & Components

| Technologie | Version | Usage |
|-------------|---------|-------|
| Radix UI | Multiple | Primitives accessibles |
| shadcn/ui | - | Design system |
| Lucide React | 0.562.0 | Icônes |
| class-variance-authority | 0.7.1 | Variants CSS |

### Testing

| Technologie | Version | Usage |
|-------------|---------|-------|
| Vitest | 4.0.17 | Test runner |
| Testing Library | 16.3.1 | Testing utilities |
| jsdom | 27.4.0 | DOM simulation |

## Points d'entrée

### Application Brief

- **URL de développement** : `http://localhost:3001`
- **Point d'entrée** : `apps/brief/app/layout.tsx`
- **Commande** : `npm run brief`

### Routes principales (Brief)

| Route | Description |
|-------|-------------|
| `/` | Dashboard principal |
| `/nouveau` | Création de brief |
| `/nouveau/guide` | Mode guidé (4 questions) |
| `/nouveau/analyse` | Mode analyse IA |
| `/historique` | Liste des briefs |
| `/settings` | Configuration |

### API Routes (Brief)

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/analyze` | POST | Analyse IA d'un contenu |
| `/api/evaluate` | POST | Évaluation d'un brief |
| `/api/questions` | POST | Génération de questions |
| `/api/integrate-responses` | POST | Intégration de réponses |
| `/api/health` | GET | Health check providers |

## Liens vers la documentation détaillée

- [Architecture](./architecture.md) - Architecture technique détaillée
- [Source Tree Analysis](./source-tree-analysis.md) - Analyse de l'arborescence
- [Component Inventory](./component-inventory.md) - Inventaire des composants UI
- [Development Guide](./development-guide.md) - Guide de développement
- [API Contracts](./api-contracts-brief.md) - Contrats API du module Brief

## Prochaines étapes

Ce projet suit la **méthode BMad**. Les prochaines étapes recommandées :

1. **Brainstorm** : Explorer les idées de modules futurs
2. **PRD** : Définir les requirements pour le prochain module
3. **Architecture** : Concevoir l'intégration du nouveau module
4. **Implementation** : Développer selon les stories définies
