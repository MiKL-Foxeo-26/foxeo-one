# Module Chat — FAQ

## Pourquoi les messages ne sont pas dans Zustand ?

TanStack Query + Supabase Realtime est la source de vérité. Zustand est réservé à l'état UI uniquement (sidebar, préférences). Stocker les messages dans Zustand créerait une désynchronisation avec le serveur.

## Comment fonctionne le temps réel ?

Supabase Realtime écoute les events `INSERT` et `UPDATE` sur la table `messages`. À chaque event, on appelle `queryClient.invalidateQueries({ queryKey: ['messages', clientId] })` pour refetch les données fraîches. Pas de sync manuelle.

## Pourquoi l'optimistic update ?

Pour respecter la contrainte NFR-P2 (réponse < 500ms). Le message est affiché immédiatement dans l'UI via `setQueryData()` avant confirmation serveur. Si le serveur échoue, on rollback vers les données précédentes.

## Peut-on modifier un message ?

Non. Les messages sont immuables (append-only). Seul `read_at` est modifiable pour marquer un message comme lu.

## Comment savoir si un message est non lu ?

`read_at IS NULL` = non lu. Le badge dans la sidebar Hub affiche le count des messages non lus.

## Quelle est la limite de taille d'un message ?

4000 caractères (validé par Zod côté client et serveur).
