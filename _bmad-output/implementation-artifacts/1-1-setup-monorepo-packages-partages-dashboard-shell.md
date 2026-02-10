# Story 1.1: Setup monorepo, packages partages & dashboard shell

Status: ready-for-dev

## Story

As a MiKL (operateur),
I want deux applications distinctes (Hub operateur + Client Lab/One) avec un systeme de modules activables et un design system partage,
So that chaque audience a une experience dediee et optimisee des le depart.

**Type:** Technical Enabler — story fondationnelle, pas de valeur utilisateur directe.

## Acceptance Criteria

### AC1: Shared Packages Foundation

**Given** le starter template Turborepo existant avec @foxeo/ui, @foxeo/utils, @foxeo/tsconfig
**When** la story est completee
**Then** les packages suivants existent et sont fonctionnels :
- `packages/supabase/` avec client.ts, server.ts, middleware.ts, realtime.ts, providers (query-provider, realtime-provider, theme-provider)
- `packages/types/` avec index.ts, module-manifest.ts, action-response.ts, auth.types.ts, client-config.types.ts
- `packages/utils/` mis a jour avec case-transform.ts, format-currency.ts, validation-schemas.ts, module-registry.ts
**And** les dependances sont installees : @supabase/supabase-js ^2.95.x, @supabase/ssr, @tanstack/react-query ^5.90.x, zustand ^5.0.x, react-hook-form ^7.71.x, @hookform/resolvers

### AC2: Application Configuration

**Given** les packages partages en place
**When** les apps hub/ et client/ sont configurees
**Then** chaque app possede :
- `app/(auth)/login/page.tsx` et `app/(auth)/layout.tsx` (placeholder)
- `app/(dashboard)/layout.tsx` avec dashboard shell (sidebar dynamique, header, slot contenu)
- `app/(dashboard)/loading.tsx` avec shell-skeleton
- `app/(dashboard)/modules/[moduleId]/page.tsx` qui charge les modules via registry
- `app/(dashboard)/modules/[moduleId]/loading.tsx` et `error.tsx`
- `middleware.ts` (placeholder auth)
- `layout.tsx` root avec providers (QueryProvider, RealtimeProvider, ThemeProvider)
**And** `turbo dev` lance les deux apps simultanement sans erreur
**And** `turbo build` compile sans erreur TypeScript
**And** le turbo.json contient les tasks : build, dev, lint, test, test:rls, test:contracts, test:e2e, gen:types, clean

### AC3: Module Registry & Discovery

**Given** le module core-dashboard existe
**When** le module registry est actif
**Then** le registry auto-decouvre les manifests des modules dans packages/modules/
**And** le dashboard shell affiche la sidebar avec les modules decouverts
**And** la route dynamique [moduleId] charge le bon module via le registry

## Tasks / Subtasks

