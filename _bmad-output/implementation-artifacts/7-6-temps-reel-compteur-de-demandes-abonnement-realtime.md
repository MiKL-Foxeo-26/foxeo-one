# Story 7.6 : Temps réel, compteur de demandes & abonnement Realtime

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **MiKL (opérateur)**,
I want **voir les nouvelles demandes apparaître en temps réel et avoir un compteur visible dans la navigation**,
So that **je ne rate aucune demande urgente et je sais toujours combien de soumissions m'attendent**.

## Acceptance Criteria

### AC 1 : Abonnement Supabase Realtime créé

**Given** le module Validation Hub est chargé dans le Hub
**When** MiKL est connecté
**Then** un abonnement Supabase Realtime est créé sur la table `validation_requests` :
- Canal : `validation-requests-operator-{operatorId}`
- Filtre : `operator_id=eq.{operatorId}`
- Événements écoutés : INSERT, UPDATE

**And** l'abonnement est géré dans le hook `use-validation-realtime.ts`
**And** l'abonnement est nettoyé proprement au démontage du composant (cleanup)

### AC 2 : Nouvelles demandes apparaissent en temps réel (INSERT)

**Given** un nouveau brief Lab ou évolution One est soumis par un client
**When** l'événement INSERT arrive via Realtime
**Then** :
- Le cache TanStack Query est invalidé automatiquement (`invalidateQueries(['validation-requests'])`)
- La liste se met à jour sans rechargement de page
- Une notification toast apparaît : "Nouvelle demande de {client} — {titre}"

**And** la notification apparaît en moins de 2 secondes (NFR-P5)
**And** le toast utilise le composant toast de @foxeo/ui

### AC 3 : Mises à jour de demandes en temps réel (UPDATE)

**Given** le statut d'une demande change (par un autre onglet, un trigger, ou une re-soumission client)
**When** l'événement UPDATE arrive via Realtime
**Then** le cache TanStack Query est invalidé et la liste se met à jour

**And** si le changement est une re-soumission client (status passe de 'needs_clarification' à 'pending') :
- Un toast spécifique apparaît : "Le client {nom} a répondu à votre question"
- Le badge dans la sidebar se met à jour

**And** la mise à jour apparaît en moins de 2 secondes (NFR-P5)

### AC 4 : Badge compteur dans la sidebar

**Given** la sidebar du Hub affiche le module Validation Hub
**When** des demandes sont en statut 'pending'
**Then** un badge numérique s'affiche à côté de l'icône "Validation Hub" dans la navigation :
- Couleur rouge si >= 1 demande en attente
- Nombre affiché (ex: "3")
- Le badge se met à jour en temps réel grâce à l'abonnement Realtime

**And** le compteur est calculé via le `pendingCount` du hook (ou un hook léger dédié pour la sidebar)
**And** le badge disparaît quand toutes les demandes sont traitées

### AC 5 : Widget dashboard Hub (vue matinale)

**Given** MiKL arrive sur le dashboard Hub (accueil)
**When** la page se charge
**Then** un widget "Validations en attente" est affiché dans la section "Actions prioritaires" :
- Nombre de demandes en attente
- Dernière demande reçue (titre + client + date)
- Lien "Voir toutes les demandes" vers le Validation Hub

**And** ce widget utilise le même hook `use-validation-queue` avec le filtre status='pending'
**And** le widget se met à jour en temps réel

### AC 6 : Gestion de la connexion/déconnexion

**Given** MiKL est connecté et l'abonnement Realtime est actif
**When** la connexion est perdue (offline)
**Then** :
- L'abonnement Realtime se reconnecte automatiquement (géré par Supabase)
- Quand la connexion est rétablie : le cache TanStack Query est invalidé pour récupérer les données manquées
- Un toast informatif apparaît : "Connexion rétablie — données à jour"

**And** la gestion de la reconnexion est transparente pour l'utilisateur
**And** aucune donnée n'est perdue pendant la déconnexion

### AC 7 : Performance et nettoyage

**Given** l'abonnement Realtime est actif
**When** le composant est démonté (navigation vers une autre page)
**Then** l'abonnement est correctement nettoyé (unsubscribe)

