# Story 5.5: Écran de bienvenue — Première connexion & tutoriel Lab

Status: ready-for-dev

## Story

As a **nouveau client Lab**,
I want **un écran de bienvenue engageant à ma première connexion avec un tutoriel interactif**,
So that **je comprends rapidement comment utiliser mon espace et je me sens accompagné**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Ajouter colonne `onboarding_completed` (BOOLEAN DEFAULT FALSE) et `first_login_at` (TIMESTAMPTZ nullable) à table `clients`. Index sur `onboarding_completed` pour filtrage.

2. **AC2 — Détection première connexion** : Middleware Next.js vérifie si `clients.first_login_at IS NULL` après login réussi. Si oui, met à jour `first_login_at = NOW()` et redirige vers `/onboarding/welcome`. Sinon, continue vers dashboard normal.

3. **AC3 — Écran de bienvenue** : Page `/onboarding/welcome` (full-screen, pas de dashboard shell). Design : thème Lab (violet/purple), animation subtile. Contenu : "Bienvenue [Prénom] 👋", explication en 3 points du parcours Lab, bouton CTA "Commencer le tutoriel".

4. **AC4 — Tutoriel interactif** : Composant `onboarding-tour.tsx` utilise une lib de product tour (ex: `react-joyride` ou `driver.js`). Steps : (1) Navigation dashboard, (2) Mon parcours Lab (module parcours), (3) Chat Élio, (4) Documents. Chaque step : highlight de la zone + description + bouton "Suivant". Skip possible à tout moment. Dernière étape : "Prêt à démarrer !" + bouton "Terminer".

5. **AC5 — Finalisation onboarding** : Clic "Terminer" → Server Action `completeOnboarding()` met à jour `clients.onboarding_completed = TRUE`. Redirection vers `/dashboard` (ou `/modules/parcours` si parcours assigné). Toast "Bienvenue dans votre espace Lab !".

6. **AC6 — Réinitialiser tutoriel** : Dans les paramètres utilisateur, option "Revoir le tutoriel" qui permet de relancer le tour (sans toucher `onboarding_completed`, juste relance le composant).

7. **AC7 — Tests** : Tests unitaires co-localisés. Tests middleware redirection. Tests composant tour. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00032_add_onboarding_fields_clients.sql`
  - [ ] 1.2 Ajouter colonnes `onboarding_completed`, `first_login_at` à `clients`
  - [ ] 1.3 Index : `idx_clients_onboarding_completed`
  - [ ] 1.4 Migration données existantes : SET onboarding_completed = TRUE pour clients créés avant cette date

- [ ] Task 2 — Middleware redirection (AC: #2)
  - [ ] 2.1 Modifier `apps/client/middleware.ts` — Détection première connexion
  - [ ] 2.2 Requête DB `SELECT first_login_at FROM clients WHERE auth_user_id = ...`
  - [ ] 2.3 Si NULL → update `first_login_at` + redirect `/onboarding/welcome`

- [ ] Task 3 — Server Actions (AC: #5)
  - [ ] 3.1 `actions/complete-onboarding.ts` — Update `onboarding_completed = TRUE`
  - [ ] 3.2 `actions/restart-onboarding-tour.ts` — Relance tour (optionnel, peut être côté client uniquement)

- [ ] Task 4 — Page Welcome (AC: #3)
  - [ ] 4.1 `apps/client/app/onboarding/welcome/page.tsx` — Page full-screen
  - [ ] 4.2 Design : thème Lab, animation d'entrée, illustration
  - [ ] 4.3 Contenu : titre, sous-titre, 3 points clés, CTA

- [ ] Task 5 — Composant Tutoriel (AC: #4)
  - [ ] 5.1 Installer lib `driver.js` (ou alternative `react-joyride`)
  - [ ] 5.2 `components/onboarding-tour.tsx` — Définition des steps
  - [ ] 5.3 Steps : Navigation, Parcours Lab, Chat Élio, Documents
  - [ ] 5.4 Hook `use-onboarding-tour.ts` — Gestion état tour (actif, step actuel, skip)

- [ ] Task 6 — Paramètres utilisateur (AC: #6)
  - [ ] 6.1 Ajouter option "Revoir le tutoriel" dans page `/settings`
  - [ ] 6.2 Bouton déclenche `startTour()` du hook

- [ ] Task 7 — Routes (AC: #3)
  - [ ] 7.1 `apps/client/app/onboarding/welcome/page.tsx`
  - [ ] 7.2 Layout `/onboarding/layout.tsx` — Sans dashboard shell

- [ ] Task 8 — Tests (AC: #7)
  - [ ] 8.1 Tests middleware : première connexion détectée → redirect
  - [ ] 8.2 Tests Server Action : completeOnboarding
  - [ ] 8.3 Tests composant : OnboardingTour, WelcomePage
  - [ ] 8.4 Tests intégration : flux complet première connexion → tutoriel → dashboard

- [ ] Task 9 — Documentation (AC: #7)
  - [ ] 9.1 Documentation onboarding dans `docs/onboarding-flow.md`

## Dev Notes

### Architecture — Règles critiques

- **Middleware** : Détection côté serveur pour éviter flash de contenu.
- **Product tour lib** : `driver.js` recommandé (léger, moderne, accessible). Alternative : `react-joyride`.
- **Thème Lab** : Utiliser les variables CSS du thème Lab (violet/purple accent).
- **Skip** : Le tutoriel DOIT être skippable à tout moment (UX importante).
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[ONBOARDING:FIRST_LOGIN]`, `[ONBOARDING:COMPLETE]`

