# Module Parcours Lab — FAQ

## Pourquoi je ne peux pas passer à l'étape suivante ?

L'étape doit être complétée avant que la suivante se débloque. Si `validation_required = true`, vous devez attendre la validation MiKL.

## Puis-je sauter une étape ?

Uniquement via l'action explicite `skipStep()`, qui doit être déclenchée par MiKL (pas par le client directement en V1).

## Où sont stockées les données de progression ?

Exclusivement en base de données Supabase (table `parcours_steps`). Pas de localStorage ni de state local.

## Comment fonctionne la notification de fin de parcours ?

Quand la dernière étape est complétée, `completeStep()` insère deux notifications dans la table `notifications` : une pour le client, une pour l'opérateur MiKL.

## Quel est le lien avec les briefs ?

Chaque étape peut avoir un `brief_template` (texte), utilisé par le module Briefs (Story 6.2+) pour pré-remplir les briefs de l'étape.