**And** aucun listener orphelin ne reste en mémoire
**And** les performances ne sont pas impactées (pas de memory leak)

## Tasks / Subtasks

### Task 1 : Créer le hook use-validation-realtime (AC: 1)
- [ ] Créer `hooks/use-validation-realtime.ts`
- [ ] Créer canal Realtime : `validation-requests-operator-{operatorId}`
- [ ] Écouter événements INSERT et UPDATE
- [ ] Filtrer par `operator_id=eq.{operatorId}`
- [ ] Invalider cache TanStack Query lors des événements
- [ ] Cleanup lors du démontage (useEffect return)
- [ ] Écrire test `use-validation-realtime.test.ts`

### Task 2 : Implémenter la gestion INSERT (AC: 2)
- [ ] Dans `use-validation-realtime.ts` : détecter INSERT
- [ ] Invalider `['validation-requests']`
- [ ] Afficher toast : "Nouvelle demande de {client} — {titre}"
- [ ] Extraire client name et titre depuis le payload Realtime
- [ ] Tester l'apparition en temps réel

### Task 3 : Implémenter la gestion UPDATE (AC: 3)
- [ ] Dans `use-validation-realtime.ts` : détecter UPDATE
- [ ] Invalider `['validation-requests']` et `['validation-request', requestId]`
- [ ] Détecter si c'est une re-soumission client (needs_clarification → pending)
- [ ] Afficher toast spécifique : "Le client {nom} a répondu à votre question"
- [ ] Tester l'update en temps réel

### Task 4 : Créer le compteur sidebar (AC: 4)
- [ ] Créer `hooks/use-validation-badge.ts` (hook léger pour compteur)
- [ ] Requête Supabase : COUNT(*) WHERE status='pending' AND operator_id={operatorId}
- [ ] TanStack Query avec queryKey `['validation-badge', operatorId]`
- [ ] Très court staleTime (10 secondes)
- [ ] Intégrer dans la sidebar du Hub
- [ ] Afficher badge rouge avec nombre
- [ ] Badge disparaît si pendingCount === 0

### Task 5 : Intégrer Realtime dans validation-queue (AC: 2-3)
- [ ] Modifier `components/validation-queue.tsx`
- [ ] Appeler `useValidationRealtime(operatorId)` dans le composant
- [ ] Le hook invalide automatiquement le cache
- [ ] La liste se met à jour automatiquement via TanStack Query refetch

### Task 6 : Créer le widget dashboard Hub (AC: 5)
- [ ] Créer `components/validation-hub-widget.tsx`
- [ ] Utiliser `useValidationQueue()` avec filtre status='pending'
- [ ] Afficher nombre de demandes en attente
- [ ] Afficher dernière demande (titre, client, date)
- [ ] Lien "Voir toutes les demandes" vers `/modules/validation-hub`
- [ ] Intégrer dans `apps/hub/app/(dashboard)/page.tsx` (accueil Hub)
- [ ] Écrire test `validation-hub-widget.test.tsx`

### Task 7 : Implémenter la gestion connexion/déconnexion (AC: 6)
- [ ] Écouter événement `SUBSCRIBED` de Supabase Realtime
- [ ] Écouter événement `CLOSED` (déconnexion)
- [ ] Écouter événement `CHANNEL_ERROR`
- [ ] Lors de la reconnexion : invalider le cache pour récupérer les données
- [ ] Afficher toast : "Connexion rétablie — données à jour"
- [ ] Tester la reconnexion automatique

### Task 8 : Implémenter le nettoyage (AC: 7)
- [ ] Dans `use-validation-realtime.ts` : useEffect avec cleanup
- [ ] Unsubscribe du canal lors du démontage
- [ ] Tester qu'aucun listener orphelin ne reste
- [ ] Vérifier les performances (pas de memory leak)

### Task 9 : Tests d'intégration (AC: 1-7)
- [ ] Test abonnement Realtime (canal créé, filtre correct)
- [ ] Test INSERT : nouvelle demande apparaît + toast
- [ ] Test UPDATE : demande mise à jour + toast si re-soumission
- [ ] Test compteur sidebar (badge + nombre)
- [ ] Test widget dashboard
- [ ] Test reconnexion automatique
- [ ] Test cleanup (pas de listener orphelin)

