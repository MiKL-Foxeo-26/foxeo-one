# Module Notifications — FAQ

## Comment créer une notification depuis un autre module ?

Via insert direct Supabase. Ne jamais importer le module notifications.

```typescript
await supabase.from('notifications').insert({
  recipient_type: 'operator',
  recipient_id: operatorId,
  type: 'alert',
  title: 'Titre',
})
```

## Pourquoi pas de polling ?

Supabase Realtime notifie instantanément via WebSocket. Le polling est interdit par l'architecture.

## Comment personnaliser les icônes ?

Les icônes sont mappées par type dans `NOTIFICATION_ICONS` (`types/notification.types.ts`). Utiliser des icônes Lucide.

## Les notifications sont-elles supprimables ?

Non. Elles sont marquées comme lues (`read_at` timestamp) mais jamais supprimées. Une purge automatique pourra être ajoutée ultérieurement.
