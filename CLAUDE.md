# CLAUDE.md — Foxeo One

## Project Overview

Foxeo is a modular SaaS B2B platform for entrepreneurs, using the "Centaure" model (AI + Human). Three dashboards: **Hub** (MiKL operator), **Lab** (client incubation), **One** (client business tool).

- **Monorepo Turborepo** with 2 apps (`hub`, `client`) + shared packages
- **Stack**: Next.js 16.1, React 19, TypeScript strict, Tailwind CSS 4, Vitest
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Deployment**: Vercel (Hub unique, Lab multi-tenant, One instance-per-client)

## Architecture Decisions (MUST follow)

### Data Fetching — 3 patterns only, no exceptions

| Pattern | Usage | Example |
|---------|-------|---------|
| **Server Component** | Read data | RSC with `@foxeo/supabase` server client |
| **Server Action** | Mutations | `'use server'` functions in `actions/` |
| **API Route** | External webhooks only | `app/api/webhooks/[service]/route.ts` |

### State Management — strict separation

- **Server data** → TanStack Query v5 (`@tanstack/react-query ^5.90.x`). Single source of truth for all server data.
- **UI state only** → Zustand (`^5.0.x`). Sidebar, preferences, tabs. NEVER store server data in Zustand.
- **Forms** → React Hook Form + Zod resolver
- **Realtime** → Supabase Realtime invalidates TanStack Query cache via `queryClient.invalidateQueries()`. No manual sync.

### Auth & Security — triple layer

1. **RLS** (Supabase policies) — data protection at DB level
2. **Middleware** (Next.js) — route protection per app
3. **UI** — conditional rendering

RLS functions: `is_admin()`, `is_owner()`, `is_operator()`. Tests RLS are mandatory in CI.

### API Response Format — always `{ data, error }`

```typescript
type ActionResponse<T> = { data: T | null; error: ActionError | null }
type ActionError = { message: string; code: string; details?: unknown }
```

Never `throw` in Server Actions. Always return typed `{ data, error }`.

### Module System — plug & play

Each module lives in `packages/modules/[name]/` and exports a `ModuleManifest`. The registry auto-discovers modules — no hardcoded lists. Modules are loaded via `next/dynamic`.

A module MUST contain: `manifest.ts`, `docs/guide.md`, `docs/faq.md`, `docs/flows.md`.

Modules CANNOT import other modules directly. Inter-module communication goes through Supabase (data) or Realtime (events).

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| DB tables | snake_case, plural | `client_configs`, `module_manifests` |
| DB columns | snake_case | `client_id`, `created_at` |
| RLS policies | `{table}_{action}_{role}` | `clients_select_owner` |
| API URLs | kebab-case, plural | `/api/webhooks/cal-com` |
| JSON responses | camelCase | `{ clientId, activeModules }` |
| Components | PascalCase | `ClientDashboard` |
| Component files | kebab-case.tsx | `client-dashboard.tsx` |
| Hooks | `use` + PascalCase | `useClientConfig()` |
| Zustand stores | `use` + PascalCase + `Store` | `useSidebarStore` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase, no `I` prefix | `ClientConfig` |

**DB ↔ API boundary**: Transform snake_case to camelCase at the service layer using `toCamelCase()` / `toSnakeCase()` from `@foxeo/utils`.

## Project Structure

```
foxeo-dash/
├── apps/
│   ├── hub/                    # Foxeo-Hub (MiKL admin) → hub.foxeo.io
│   └── client/                 # Foxeo-Client template → lab.foxeo.io / {slug}.foxeo.io
├── packages/
│   ├── ui/                     # @foxeo/ui — shadcn/ui + Radix, dashboard shell, themes
│   ├── supabase/               # @foxeo/supabase — client, server, middleware, realtime helpers
│   ├── utils/                  # @foxeo/utils — cn, dates, case-transform, validation schemas
│   ├── types/                  # @foxeo/types — database.types.ts (auto-generated), ModuleManifest, ActionResponse
│   ├── tsconfig/               # @foxeo/tsconfig
│   └── modules/                # Catalogue: core-dashboard, chat, elio, documents, visio, crm, etc.
├── supabase/                   # Migrations, seed, config
├── docker/                     # OpenVidu, Cal.com
└── tests/                      # RLS tests, contract tests, e2e (Playwright)
```

### Module internal structure

```
packages/modules/[name]/
├── index.ts              # Barrel export
├── manifest.ts           # ModuleManifest (FIRST file to create)
├── docs/                 # Documentation (mandatory, CI-checked)
│   ├── guide.md
│   ├── faq.md
│   └── flows.md
├── components/           # React components
├── hooks/                # Module-specific hooks
├── actions/              # Server Actions
├── types/                # Module-specific types
└── utils/                # Internal utilities
```

Tests are **co-located**: `*.test.ts` next to source files, never in a separate `__tests__/` folder.

## UX Design & Visual Identity

### Style: "Minimal Futuriste"

