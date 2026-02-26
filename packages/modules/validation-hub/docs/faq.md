# FAQ — Validation Hub

## Questions fréquentes

### Pourquoi certaines demandes n'apparaissent-elles pas ?

Les demandes sont filtrées par `operator_id` via RLS. Vous ne voyez que les demandes de vos propres clients. Si une demande est manquante, vérifiez :
1. Le filtre de statut actif (basculer sur "Tous")
2. Le filtre de type actif

### Les données sont-elles en temps réel ?

Les données se rafraîchissent automatiquement toutes les **30 secondes** (`staleTime: 30s`). Le temps réel complet (compteur live, nouvelles demandes instantanées) sera ajouté en **Story 7.6** via Supabase Realtime.

### Que signifient les différents statuts ?

| Statut | Signification |
|--------|---------------|
| **En attente** (pending) | Soumission reçue, pas encore traitée |
| **Approuvé** (approved) | Demande validée par MiKL |
| **Refusé** (rejected) | Demande refusée avec commentaire |
| **Précisions demandées** (needs_clarification) | MiKL a demandé des informations supplémentaires |

### Quelle est la différence entre Brief Lab et Évolution One ?

- **Brief Lab** : Soumission d'un brief dans le cadre du Parcours Lab (Story 6.3-6.5)
- **Évolution One** : Demande d'évolution ou de personnalisation dans le dashboard One (Epic 8)

### Comment les demandes sont-elles triées par défaut ?

Les demandes **en attente** apparaissent toujours en premier. Parmi elles, le tri par défaut est **date de soumission croissante** (les plus anciennes d'abord) pour prioriser les demandes les plus urgentes.

### Où est la vue détaillée d'une demande ?

La vue détaillée est implémentée en **Story 7.2**. Cliquez sur une demande pour y accéder.

### Comment valider ou refuser une demande ?

Les actions de validation, refus et demande de précisions seront disponibles en **Stories 7.3 et 7.4**.
