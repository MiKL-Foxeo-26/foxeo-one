# Story 8.2: Conversations Élio — Liste, commutation & historique persistant complet

Status: ready-for-dev

## Story

As a **utilisateur (MiKL ou client)**,
I want **voir la liste de mes conversations Élio, en démarrer de nouvelles sans perdre les anciennes, et retrouver tout l'historique**,
So that **je peux revenir sur des échanges précédents et organiser mes conversations par sujet**.

## Acceptance Criteria

### AC1 : Historique des conversations Élio persistant (FR123)

**Given** l'historique des conversations Élio est stocké dans `elio_conversations` + `elio_messages` (Story 6.4)
**When** un utilisateur ouvre le module Élio
**Then** ses conversations précédentes sont disponibles et persistantes entre sessions :

- Les conversations sont fetchées via TanStack Query avec `queryKey: ['elio-conversations', userId, dashboardType]`
- L'historique complet des messages est chargé à la demande (lazy loading par conversation)
- Les conversations sont triées par date de dernière activité (la plus récente en haut)

**And** la conversation la plus récente est ouverte par defaut

### AC2 : Liste des conversations avec sidebar/drawer (FR123)

**Given** l'utilisateur veut voir ses conversations
**When** il ouvre le panneau de conversations
**Then** une liste latérale (sidebar ou drawer mobile) affiche :

- Chaque conversation avec :
  - Titre (auto-généré ou éditable)
  - Date de dernier message (format relatif : "il y a 2h", "hier")
  - Aperçu du dernier message (30 caractères max)
- La conversation active est surlignée
- Un bouton "Nouvelle conversation" en haut de la liste

**And** sur mobile (< 768px), la liste s'affiche en plein écran avec retour au chat au clic
**And** sur desktop, la liste est un panneau latéral collapsible

### AC3 : Nouvelle conversation (FR124)

**Given** l'utilisateur clique sur "Nouvelle conversation"
**When** la Server Action `newConversation(userId, dashboardType)` s'exécute
**Then** :

1. Une nouvelle entrée est créée dans `elio_conversations` avec `title='Nouvelle conversation'`, `dashboard_type` correspondant
2. L'ancienne conversation n'est PAS supprimée ni modifiée
3. Le chat s'ouvre sur la nouvelle conversation vide
4. Élio affiche un message d'accueil adapté au `dashboard_type` :
   - **Lab** : "Salut ! On reprend ton parcours ? Sur quoi tu veux bosser ?"
   - **One** : "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
   - **Hub** : "Hey MiKL ! Qu'est-ce que je peux faire pour toi ?"

**And** le message d'accueil utilise le profil de communication si disponible (tutoiement/vouvoiement)
**And** le cache TanStack Query est invalidé pour `['elio-conversations']`

### AC4 : Navigation entre conversations

**Given** l'utilisateur navigue entre les conversations
**When** il clique sur une conversation dans la liste
**Then** le chat affiche l'historique complet de cette conversation

**And** le scroll se positionne sur le dernier message
**And** le chargement est progressif si > 50 messages (pagination inverse avec "Charger les messages précédents")
**And** la transition entre conversations est fluide (< 500ms, NFR-P2)

### AC5 : Titre auto-généré

**Given** une conversation accumule plusieurs échanges
**When** le titre est encore "Nouvelle conversation"
**Then** après 3 messages utilisateur, le titre est auto-généré par le LLM en un appel léger :

- **Prompt** : "Résume cette conversation en 5 mots max : {3 premiers messages}"
- Le titre est mis à jour dans `elio_conversations.title`

**And** l'utilisateur peut éditer le titre manuellement (double-clic ou icône edit)

## Tasks / Subtasks