### Task 10 : Documentation (AC: 1-7)
- [ ] Mettre à jour `docs/flows.md` avec diagramme Realtime
- [ ] Documenter le canal Realtime et les événements écoutés
- [ ] Documenter la gestion de la reconnexion

## Dev Notes

### Contexte Epic 7

Cette story est la **sixième et dernière** de l'Epic 7. Elle ajoute le **temps réel** au Validation Hub, permettant à MiKL de recevoir les nouvelles demandes instantanément sans rechargement.

**Dépendances** :
- Story 7.1-7.5 : Structure complète du module
- Epic 3 : Infrastructure Realtime (Supabase)

### Architecture : Supabase Realtime + TanStack Query

**Pattern recommandé** : Realtime invalide le cache TanStack Query, qui déclenche automatiquement un refetch.

**Avantage** : Séparation des responsabilités — Realtime gère les événements, TanStack Query gère les données.

### Références architecture importantes

#### Pattern Supabase Realtime

**Source** : `architecture/04-implementation-patterns.md` — section "Communication Patterns"

```typescript
'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@foxeo/supabase'

export function useValidationRealtime(operatorId: string) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  useEffect(() => {
    // Créer le canal
    const channel = supabase
      .channel(`validation-requests-operator-${operatorId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'validation_requests',
          filter: `operator_id=eq.${operatorId}`,
        },
        (payload) => {
          console.log('[VALIDATION-HUB:REALTIME] New request:', payload.new)
          // Invalider le cache
          queryClient.invalidateQueries({ queryKey: ['validation-requests'] })
          queryClient.invalidateQueries({ queryKey: ['validation-badge', operatorId] })
          // Toast notification
          const request = payload.new as ValidationRequest
          toast.info(`Nouvelle demande de ${request.client?.name} — ${request.title}`)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'validation_requests',
          filter: `operator_id=eq.${operatorId}`,
        },
        (payload) => {
          console.log('[VALIDATION-HUB:REALTIME] Updated request:', payload.new)
          const oldRequest = payload.old as ValidationRequest
          const newRequest = payload.new as ValidationRequest

          // Invalider le cache
          queryClient.invalidateQueries({ queryKey: ['validation-requests'] })
          queryClient.invalidateQueries({ queryKey: ['validation-request', newRequest.id] })
          queryClient.invalidateQueries({ queryKey: ['validation-badge', operatorId] })

          // Toast si re-soumission client
          if (
            oldRequest.status === 'needs_clarification' &&
            newRequest.status === 'pending'
          ) {
            toast.info(`Le client ${newRequest.client?.name} a répondu à votre question`)
          }
        }
      )
      .subscribe()

    // Cleanup
    return () => {
      supabase.removeChannel(channel)
    }
  }, [operatorId, queryClient, supabase])
}
```

#### Pattern Badge compteur dans sidebar

**Source** : Design system Hub

```typescript
// Dans la sidebar du Hub
import { Badge } from '@foxeo/ui'
import { useValidationBadge } from '@/modules/validation-hub/hooks/use-validation-badge'

export function Sidebar() {
  const { pendingCount } = useValidationBadge(operatorId)

  return (
    <SidebarItem href="/modules/validation-hub">
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Validation Hub
      {pendingCount > 0 && (
        <Badge variant="destructive" className="ml-auto">
          {pendingCount}
        </Badge>
      )}
    </SidebarItem>
  )
}
```

#### Pattern Hook léger pour compteur

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { createBrowserClient } from '@foxeo/supabase'

export function useValidationBadge(operatorId: string) {
  const supabase = createBrowserClient()

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['validation-badge', operatorId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('validation_requests')
        .select('*', { count: 'exact', head: true })
        .eq('operator_id', operatorId)
        .eq('status', 'pending')

      if (error) {
        console.error('[VALIDATION-HUB:BADGE] Error:', error)
        return 0
      }

      return count ?? 0
    },
    staleTime: 1000 * 10, // 10 secondes
    refetchInterval: 1000 * 30, // Refetch toutes les 30 secondes en fallback
  })

  return { pendingCount }
}
```

