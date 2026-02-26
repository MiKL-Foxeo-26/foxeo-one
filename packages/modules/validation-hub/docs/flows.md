# Flux Utilisateur — Validation Hub

## Flux principal : Consultation de la file d'attente

```
MiKL ouvre le Hub
    │
    ▼
Sidebar → clic "Validation Hub"
    │
    ▼
Route: /modules/validation-hub
    │
    ├── Loading: skeleton (loading.tsx)
    │
    ▼
Page chargée: <ValidationQueue />
    │
    ├── useValidationQueue() → TanStack Query → getValidationRequests()
    │       │
    │       └── Supabase: validation_requests JOIN clients
    │               Filtré par operator_id (RLS)
    │
    ▼
Affichage:
    ├── Si requests.length === 0 → EmptyState ("Aucune demande en attente")
    └── Si requests.length > 0 → Liste de ValidationCard
            │
            └── Tri: pending en premier, puis submitted_at ASC
```

## Flux : Filtrage

```
MiKL change un filtre (statut, type, tri)
    │
    ▼
setFilters({ status: 'pending' })
    │
    ▼
État local React mis à jour
    │
    ▼
TanStack Query re-fetch (queryKey change: ['validation-requests', filters])
    │
    ▼
Affichage mis à jour avec nouvelles données
```

## Flux : Navigation vers le détail

```
MiKL clique sur une carte de demande
    │
    ▼
onClick() → router.push('/modules/validation-hub/{requestId}')
    │
    ▼
Route: /modules/validation-hub/[requestId]
    │
    └── Story 7.2 (à implémenter)
```

## Flux : Cycle de vie d'une demande

```
Client soumet un brief (Story 6.3/6.5)
    │
    ▼
validation_requests.status = 'pending'
    │
    ▼
MiKL voit la demande dans la file d'attente
    │
    ├── Story 7.3: Valider → status = 'approved'
    ├── Story 7.3: Refuser → status = 'rejected' + reviewer_comment
    └── Story 7.4: Précisions → status = 'needs_clarification'
                │
                └── Client répond
                        │
                        └── MiKL re-traite la demande
```

## Types de demandes

| Type | Source | Cible |
|------|--------|-------|
| `brief_lab` | Élio Lab (Story 6.5) | Validation Hub Hub |
| `evolution_one` | Élio One+ (Story 8.8) | Validation Hub Hub |

## Statuts et transitions

```
pending ──→ approved
        ──→ rejected
        ──→ needs_clarification ──→ pending (après réponse client)
```
