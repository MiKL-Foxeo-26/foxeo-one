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

## Flow 5 : Soumission d'une étape (Story 6.3)

```
Client sur /modules/parcours/steps/[N]/submit
  → SubmitStepForm (react-hook-form + Zod, min 50 chars)
  → submitStep() Server Action
    → Vérification auth (UNAUTHORIZED si absent)
    → Vérification pas de soumission pending existante (DUPLICATE_SUBMISSION)
    → Upload fichiers → Supabase Storage bucket "submissions/" (optionnel)
    → INSERT step_submissions (status='pending')
    → UPDATE parcours_steps.status = 'pending_validation'
    → INSERT notification opérateur (type='alert') — lien vers Hub soumission
    → INSERT notification client (type='info') — "Soumission envoyée"
    → Log [PARCOURS:SUBMIT]
  → Toast succès + redirect /modules/parcours
```

## Flow 6 : Validation MiKL (Story 6.3)

```
MiKL → Hub CRM → fiche client → onglet "Soumissions"
  → SubmissionsList : tableau étape / date / statut / "Voir"
  → clic "Voir" → /modules/crm/clients/[id]/submissions/[subId]
  → SubmissionDetailView (showValidationForm=true)
    → affichage contenu + fichiers joints + statut badge
    → ValidateSubmissionForm

    [Approuver]
      → validateSubmission({ decision: 'approved' }) Server Action
        → UPDATE step_submissions.status = 'approved'
        → UPDATE parcours_steps.status = 'completed'
        → UPDATE étape suivante.status = 'current'
        → INSERT notification client (type='success') — "Validation approuvée"
        → Log [PARCOURS:VALIDATE] approved
      → invalidateQueries(['step-submissions', ...])
      → redirect /modules/crm/clients/[id]

    [Demander révision] (feedback obligatoire)
      → validateSubmission({ decision: 'revision_requested', feedback })
        → UPDATE step_submissions.status = 'revision_requested', feedback_at
        → UPDATE parcours_steps.status = 'current'
        → INSERT notification client (type='warning') — "Révision demandée"
        → Log [PARCOURS:VALIDATE] revision_requested

    [Refuser] (feedback obligatoire)
      → validateSubmission({ decision: 'rejected', feedback })
        → UPDATE step_submissions.status = 'rejected', feedback_at
        → UPDATE parcours_steps.status = 'current'
        → INSERT notification client (type='error') — "Soumission refusée"
        → Log [PARCOURS:VALIDATE] rejected
```

## Flow 7 : Vue soumission client (Story 6.3)

```
Client → /modules/parcours/steps/[N]/submission
  → getSubmissions({ stepId, clientId }) Server Action
    → Récupère dernière soumission (ORDER BY submitted_at DESC)
  → SubmissionDetailView (showValidationForm=false)
    → Affichage statut badge (pending/approved/rejected/revision_requested)
    → Affichage contenu + fichiers
    → Si feedback MiKL présent : section "Commentaire MiKL"
    → Si status='revision_requested' : lien retour vers /submit
```
