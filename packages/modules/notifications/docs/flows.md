# Module Notifications — Flows

## Flow 1 : Réception d'une notification

1. Un module (Chat, Validation Hub, CRM...) insère dans `notifications` via Supabase
2. Supabase Realtime détecte l'INSERT
3. Le hook `useNotificationsRealtime` reçoit l'événement
4. `invalidateQueries(['notifications', recipientId])` rafraîchit la liste
5. `invalidateQueries(['notifications', recipientId, 'unread-count'])` met à jour le badge
6. Un toast éphémère s'affiche avec le titre de la notification

## Flow 2 : Consultation du centre de notifications

1. L'utilisateur clique sur le badge dans le header
2. Le `NotificationCenter` s'ouvre (dropdown)
3. `useNotifications(recipientId)` fournit la liste paginée
4. Les notifications non lues sont visuellement distinctes (fond accent)

## Flow 3 : Clic sur une notification

1. L'utilisateur clique sur une notification
2. Si `link` est défini → redirection via `router.push(link)`
3. La notification est automatiquement marquée comme lue via `markAsRead()`
4. Le cache est invalidé, le compteur se met à jour

## Flow 4 : Tout marquer comme lu

1. L'utilisateur clique sur "Tout marquer comme lu"
2. `markAllAsRead()` met à jour toutes les notifications non lues
3. Le cache est invalidé, le compteur passe à 0
