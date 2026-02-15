# Story 9.2: Graduation Lab vers One — Notification client & activation accès One

Status: ready-for-dev

## Story

As a **client Lab gradué**,
I want **recevoir une notification de graduation et accéder immédiatement à mon nouveau dashboard One**,
so that **je sais que mon parcours est terminé et je peux commencer à utiliser mes outils professionnels**.

## Acceptance Criteria

**Given** la graduation a été exécutée avec succès (Story 9.1) (FR76)
**When** la Server Action termine la transaction
**Then** une notification est envoyée au client :
- Type : 'graduation'
- Titre : "Félicitations ! Votre espace professionnel Foxeo One est prêt !"
- Body : "Votre parcours Lab est terminé. Vous avez maintenant accès à votre dashboard personnalisé avec {X} modules activés."
- Link : "/" (redirige vers l'accueil du dashboard One)
**And** la notification est envoyée en temps réel via Supabase Realtime (NFR-P5, < 2 secondes)
**And** un email de graduation est également envoyé (template spécifique) :
- Objet : "Bienvenue dans Foxeo One — Votre espace professionnel est prêt"
- Contenu : récapitulatif du parcours Lab, lien de connexion, aperçu des modules activés
**And** MiKL est également notifié (type : 'system') : "Graduation effectuée — {nom} est maintenant client One"

**Given** le client se connecte après la graduation
**When** le middleware d'authentification vérifie son profil
**Then** :
1. Le client est redirigé vers son instance dédiée `{slug}.foxeo.io` (au lieu de `lab.foxeo.io`)
   - Le Hub fournit l'URL de l'instance One via `client_instances.instance_url`
   - Le middleware Auth de l'instance Lab détecte le client gradué et redirige
2. Le flag `show_graduation_screen` est détecté
3. L'écran de graduation (Story 5.6) s'affiche avec l'animation et le récapitulatif
4. Après fermeture, le flag est mis à false (affichage unique)
**And** si le client était déjà connecté (session active), la redirection se fait au prochain chargement de page

**Given** le client est sur le dashboard One après la graduation
**When** il ouvre Elio One pour la première fois
**Then** Elio One l'accueille avec un message contextualisé (Story 8.7) :
- "Félicitations pour la fin de votre parcours Lab ! Je suis Elio One, votre nouvel assistant. Je connais déjà votre projet grâce à votre parcours — n'hésitez pas à me poser des questions sur vos outils."
- Le ton est adapté au profil de communication hérité du Lab (FR68, Story 8.4)
**And** le message d'accueil est un `elio_messages` avec `dashboard_type='one'` dans une nouvelle `elio_conversations`

**Given** le client veut consulter ses données Lab après la graduation
**When** il cherche ses anciens briefs ou conversations
**Then** :
- Les documents Lab sont visibles dans le module documents (même table, même client_id)
- Les conversations Lab sont consultables dans le panneau de conversations Elio (section "Historique Lab", filtrées par `dashboard_type='lab'`, lecture seule)
- Le parcours Lab terminé est visible dans un onglet "Mon parcours" (lecture seule, module historique-lab, Epic 10)
**And** le client ne peut plus modifier ou soumettre de briefs Lab (accès lecture seule)

## Tasks / Subtasks

- [ ] Créer système de notifications de graduation (AC: #1)
  - [ ] Créer helper `sendGraduationNotification(clientId)` dans `packages/modules/notifications/actions/send-notification.ts`
  - [ ] Créer notification in-app : type 'graduation', insérer dans table `notifications`
  - [ ] Titre : "Félicitations ! Votre espace professionnel Foxeo One est prêt !"
  - [ ] Body : template avec interpolation `{modulesCount}` modules activés
  - [ ] Link : "/" (racine du dashboard One)
  - [ ] Envoyer via Supabase Realtime channel `client:notifications:{clientId}`
  - [ ] Invalider TanStack Query cache pour `['notifications', clientId]`

- [ ] Créer notification système pour MiKL (AC: #1)
  - [ ] Créer notification type 'system' pour opérateur
  - [ ] Titre : "Graduation effectuée — {nom} est maintenant client One"
  - [ ] Body : récapitulatif (tier, modules activés, date)
  - [ ] Link : `/modules/crm/clients/{clientId}`
  - [ ] Envoyer via channel `operator:notifications:{operatorId}`

- [ ] Créer template email de graduation (AC: #1)
  - [ ] Créer template HTML dans `packages/modules/notifications/templates/graduation-email.html`
  - [ ] Sections : header félicitations, récapitulatif parcours Lab, lien connexion One, aperçu modules
  - [ ] Variables : `{clientName}`, `{companyName}`, `{instanceUrl}`, `{modules}`, `{labDuration}`, `{labStepsCompleted}`
  - [ ] Utiliser Edge Function pour envoi email (Resend ou Supabase Email)
  - [ ] Créer action `sendGraduationEmail(clientId)` dans `packages/modules/notifications/actions/send-email.ts`

- [ ] Modifier middleware Auth client pour redirection gradués (AC: #2)
  - [ ] Modifier `apps/client/middleware.ts`
  - [ ] Après auth success, vérifier `clients.client_type`
  - [ ] Si `client_type = 'one'`, fetch `client_instances.instance_url`
  - [ ] Si instance_url existe et différente de current host → redirect 302 vers `{instance_url}`
  - [ ] Gérer cas où instance pas encore provisionnée (status 'provisioning') → afficher page d'attente
  - [ ] Préserver query params et path dans redirect

- [ ] Implémenter détection flag graduation screen (AC: #2)
  - [ ] Créer helper `checkGraduationScreenFlag(clientId)` dans `packages/modules/core-dashboard/actions/check-graduation-flag.ts`
  - [ ] Query DB One du client : table `user_preferences` ou `client_configs`, colonne `show_graduation_screen`
  - [ ] Si flag = true → retourner `{ shouldShow: true }`
  - [ ] NOTE: Affichage écran graduation implémenté dans Story 5.6

- [ ] Implémenter reset flag graduation screen (AC: #2)
  - [ ] Créer action `dismissGraduationScreen(clientId)` dans `packages/modules/core-dashboard/actions/dismiss-graduation-screen.ts`
  - [ ] UPDATE `user_preferences` SET `show_graduation_screen = false` WHERE `client_id = {clientId}`
  - [ ] Appelé après fermeture de l'écran de graduation (Story 5.6)
  - [ ] Retourner format `{ data, error }` standard

- [ ] Créer message d'accueil Elio One post-graduation (AC: #3)
  - [ ] Modifier `packages/modules/elio/actions/start-conversation.ts`
  - [ ] Détecter si nouvelle conversation Elio One ET client récemment gradué (graduated_at < 7 jours)
  - [ ] Si détecté : insérer message système d'accueil avec template graduation
  - [ ] Template : "Félicitations pour la fin de votre parcours Lab ! Je suis Elio One, votre nouvel assistant..."
  - [ ] Charger `communication_profile` du client pour adapter ton (Story 8.4)
  - [ ] Créer `elio_messages` avec `role='assistant'`, `dashboard_type='one'`, `is_system=true`

- [ ] Implémenter accès lecture seule données Lab (AC: #4)
  - [ ] Documents Lab : aucune modification nécessaire (même table `documents`, filtrée par `client_id`)
  - [ ] Conversations Lab : modifier query dans `packages/modules/elio/actions/get-conversations.ts`
  - [ ] Filtrer conversations par `dashboard_type IN ('lab', 'one')` pour client One
  - [ ] Afficher section "Historique Lab" dans sidebar conversations (filtré `dashboard_type='lab'`)
  - [ ] Messages Lab en lecture seule : désactiver input si `conversation.dashboard_type='lab'`
  - [ ] Parcours Lab : aucune implémentation ici (module historique-lab Epic 10)

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `sendGraduationNotification`: notification créée + Realtime trigger
  - [ ] Test `sendGraduationEmail`: template rendu correctement avec variables
  - [ ] Test middleware redirect: client gradué redirigé vers instance One
  - [ ] Test middleware redirect: client en provisioning → page d'attente
  - [ ] Test `checkGraduationScreenFlag`: flag true → shouldShow true
  - [ ] Test `dismissGraduationScreen`: flag reset à false
  - [ ] Test message accueil Elio One: client gradué < 7j → message système

- [ ] Créer test d'intégration (E2E)
  - [ ] Test flow complet : graduation → notification → redirect → écran graduation → Elio accueil
  - [ ] Test Playwright : vérifier notification in-app reçue < 2s après graduation
  - [ ] Test Playwright : vérifier redirect automatique vers instance One

## Dev Notes

### Architecture Patterns
- **Pattern notifications**: Module notifications centralisé (in-app + email + Realtime)
- **Pattern middleware**: Next.js middleware pour redirect basé sur `client_type`
- **Pattern realtime**: Supabase Realtime channels `client:notifications:{clientId}` et `operator:notifications:{operatorId}`
- **Pattern flag temporaire**: `show_graduation_screen` dans user_preferences, reset après affichage
- **Pattern message système**: Elio message avec `is_system=true` pour accueil contextuel

### Source Tree Components
```
packages/modules/notifications/
├── actions/
│   ├── send-notification.ts          # MODIFIER: ajouter sendGraduationNotification()
│   ├── send-notification.test.ts
│   ├── send-email.ts                 # CRÉER: sendGraduationEmail()
│   └── send-email.test.ts
├── templates/
│   └── graduation-email.html         # CRÉER: template HTML email graduation
└── types/
    └── notification.types.ts         # MODIFIER: ajouter type 'graduation'

apps/client/
└── middleware.ts                     # MODIFIER: ajouter logique redirect clients gradués

packages/modules/core-dashboard/
├── actions/
│   ├── check-graduation-flag.ts      # CRÉER: vérifier flag show_graduation_screen
│   ├── check-graduation-flag.test.ts
│   ├── dismiss-graduation-screen.ts  # CRÉER: reset flag après affichage
│   └── dismiss-graduation-screen.test.ts

packages/modules/elio/
├── actions/
│   ├── start-conversation.ts         # MODIFIER: ajouter message accueil post-graduation
│   ├── start-conversation.test.ts
│   ├── get-conversations.ts          # MODIFIER: filtrer conversations Lab+One pour clients One
│   └── get-conversations.test.ts
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Realtime**: Tester que invalidation TanStack Query se déclenche < 2s
- **E2E**: Playwright pour flow complet graduation → notification → redirect → écran
- **Coverage**: >80% pour actions critiques (notifications, redirect)

### Project Structure Notes
- Alignement avec architecture notifications centralisées (Story 3.2)
- Middleware Auth client déjà existant (Story 1.3) — ajouter logique redirect
- Message système Elio suit pattern existant (Story 8.1)
- Flag graduation screen stocké dans user_preferences (table client-side)

### Key Technical Decisions

**1. Notification temps réel**
- Utiliser Supabase Realtime Postgres Changes (INSERT sur table `notifications`)
- Channel `client:notifications:{clientId}` déjà abonné côté client (Story 3.2)
- Invalidation TanStack Query automatique via listener
- NFR-P5 : notification reçue < 2 secondes après graduation

**2. Email de graduation**
- Template HTML avec variables interpolées
- Envoi via Edge Function (Resend API ou Supabase Email)
- Email envoyé après commit transaction graduation (ne bloque pas l'action)
- Retry automatique si envoi échoue (queue Supabase)

**3. Redirect vers instance One**
- Middleware Next.js vérifie `client_type` après auth
- Si 'one' → fetch `client_instances.instance_url` et redirect 302
- Préserver path et query params dans redirect (`${instanceUrl}${pathname}${search}`)
- Gérer cas provisioning en cours (status 'provisioning') → page d'attente avec loader

**4. Flag graduation screen**
- Stocké dans DB One du client (table `user_preferences` ou `client_configs`)
- Flag `show_graduation_screen: boolean`, default false
- Positionné à true par Story 9.1 lors de la graduation
- Reset à false après affichage de l'écran (Story 5.6)
- Affichage unique (si client refresh page après avoir fermé l'écran, ne réaffiche pas)

**5. Message accueil Elio One**
- Détection : client récemment gradué (graduated_at < 7 jours) + première conversation One
- Message système (is_system=true) avec template spécifique
- Ton adapté au profil de communication hérité du Lab (Story 8.4)
- Créé automatiquement au `startConversation()` si conditions remplies

**6. Accès données Lab en lecture seule**
- Documents : même table `documents`, aucune modification UI/backend nécessaire
- Conversations : filtrer `dashboard_type IN ('lab', 'one')` dans query
- Afficher section "Historique Lab" dans sidebar (lecture seule, pas de réponse)
- Parcours Lab : module historique-lab (Epic 10) — pas implémenté ici

### Database Schema Changes

```sql
-- Migration: add show_graduation_screen flag to user_preferences
-- NOTE: Table user_preferences peut ne pas exister encore, créer si nécessaire
CREATE TABLE IF NOT EXISTS user_preferences (
  client_id UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  show_graduation_screen BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_client_id ON user_preferences(client_id);

-- Trigger updated_at
CREATE TRIGGER trg_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_timestamp();

-- RLS policies pour user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_preferences_select_owner"
  ON user_preferences FOR SELECT
  USING (client_id = auth.uid() OR is_admin());

CREATE POLICY "user_preferences_insert_owner"
  ON user_preferences FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "user_preferences_update_owner"
  ON user_preferences FOR UPDATE
  USING (client_id = auth.uid() OR is_admin());
```

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — Communication Patterns, Realtime]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.2 Requirements]
- [Source: Story 3.2 — Module notifications infrastructure]
- [Source: Story 5.6 — Écran de graduation (consommation du flag)]
- [Source: Story 8.4 — Profil de communication (héritage Lab→One)]
- [Source: Story 8.7 — Elio One chat (message accueil)]

### Dependencies
- **Bloquée par**: Story 9.1 (graduation déclenchement), Story 3.2 (module notifications), Story 5.6 (écran graduation), Story 8.4 (profil communication), Story 8.7 (Elio One)
- **Bloque**: Aucune (story finale du flow graduation)

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
