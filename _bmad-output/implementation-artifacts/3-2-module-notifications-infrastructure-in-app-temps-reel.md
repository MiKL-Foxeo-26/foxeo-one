# Story 3.2: Module Notifications — Infrastructure in-app & temps réel

Status: ready-for-dev

## Story

As a **utilisateur (MiKL ou client)**,
I want **recevoir des notifications in-app en temps réel pour les événements importants (validations, messages, alertes)**,
So that **je suis informé immédiatement de ce qui nécessite mon attention**.

## Acceptance Criteria

1. **AC1 — Migration DB** : Table `notifications` créée avec : id (UUID PK), recipient_type (TEXT CHECK 'client'/'operator'), recipient_id (UUID NOT NULL), type (TEXT NOT NULL — 'message', 'validation', 'alert', 'system', 'graduation', 'payment'), title (TEXT NOT NULL), body (TEXT), link (TEXT nullable — URL relative), read_at (TIMESTAMP nullable), created_at. Index `idx_notifications_recipient_created_at`. RLS : `notifications_select_owner`, `notifications_update_owner`.

2. **AC2 — Module Notifications structure** : Module `packages/modules/notifications/` structuré. Manifest id: `notifications`, targets: `['hub', 'client-lab', 'client-one']`, requiredTables: `['notifications']`. Composants: notification-center, notification-badge. Hook: use-notifications. Actions: mark-as-read, create-notification.

3. **AC3 — Badge notification** : Badge dans le header dashboard affichant le nombre de notifications non lues. TanStack Query queryKey `['notifications', recipientId, 'unread-count']`.

4. **AC4 — Centre de notifications** : Clic sur badge → dropdown/panneau latéral. Liste ordonnée récente→ancienne. Chaque notif : icône par type, titre, body tronqué, date relative. Non lues visuellement distinctes (fond accent subtil). Bouton "Tout marquer comme lu".

5. **AC5 — Clic notification** : Si lien → redirection vers page concernée. Notification marquée lue automatiquement via `markAsRead()`.

6. **AC6 — Temps réel** : Nouvelle notification apparaît en temps réel via Realtime (channel: `notifications:{recipientId}`). Invalidation `['notifications', recipientId, 'unread-count']`. Visible < 2 secondes (NFR-P5). Toast discret avec titre (FR61).

7. **AC7 — Tests** : Tests unitaires co-localisés. Tests RLS. Coverage >80%.

## Tasks / Subtasks

