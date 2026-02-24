# Module Parcours Lab — Guide

## Vue d'ensemble

Le module Parcours Lab permet aux clients Lab de visualiser et progresser dans leur parcours de création entrepreneuriale, étape par étape.

## Fonctionnalités

- **Vue d'ensemble** : timeline verticale des étapes avec statuts visuels
- **Progression linéaire** : chaque étape se débloque après completion de la précédente
- **Navigation** : clic sur étape `current` → vue détaillée, clic sur `locked` → tooltip informatif
- **Complétion automatique** : notification MiKL + client à la fin du parcours

## Statuts des étapes

| Statut | Description | Visuel |
|--------|-------------|--------|
| `locked` | Non accessible | Grisé + cadenas |
| `current` | En cours | Accent Lab (violet) |
| `completed` | Terminée | Check vert |
| `skipped` | Passée | Orange |

## Usage

```tsx
import { ParcoursOverview } from '@foxeo/module-parcours'

// Page parcours
<ParcoursOverview clientId={clientId} />
```

## Architecture

- **Server Actions** : `getParcours`, `completeStep`, `updateStepStatus`, `skipStep`
- **Hooks** : `useParcours`, `useParcoursSteps` (TanStack Query)
- **Composants** : `ParcoursOverview`, `ParcoursTimeline`, `ParcoursStepCard`, `ParcoursProgressBar`, `ParcoursStepStatusBadge`