#### Pattern Widget dashboard

```typescript
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@foxeo/ui'
import { Button } from '@foxeo/ui'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { useValidationQueue } from '@/modules/validation-hub/hooks/use-validation-queue'
import { formatRelativeDate } from '@foxeo/utils'
import Link from 'next/link'

export function ValidationHubWidget() {
  const { requests, pendingCount, isLoading } = useValidationQueue()
  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const latestRequest = pendingRequests[0]

  if (isLoading) {
    return <Card><CardContent>Chargement...</CardContent></Card>
  }

  if (pendingCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Validations en attente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune demande en attente — tout est à jour ! 🎉
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Validations en attente</CardTitle>
        <AlertCircle className="h-5 w-5 text-destructive" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-destructive">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">
              {pendingCount === 1 ? 'demande' : 'demandes'} en attente
            </p>
          </div>

          {latestRequest && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium">Dernière demande :</p>
              <p className="text-sm text-muted-foreground mt-1">
                {latestRequest.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {latestRequest.client?.name} •{' '}
                {formatRelativeDate(latestRequest.submittedAt)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/modules/validation-hub" className="w-full">
          <Button className="w-full" variant="outline">
            Voir toutes les demandes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
```

#### Pattern Reconnexion automatique

**Source** : Supabase Realtime events

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`validation-requests-operator-${operatorId}`)
    .on('postgres_changes', { /* ... */ })
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('[VALIDATION-HUB:REALTIME] Connected')
      }
      if (status === 'CLOSED') {
        console.log('[VALIDATION-HUB:REALTIME] Disconnected')
      }
      if (status === 'CHANNEL_ERROR') {
        console.error('[VALIDATION-HUB:REALTIME] Channel error:', err)
      }
    })

  // Écouter la reconnexion
  const handleReconnect = () => {
    console.log('[VALIDATION-HUB:REALTIME] Reconnecting...')
    // Invalider le cache pour récupérer les données manquées
    queryClient.invalidateQueries({ queryKey: ['validation-requests'] })
    toast.info('Connexion rétablie — données à jour')
  }

  window.addEventListener('online', handleReconnect)

  return () => {
    supabase.removeChannel(channel)
    window.removeEventListener('online', handleReconnect)
  }
}, [operatorId, queryClient, supabase])
```

### Technical Requirements

#### Stack & Versions

| Package | Version | Usage |
|---------|---------|-------|
| Next.js | 16.1.1 | App Router |
| React | 19.2.3 | UI Components |
| @tanstack/react-query | ^5.90.x | Cache management + invalidation |
| @supabase/supabase-js | ^2.95.x | Realtime client |
| @foxeo/ui | Internal | Badge, Card, Button, Toast |
| @foxeo/utils | Internal | formatRelativeDate |

#### Supabase Realtime Events

**Événements écoutés** :
- `INSERT` : Nouvelle demande créée
- `UPDATE` : Demande mise à jour (re-soumission, validation, refus, etc.)

**Événements de connexion** :
- `SUBSCRIBED` : Connexion établie
- `CLOSED` : Connexion fermée
- `CHANNEL_ERROR` : Erreur de connexion

### Architecture Compliance

#### Pattern Realtime → Invalidation cache (OBLIGATOIRE)

**RÈGLE ABSOLUE** : Realtime → `queryClient.invalidateQueries()`. Pas de sync manuelle. TanStack Query est la single source of truth pour les données serveur.

#### Pattern Cleanup (OBLIGATOIRE)

**Toujours nettoyer l'abonnement** lors du démontage :

```typescript
useEffect(() => {
  const channel = supabase.channel('...')
  // ...
  return () => {
    supabase.removeChannel(channel)
  }
}, [dependencies])
```

#### Pattern Performance (OBLIGATOIRE)

**Optimisations** :
- StaleTime court pour le badge (10 secondes)
- RefetchInterval en fallback (30 secondes)
- Invalidation ciblée (queryKey spécifiques)
- Pas de refetch global excessif

### Library/Framework Requirements

#### Supabase Realtime

**Documentation** : https://supabase.com/docs/guides/realtime

**Pattern canal** :

```typescript
const channel = supabase
  .channel('channel-name')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'table_name', filter: 'column=eq.value' }, callback)
  .subscribe()
