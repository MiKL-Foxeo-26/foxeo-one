# Story 9.5c: Anonymisation & rétention des données après résiliation

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **archiver, puis anonymiser les données des clients résiliés après la période de rétention**,
so that **la plateforme est conforme RGPD et les obligations comptables sont respectées**.

## Acceptance Criteria

**Given** un client est résilié (FR93)
**When** son compte est désactivé par MiKL
**Then** les données sont ARCHIVÉES (jamais supprimées immédiatement) :
1. `clients.status` → 'archived'
2. `clients.archived_at` → NOW()
3. Le client perd l'accès au dashboard (middleware bloque la connexion)
4. Les données restent en base (RLS empêche l'accès mais ne supprime pas)
5. Un champ `clients.retention_until` → NOW() + {periode_retention} est positionné
**And** la période de rétention par défaut est de **90 jours** (configurable)
**And** les obligations comptables sont respectées : les factures sont conservées **10 ans** indépendamment de la rétention client (conformité fiscale française)
**And** un événement 'client_archived' est loggé dans `activity_logs`

**Given** la période de rétention est écoulée
**When** un processus de nettoyage s'exécute (Supabase Edge Function, cron hebdomadaire)
**Then** les données du client sont anonymisées :
1. `clients.name` → 'Client supprimé #{id_court}'
2. `clients.email` → 'deleted_{uuid}@anonymized.foxeo.io'
3. `clients.company` → null
4. Les `elio_conversations` et `elio_messages` sont supprimées
5. Les `messages` (chat MiKL) sont anonymisés (contenu → 'Message supprimé')
6. Les `documents` sont supprimés du Storage (fichiers physiques)
7. Les `notifications` sont supprimées
8. Le `client_configs` est supprimé (sauf `subscription_tier` pour historique facturation)
9. Les `validation_requests` sont conservées (anonymisées) pour les stats
10. Les données de facturation sont PRÉSERVÉES (obligation légale 10 ans)
**And** `clients.status` → 'deleted'
**And** un événement 'client_data_purged' est loggué dans `activity_logs`
**And** l'anonymisation est irréversible

**Given** MiKL veut consulter les clients archivés
**When** il accède à la liste clients avec le filtre "Archivés"
**Then** les clients archivés sont visibles avec :
- Mention "Archivé" + date d'archivage
- Date de suppression prévue (`retention_until`)
- Bouton "Réactiver" (si dans la période de rétention)
- Les données sont encore consultables tant que la rétention n'est pas écoulée
**And** après la suppression/anonymisation, seul le nom anonymisé et les données comptables restent

**Given** MiKL veut réactiver un client archivé (dans la période de rétention)
**When** il clique sur "Réactiver"
**Then** `clients.status` → le statut précédent ('lab' ou 'one')
**And** `clients.archived_at` → null, `clients.retention_until` → null
**And** le client retrouve l'accès à son dashboard avec toutes ses données intactes
**And** une notification est envoyée au client : "Votre compte Foxeo a été réactivé"

## Tasks / Subtasks

- [ ] Créer action archivage client (AC: #1)
  - [ ] Créer `packages/modules/crm/actions/archive-client.ts`
  - [ ] Signature: `archiveClient(clientId: string, retentionDays?: number): Promise<ActionResponse<void>>`
  - [ ] Validation Zod : clientId UUID, retentionDays optionnel (default 90, min 30, max 365)
  - [ ] Vérifier que client status != 'archived' et != 'deleted'
  - [ ] UPDATE `clients` SET status='archived', archived_at=NOW(), retention_until=NOW() + INTERVAL '{retentionDays} days'
  - [ ] INSERT `activity_logs` : type 'client_archived', metadata { retentionDays, retentionUntil }
  - [ ] Retourner format `{ data: null, error }` standard

- [ ] Créer UI archivage dans fiche client (AC: #1)
  - [ ] Modifier `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Section "Administration" → bouton "Archiver le client"
  - [ ] Au clic : dialog confirmation avec warning
  - [ ] Dialog : "Archiver {nom} ?" + mention période rétention (90 jours par défaut)
  - [ ] Champ optionnel : période rétention personnalisée (slider 30-365 jours)
  - [ ] Warning : "Le client perdra l'accès immédiatement. Données conservées {X} jours puis anonymisées."
  - [ ] Boutons "Confirmer l'archivage" (destructive) / "Annuler"

- [ ] Implémenter blocage accès client archivé (AC: #1)
  - [ ] Modifier `apps/client/middleware.ts`
  - [ ] Après auth success, vérifier `clients.status`
  - [ ] Si status = 'archived' : bloquer accès, afficher page "Compte archivé"
  - [ ] Page archivé : "Votre compte Foxeo a été archivé. Contactez MiKL pour plus d'informations."

- [ ] Créer filtre "Archivés" dans liste clients (AC: #3)
  - [ ] Modifier `packages/modules/crm/components/client-list.tsx`
  - [ ] Ajouter option filtre status : "Tous", "Actifs", "Archivés", "Supprimés"
  - [ ] Filtre "Archivés" : status = 'archived'
  - [ ] Afficher badge "Archivé" + date archivage
  - [ ] Afficher date suppression prévue (`retention_until`)
  - [ ] Bouton "Réactiver" visible si retention_until > NOW()

- [ ] Créer action réactivation client (AC: #4)
  - [ ] Créer `packages/modules/crm/actions/reactivate-client.ts`
  - [ ] Signature: `reactivateClient(clientId: string): Promise<ActionResponse<void>>`
  - [ ] Vérifier que status = 'archived' ET retention_until > NOW()
  - [ ] Si retention_until < NOW() : retourner error 'CLIENT_DATA_PURGED' (trop tard pour réactiver)
  - [ ] Fetch `clients.previous_status` (à créer) pour restaurer ancien status ('lab' ou 'one')
  - [ ] UPDATE `clients` SET status=previous_status, archived_at=null, retention_until=null
  - [ ] INSERT `activity_logs` : type 'client_reactivated'
  - [ ] Créer notification client : "Votre compte Foxeo a été réactivé"
  - [ ] Retourner format `{ data: null, error }` standard

- [ ] Créer Edge Function nettoyage périodique (AC: #2)
  - [ ] Créer `supabase/functions/cleanup-archived-clients/index.ts`
  - [ ] Déclenchée par cron hebdomadaire (Supabase Cron)
  - [ ] Query `clients` WHERE status='archived' AND retention_until < NOW()
  - [ ] Pour chaque client :
    - Anonymiser `clients` : name → 'Client supprimé #{last 8 char id}', email → 'deleted_{uuid}@anonymized.foxeo.io', company → null
    - DELETE `elio_conversations` WHERE client_id = {clientId}
    - DELETE `elio_messages` (cascade via foreign key)
    - UPDATE `messages` SET content='Message supprimé', sender_name='Utilisateur supprimé' WHERE client_id = {clientId}
    - DELETE fichiers Storage : bucket `documents`, path `{clientId}/*`
    - DELETE `notifications` WHERE client_id = {clientId}
    - DELETE `client_configs` (SAUF si données facturation liées)
    - UPDATE `validation_requests` SET client_name='Client supprimé' WHERE client_id = {clientId}
    - PRÉSERVER données facturation (tables `invoices`, `subscriptions` si Epic 11)
    - UPDATE `clients` SET status='deleted'
    - INSERT `activity_logs` : type 'client_data_purged', metadata { anonymizedAt: NOW() }
  - [ ] Logger résultats : nombre clients anonymisés, erreurs éventuelles
  - [ ] Retourner rapport (log Supabase)

- [ ] Créer colonne `previous_status` dans clients (AC: #4)
  - [ ] Migration : ALTER TABLE clients ADD COLUMN previous_status TEXT
  - [ ] UPDATE `archiveClient` action pour stocker ancien status avant archivage

- [ ] Implémenter conservation données comptables (AC: #2)
  - [ ] Les tables facturation (Epic 11) ne sont PAS supprimées ni anonymisées
  - [ ] Obligation légale : conservation 10 ans (conformité fiscale France)
  - [ ] Données conservées : invoices, subscriptions, payment_methods
  - [ ] Link client_id reste (même si client anonymisé) pour traçabilité comptable

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `archiveClient`: client actif → status archived + retention_until
  - [ ] Test `archiveClient`: client déjà archived → error 'CLIENT_ALREADY_ARCHIVED'
  - [ ] Test `reactivateClient`: client archived dans rétention → status restauré
  - [ ] Test `reactivateClient`: client archived hors rétention → error 'CLIENT_DATA_PURGED'
  - [ ] Test Edge Function : anonymisation complète + données comptables préservées
  - [ ] Test Edge Function : fichiers Storage supprimés

- [ ] Créer test RLS
  - [ ] Test : opérateur A ne peut pas archiver client de opérateur B
  - [ ] Test : client archivé ne peut pas se connecter (middleware bloque)

## Dev Notes

### Architecture Patterns
- **Pattern archivage**: Soft delete (status 'archived') + période rétention
- **Pattern anonymisation**: Irréversible après rétention, données comptables préservées
- **Pattern cron**: Edge Function hebdomadaire pour nettoyage automatique
- **Pattern conformité**: RGPD (droit à l'oubli) + obligations fiscales (conservation 10 ans)
- **Pattern réactivation**: Possible uniquement dans période rétention

### Source Tree Components
```
packages/modules/crm/
├── actions/
│   ├── archive-client.ts             # CRÉER: Server Action archivage
│   ├── archive-client.test.ts
│   ├── reactivate-client.ts          # CRÉER: Server Action réactivation
│   └── reactivate-client.test.ts
├── components/
│   ├── client-info-tab.tsx           # MODIFIER: ajouter bouton archivage
│   └── client-list.tsx               # MODIFIER: ajouter filtre "Archivés"

apps/client/
├── middleware.ts                     # MODIFIER: bloquer accès clients archivés
└── app/(dashboard)/
    └── archived/
        └── page.tsx                  # CRÉER: page "Compte archivé"

supabase/functions/
└── cleanup-archived-clients/
    └── index.ts                      # CRÉER: Edge Function nettoyage cron

supabase/migrations/
├── [timestamp]_add_archiving_fields.sql  # CRÉER: colonnes archived_at, retention_until, previous_status
└── [timestamp]_create_cron_cleanup.sql   # CRÉER: cron hebdomadaire
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Integration**: Tester Edge Function anonymisation complète
- **RLS**: Test isolation opérateur (ne peut pas archiver client d'un autre)
- **Conformité**: Test données comptables préservées après anonymisation

### Project Structure Notes
- Alignement avec module CRM (Story 2.1, 2.3)
- Préservation données comptables (Epic 11)
- Edge Function cron Supabase pour nettoyage automatique
- Page bloquée client archivé (apps/client)

### Key Technical Decisions

**1. Période de rétention par défaut**
- **90 jours** (3 mois) par défaut
- Configurable par MiKL : min 30 jours, max 365 jours
- Conforme RGPD : données conservées le temps nécessaire (Art. 5)
- Permet réactivation rapide si erreur

**2. Archivage vs suppression**
- **Archivage** : soft delete, données conservées, accès bloqué
- **Suppression/anonymisation** : après rétention, irréversible
- Status : 'active' → 'archived' → 'deleted'
- Client archivé peut être réactivé (dans période rétention)
- Client supprimé ne peut PAS être réactivé (anonymisation irréversible)

**3. Anonymisation irréversible**
- Name : 'Client supprimé #{last 8 char id}' (traçabilité)
- Email : 'deleted_{uuid}@anonymized.foxeo.io' (unique, invalide)
- Company : null
- Conversations Elio : supprimées (RGPD droit à l'oubli)
- Messages MiKL : contenu anonymisé, metadata préservé (stats)
- Documents : fichiers physiques supprimés (Storage)
- Pas de rollback possible

**4. Conservation données comptables**
- **Obligation légale France** : conservation factures 10 ans
- Tables facturation (Epic 11) : JAMAIS supprimées ni anonymisées
- Données conservées : invoices, subscriptions, payment_methods
- Link client_id reste (traçabilité comptable)
- Séparation claire : données personnelles (anonymisées) vs comptables (préservées)

**5. Processus nettoyage automatique**
- Edge Function cron hebdomadaire (dimanche 3h AM)
- Query clients archivés dont retention_until < NOW()
- Anonymisation batch (peut traiter plusieurs clients)
- Logging détaillé : nombre clients anonymisés, erreurs
- Idempotent : peut être relancé sans risque

**6. Réactivation possible**
- Uniquement si retention_until > NOW() (dans période rétention)
- Restauration status précédent (lab ou one)
- Toutes les données intactes (pas d'anonymisation encore)
- Notification client automatique
- Si hors rétention : error 'CLIENT_DATA_PURGED' (trop tard)

### Database Schema Changes

```sql
-- Migration: add archiving fields to clients table
ALTER TABLE clients
  ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN retention_until TIMESTAMP WITH TIME ZONE,
  ADD COLUMN previous_status TEXT;

-- Migration: add index on retention_until for cron query
CREATE INDEX idx_clients_retention_until ON clients(retention_until) WHERE status = 'archived';

-- Migration: update client_status enum to include 'archived' and 'deleted'
ALTER TYPE client_status ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE client_status ADD VALUE IF NOT EXISTS 'deleted';

-- Migration: create Supabase cron for weekly cleanup
-- NOTE: Supabase cron config (pg_cron extension)
-- Exécution : chaque dimanche à 3h AM
SELECT cron.schedule(
  'cleanup-archived-clients',
  '0 3 * * 0', -- Cron syntax: minute hour day month weekday
  $$
  SELECT net.http_post(
    url := 'https://{project-ref}.supabase.co/functions/v1/cleanup-archived-clients',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer {anon-key}"}'::jsonb
  );
  $$
);
```

### Anonymisation Rules (RGPD Compliance)

**Données anonymisées (irréversible) :**
- Nom client
- Email client
- Téléphone client
- Entreprise
- Adresse
- Conversations Elio (texte intégral)
- Messages MiKL (contenu, sender_name)
- Documents (fichiers physiques)
- Notifications
- Préférences utilisateur

**Données conservées (traçabilité) :**
- Client ID (hash pour traçabilité)
- Dates (created_at, archived_at, deleted_at)
- Statuts (historique workflow)
- Logs activité (anonymisés : 'Client supprimé')
- Données comptables (obligation légale 10 ans)
- Stats agrégées (anonymisées)

**Données préservées (obligations légales) :**
- Factures (10 ans, obligation fiscale France)
- Abonnements (historique paiements)
- Transactions (traçabilité comptable)
- Client_id link (traçabilité, pas de données personnelles)

### Cron Function Logic

```typescript
// supabase/functions/cleanup-archived-clients/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Admin access
  )

  // 1. Fetch clients à anonymiser
  const { data: clientsToAnonymize, error } = await supabase
    .from('clients')
    .select('id, name, email')
    .eq('status', 'archived')
    .lt('retention_until', new Date().toISOString())

  if (error || !clientsToAnonymize?.length) {
    return new Response(JSON.stringify({ message: 'No clients to anonymize' }), { status: 200 })
  }

  const results = []

  // 2. Anonymiser chaque client
  for (const client of clientsToAnonymize) {
    try {
      const anonymizedId = client.id.slice(-8)
      const anonymizedEmail = `deleted_${crypto.randomUUID()}@anonymized.foxeo.io`

      // Anonymiser données personnelles
      await supabase.from('clients').update({
        name: `Client supprimé #${anonymizedId}`,
        email: anonymizedEmail,
        company: null,
        phone: null,
        address: null,
        status: 'deleted',
      }).eq('id', client.id)

      // Supprimer conversations Elio
      await supabase.from('elio_conversations').delete().eq('client_id', client.id)

      // Anonymiser messages MiKL
      await supabase.from('messages').update({
        content: 'Message supprimé',
        sender_name: 'Utilisateur supprimé',
      }).eq('client_id', client.id)

      // Supprimer fichiers Storage
      const { data: files } = await supabase.storage.from('documents').list(client.id)
      if (files?.length) {
        await supabase.storage.from('documents').remove(files.map(f => `${client.id}/${f.name}`))
      }

      // Supprimer notifications
      await supabase.from('notifications').delete().eq('client_id', client.id)

      // Supprimer client_configs (SAUF données facturation)
      await supabase.from('client_configs').delete().eq('client_id', client.id)

      // Anonymiser validation_requests (préserver stats)
      await supabase.from('validation_requests').update({
        client_name: `Client supprimé #${anonymizedId}`,
      }).eq('client_id', client.id)

      // Logger anonymisation
      await supabase.from('activity_logs').insert({
        client_id: client.id,
        type: 'client_data_purged',
        metadata: { anonymizedAt: new Date().toISOString() },
      })

      results.push({ clientId: client.id, status: 'success' })
    } catch (err) {
      results.push({ clientId: client.id, status: 'error', error: err.message })
    }
  }

  return new Response(JSON.stringify({ results }), { status: 200 })
})
```

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — Error Handling]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.5c Requirements]
- [Source: RGPD Art. 5 — Limitation de la conservation]
- [Source: RGPD Art. 17 — Droit à l'effacement]
- [Source: Code Général des Impôts — Conservation factures 10 ans]
- [Source: Story 2.1 — Liste clients CRM]

### Dependencies
- **Bloquée par**: Story 2.1 (liste clients), Story 2.3 (fiche client)
- **Bloque**: Aucune
- **Référence**: Epic 11 (facturation — conservation données comptables)

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
