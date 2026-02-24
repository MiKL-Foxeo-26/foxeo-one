# Story 5.6: Écran de graduation — Lab vers One

Status: done

## Story

As a **client Lab qui termine son parcours**,
I want **un écran de graduation célébrant ma réussite et m'accueillant dans Foxeo One**,
So that **je ressens une transition positive et comprends les nouvelles fonctionnalités disponibles**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Ajouter colonne `graduated_at` (TIMESTAMPTZ nullable) et `graduation_screen_shown` (BOOLEAN DEFAULT FALSE) à table `clients`. Index sur `graduated_at`.

2. **AC2 — Déclenchement graduation** : Quand MiKL déclenche la graduation (Story 9.1, action `graduateClient()`), le champ `graduated_at` est renseigné. À la prochaine connexion du client, middleware détecte `graduated_at NOT NULL AND graduation_screen_shown = FALSE` → redirige vers `/graduation/celebrate`.

3. **AC3 — Écran de célébration** : Page `/graduation/celebrate` (full-screen, pas de dashboard shell). Design : animation confetti (lib `canvas-confetti`), transition du thème Lab (violet) vers thème One (vert/orange). Contenu : "Félicitations [Prénom] ! 🎉", message personnalisé de MiKL (stocké dans `clients.graduation_message` TEXT nullable), récapitulatif du parcours Lab (durée, étapes complétées). CTA : "Découvrir Foxeo One".

4. **AC4 — Présentation Foxeo One** : Page `/graduation/discover-one` — Présentation des nouveaux modules disponibles dans One (selon les modules activés dans `client_configs`). Cards : CRM, Documents, Chat Élio+, Modules métiers. Chaque card : icône, titre, description courte. Navigation : bouton "Commencer le tutoriel One" ou "Accéder au dashboard".

5. **AC5 — Tutoriel One (optionnel)** : Réutilise le système de product tour (Story 5.5) avec steps adaptés aux modules One actifs. Skip possible. Dernière étape : "Bienvenue dans Foxeo One !".

6. **AC6 — Finalisation** : Clic "Accéder au dashboard" (ou fin du tutoriel) → Server Action `markGraduationScreenShown()` met à jour `graduation_screen_shown = TRUE`. Redirection vers `/dashboard` avec thème One actif. Toast "Bienvenue dans Foxeo One 🚀".

7. **AC7 — Tests** : Tests unitaires co-localisés. Tests middleware graduation. Tests composant célébration. Coverage >80%.

## Tasks / Subtasks

