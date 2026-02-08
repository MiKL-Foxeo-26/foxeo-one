# Foxeo Dash

Plateforme modulaire de dashboards professionnels.

## Structure

```
foxeo-dash/
├── apps/                     # Applications (dashboards)
│
├── packages/
│   ├── ui/                 # Composants UI partagés (shadcn/ui)
│   ├── utils/              # Utilitaires partagés
│   └── tsconfig/           # Configurations TypeScript
│
├── turbo.json              # Configuration Turborepo
└── package.json            # Workspace root
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer tous les modules en développement
npm run dev
```

## Commandes

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance tous les modules en mode développement |
| `npm run build` | Build tous les modules |
| `npm run lint` | Lint tous les modules |

## Packages partagés

### @foxeo/ui

Composants UI basés sur shadcn/ui et Radix UI.

```tsx
import { Button, Card, Input } from '@foxeo/ui'
```

### @foxeo/utils

Utilitaires partagés (cn, formatDate, etc.)

```tsx
import { cn, formatRelativeDate } from '@foxeo/utils'
```