- [ ] **Task 1** : Créer la migration Supabase pour les tables conversations (AC: #1, Story 6.4)
  - [ ] 1.1 : Créer `supabase/migrations/00011_elio_conversations.sql`
  - [ ] 1.2 : Table `elio_conversations` (id, user_id, dashboard_type, title, created_at, updated_at)
  - [ ] 1.3 : Table `elio_messages` (id, conversation_id, role, content, metadata, created_at)
  - [ ] 1.4 : Policies RLS (user ne voit que ses conversations)
  - [ ] 1.5 : Index sur `user_id`, `dashboard_type`, `conversation_id`, `created_at`

- [ ] **Task 2** : Créer les types pour conversations & messages
  - [ ] 2.1 : Ajouter `ElioConversation` dans `types/elio.types.ts`
  - [ ] 2.2 : Ajouter `ElioMessage` avec `role: 'user' | 'assistant'`
  - [ ] 2.3 : Ajouter `ConversationSummary` (pour la liste)

- [ ] **Task 3** : Créer le composant liste conversations (AC: #2)
  - [ ] 3.1 : Créer `components/conversation-list.tsx`
  - [ ] 3.2 : Implémenter la liste avec sidebar desktop
  - [ ] 3.3 : Implémenter drawer mobile (< 768px)
  - [ ] 3.4 : Ajouter le bouton "Nouvelle conversation"
  - [ ] 3.5 : Afficher titre, date, aperçu pour chaque conversation
  - [ ] 3.6 : Surligner la conversation active

- [ ] **Task 4** : Créer le composant item de conversation
  - [ ] 4.1 : Créer `components/conversation-item.tsx`
  - [ ] 4.2 : Afficher titre éditable (double-clic)
  - [ ] 4.3 : Afficher date relative (`formatRelativeDate()`)
  - [ ] 4.4 : Afficher aperçu dernier message (30 char max)

- [ ] **Task 5** : Créer le hook `use-elio-conversations.ts` (AC: #1)
  - [ ] 5.1 : Créer le hook avec TanStack Query
  - [ ] 5.2 : QueryKey `['elio-conversations', userId, dashboardType]`
  - [ ] 5.3 : Fetch via Server Action `getConversations()`
  - [ ] 5.4 : Tri par `updated_at DESC`
  - [ ] 5.5 : Cache 5 minutes

- [ ] **Task 6** : Créer le hook `use-elio-messages.ts`
  - [ ] 6.1 : Créer le hook avec TanStack Query + pagination
  - [ ] 6.2 : QueryKey `['elio-messages', conversationId]`
  - [ ] 6.3 : Fetch via Server Action `getMessages(conversationId, page)`
  - [ ] 6.4 : Pagination inverse (50 messages par page)
  - [ ] 6.5 : Bouton "Charger les messages précédents"

- [ ] **Task 7** : Créer la Server Action `newConversation()` (AC: #3, FR124)
  - [ ] 7.1 : Créer `actions/new-conversation.ts`
  - [ ] 7.2 : Créer l'entrée dans `elio_conversations`
  - [ ] 7.3 : Retourner `{ data: conversation, error: null }`
  - [ ] 7.4 : Invalider le cache `['elio-conversations']`

- [ ] **Task 8** : Créer la Server Action pour le message d'accueil
  - [ ] 8.1 : Créer `actions/generate-welcome-message.ts`
  - [ ] 8.2 : Messages d'accueil par dashboard_type (Lab, One, Hub)
  - [ ] 8.3 : Adapter au profil de communication (tutoiement/vouvoiement)
  - [ ] 8.4 : Créer le message dans `elio_messages` avec `role='assistant'`

- [ ] **Task 9** : Créer la Server Action pour auto-génération titre (AC: #5)
  - [ ] 9.1 : Créer `actions/generate-conversation-title.ts`
  - [ ] 9.2 : Appel LLM léger (prompt: "Résume en 5 mots max")
  - [ ] 9.3 : Mettre à jour `elio_conversations.title`
  - [ ] 9.4 : Déclencher après le 3ème message utilisateur

- [ ] **Task 10** : Édition manuelle du titre
  - [ ] 10.1 : Créer `actions/update-conversation-title.ts`
  - [ ] 10.2 : Mettre à jour `elio_conversations.title`
  - [ ] 10.3 : Invalider le cache `['elio-conversations']`

- [ ] **Task 11** : Intégrer dans `elio-chat.tsx`
  - [ ] 11.1 : Ajouter le panneau conversations collapsible
  - [ ] 11.2 : Connecter `use-elio-conversations()` et `use-elio-messages()`
  - [ ] 11.3 : Gérer la navigation entre conversations (< 500ms transition)
  - [ ] 11.4 : Auto-scroll au dernier message

- [ ] **Task 12** : Tests
  - [ ] 12.1 : Tester `use-elio-conversations()` (fetch, tri, cache)
  - [ ] 12.2 : Tester `use-elio-messages()` (pagination, lazy loading)
  - [ ] 12.3 : Tester `newConversation()` (création, invalidation cache)
  - [ ] 12.4 : Tester auto-génération titre (après 3 messages)

## Dev Notes

### Base de données — Migration 00011

```sql
-- Table elio_conversations
CREATE TABLE elio_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_type TEXT NOT NULL CHECK (dashboard_type IN ('hub', 'lab', 'one')),
  title TEXT DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_elio_conversations_user_id ON elio_conversations(user_id);
CREATE INDEX idx_elio_conversations_dashboard_type ON elio_conversations(dashboard_type);
CREATE INDEX idx_elio_conversations_updated_at ON elio_conversations(updated_at DESC);

-- RLS policies
ALTER TABLE elio_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON elio_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON elio_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON elio_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Table elio_messages
CREATE TABLE elio_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES elio_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_elio_messages_conversation_id ON elio_messages(conversation_id);
CREATE INDEX idx_elio_messages_created_at ON elio_messages(created_at);

-- RLS policies
ALTER TABLE elio_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations"
  ON elio_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM elio_conversations
      WHERE elio_conversations.id = elio_messages.conversation_id
      AND elio_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON elio_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM elio_conversations
      WHERE elio_conversations.id = elio_messages.conversation_id
      AND elio_conversations.user_id = auth.uid()
    )
  );

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_elio_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE elio_conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON elio_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_elio_conversation_timestamp();
```

### Types TypeScript

```typescript
// types/elio.types.ts
export interface ElioConversation {
  id: string
  userId: string
  dashboardType: 'hub' | 'lab' | 'one'
  title: string
  createdAt: string
  updatedAt: string
}

export interface ElioMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  metadata: {
    feedback?: 'useful' | 'not_useful'
    documentId?: string
    profileObservation?: string
    draftType?: 'email' | 'validation_hub' | 'chat'
    evolutionBrief?: boolean
  }
  createdAt: string
}

export interface ConversationSummary {
  id: string
  title: string
  lastMessage: string
  lastMessageDate: string
  isActive: boolean
}
```

### Messages d'accueil par dashboard

```typescript
// config/welcome-messages.ts
export const WELCOME_MESSAGES = {
  hub: {
    formal: "Bonjour MiKL ! Je suis Élio Hub, votre assistant. Comment puis-je vous aider aujourd'hui ?",
    casual: "Hey MiKL ! Qu'est-ce que je peux faire pour toi ?",
  },
  lab: {
    formal: "Bonjour ! Bienvenue sur Élio Lab. Comment puis-je vous accompagner dans votre parcours ?",
    casual: "Salut ! On reprend ton parcours ? Sur quoi tu veux bosser ?",
  },
  one: {
    formal: "Bonjour ! Je suis Élio, votre assistant. Comment puis-je vous aider aujourd'hui ?",
    casual: "Salut ! Comment je peux t'aider aujourd'hui ?",
  },
} as const

export function getWelcomeMessage(
  dashboardType: DashboardType,
  communicationProfile?: CommunicationProfile
): string {
  const isCasual = communicationProfile?.tutoiement ?? false
  return isCasual
    ? WELCOME_MESSAGES[dashboardType].casual
    : WELCOME_MESSAGES[dashboardType].formal
}
```

### Pattern pagination inverse

```typescript
// hooks/use-elio-messages.ts
import { useInfiniteQuery } from '@tanstack/react-query'

export function useElioMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ['elio-messages', conversationId],
    queryFn: ({ pageParam = 0 }) => getMessages(conversationId, pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === PAGE_SIZE ? pages.length : undefined
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 secondes
  })
}

// Dans le composant
const { data, fetchNextPage, hasNextPage } = useElioMessages(conversationId)

// Bouton "Charger les messages précédents"
{hasNextPage && (
  <button onClick={() => fetchNextPage()}>
    Charger les messages précédents
  </button>
)}
```

### Transition fluide entre conversations (NFR-P2)

```typescript
// components/conversation-list.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'

export function ConversationList() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeId}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Chat messages */}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Realtime sync pour nouveaux messages

```typescript
// hooks/use-elio-chat.ts
import { useEffect } from 'react'
import { createBrowserClient } from '@foxeo/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

export function useElioChat(conversationId: string) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`elio:conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'elio_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          // Invalider le cache pour recharger les messages
          queryClient.invalidateQueries({
            queryKey: ['elio-messages', conversationId],
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase, queryClient])

  // ...
}
```

### References

- [Source: Epic 8 — Story 8.2](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-82)
- [Source: Architecture — Implementation Patterns](file:///_bmad-output/planning-artifacts/architecture/04-implementation-patterns.md)
- [Source: PRD — FR123, FR124](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1 (infrastructure Élio)
**FRs couvertes** : FR123 (historique persistant), FR124 (nouvelle conversation)