- [x] Task 1 — Migration Supabase (AC: #1)
  - [x] 1.1 Créer migration `00036_add_graduation_fields_clients.sql`
  - [x] 1.2 Ajouter colonnes `graduated_at`, `graduation_screen_shown`, `graduation_message` à `clients`
  - [x] 1.3 Index : `idx_clients_graduated_at`

- [x] Task 2 — Middleware redirection (AC: #2)
  - [x] 2.1 Modifier `apps/client/middleware.ts` — Détection graduation
  - [x] 2.2 Si `graduated_at NOT NULL AND graduation_screen_shown = FALSE` → redirect `/graduation/celebrate`

- [x] Task 3 — Server Actions (AC: #6)
  - [x] 3.1 `actions/mark-graduation-screen-shown.ts` — Update `graduation_screen_shown = TRUE`

- [x] Task 4 — Page Célébration (AC: #3)
  - [x] 4.1 `apps/client/app/graduation/celebrate/page.tsx` — Page full-screen
  - [x] 4.2 Animation confetti (lib `canvas-confetti`)
  - [x] 4.3 Transition thème Lab → One (CSS animation)
  - [x] 4.4 Affichage message personnalisé MiKL
  - [x] 4.5 Récapitulatif parcours Lab (durée, étapes complétées)

- [x] Task 5 — Page Découverte One (AC: #4)
  - [x] 5.1 `apps/client/app/graduation/discover-one/page.tsx` — Présentation modules One
  - [x] 5.2 Récupérer modules actifs depuis `client_configs`
  - [x] 5.3 Cards modules avec icônes, descriptions

- [x] Task 6 — Tutoriel One (AC: #5)
  - [x] 6.1 Réutiliser composant `onboarding-tour.tsx` (Story 5.5) — adapté en `graduation-tour.tsx`
  - [x] 6.2 Adapter steps aux modules One actifs
  - [x] 6.3 Hook `use-graduation-tour.ts`

- [x] Task 7 — Composants UI (AC: #3, #4)
  - [x] 7.1 `components/graduation/graduation-confetti.tsx` — Animation confetti
  - [x] 7.2 `components/graduation/graduation-recap.tsx` — Récapitulatif parcours
  - [x] 7.3 `components/graduation/one-module-card.tsx` — Card module One

- [x] Task 8 — Routes (AC: #3, #4)
  - [x] 8.1 `apps/client/app/graduation/celebrate/page.tsx`
  - [x] 8.2 `apps/client/app/graduation/discover-one/page.tsx`
  - [x] 8.3 Layout `/graduation/layout.tsx` — Sans dashboard shell

- [x] Task 9 — Tests (AC: #7)
  - [x] 9.1 Tests middleware : graduation détectée → redirect (middleware.test.ts)
  - [x] 9.2 Tests Server Action : markGraduationScreenShown (mark-graduation-screen-shown.test.ts)
  - [x] 9.3 Tests composants : GraduationRecap, OneModuleCard, GraduationCelebrate, useGraduationTour
  - [x] 9.4 Tests intégration : flux complet graduation → célébration → tutoriel One → dashboard

- [x] Task 10 — Documentation (AC: #7)
  - [x] 10.1 Documentation graduation dans `docs/graduation-flow.md`

## Dev Notes

### Architecture — Règles critiques

- **Transition thème** : Animation CSS smooth Lab → One (change CSS variables OKLCH).
- **Confetti** : Lib `canvas-confetti` (léger, performant, accessible).
- **Message personnalisé** : Stocké en DB par MiKL lors de la graduation (optionnel).
- **Modules dynamiques** : Afficher uniquement les modules activés pour ce client.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[GRADUATION:CELEBRATE]`, `[GRADUATION:COMPLETE]`

### Base de données

**Migration `00033`** :
```sql
-- Ajouter colonnes graduation à clients
ALTER TABLE clients
  ADD COLUMN graduated_at TIMESTAMPTZ,
  ADD COLUMN graduation_screen_shown BOOLEAN DEFAULT FALSE,
  ADD COLUMN graduation_message TEXT;

-- Index pour filtrage
CREATE INDEX idx_clients_graduated_at ON clients(graduated_at);
```

### Middleware — Détection graduation

```typescript
// apps/client/middleware.ts (ajout à la logique existante)
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: client } = await supabase
      .from('clients')
      .select('graduated_at, graduation_screen_shown')
      .eq('auth_user_id', user.id)
      .single()

    // Si graduated et écran pas encore montré
    if (client && client.graduated_at && !client.graduation_screen_shown) {
      console.log('[GRADUATION:CELEBRATE] Client graduated:', user.id)

      if (!request.nextUrl.pathname.startsWith('/graduation')) {
        const url = request.nextUrl.clone()
        url.pathname = '/graduation/celebrate'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}
```

### Page Célébration

```typescript
// apps/client/app/graduation/celebrate/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Button } from '@foxeo/ui/components/button'
import { GraduationRecap } from '@/components/graduation-recap'

export default function GraduationCelebratePage() {
  const router = useRouter()

  useEffect(() => {
    // Animation confetti
    const duration = 3 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#8b5cf6', '#7c3aed'],
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#8b5cf6', '#7c3aed'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()

    // Transition thème Lab → One (CSS animation)
    document.documentElement.classList.add('theme-transition')
    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', 'one')
    }, 1000)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-green-800 to-orange-900 text-white">
      <div className="max-w-3xl text-center space-y-8 px-4">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl font-bold mb-4">
            Félicitations ! 🎉
          </h1>
          <p className="text-2xl text-purple-200 mb-8">
            Vous avez terminé votre parcours Lab avec succès
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 animate-fade-in-up animation-delay-300">
          <p className="text-lg italic mb-4">
            "Message personnalisé de MiKL ici..."
          </p>
          <p className="text-sm text-purple-200">— MiKL, votre accompagnateur</p>
        </div>

        <GraduationRecap />

        <div className="pt-8">
          <Button
            size="lg"
            onClick={() => router.push('/graduation/discover-one')}
            className="bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-500 hover:to-orange-500 text-white px-10 py-6 text-lg"
          >
            Découvrir Foxeo One
          </Button>
        </div>
      </div>
    </div>
  )
}
```

### Page Découverte One

```typescript
// apps/client/app/graduation/discover-one/page.tsx
import { createServerSupabaseClient } from '@foxeo/supabase/server'
import { Button } from '@foxeo/ui/components/button'
import { OneModuleCard } from '@/components/one-module-card'
import Link from 'next/link'

export default async function DiscoverOnePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Récupérer client + modules actifs
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('auth_user_id', user?.id)
    .single()

  const { data: config } = await supabase
    .from('client_configs')
    .select('active_modules')
    .eq('client_id', client?.id)
    .single()

  const activeModules = config?.active_modules || []

  const allModules = [
    {
      id: 'crm',
      name: 'CRM',
      description: 'Gérez vos contacts, clients et opportunités',
      icon: '👥',
      enabled: activeModules.includes('crm'),
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Stockez et partagez vos documents importants',
      icon: '📄',
      enabled: activeModules.includes('documents'),
    },
    {
      id: 'elio-plus',
      name: 'Élio+',
      description: 'Assistant IA avancé avec actions automatisées',
      icon: '🤖',
      enabled: activeModules.includes('elio'),
    },
    // ... autres modules
  ].filter(m => m.enabled)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-orange-800 to-yellow-900 text-white p-8">
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenue dans Foxeo One</h1>
          <p className="text-xl text-green-200">
            Votre espace professionnel tout-en-un pour gérer votre activité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allModules.map((module) => (
            <OneModuleCard key={module.id} module={module} />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/graduation/tour-one">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
              Commencer le tutoriel
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" className="bg-green-600 hover:bg-green-500">
              Accéder au dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Transition thème CSS

```css
/* apps/client/app/globals.css */
html.theme-transition {
  transition: all 1s ease-in-out;
}

html.theme-transition * {
  transition: background-color 1s ease-in-out, color 1s ease-in-out;
}
```

### Fichiers à créer

**App client :**
```
apps/client/
├── app/graduation/
│   ├── layout.tsx (sans dashboard shell)
│   ├── celebrate/page.tsx
│   ├── discover-one/page.tsx
│   └── tour-one/page.tsx (avec OnboardingTour adapté One)
├── components/graduation-confetti.tsx
├── components/graduation-recap.tsx
├── components/one-module-card.tsx
├── hooks/use-graduation-tour.ts
└── actions/mark-graduation-screen-shown.ts
```

**Migration :**
- `supabase/migrations/00033_add_graduation_fields_clients.sql`

**Documentation :**
- `docs/graduation-flow.md`

### Fichiers à modifier

- `apps/client/middleware.ts` — Détection graduation
- `apps/client/app/globals.css` — Ajouter transition thème

### Dépendances

- **Story 9.1** : Action `graduateClient()` qui définit `graduated_at`
- **Story 5.5** : Composant `onboarding-tour.tsx` (réutilisé pour tutoriel One)
- Table `clients`, `client_configs`
- Package `canvas-confetti`

### Anti-patterns — Interdit

- NE PAS forcer le tutoriel One (doit être skippable)
- NE PAS afficher l'écran de graduation à chaque connexion (flag `graduation_screen_shown`)
- NE PAS bloquer l'accès au dashboard si le client skip la célébration
- NE PAS oublier la transition thème (UX importante pour marquer le changement)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-*.md#Story 5.6]
- [Source: docs/project-context.md]
- [canvas-confetti: https://www.kirilv.com/canvas-confetti/]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

- Migration numéro 00036 (pas 00033 qui existait déjà) : conflits avec migrations existantes
- `@foxeo/supabase/server` n'est pas un export valide du package → utiliser `@foxeo/supabase` directement
- `canvas-confetti` absent des dépendances → installé (AC3 explicite dans story)
- Packages `workspace:*` (`modules/documents`, `modules/visio`) bloquaient `npm install` → corrigés en `*` pour permettre l'install

### Completion Notes List

- **Migration 00036** : ajout colonnes `graduated_at`, `graduation_screen_shown`, `graduation_message` + index `idx_clients_graduated_at` sur table `clients`
- **Middleware** : ajout `isGraduationExcluded()`, `GRADUATION_EXCLUDED_PATHS`, détection graduation après onboarding check. `/graduation` ajouté à `CONSENT_EXCLUDED_PATHS` et `ONBOARDING_EXCLUDED_PATHS`
- **Server Action `markGraduationScreenShown()`** : update `graduation_screen_shown = TRUE`, retourne `{ data, error }` via `successResponse`/`errorResponse`
- **Page célébration** : architecture Server Component (data fetch) + Client Component `GraduationCelebrate` (confetti, interaction). Confetti avec couleurs Lab→One transition
- **Page discover-one** : Server Component, filtre modules actifs depuis `client_configs.active_modules`
- **Page tour-one** : Server Component, `?skip=true` géré par `GraduationTourSkip` client component
- **Tutoriel One** : `GraduationTour` adapté depuis `OnboardingTour`, steps adaptés aux modules actifs
- **Hook `useGraduationTour`** : clé localStorage `foxeo-graduation-tour-completed` distincte de l'onboarding
- **Tests** : 54 nouveaux tests (2183 total vs 2129 avant). Middleware, Server Action, Composants, Hook, Intégration

### File List

**Créés :**
- `supabase/migrations/00036_add_graduation_fields_clients.sql`
- `apps/client/app/graduation/layout.tsx`
- `apps/client/app/graduation/celebrate/page.tsx`
- `apps/client/app/graduation/discover-one/page.tsx`
- `apps/client/app/graduation/tour-one/page.tsx`
- `apps/client/app/graduation/actions/mark-graduation-screen-shown.ts`
- `apps/client/app/graduation/actions/mark-graduation-screen-shown.test.ts`
- `apps/client/app/graduation/graduation-flow.test.ts`
- `apps/client/app/components/graduation/graduation-confetti.tsx`
- `apps/client/app/components/graduation/graduation-recap.tsx`
- `apps/client/app/components/graduation/graduation-recap.test.tsx`
- `apps/client/app/components/graduation/one-module-card.tsx`
- `apps/client/app/components/graduation/one-module-card.test.tsx`
- `apps/client/app/components/graduation/graduation-celebrate.tsx`
- `apps/client/app/components/graduation/graduation-celebrate.test.tsx`
- `apps/client/app/components/graduation/graduation-tour.tsx`
- `apps/client/app/components/graduation/graduation-tour-skip.tsx`
- `apps/client/app/hooks/use-graduation-tour.ts`
- `apps/client/app/hooks/use-graduation-tour.test.ts`
- `docs/graduation-flow.md`

**Modifiés :**
- `apps/client/middleware.ts` — ajout `isGraduationExcluded`, `GRADUATION_EXCLUDED_PATHS`, graduation detection, inclusion de `/graduation` dans `CONSENT_EXCLUDED_PATHS` et `ONBOARDING_EXCLUDED_PATHS`
- `apps/client/middleware.test.ts` — ajout tests `isGraduationExcluded` et graduation redirect logic
- `apps/client/app/globals.css` — ajout `.theme-transition` CSS animation
- `apps/client/package.json` — ajout `canvas-confetti` + `@types/canvas-confetti`
- `packages/modules/documents/package.json` — `workspace:*` → `*` (fix npm compatibility)
- `packages/modules/visio/package.json` — `workspace:*` → `*` (fix npm compatibility)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story `5-6-ecran-de-graduation-lab-vers-one`: `in-progress` → `review`

## Change Log

- 2026-02-24: Story 5.6 implémentée — Écran de graduation Lab vers One. Migration DB, middleware redirection, pages célébration + discover-one + tutoriel One, composants UI, hook, Server Action, 54 nouveaux tests (2183 total).
- 2026-02-24: Code review fixes — H1: cleanup requestAnimationFrame confetti, H2: cleanup theme-transition class, M1: remove canvas-confetti from root package.json, M2: useMemo for steps in GraduationTour, M3: console.error for error logging.
