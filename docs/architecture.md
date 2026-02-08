# Foxeo One - Architecture Technique

> Documentation générée le 2026-01-20 par BMM Document Project Workflow

## Vue d'ensemble architecturale

Foxeo One utilise une **architecture monorepo modulaire** basée sur Turborepo, permettant :

- **Isolation des modules** : Chaque app est indépendante
- **Partage de code** : Packages communs (ui, utils, tsconfig)
- **Build optimisé** : Caching intelligent et parallélisation
- **Scalabilité** : Ajout facile de nouveaux modules

```
┌─────────────────────────────────────────────────────────────┐
│                      FOXEO ONE                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│   │  apps/brief │   │  apps/???   │   │  apps/???   │       │
│   │  (Next.js)  │   │  (future)   │   │  (future)   │       │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘       │
│          │                 │                 │               │
│          └─────────────────┴─────────────────┘               │
│                            │                                 │
│   ┌────────────────────────┴────────────────────────┐       │
│   │                 PACKAGES PARTAGÉS                │       │
│   ├─────────────┬─────────────┬─────────────────────┤       │
│   │  @foxeo/ui  │@foxeo/utils │ @foxeo/tsconfig     │       │
│   │ (Radix UI)  │ (helpers)   │ (TypeScript)        │       │
│   └─────────────┴─────────────┴─────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Architecture du Module Brief

### Pattern architectural : Layered + Component-Based

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  app/                 components/                        ││
│  │  ├── page.tsx         ├── brief/                        ││
│  │  ├── nouveau/         │   ├── BriefPanel.tsx            ││
│  │  │   ├── page.tsx     │   ├── BriefElementCard.tsx      ││
│  │  │   ├── guide/       │   └── ...                       ││
│  │  │   └── analyse/     ├── dashboard/                    ││
│  │  ├── historique/      ├── layout/                       ││
│  │  └── settings/        └── settings/                     ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     STATE LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  contexts/BriefContext.tsx                               ││
│  │  - currentBrief, briefs[], settings                      ││
│  │  - CRUD operations, AI interactions                      ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  lib/api/    │ │ lib/scoring/ │ │ lib/export/  │         │
│  │  - client.ts │ │ - calculate  │ │ - formatBrief│         │
│  │  - helpers   │ │   Score.ts   │ │   .ts        │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    PROVIDER LAYER (Server)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  lib/providers/                                          ││
│  │  ├── index.ts      # Factory + Registry                  ││
│  │  ├── claude.ts     # Anthropic SDK                       ││
│  │  ├── openai.ts     # OpenAI SDK                          ││
│  │  ├── gemini.ts     # Google AI SDK                       ││
│  │  └── types.ts      # Interfaces communes                 ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                   PERSISTENCE LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  lib/storage/                                            ││
│  │  ├── briefs.ts     # CRUD briefs (localStorage)          ││
│  │  └── settings.ts   # User settings (localStorage)        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Gestion d'état

### React Context Pattern

```typescript
// contexts/BriefContext.tsx
BriefProvider
├── State
│   ├── currentBrief: Brief | null
│   ├── briefs: Brief[]
│   └── isLoading: boolean
│
├── Actions
│   ├── createBrief(input)
│   ├── updateBrief(id, updates)
│   ├── deleteBrief(id)
│   ├── selectBrief(id)
│   └── analyzeBrief(content)
│
└── Effects
    └── Sync with localStorage on changes
```

### Hooks personnalisés

| Hook | Fichier | Usage |
|------|---------|-------|
| `useBriefContext` | contexts/ | Accès au contexte Brief |
| `useBriefs` | hooks/ | Opérations CRUD briefs |
| `useAIApi` | hooks/ | Appels API IA |
| `useAIAvailability` | hooks/ | État des providers |
| `useAutoSave` | hooks/ | Sauvegarde automatique |
| `useSettings` | hooks/ | Paramètres utilisateur |
| `useDebouncedValue` | hooks/ | Debounce de valeurs |
| `useMobile` | @foxeo/ui | Détection mobile |

## Architecture AI Providers

### Factory Pattern

```typescript
// lib/providers/index.ts

