# Story 9.5b: Transfert instance One au client sortant

Status: ready-for-dev

## Story

As a **MiKL (opérateur)**,
I want **transférer l'instance One dédiée à un client qui quitte Foxeo, avec code source, DB et documentation**,
so that **le client est autonome et propriétaire de son outil conformément aux engagements Foxeo (FR154)**.

## Acceptance Criteria

**Given** un client One quitte Foxeo et récupère son outil (FR154, FR157)
**When** MiKL déclenche la procédure de sortie depuis la fiche client (bouton "Transférer l'instance au client")
**Then** la procédure suivante est exécutée :
1. Le code source du monorepo client est exporté dans un repo Git dédié
2. La documentation complète de chaque module actif est incluse (guide.md, faq.md, flows.md)
3. Les credentials Supabase sont transférés au client (ou un dump DB est fourni)
4. Les modules service Foxeo sont retirés (chat MiKL, visio, Elio) — sauf si inclus dans le périmètre projet
5. Un document "Guide d'autonomie" est généré avec :
   - Architecture technique de l'instance
   - Variables d'environnement documentées
   - Procédure de déploiement sans Foxeo
   - Contacts support technique (optionnel, payant)
6. `client_instances.status` → 'transferred'
7. Le client reçoit par email : repo Git + dump DB + documentation + Guide d'autonomie
**And** le dossier BMAD (briefs internes, analyses Orpheus) reste propriété Foxeo — le client reçoit les documents stratégiques (brief final, PRD, architecture client)
**And** un événement 'client_instance_transferred' est loggé dans `activity_logs`

## Tasks / Subtasks

