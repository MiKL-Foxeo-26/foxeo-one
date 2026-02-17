# Module Chat — Flows

## Flow 1 : Envoi d'un message (client)

```
Client tape message → Enter/bouton envoyer
  → useChatMessages.sendMessage(content)
    → optimistic update : message ajouté localement
    → sendMessage() Server Action
      → validation Zod
      → insert DB messages
      → { data, error }
    → Supabase Realtime (INSERT event)
      → queryClient.invalidateQueries(['messages', clientId])
      → refetch → message confirmé en DB
    → Si erreur : rollback optimistic update
```

## Flow 2 : Réception temps réel (Hub MiKL)

```
Client envoie message
  → Supabase Realtime INSERT event sur messages
    → useChatRealtime hook reçoit l'event
      → invalidateQueries(['messages', clientId])
      → invalidateQueries(['conversations'])
    → TanStack Query refetch automatique
    → ChatWindow se met à jour
    → Badge non lus mis à jour dans sidebar
```

## Flow 3 : Marquage messages lus

```
MiKL ouvre conversation avec client
  → ChatWindow mount
    → markMessagesRead(clientId) appelé
      → UPDATE messages SET read_at = NOW()
        WHERE client_id = X AND read_at IS NULL AND sender_type = 'client'
      → invalidateQueries(['conversations'])
    → Badge non lus mis à jour (→ 0)
```

## Flow 4 : Navigation Hub

```
MiKL arrive sur /modules/chat
  → ChatList charge : useConversations()
    → getConversations() : liste clients + dernier message + count non lus
  → MiKL clique sur un client
    → Navigation vers /modules/chat/[clientId]
      → ChatWindow charge : useChatMessages(clientId)
      → useChatRealtime(clientId) subscribe
      → markMessagesRead(clientId) appelé
```
