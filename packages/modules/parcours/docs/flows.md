# Module Parcours Lab — Flows

## Flow 1 : Initialisation du parcours

```
MiKL assigne un template → create_parcours_steps_from_template() [SQL]
  → Steps créés : étape 1 = "current", rest = "locked"
  → Client arrive sur /modules/parcours → ParcoursOverview affiché
```

## Flow 2 : Complétion d'une étape

```
Client clique sur étape current
  → /modules/parcours/steps/[stepNumber]
  → Soumet brief → validation MiKL (si validation_required)
  → MiKL valide → completeStep(stepId)
    → étape N → "completed"
    → étape N+1 → "current" (si existe)
    → sinon : parcours.completed_at renseigné + notifications
```

## Flow 3 : Navigation

```
Étape "locked" → Tooltip "Complétez l'étape X avant"
Étape "current" → Redirect /modules/parcours/steps/[stepNumber]
Étape "completed" → Vue détaillée lecture seule
```

## Flow 4 : Fin de parcours

```
completeStep(dernière étape)
  → parcours.completed_at = NOW()
  → notification client : "Parcours Lab terminé ! 🎉"
  → notification MiKL : "Client a terminé son parcours"
```