interface AIProviderService {
  analyze(content: string): Promise<AnalysisResult>;
  evaluate(brief: Brief): Promise<EvaluationResult>;
  generateQuestions(context: string): Promise<string[]>;
}

// Usage
const provider = getProvider('claude'); // ou 'openai', 'gemini'
const result = await provider.analyze(content);
```

### Flux de données AI

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────┐
│ Client  │───▶│ API Route   │───▶│ Provider    │───▶│ AI API  │
│ (React) │    │ (Next.js)   │    │ (Factory)   │    │ (Cloud) │
└─────────┘    └─────────────┘    └─────────────┘    └─────────┘
                     │
                     ▼
              ┌─────────────┐
              │ Validation  │
              │ (Zod)       │
              └─────────────┘
```

## Modèle de données

### Brief (entité principale)

```typescript
interface Brief {
  id: string;                    // UUID
  title: string;
  createdAt: string;             // ISO 8601
  updatedAt: string;
  status: BriefStatus;           // 'incomplete' | 'needs-work' | 'ready' | 'optimal'
  mode: BriefMode;               // 'guided' | 'analysis'
  elements: BriefElements;
  rawContent?: string;           // Mode analyse uniquement
  followUpQuestions?: string[];
  clientName?: string;
  companyName?: string;
}

interface BriefElements {
  problem: BriefElement;         // Requis
  target: BriefElement;          // Requis
  solution: BriefElement;        // Requis
  differentiator: BriefElement;  // Optionnel
}

interface BriefElement {
  content: string;
  status: ElementStatus;         // 'missing' | 'vague' | 'clear'
  suggestion?: string;           // Suggestion IA si vague
}
```

### Scoring BMAD

```
Status        Condition                              Icône
─────────────────────────────────────────────────────────────
incomplete    Problème, Cible OU Solution manquant   🔴
needs-work    Les 3 présents mais au moins 1 vague   🟠
ready         Problème, Cible, Solution tous clairs  🟢
optimal       + Différenciant clair                  ⭐
```

## Architecture des packages partagés

### @foxeo/ui

```typescript
// Composants exportés (14)
export {
  Alert,
  AlertDialog,
  Badge,
  Button,
  Card,
  Dialog,
  Input,
  Select,
  Separator,
  Sheet,
  Sidebar,
  Skeleton,
  Tabs,
  Textarea,
  Tooltip,
  useMobile,  // Hook
}
```

### @foxeo/utils

```typescript
// Utilitaires exportés
export {
  cn,                 // Merge classnames (clsx + tailwind-merge)
  formatDate,         // Format date complet
  formatShortDate,    // Format date court
  formatRelativeDate, // Format relatif (il y a 2h)
}
```

## Configuration et environnement

### Variables d'environnement (Brief)

```env
# AI Providers (au moins 1 requis)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
```

### Scripts disponibles

```bash
# Racine
npm run dev           # Tous les modules
npm run brief         # Module Brief uniquement
npm run build         # Build production
npm run lint          # Lint tous les modules
npm run clean         # Nettoyer les builds

# Dans apps/brief
npm run dev           # Dev sur port 3001
npm run build         # Build Next.js
npm run lint          # ESLint
```

## Conventions de code

### Structure des fichiers

```
composants/
├── ComponentName.tsx        # Composant principal
├── ComponentName.test.tsx   # Tests (optionnel)
└── index.ts                 # Barrel export
```

### Patterns utilisés

1. **Barrel exports** : Chaque dossier a un `index.ts`
2. **Colocation** : Tests à côté des fichiers source
3. **Types séparés** : Dossier `types/` avec schemas Zod
4. **Server/Client split** : Providers côté serveur uniquement

## Sécurité

### Points d'attention

- **API Keys** : Stockées en variables d'environnement côté serveur
- **Validation** : Tous les inputs validés avec Zod
- **CORS** : Géré par Next.js (API Routes)
- **localStorage** : Données briefs non sensibles uniquement

## Performance

### Optimisations Turborepo

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],    // Build packages d'abord
      "outputs": [".next/**"]     // Cache intelligent
    }
  }
}
```

### Stratégies Next.js

- **App Router** : Streaming et Server Components
- **Font optimization** : Google Fonts optimisées (Geist)
- **Code splitting** : Automatique par route