- [ ] **Task 1: Create @foxeo/supabase package** (AC: #1)
  - [ ] 1.1 Create `packages/supabase/package.json` with deps: @supabase/supabase-js ^2.95.x, @supabase/ssr latest
  - [ ] 1.2 Create `packages/supabase/tsconfig.json` extending @foxeo/tsconfig/react-library.json
  - [ ] 1.3 Create `src/client.ts` — `createClient()` using `createBrowserClient` from @supabase/ssr
  - [ ] 1.4 Create `src/server.ts` — `createServerClient()` using @supabase/ssr + next/headers cookies
  - [ ] 1.5 Create `src/middleware.ts` — `createMiddlewareClient()` for Next.js middleware
  - [ ] 1.6 Create `src/realtime.ts` — Channel pattern helpers + CHANNEL_PATTERNS constant
  - [ ] 1.7 Create `src/providers/query-provider.tsx` — TanStack Query provider (with devtools in dev)
  - [ ] 1.8 Create `src/providers/realtime-provider.tsx` — Supabase Realtime subscription management
  - [ ] 1.9 Create `src/providers/theme-provider.tsx` — Dynamic OKLCH theme provider (dark mode default)
  - [ ] 1.10 Create `src/index.ts` barrel export
  - [ ] 1.11 Write co-located unit tests for client.ts, server.ts, realtime.ts

- [ ] **Task 2: Create @foxeo/types package** (AC: #1)
  - [ ] 2.1 Create `packages/types/package.json` (pure types, no runtime deps)
  - [ ] 2.2 Create `packages/types/tsconfig.json`
  - [ ] 2.3 Create `src/action-response.ts` — ActionResponse<T>, ActionError types
  - [ ] 2.4 Create `src/module-manifest.ts` — ModuleManifest interface (id, name, version, navigation, routes, targets, dependencies)
  - [ ] 2.5 Create `src/auth.types.ts` — UserRole, Session types
  - [ ] 2.6 Create `src/client-config.types.ts` — ClientConfig interface (active_modules, dashboard_type, theme_variant, custom_branding, elio_config)
  - [ ] 2.7 Create `src/database.types.ts` — placeholder (auto-generated later by `supabase gen types`)
  - [ ] 2.8 Create `src/index.ts` barrel export

- [ ] **Task 3: Update @foxeo/utils package** (AC: #1)
  - [ ] 3.1 Create `src/case-transform.ts` — toCamelCase() / toSnakeCase() (deep recursive object transform)
  - [ ] 3.2 Create `src/format-currency.ts` — cents to EUR formatting (2500 → "25,00 €")
  - [ ] 3.3 Create `src/validation-schemas.ts` — shared Zod schemas (email, password, uuid, etc.)
  - [ ] 3.4 Create `src/module-registry.ts` — getModuleRegistry() auto-discovery system
  - [ ] 3.5 Update `src/index.ts` to export new utilities
  - [ ] 3.6 Add zod to package.json dependencies
  - [ ] 3.7 Write co-located unit tests for case-transform.ts, format-currency.ts, module-registry.ts

- [ ] **Task 4: Update @foxeo/ui — Dashboard Shell & Themes** (AC: #1, #2, #3)
  - [ ] 4.1 Create `src/themes/hub.css` — Hub cyan/turquoise OKLCH palette (density: compact)
  - [ ] 4.2 Create `src/themes/lab.css` — Lab violet/terracotta OKLCH palette (density: spacious)
  - [ ] 4.3 Create `src/themes/one.css` — One orange/green OKLCH palette (density: comfortable)
  - [ ] 4.4 Create `src/components/dashboard-shell.tsx` — Shared shell (sidebar + header + content slot), density variants prop
  - [ ] 4.5 Create `src/components/shell-skeleton.tsx` — Full shell skeleton loader
  - [ ] 4.6 Create `src/components/module-skeleton.tsx` — Generic module skeleton loader
  - [ ] 4.7 Create `src/components/empty-state.tsx` — Empty state with icon, title, description, CTA
  - [ ] 4.8 Create `src/components/toast.tsx` — Toast notification system
  - [ ] 4.9 Update `src/index.ts` barrel export with new components
  - [ ] 4.10 Update `src/globals.css` to import theme base variables
  - [ ] 4.11 Update `package.json` with any new dependencies (if needed)

- [ ] **Task 5: Create Hub app (apps/hub/)** (AC: #2)
  - [ ] 5.1 Initialize Next.js 16.1 app in `apps/hub/` with TypeScript strict, Tailwind CSS 4, App Router
  - [ ] 5.2 Configure `next.config.ts` with transpilePackages for @foxeo/* packages
  - [ ] 5.3 Configure `tailwind.config.ts` extending @foxeo/ui
  - [ ] 5.4 Create `app/layout.tsx` root with providers (QueryProvider, RealtimeProvider, ThemeProvider)
  - [ ] 5.5 Create `app/globals.css` importing hub.css theme
  - [ ] 5.6 Create `app/(auth)/layout.tsx` + `app/(auth)/login/page.tsx` (placeholder)
  - [ ] 5.7 Create `app/(dashboard)/layout.tsx` with DashboardShell (density="compact")
  - [ ] 5.8 Create `app/(dashboard)/loading.tsx` with ShellSkeleton
  - [ ] 5.9 Create `app/(dashboard)/page.tsx` — Hub home (placeholder)
  - [ ] 5.10 Create `app/(dashboard)/modules/[moduleId]/page.tsx` — dynamic module loader via registry
  - [ ] 5.11 Create `app/(dashboard)/modules/[moduleId]/loading.tsx` with ModuleSkeleton
  - [ ] 5.12 Create `app/(dashboard)/modules/[moduleId]/error.tsx` — error boundary
  - [ ] 5.13 Create `middleware.ts` (placeholder auth check)
  - [ ] 5.14 Create `package.json` with workspace deps (@foxeo/ui, @foxeo/supabase, @foxeo/utils, @foxeo/types)

- [ ] **Task 6: Create Client app (apps/client/)** (AC: #2)
  - [ ] 6.1 Same structure as hub but with Lab/One dynamic theme loading
  - [ ] 6.2 `app/globals.css` importing lab.css by default (dynamic switch for One)
  - [ ] 6.3 `app/(dashboard)/layout.tsx` with DashboardShell (density from client_config)
  - [ ] 6.4 All other files mirror hub structure with client-specific middleware
  - [ ] 6.5 Create `package.json` with workspace deps

- [ ] **Task 7: Create core-dashboard module** (AC: #3)
  - [ ] 7.1 Create `packages/modules/core-dashboard/manifest.ts` with ModuleManifest
  - [ ] 7.2 Create `packages/modules/core-dashboard/index.ts` barrel export
  - [ ] 7.3 Create `packages/modules/core-dashboard/components/core-dashboard.tsx` (placeholder welcome page)
  - [ ] 7.4 Create `packages/modules/core-dashboard/docs/guide.md`
  - [ ] 7.5 Create `packages/modules/core-dashboard/docs/faq.md`
  - [ ] 7.6 Create `packages/modules/core-dashboard/docs/flows.md`
  - [ ] 7.7 Create `packages/modules/core-dashboard/package.json`

- [ ] **Task 8: Update Turborepo config** (AC: #2)
  - [ ] 8.1 Update `turbo.json` to add tasks: test, test:rls, test:contracts, test:e2e, gen:types
  - [ ] 8.2 Configure dependency graph (packages build before apps)
  - [ ] 8.3 Ensure `turbo dev` starts both hub and client apps

- [ ] **Task 9: Install root dependencies & verify** (AC: #1, #2)
  - [ ] 9.1 Run `npm install` at root to install all workspace dependencies
  - [ ] 9.2 Run `turbo build` — verify zero TypeScript errors
  - [ ] 9.3 Run `turbo dev` — verify both apps start without errors
  - [ ] 9.4 Verify module registry discovers core-dashboard
  - [ ] 9.5 Verify dashboard shell renders with sidebar showing core-dashboard

## Dev Notes

### Architecture Patterns (MUST follow)

**Data Fetching — 3 patterns ONLY:**
1. Server Component → read data (RSC with @foxeo/supabase server client)
2. Server Action → mutations (`'use server'` functions in `actions/`)
3. API Route → external webhooks ONLY (`app/api/webhooks/[service]/route.ts`)

**State Management — strict separation:**
- Server data → TanStack Query v5 (single source of truth, NEVER in Zustand)
- UI state → Zustand (sidebar, preferences, tabs ONLY)
- Forms → React Hook Form + Zod resolver
- Realtime → Supabase Realtime invalidates TanStack Query cache via `queryClient.invalidateQueries()`

**Error Handling — ALWAYS `{ data, error }` response:**
```typescript
type ActionResponse<T> = { data: T | null; error: ActionError | null }
type ActionError = { message: string; code: string; details?: unknown }
```
NEVER throw in Server Actions. Always return typed response.

**Module System — plug & play:**
- Each module in `packages/modules/[name]/` exports ModuleManifest
- Registry auto-discovers — NO hardcoded lists
- Modules loaded via `next/dynamic`
- Module MUST contain: manifest.ts, docs/guide.md, docs/faq.md, docs/flows.md
- Modules CANNOT import other modules directly

### Naming Conventions (MUST follow)

| Context | Convention | Example |
|---------|-----------|---------|
| DB tables | snake_case, plural | `client_configs` |
| DB columns | snake_case | `client_id` |
| RLS policies | `{table}_{action}_{role}` | `clients_select_owner` |
| API URLs | kebab-case, plural | `/api/webhooks/cal-com` |
| JSON responses | camelCase | `{ clientId, activeModules }` |
| Components | PascalCase | `ClientDashboard` |
| Component files | kebab-case.tsx | `client-dashboard.tsx` |
| Hooks | `use` + PascalCase | `useClientConfig()` |
| Zustand stores | `use` + PascalCase + `Store` | `useSidebarStore` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase, no `I` prefix | `ClientConfig` |

**DB ↔ API boundary:** Transform snake_case to camelCase at service layer using toCamelCase()/toSnakeCase() from @foxeo/utils.

### Key Type Definitions

```typescript
// ModuleManifest — EVERY module must export this
interface ModuleManifest {
  id: string
  name: string
  version: string
  description: string
  navigation: { icon: string; label: string; position: number }
  routes: Array<{ path: string; component: React.ComponentType }>
  apiRoutes?: Array<{ path: string; method: 'GET' | 'POST' | 'PUT' | 'DELETE' }>
  requiredTables: string[]
  targets: ('hub' | 'client-lab' | 'client-one')[]
  dependencies: string[]
}
```

### Dashboard Shell Specifications

**DashboardShell props:**
```typescript
interface DashboardShellProps {
  density?: 'compact' | 'comfortable' | 'spacious'  // Hub=compact, One=comfortable, Lab=spacious
  activeModule?: string
  children?: React.ReactNode
}
```

**Layout hierarchy:**
```
DashboardShell
├── Sidebar (module navigation from registry, collapse via useSidebarStore)
├── Header (breadcrumb, notifications, profile, theme toggle)
└── ContentArea ([children] — module content)
```

**OKLCH Theme Colors (from design-system-themes.css):**

| Dashboard | Primary Dark | Background Dark | Sidebar | Radius |
|-----------|-------------|-----------------|---------|--------|
| Hub | `oklch(0.3640 0.0489 211.6889)` cyan | `oklch(0.1572 0.0121 216.5659)` | dark blue-grey | 0.375rem |
| Lab | `oklch(0.7104 0.1115 33.7528)` golden | `oklch(0.2882 0.0491 30.0902)` warm brown | `oklch(0.2177 0.0238 32.4986)` | 0.5rem |
| One | `oklch(0.7175 0.1747 50.3148)` orange | `oklch(0 0 0)` pure black | `oklch(0.1469 0.0041 49.2499)` | 0.5rem |

**Typography:** Poppins (headings/UI), Inter (body). Monospace per dashboard: Hub=Geist Mono, Lab=monospace, One=JetBrains Mono.

**CRITICAL:** Dark mode default for ALL dashboards. Skeleton loaders everywhere, NEVER spinners.

### Supabase Client Patterns

```typescript
// client.ts — Browser-side
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// server.ts — Server-side (RSC + Server Actions)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export function createServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll(cookiesToSet) { /* ... */ } } }
  )
}