- [ ] Task 1 — Migration Supabase (AC: #1)
  - [ ] 1.1 Créer migration `00023_create_notifications.sql`
  - [ ] 1.2 Table `notifications` avec tous les champs
  - [ ] 1.3 Index `idx_notifications_recipient_created_at` (recipient_id, read_at, created_at)
  - [ ] 1.4 RLS policies
  - [ ] 1.5 Activer Realtime sur la table

- [ ] Task 2 — Module Notifications scaffold (AC: #2)
  - [ ] 2.1 `packages/modules/notifications/manifest.ts`
  - [ ] 2.2 `packages/modules/notifications/index.ts`
  - [ ] 2.3 `packages/modules/notifications/types/notification.types.ts`
  - [ ] 2.4 `package.json`, `tsconfig.json`
  - [ ] 2.5 `docs/guide.md`, `faq.md`, `flows.md`

- [ ] Task 3 — Server Actions (AC: #4, #5)
  - [ ] 3.1 `actions/get-notifications.ts` — Récupérer notifications, paginées, ordonnées DESC
  - [ ] 3.2 `actions/get-unread-count.ts` — Compter notifications non lues
  - [ ] 3.3 `actions/mark-as-read.ts` — Marquer une notification lue (set read_at)
  - [ ] 3.4 `actions/mark-all-as-read.ts` — Marquer toutes comme lues
  - [ ] 3.5 `actions/create-notification.ts` — Action utilitaire, appelée par d'autres modules pour créer des notifications

- [ ] Task 4 — Hooks TanStack Query (AC: #3, #4, #6)
  - [ ] 4.1 `hooks/use-notifications.ts` — queryKey `['notifications', recipientId]`
  - [ ] 4.2 `hooks/use-unread-count.ts` — queryKey `['notifications', recipientId, 'unread-count']`
  - [ ] 4.3 `hooks/use-notifications-realtime.ts` — Realtime → invalidateQueries + toast

- [ ] Task 5 — Composants UI (AC: #3, #4, #5)
  - [ ] 5.1 `components/notification-badge.tsx` — Badge compteur dans le header (rond rouge avec nombre)
  - [ ] 5.2 `components/notification-center.tsx` — Dropdown/panneau avec liste notifications
  - [ ] 5.3 `components/notification-item.tsx` — Ligne notification : icône type, titre, body, date relative
  - [ ] 5.4 `components/notification-toast.tsx` — Toast éphémère pour nouvelles notifications

- [ ] Task 6 — Intégration dashboard shell (AC: #3)
  - [ ] 6.1 Intégrer `NotificationBadge` dans le header du dashboard shell (`@foxeo/ui`)
  - [ ] 6.2 Le badge doit fonctionner dans Hub ET Client (même composant, recipient différent)
  - [ ] 6.3 Setup Realtime dans le layout dashboard (provider level)

- [ ] Task 7 — Tests (AC: #7)
  - [ ] 7.1 Tests Server Actions
  - [ ] 7.2 Tests composants : Badge, Center, Item
  - [ ] 7.3 Tests hooks
  - [ ] 7.4 Tests RLS : user A ne voit pas notifications user B

- [ ] Task 8 — Documentation (AC: #7)
  - [ ] 8.1 `docs/guide.md`, `faq.md`, `flows.md`

## Dev Notes

### Architecture — Règles critiques

- **NOUVEAU MODULE** : `packages/modules/notifications/` — créer `manifest.ts` en premier.
- **Module transversal** : Utilisé par tous les dashboards (Hub, Lab, One). Le `create-notification.ts` est une action utilitaire que d'autres modules appellent.
- **Realtime** : `Supabase Realtime → invalidateQueries()` — JAMAIS de sync manuelle.
- **Inter-module communication** : Les autres modules (Chat, CRM, Validation Hub) créent des notifications via insert direct dans la table `notifications` en Supabase (pas d'import du module notifications). Communication inter-modules via Supabase data, pas d'import direct.
- **Response format** : `{ data, error }` — JAMAIS throw.
- **Logging** : `[NOTIFICATIONS:GET]`, `[NOTIFICATIONS:MARK_READ]`, `[NOTIFICATIONS:CREATE]`

### ATTENTION — Conflit table `notifications` avec Story 2.10

La Story 2.10 crée une table `notifications` dans la migration `00021_inactivity_alerting.sql`. Si 2.10 est implémentée avant 3.2 :
- **Vérifier** si la table existe déjà
- **ALTER TABLE** pour ajouter les colonnes manquantes (recipient_type, body, link, etc.)
- Si 2.10 n'est pas encore implémentée, créer la table complète ici

**Recommandation** : Implémenter 3.2 comme la migration définitive de `notifications`. Si 2.10 est faite avant, adapter. La migration 00023 doit utiliser `CREATE TABLE IF NOT EXISTS` ou vérifier.

### Base de données

**Migration `00023`** :
```sql
-- Créer ou étendre la table notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('client', 'operator')),
  recipient_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'validation', 'alert', 'system', 'graduation', 'payment')),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created_at
  ON notifications(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON notifications(recipient_id, read_at) WHERE read_at IS NULL;

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_owner ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY notifications_update_owner ON notifications FOR UPDATE
  USING (recipient_id = auth.uid());

-- INSERT : via service_role ou functions (pas directement par l'utilisateur)
CREATE POLICY notifications_insert_system ON notifications FOR INSERT
  WITH CHECK (true); -- Contrôlé par les Server Actions

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### Realtime — Pattern

```typescript
// hooks/use-notifications-realtime.ts
'use client'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createBrowserSupabaseClient } from '@foxeo/supabase'
import { toast } from '@foxeo/ui' // ou le système toast existant

export function useNotificationsRealtime(recipientId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    const channel = supabase
      .channel(`notifications:${recipientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `recipient_id=eq.${recipientId}`,
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['notifications', recipientId] })
        queryClient.invalidateQueries({ queryKey: ['notifications', recipientId, 'unread-count'] })
        // Toast éphémère
        toast({ title: payload.new.title, description: payload.new.body })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [recipientId, queryClient])
}
```

### Icônes par type de notification

```typescript
const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  message: 'message-circle',
  validation: 'check-circle',
  alert: 'alert-triangle',
  system: 'info',
  graduation: 'award',
  payment: 'credit-card',
}
```

### Date relative

Utiliser `formatRelativeDate` de `@foxeo/utils` (ou créer si inexistant) :
```typescript
// "il y a 2 minutes", "il y a 3 heures", "hier", "12 fév."
```

### Module manifest

```typescript
export const manifest: ModuleManifest = {
  id: 'notifications',
  name: 'Notifications',
  description: 'Centre de notifications in-app temps réel',
  version: '1.0.0',
  targets: ['hub', 'client-lab', 'client-one'],
  navigation: { label: 'Notifications', icon: 'bell', position: 0 }, // Pas dans la nav sidebar, dans le header
  routes: [],
  requiredTables: ['notifications'],
  dependencies: []
}
```

### Fichiers à créer

**Module structure :**
```
packages/modules/notifications/
├── manifest.ts, index.ts, package.json, tsconfig.json
├── docs/guide.md, faq.md, flows.md
├── types/notification.types.ts
├── actions/get-notifications.ts, get-unread-count.ts, mark-as-read.ts, mark-all-as-read.ts, create-notification.ts
├── hooks/use-notifications.ts, use-unread-count.ts, use-notifications-realtime.ts
└── components/notification-badge.tsx, notification-center.tsx, notification-item.tsx, notification-toast.tsx
```

- `supabase/migrations/00023_create_notifications.sql`

### Fichiers à modifier

- Dashboard shell header dans `@foxeo/ui` pour intégrer NotificationBadge
- Layouts Hub et Client pour setup Realtime provider

### Dépendances

- `@foxeo/supabase` — Realtime + Server client
- `@tanstack/react-query` — Cache + invalidation
- `@foxeo/ui` — Toast, Badge, Dropdown

### Anti-patterns — Interdit

- NE PAS importer le module notifications depuis d'autres modules (utiliser insert Supabase direct)
- NE PAS stocker le compteur non lus dans Zustand
- NE PAS faire de polling (Realtime uniquement)
- NE PAS throw dans les Server Actions

### References

- [Source: _bmad-output/planning-artifacts/epics/epic-3-*.md#Story 3.2]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
