# Core Dashboard — Flows

## Chargement initial

1. L'utilisateur arrive sur `/modules/core-dashboard`
2. Le `loading.tsx` affiche un `ModuleSkeleton`
3. Le module est charge via le registry
4. Les donnees sont fetchees via Server Component + TanStack Query
5. Le dashboard personnalise s'affiche

## Navigation

1. L'utilisateur clique sur un element du dashboard
2. Navigation vers le module correspondant via le router
3. Le module cible est charge dynamiquement