- **Dark mode** default for all dashboards (user can toggle to light)
- **Deep black** background (#020402 or similar)
- **Accent colors** differentiate each dashboard on dark base
- Clean typography, generous whitespace, subtle glow effects
- **Skeleton loaders** everywhere, never spinners

### Dashboard Themes (OKLCH + Tailwind v4 `@theme`)

| Dashboard | Accent Color | Density | Usage |
|-----------|-------------|---------|-------|
| **Hub** | Cyan/Turquoise | Compact | MiKL data-dense cockpit |
| **Lab** | Violet/Purple | Spacious | Client creative incubation |
| **One** | Green/Orange | Comfortable | Client daily business tool |

CSS theme files: `packages/ui/src/themes/{hub,lab,one}.css`
Full reference: `_bmad-output/planning-artifacts/design-system-themes.css`

### Component Library

- **Base**: shadcn/ui + Radix UI
- **Premium**: 21st.dev (case-by-case approval)
- **Dashboard blocks**: Tremor (300+ blocks, same React/Tailwind/Radix stack)
- **Typography**: Poppins (headings/UI) + Inter (body)
- **Theme generator**: [tweakcn.com](https://tweakcn.com)

### Key UI Patterns

- **Dashboard shell** shared across apps (`@foxeo/ui/dashboard-shell`) with content slot
- **Module loading**: `loading.tsx` (skeleton) + `error.tsx` (error boundary) per module route
- **Élio chat** accessible on every page (floating, non-intrusive)
- **Validation Hub** as primary MiKL ↔ Client workflow (1-click validate/comment/video)
- **Graduation Lab→One**: animated transition, welcome message, smooth theme change

## Deployment Model

| Target | Model | URL |
|--------|-------|-----|
| **Hub** | Single instance | `hub.foxeo.io` |
| **Lab** | Multi-tenant (RLS) | `lab.foxeo.io` |
| **One** | Instance per client | `{slug}.foxeo.io` |

Hub communicates with instances via **API REST + HMAC-signed webhooks**. No shared databases between Hub and client instances.

Client One **owns** their code + data. On exit: export code + DB + documentation.

## Quality Gates (CI — all blocking)

- RLS isolation tests (Lab inter-client + One instance isolation)
- Contract tests per module (valid manifest, correct exports, type alignment)
- Module documentation present (`docs/guide.md`, `docs/faq.md`, `docs/flows.md`)
- Lint + TypeScript strict (no `any`, no `as` except documented cases)
- Unit tests >80% coverage
- Build successful

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.95.x | DB, Auth, Storage, Realtime |
| `@supabase/ssr` | latest | Auth SSR for Next.js |
| `@tanstack/react-query` | ^5.90.x | Cache & data fetching |
| `zustand` | ^5.0.x | UI state only |
| `react-hook-form` | ^7.71.x | Form management |
| `zod` | existing | Validation (client + server) |

## Commands

```bash
npm run dev           # All modules (turbo dev)
npm run build         # Production build (turbo build)
npm run lint          # Lint all (turbo lint)
npm run clean         # Clean builds (turbo clean)
```

## Model Routing — BMAD Agents & Workflows (MUST follow)

When a BMAD agent (`/bmad:bmm:agents:*`) or workflow (`/bmad:bmm:workflows:*`) is invoked, **check the recommended model below BEFORE proceeding**. If your current model doesn't match, warn the user in French:

> **Recommandation modele :** Ce {agent/workflow} fonctionne de maniere optimale avec **{model}**. Vous etes actuellement sur **{current_model}**. Tapez `/model` pour changer, ou continuez si vous preferez rester sur ce modele.

Full config: `_bmad/_config/model-routing.yaml`

### Quick Reference

| Tier | Model | Usage |
|------|-------|-------|
| **opus** | Claude Opus 4.6 | Architecture, revue adversariale, decisions complexes |
| **sonnet** | Claude Sonnet 4.5 | Dev quotidien, stories, tests, UX, analyse (DEFAULT) |
| **haiku** | Claude Haiku 4.5 | Status, scaffolding, diagrammes, docs simples |

### Opus (raisonnement complexe)

- **Agents**: architect
- **Workflows**: prd, create-architecture, create-epics-and-stories, check-implementation-readiness, code-review, correct-course, testarch-nfr

### Sonnet (defaut — bon equilibre)

- **Agents**: analyst, dev, pm, sm, ux-designer, tea, quick-flow-solo-dev, bmad-master
- **Workflows**: dev-story, create-story, retrospective, quick-dev, quick-spec, create-product-brief, research, create-ux-design, document-project, generate-project-context, testarch-atdd, testarch-automate, testarch-test-design, testarch-test-review, testarch-trace, brainstorming, party-mode

### Haiku (rapide & economique)

- **Agents**: tech-writer
- **Workflows**: sprint-planning, sprint-status, workflow-init, workflow-status, testarch-ci, testarch-framework, create-excalidraw-*

## Detailed Documentation

| Document | Path |
|----------|------|
| Architecture (7 sections) | `_bmad-output/planning-artifacts/architecture/index.md` |
| PRD (sharded) | `_bmad-output/planning-artifacts/prd/index.md` |
| Architecture PRD (agents, infra, onboarding) | `_bmad-output/planning-artifacts/prd/architecture-prd-consolidee/index.md` |
| UX Design Specification | `_bmad-output/planning-artifacts/ux-design-specification.md` |
| Implementation Patterns | `_bmad-output/planning-artifacts/architecture/04-implementation-patterns.md` |
| Project Structure | `_bmad-output/planning-artifacts/architecture/05-project-structure.md` |
| Design System Themes CSS | `_bmad-output/planning-artifacts/design-system-themes.css` |
| Project Overview (existing code) | `docs/project-overview.md` |
| Existing Architecture (code) | `docs/architecture.md` |
| Internationalization (i18n) | `docs/i18n.md` |