### Base de données

**Migration `00032`** :
```sql
-- Ajouter colonnes onboarding à clients
ALTER TABLE clients
  ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN first_login_at TIMESTAMPTZ;

-- Index pour filtrage
CREATE INDEX idx_clients_onboarding_completed ON clients(onboarding_completed);

-- Migration données existantes : tous les clients créés avant cette migration
-- sont considérés comme ayant déjà fait l'onboarding
UPDATE clients SET onboarding_completed = TRUE WHERE created_at < NOW();
```

### Middleware — Détection première connexion

```typescript
// apps/client/middleware.ts
import { createMiddlewareSupabaseClient } from '@foxeo/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Vérifier si première connexion
    const { data: client } = await supabase
      .from('clients')
      .select('first_login_at, onboarding_completed')
      .eq('auth_user_id', user.id)
      .single()

    if (client && !client.first_login_at) {
      // Première connexion détectée
      await supabase
        .from('clients')
        .update({ first_login_at: new Date().toISOString() })
        .eq('auth_user_id', user.id)

      console.log('[ONBOARDING:FIRST_LOGIN] Client:', user.id)

      // Redirection vers écran de bienvenue
      if (!request.nextUrl.pathname.startsWith('/onboarding')) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding/welcome'
        return NextResponse.redirect(url)
      }
    }

    // Si onboarding pas terminé et pas sur /onboarding, rediriger
    if (client && !client.onboarding_completed && !request.nextUrl.pathname.startsWith('/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding/welcome'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)']
}
```

### Page Welcome

```typescript
// apps/client/app/onboarding/welcome/page.tsx
import { Button } from '@foxeo/ui/components/button'
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white">
      <div className="max-w-2xl text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold animate-fade-in">
          Bienvenue dans Foxeo Lab 👋
        </h1>
        <p className="text-xl text-purple-200">
          Votre espace de création et d'accompagnement pour donner vie à votre projet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Parcours guidé</h3>
            <p className="text-sm text-purple-200">
              Suivez les étapes de votre parcours Lab pour structurer votre projet.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold mb-2">Élio, votre assistant IA</h3>
            <p className="text-sm text-purple-200">
              Posez vos questions, obtenez des conseils personnalisés 24/7.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-semibold mb-2">Accompagnement MiKL</h3>
            <p className="text-sm text-purple-200">
              Validations, conseils et soutien tout au long de votre parcours.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/onboarding/tour">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-6 text-lg">
              Commencer le tutoriel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Composant Tutoriel

```typescript
// components/onboarding-tour.tsx
'use client'
import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from '../actions/complete-onboarding'

export function OnboardingTour() {
  const router = useRouter()

  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '#sidebar-navigation',
          popover: {
            title: 'Navigation',
            description: 'Accédez à tous vos outils depuis ce menu : parcours, documents, chat, etc.',
            side: 'right',
            align: 'start',
          }
        },
        {
          element: '#module-parcours',
          popover: {
            title: 'Votre parcours Lab',
            description: 'Suivez étape par étape votre parcours de création. Chaque étape validée vous rapproche de votre objectif.',
            side: 'bottom',
            align: 'start',
          }
        },
        {
          element: '#elio-chat-button',
          popover: {
            title: 'Chat Élio',
            description: 'Votre assistant IA est disponible 24/7 pour répondre à vos questions et vous guider.',
            side: 'left',
            align: 'start',
          }
        },
        {
          element: '#module-documents',
          popover: {
            title: 'Vos documents',
            description: 'Tous vos documents, briefs et livrables sont centralisés ici.',
            side: 'bottom',
            align: 'start',
          }
        },
        {
          popover: {
            title: 'Prêt à démarrer ! 🚀',
            description: 'Vous êtes maintenant prêt à utiliser votre espace Lab. Bonne création !',
          }
        }
      ],
      onDestroyStarted: async () => {
        // Finaliser l'onboarding
        await completeOnboarding()
        driverObj.destroy()
        router.push('/dashboard')
      },
    })

    driverObj.drive()

    return () => {
      driverObj.destroy()
    }
  }, [router])

  return null
}
```

### Fichiers à créer

**App client :**
```
apps/client/
├── app/onboarding/
│   ├── layout.tsx (sans dashboard shell)
│   ├── welcome/page.tsx
│   └── tour/page.tsx (avec OnboardingTour)
├── components/onboarding-tour.tsx
├── hooks/use-onboarding-tour.ts
└── actions/complete-onboarding.ts
```

**Migration :**
- `supabase/migrations/00032_add_onboarding_fields_clients.sql`

**Documentation :**
- `docs/onboarding-flow.md`

### Fichiers à modifier

- `apps/client/middleware.ts` — Détection première connexion
- `apps/client/app/(dashboard)/settings/page.tsx` — Option "Revoir le tutoriel"

### Dépendances

- Table `clients`
- Package `driver.js` (ou `react-joyride`)
- Middleware Next.js

### Anti-patterns — Interdit

- NE PAS forcer le tutoriel sans possibilité de skip (UX frustrant)
- NE PAS stocker l'état du tour en DB (localStorage client suffit pour relancer)
- NE PAS bloquer l'accès au dashboard si onboarding pas terminé pendant trop longtemps (laisser accès après X jours)
- NE PAS utiliser de flash de contenu (middleware côté serveur pour redirection propre)

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-5-*.md#Story 5.5]
- [Source: docs/project-context.md]
- [driver.js: https://driverjs.com/]
- [react-joyride: https://docs.react-joyride.com/]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
