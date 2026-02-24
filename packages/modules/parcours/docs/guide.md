# Module Parcours Lab — Guide

## Vue d'ensemble

Le module Parcours Lab permet aux clients Lab de visualiser et progresser dans leur parcours de création entrepreneuriale, étape par étape.

## Fonctionnalités

- **Vue d'ensemble** : timeline verticale des étapes avec statuts visuels
- **Progression linéaire** : chaque étape se débloque après completion de la précédente
- **Navigation** : clic sur étape `current` → vue détaillée, clic sur `locked` → tooltip informatif
- **Complétion automatique** : notification MiKL + client à la fin du parcours
- **Brief détaillé** : contenu markdown par étape (`brief_content`) avec rendu riche (headings, listes, liens, images)
- **Galerie assets** : images et vidéos YouTube/Vimeo embarquées via `brief_assets` (JSONB array d'URLs)
- **Teasing Foxeo One** : message personnalisé par étape dans une card accent violet/vert (`one_teasing_message`)

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

## Usage

```tsx
import { ParcoursOverview, ParcoursStepDetail } from '@foxeo/module-parcours'

// Page parcours (liste)
<ParcoursOverview clientId={clientId} />

// Page détail étape (Server Component)
<ParcoursStepDetail step={step} totalSteps={parcours.totalSteps} />
```

## Architecture

- **Server Actions** : `getParcours`, `completeStep`, `updateStepStatus`, `skipStep`
- **Hooks** : `useParcours`, `useParcoursSteps` (TanStack Query)
- **Composants** : `ParcoursOverview`, `ParcoursTimeline`, `ParcoursStepCard`, `ParcoursProgressBar`, `ParcoursStepStatusBadge`, `ParcoursStepDetail`, `BriefMarkdownRenderer`, `BriefAssetsGallery`, `OneTeasingCard`, `StepNavigationButtons`

## DB Schema (parcours_steps)

| Colonne | Type | Description |
|---------|------|-------------|
| `brief_template` | TEXT | Template ancien (migré vers brief_content) |
| `brief_content` | TEXT | Brief markdown complet (Story 6.2) |
| `brief_assets` | JSONB | Array URLs images/vidéos (Story 6.2) |
| `one_teasing_message` | TEXT | Message personnalisé teasing One (Story 6.2) |