- [ ] Créer bouton "Transférer l'instance" dans fiche client (AC: #1)
  - [ ] Modifier `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Section "Administration" → bouton "Transférer l'instance au client"
  - [ ] Visible uniquement si `client_type = 'one'` ET `client_instances.status = 'active'`
  - [ ] Au clic : ouvrir `TransferInstanceDialog`

- [ ] Créer modale de confirmation transfert (AC: #1)
  - [ ] Créer `packages/modules/crm/components/transfer-instance-dialog.tsx`
  - [ ] Utiliser Dialog component de @foxeo/ui (Radix UI)
  - [ ] Header : "Transférer l'instance One au client"
  - [ ] Warning : "Cette action est irréversible. Le client deviendra propriétaire complet de son instance."
  - [ ] Checklist pré-transfert :
    - [ ] Factures soldées (vérification manuelle)
    - [ ] Documents stratégiques finalisés (brief, PRD, architecture)
    - [ ] Export RGPD effectué (optionnel mais recommandé)
  - [ ] Champ email destinataire (pré-rempli avec client.email)
  - [ ] Checkbox confirmation : "Je confirme que le client est propriétaire de son code et données"
  - [ ] Boutons "Confirmer le transfert" (destructive) / "Annuler"

- [ ] Créer Server Action `transferInstanceToClient` (AC: #1)
  - [ ] Créer `packages/modules/admin/actions/transfer-instance.ts`
  - [ ] Signature: `transferInstanceToClient(clientId: string, recipientEmail: string): Promise<ActionResponse<TransferResult>>`
  - [ ] Validation Zod : clientId UUID, recipientEmail email
  - [ ] Vérifier que client_type = 'one' ET instance status = 'active'
  - [ ] Vérifier que opérateur est owner (RLS + explicit check)
  - [ ] Déclencher transfert asynchrone (Edge Function, processus long ~10-30 min)
  - [ ] UPDATE `client_instances` SET status = 'transferring'
  - [ ] Créer entrée dans table `instance_transfers` : status 'pending', recipient_email, created_at
  - [ ] Retourner `{ data: { transferId }, error }` immédiatement
  - [ ] Toast : "Transfert lancé — le processus peut prendre 10 à 30 minutes"

- [ ] Créer Edge Function exécution transfert (AC: #1)
  - [ ] Créer `supabase/functions/transfer-client-instance/index.ts`
  - [ ] Déclenchée par insertion dans `instance_transfers` ou webhook
  - [ ] **Étape 1 : Export code source**
    - Créer repo Git privé (GitHub, GitLab, ou export ZIP)
    - Copier code monorepo client (`apps/client/`) + modules actifs
    - Retirer modules service Foxeo : chat MiKL, visio, Elio (sauf si inclus périmètre)
    - Inclure `package.json`, `turbo.json`, config files
    - Inclure documentation modules actifs (`docs/guide.md`, `faq.md`, `flows.md`)
    - Commit initial : "Instance transférée depuis Foxeo — {date}"
  - [ ] **Étape 2 : Export base de données**
    - Dump Supabase database (pg_dump ou Supabase Admin API)
    - Format SQL ou CSV (choix client)
    - Anonymiser données opérateur (operator_id, notes privées MiKL)
    - Inclure schémas RLS (policies client-side restent)
  - [ ] **Étape 3 : Génération Guide d'autonomie**
    - Template Markdown avec sections :
      - Architecture technique (stack, modules, dependencies)
      - Variables d'environnement documentées (.env.example)
      - Procédure déploiement (Vercel, Netlify, ou self-hosted)
      - Accès Supabase (credentials transférés ou nouveau projet)
      - Contacts support (optionnel, lien vers offre payante)
    - Générer PDF depuis Markdown
  - [ ] **Étape 4 : Préparation documents stratégiques**
    - Copier brief final, PRD, architecture client (depuis dossier projet)
    - Exclure briefs internes BMAD, analyses Orpheus (propriété Foxeo)
    - Compresser en ZIP "Documents Stratégiques"
  - [ ] **Étape 5 : Packaging final**
    - Compresser tout en ZIP : code source + DB dump + Guide + docs stratégiques
    - Upload vers Supabase Storage (bucket `transfers`, expire 30 jours)
    - Générer signed URL (expire 7 jours)
  - [ ] **Étape 6 : Envoi email client**
    - Template email : "Votre instance Foxeo One vous est transférée"
    - Contenu : lien téléchargement ZIP, credentials Supabase, instructions
    - Attacher Guide d'autonomie PDF
  - [ ] UPDATE `instance_transfers` SET status = 'completed', file_path, sent_at
  - [ ] UPDATE `client_instances` SET status = 'transferred', transferred_at = NOW()
  - [ ] INSERT `activity_logs` : type 'client_instance_transferred'
  - [ ] Si erreur : UPDATE status = 'failed', log erreur

- [ ] Créer table `instance_transfers` (AC: #1)
  - [ ] Migration Supabase : créer table tracking transferts
  - [ ] Colonnes : id, client_id, instance_id, recipient_email, status (pending/processing/completed/failed), file_path, sent_at, created_at
  - [ ] Index sur client_id, status
  - [ ] RLS : seul opérateur owner peut voir

- [ ] Implémenter désactivation accès instance après transfert (AC: #1)
  - [ ] Modifier middleware Auth instance One
  - [ ] Si `client_instances.status = 'transferred'` : bloquer connexion client
  - [ ] Afficher page : "Votre instance a été transférée. Consultez votre email pour les instructions."
  - [ ] MiKL peut encore consulter fiche client Hub (lecture seule)

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `transferInstanceToClient`: instance active → status transferring
  - [ ] Test `transferInstanceToClient`: instance already transferred → error 'INSTANCE_ALREADY_TRANSFERRED'
  - [ ] Test `transferInstanceToClient`: opérateur non-owner → error UNAUTHORIZED
  - [ ] Test Edge Function : ZIP généré avec code + DB + docs
  - [ ] Test Edge Function : modules service Foxeo retirés du code
  - [ ] Test Edge Function : email envoyé après completion

- [ ] Créer test RLS
  - [ ] Test : opérateur A ne peut pas transférer instance de client de opérateur B

## Dev Notes

### Architecture Patterns
- **Pattern async**: Transfert asynchrone via Edge Function (processus long 10-30 min)
- **Pattern ownership**: Client devient propriétaire complet (code + données)
- **Pattern cleanup**: Retirer modules service Foxeo (chat MiKL, visio, Elio non-inclus)
- **Pattern documentation**: Guide d'autonomie généré automatiquement
- **Pattern security**: Credentials Supabase transférés OU nouveau projet client

### Source Tree Components
```
packages/modules/admin/
├── actions/
│   ├── transfer-instance.ts          # CRÉER: Server Action déclenchement transfert
│   └── transfer-instance.test.ts
└── types/
    └── transfer.types.ts             # CRÉER: types TransferResult, TransferStatus

packages/modules/crm/
└── components/
    ├── client-info-tab.tsx           # MODIFIER: ajouter bouton transfert
    ├── transfer-instance-dialog.tsx  # CRÉER: modale confirmation transfert
    └── transfer-instance-dialog.test.tsx

supabase/functions/
└── transfer-client-instance/
    └── index.ts                      # CRÉER: Edge Function exécution transfert

supabase/migrations/
├── [timestamp]_create_instance_transfers_table.sql  # CRÉER: table tracking transferts
└── [timestamp]_create_transfers_storage_bucket.sql  # CRÉER: bucket Storage
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Integration**: Tester Edge Function génération complète (code + DB + docs)
- **RLS**: Test isolation opérateur (ne peut pas transférer instance d'un autre)
- **Security**: Test credentials Supabase anonymisés

### Project Structure Notes
- Alignement avec module admin (Epic 12)
- Utilisation Supabase Storage pour packages transfert
- Edge Functions Deno pour processus long asynchrone
- Export Git repo via GitHub API ou ZIP

### Key Technical Decisions

**1. Transfert asynchrone**
- Processus peut prendre 10-30 minutes (export code + DB + docs)
- Server Action retourne immédiatement avec transferId
- Edge Function exécute transfert en background
- MiKL reçoit notification quand prêt (optionnel)

**2. Code source exporté**
- Monorepo client complet (`apps/client/`) + modules actifs
- Retirer modules service Foxeo (chat MiKL, visio, Elio) — sauf si inclus périmètre projet
- Inclure documentation modules (`docs/guide.md`, `faq.md`, `flows.md`)
- Repo Git privé (GitHub/GitLab) OU export ZIP
- Commit initial : "Instance transférée depuis Foxeo — {date}"

**3. Base de données exportée**
- Dump Supabase via pg_dump ou Admin API
- Format SQL (restauration facile) + CSV (lisibilité)
- Anonymiser données opérateur : `operator_id → NULL`, `notes_mikl → NULL`
- Schémas RLS conservés (client-side policies)
- Credentials Supabase transférés (transfert projet) OU nouveau projet client

**4. Documents stratégiques inclus**
- Brief final, PRD, architecture client (livrables)
- Exclure briefs internes BMAD, analyses Orpheus (propriété Foxeo)
- Format : PDF + sources Markdown
- Compressé en ZIP "Documents Stratégiques"

**5. Guide d'autonomie**
- Généré automatiquement depuis template
- Sections : architecture, env vars, déploiement, support
- Variables interpolées : modules actifs, stack, credentials
- Format : Markdown + PDF
- Inclus dans package transfert

**6. Modules service Foxeo retirés**
- Chat MiKL : retiré (communication directe Foxeo)
- Visio : retiré (infrastructure Foxeo)
- Elio : retiré SAUF si inclus dans périmètre projet initial
- Si Elio inclus : conserver code mais désactiver accès API Foxeo (client doit configurer son propre LLM)

**7. Accès post-transfert**
- Client : accès bloqué à instance Foxeo (status 'transferred')
- Instructions dans email : déployer instance sur infrastructure propre
- MiKL : peut consulter fiche client Hub (lecture seule, historique)
- Pas de rollback possible (action irréversible)

### Database Schema Changes

```sql
-- Migration: create instance_transfers table
CREATE TABLE instance_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  instance_id UUID REFERENCES client_instances(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  file_path TEXT,
  file_size_bytes BIGINT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_instance_transfers_client_id ON instance_transfers(client_id);
CREATE INDEX idx_instance_transfers_status ON instance_transfers(status);

-- RLS policies
ALTER TABLE instance_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instance_transfers_select_operator"
  ON instance_transfers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients WHERE clients.id = instance_transfers.client_id AND clients.operator_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "instance_transfers_insert_operator"
  ON instance_transfers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients WHERE clients.id = instance_transfers.client_id AND clients.operator_id = auth.uid()
    )
    OR is_admin()
  );

-- Migration: add transferred_at column to client_instances
ALTER TABLE client_instances
  ADD COLUMN transferred_at TIMESTAMP WITH TIME ZONE;

-- Migration: create transfers storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('transfers', 'transfers', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "transfers_insert_system"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'transfers'
    AND auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "transfers_select_operator"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'transfers'
    AND is_admin() -- ou vérifier operator_id via metadata
  );

CREATE POLICY "transfers_delete_system"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'transfers'
    AND auth.jwt() ->> 'role' = 'service_role'
  );
```

### Guide d'Autonomie Template

```markdown
# Guide d'Autonomie — Instance Foxeo One

**Client** : {clientName}
**Instance** : {instanceUrl}
**Date de transfert** : {transferDate}

## 1. Architecture Technique

Votre instance Foxeo One est construite sur les technologies suivantes :
- **Framework** : Next.js 16.1 (App Router)
- **UI** : React 19, Tailwind CSS 4
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Déploiement** : Vercel (recommandé) ou self-hosted

### Modules actifs
{modulesList}

## 2. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL={supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY={supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY={serviceRoleKey}

# App
NEXT_PUBLIC_APP_URL={instanceUrl}
```

## 3. Installation et Déploiement

### Option A : Déploiement Vercel (recommandé)
1. Importez le repo Git sur Vercel
2. Configurez les variables d'environnement
3. Déployez (automatique)

### Option B : Self-hosted
1. `npm install`
2. `npm run build`
3. `npm run start`

## 4. Accès Supabase

Vos credentials Supabase ont été transférés. Vous êtes propriétaire du projet.

**Projet ID** : {supabaseProjectId}
**URL Dashboard** : https://supabase.com/dashboard/project/{supabaseProjectId}

## 5. Support Technique

Foxeo propose un support technique optionnel (payant) :
- **Email** : support@foxeo.io
- **Tarif** : 150€/h (interventions ponctuelles)
- **Abonnement** : 300€/mois (support continu)

---

*Document généré automatiquement lors du transfert d'instance.*
```

### Package Transfert Structure

```
foxeo-instance-{clientName}-{date}.zip
├── code-source/
│   ├── apps/client/                  # Monorepo client complet
│   ├── packages/modules/             # Modules actifs uniquement
│   ├── package.json
│   ├── turbo.json
│   ├── .env.example
│   └── README.md                     # Instructions installation
├── database/
│   ├── dump.sql                      # Dump PostgreSQL complet
│   ├── dump.csv/                     # Export CSV par table (optionnel)
│   └── README.md                     # Instructions restauration
├── documentation/
│   ├── modules/                      # Docs modules actifs (guide, faq, flows)
│   ├── brief-final.pdf
│   ├── prd.pdf
│   └── architecture.pdf
├── guide-autonomie.pdf               # Guide d'autonomie complet
└── README.txt                        # Instructions principales
```

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — Module Structure]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.5b Requirements]
- [Source: FR154 — Client propriétaire de son code et données]
- [Source: Epic 12 — Module admin]

### Dependencies
- **Bloquée par**: Story 2.3 (fiche client), Story 12.6 (provisioning instance)
- **Bloque**: Aucune
- **Référence**: Epic 12 (module admin, backups)

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