```

**Filter syntax** : `column=eq.value`, `column=neq.value`, `column=gt.value`, etc.

#### TanStack Query Invalidation

**Pattern invalidation** :

```typescript
// Invalider une query spécifique
queryClient.invalidateQueries({ queryKey: ['validation-requests'] })

// Invalider plusieurs queries
queryClient.invalidateQueries({ queryKey: ['validation-requests'] })
queryClient.invalidateQueries({ queryKey: ['validation-badge', operatorId] })
```

### File Structure Requirements

#### Module validation-hub (ajout Story 7.6)

```
packages/modules/validation-hub/
├── hooks/
│   ├── use-validation-realtime.ts   # Story 7.6 ← NOUVEAU
│   ├── use-validation-realtime.test.ts # Story 7.6 ← NOUVEAU
│   ├── use-validation-badge.ts      # Story 7.6 ← NOUVEAU
│   └── use-validation-badge.test.ts # Story 7.6 ← NOUVEAU
├── components/
│   ├── validation-hub-widget.tsx    # Story 7.6 ← NOUVEAU
│   └── validation-hub-widget.test.tsx # Story 7.6 ← NOUVEAU
```

#### Integration Hub

```
apps/hub/app/(dashboard)/
├── page.tsx                         # Ajouter ValidationHubWidget
└── layout.tsx                       # Sidebar avec badge compteur
```

### Testing Requirements

#### Tests à écrire (co-localisés)

| Fichier | Test à écrire | Type |
|---------|---------------|------|
| `use-validation-realtime.ts` | `use-validation-realtime.test.ts` | Hook test + mock Realtime |
| `use-validation-badge.ts` | `use-validation-badge.test.ts` | Hook test |
| `validation-hub-widget.tsx` | `validation-hub-widget.test.tsx` | Component test |

#### Scénarios de test critiques

1. **Test abonnement Realtime** : Vérifier canal créé avec bon filtre
2. **Test INSERT** : Mock événement INSERT → vérifier invalidation cache + toast
3. **Test UPDATE** : Mock événement UPDATE → vérifier invalidation cache
4. **Test re-soumission** : Mock UPDATE needs_clarification → pending → toast spécifique
5. **Test badge compteur** : Vérifier calcul correct du pendingCount
6. **Test widget** : Vérifier affichage dernière demande
7. **Test cleanup** : Vérifier unsubscribe lors du démontage
8. **Test reconnexion** : Mock déconnexion/reconnexion → vérifier invalidation cache

### Project Structure Notes

#### Alignement avec la structure unifiée

Cette story respecte l'architecture définie dans `architecture/05-project-structure.md` :
- Pattern Realtime → invalidation TanStack Query
- Pas de sync manuelle
- Cleanup propre
- Tests co-localisés

#### Performance et scalabilité

**Optimisations** :
- Filtrage côté Supabase (`operator_id=eq.{operatorId}`) — pas de réception de toutes les demandes
- Invalidation ciblée (queryKey spécifiques)
- StaleTime court pour le badge (10s) mais pas trop court pour éviter les requêtes excessives
- RefetchInterval en fallback (30s) au cas où Realtime rate un événement

### References

- [Epic 7 : Validation Hub](_bmad-output/planning-artifacts/epics/epic-7-validation-hub-stories-detaillees.md#story-76)
- [Story 7.1-7.5 : Stories précédentes](.)
- [Architecture Platform](../planning-artifacts/architecture/02-platform-architecture.md)
- [Implementation Patterns — Communication Patterns](../planning-artifacts/architecture/04-implementation-patterns.md#communication-patterns)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [TanStack Query Invalidation](https://tanstack.com/query/latest/docs/react/guides/query-invalidation)

## Dev Agent Record

### Agent Model Used

(À remplir par le dev agent)

### Debug Log References

(À remplir par le dev agent lors de l'implémentation)

### Completion Notes List

(À remplir par le dev agent après implémentation)

### File List

(À remplir par le dev agent — liste des fichiers créés/modifiés)