// realtime.ts — Channel patterns
export const CHANNEL_PATTERNS = {
  clientNotifications: (clientId: string) => `client:notifications:${clientId}`,
  chatRoom: (clientId: string) => `chat:room:${clientId}`,
  presence: (operatorId: string) => `presence:operator:${operatorId}`,
  clientConfig: (clientId: string) => `client:config:${clientId}`,
}
```

### Existing Code (DO NOT recreate)

**Already exists — extend, don't replace:**
- `packages/tsconfig/` — base.json, nextjs.json, react-library.json (complete)
- `packages/ui/src/` — 14 shadcn components (button, card, input, dialog, select, separator, sheet, sidebar, skeleton, tabs, textarea, alert, alert-dialog, badge)
- `packages/ui/src/globals.css` — base Tailwind styles
- `packages/ui/src/use-mobile.ts` — mobile detection hook
- `packages/utils/src/cn.ts` — classnames merge utility
- `packages/utils/src/date.ts` — date formatting (formatRelativeDate, formatShortDate, formatDate)
- Root `turbo.json` — has build, dev, lint, clean (needs test tasks added)
- Root `package.json` — workspaces configured, turbo ^2.3.0

**Does NOT exist yet — create from scratch:**
- `apps/hub/` — entire Hub application
- `apps/client/` — entire Client application
- `packages/supabase/` — entire package
- `packages/types/` — entire package
- `packages/modules/` — module catalogue structure
- Theme CSS files (hub.css, lab.css, one.css)
- Dashboard shell component
- Shell/module skeleton components
- Case transform, format-currency, validation-schemas, module-registry utilities

### Testing Standards

- **Unit tests:** Vitest, co-located `*.test.ts` next to source (NEVER `__tests__/` folder)
- **Coverage:** >80% required
- **RLS tests:** `tests/rls/` — verify data isolation
- **Contract tests:** `tests/contracts/` — verify module manifests + docs
- **E2E tests:** `tests/e2e/` — Playwright

### Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Create `.env.example` at root with placeholders.

### Project Structure Notes

- Monorepo with npm workspaces (`apps/*`, `packages/*`)
- Turborepo ^2.3.0 for task orchestration
- TypeScript strict mode across all packages
- Tailwind CSS 4 with OKLCH color space
- Next.js 16.1 App Router for both apps

### References

- [Source: _bmad-output/planning-artifacts/architecture/05-project-structure.md — Complete project tree]
- [Source: _bmad-output/planning-artifacts/architecture/03-core-decisions.md — Data fetching, state management, auth patterns]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — Code patterns and conventions]
- [Source: _bmad-output/planning-artifacts/architecture/02-platform-architecture.md — Module system, deployment model]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Dashboard shell UX, themes, accessibility]
- [Source: _bmad-output/planning-artifacts/design-system-themes.css — OKLCH theme definitions]
- [Source: _bmad-output/planning-artifacts/epics/epic-1-fondation-plateforme-authentification-stories-detaillees.md — Story 1.1 requirements]
- [Source: CLAUDE.md — Enforced conventions and architecture decisions]

## Dev Agent Record

### Agent Model Used

(to be filled by dev agent)

### Debug Log References

### Completion Notes List

### File List
