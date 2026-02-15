# Story 9.5a: Export RGPD des données client

Status: ready-for-dev

## Story

As a **client Foxeo ou MiKL (opérateur)**,
I want **exporter l'ensemble des données personnelles d'un client (droit d'accès RGPD)**,
so that **le client peut exercer son droit à la portabilité des données**.

## Acceptance Criteria

**Given** un client souhaite exporter ses données (FR92)
**When** il accède à ses paramètres de compte (section "Mes données")
**Then** il voit :
- Un bouton "Exporter toutes mes données" avec l'explication : "Conformément au RGPD, vous pouvez télécharger l'ensemble de vos données personnelles."
- Une estimation du temps de génération ("L'export prend généralement 1 à 5 minutes")

**Given** le client (ou MiKL via la fiche client) déclenche l'export
**When** la Server Action `exportClientData(clientId)` s'exécute
**Then** un export complet est généré incluant :
1. **Informations personnelles** : nom, email, entreprise, date d'inscription, type de client
2. **Documents** : tous les documents associés (briefs, livrables) — fichiers + metadata
3. **Communications** : historique des messages chat avec MiKL (table `messages`)
4. **Conversations Elio** : historique complet des conversations avec Elio (tables `elio_conversations` + `elio_messages`)
5. **Parcours Lab** : étapes, progression, briefs soumis (si applicable)
6. **Demandes de validation** : historique des `validation_requests`
7. **Notifications** : historique des notifications reçues
8. **Consentements** : consentements donnés (CGU, IA, etc.)
9. **Sessions** : historique des connexions
10. **Facturation** : factures et devis (si applicable)
**And** l'export est généré dans 2 formats :
- **JSON structuré** : un fichier JSON complet avec toutes les données brutes
- **PDF lisible** : un document PDF formaté avec les données organisées par catégorie
**And** les fichiers sont compressés en ZIP
**And** l'export est stocké temporairement dans Supabase Storage (dossier privé, expire après 7 jours)
**And** un lien de téléchargement est envoyé par notification in-app ET email

**Given** MiKL peut aussi déclencher un export pour un client (FR104 — lien avec Epic 12)
**When** il accède à la fiche client (section "Administration")
**Then** un bouton "Exporter les données client" est disponible
**And** le même processus s'exécute
**And** l'export est accessible à MiKL (pas au client) si MiKL l'a déclenché pour ses propres besoins

## Tasks / Subtasks

- [ ] Créer section "Mes données" dans paramètres client (AC: #1)
  - [ ] Modifier ou créer `apps/client/app/(dashboard)/settings/page.tsx`
  - [ ] Section "Mes données" avec titre "Conformité RGPD"
  - [ ] Bouton "Exporter toutes mes données"
  - [ ] Texte explicatif : "Conformément au RGPD, vous pouvez télécharger l'ensemble de vos données personnelles."
  - [ ] Mention temps estimé : "L'export prend généralement 1 à 5 minutes"
  - [ ] Au clic : appeler Server Action `exportClientData` avec `clientId` actuel

- [ ] Créer bouton export dans fiche client Hub (AC: #3)
  - [ ] Modifier `packages/modules/crm/components/client-info-tab.tsx`
  - [ ] Section "Administration" (accessible uniquement MiKL)
  - [ ] Bouton "Exporter les données client"
  - [ ] Au clic : confirmation dialog puis appeler `exportClientData(clientId)`

- [ ] Créer Server Action `exportClientData` (AC: #2)
  - [ ] Créer `packages/modules/admin/actions/export-client-data.ts`
  - [ ] Signature: `exportClientData(clientId: string, requestedBy: 'client' | 'operator'): Promise<ActionResponse<ExportResult>>`
  - [ ] Validation Zod : clientId UUID, requestedBy enum
  - [ ] Vérifier authorization : client peut exporter ses propres données OU opérateur owner peut exporter
  - [ ] Déclencher export asynchrone (Edge Function ou background job)
  - [ ] Créer entrée dans table `data_exports` : status 'pending', requested_by, created_at
  - [ ] Retourner `{ data: { exportId }, error }` immédiatement
  - [ ] Toast : "Export en cours — vous recevrez une notification quand il sera prêt"

- [ ] Créer Edge Function génération export (AC: #2)
  - [ ] Créer `supabase/functions/generate-client-export/index.ts`
  - [ ] Déclenchée par insertion dans `data_exports` (Supabase trigger ou cron)
  - [ ] Fetch toutes les données client :
    - `clients` table : infos personnelles
    - `documents` table + Storage files
    - `messages` table : chat MiKL
    - `elio_conversations` + `elio_messages` tables
    - `parcours` + `parcours_steps` tables (si Lab)
    - `validation_requests` table
    - `notifications` table
    - `consents` table
    - `auth.sessions` (via admin API)
    - Facturation (Epic 11, pour MVP skip ou stub)
  - [ ] Générer JSON structuré : un objet avec sections par catégorie
  - [ ] Générer PDF : utiliser library (ex: pdfmake, puppeteer) pour formatter JSON en PDF lisible
  - [ ] Compresser JSON + PDF en ZIP
  - [ ] Upload ZIP vers Supabase Storage (bucket `exports`, dossier privé par client)
  - [ ] UPDATE `data_exports` SET status='completed', file_path='{path}', expires_at=NOW() + 7 days
  - [ ] Créer notification client : "Votre export de données est prêt !" avec lien téléchargement
  - [ ] Si erreur : UPDATE status='failed', log erreur

- [ ] Créer table `data_exports` (AC: #2)
  - [ ] Migration Supabase : créer table tracking exports
  - [ ] Colonnes : id, client_id, requested_by (client/operator), status (pending/completed/failed), file_path, expires_at, created_at
  - [ ] Index sur client_id, status
  - [ ] RLS : client peut voir ses propres exports, opérateur owner peut voir exports de ses clients

- [ ] Créer notification export prêt (AC: #2)
  - [ ] Créer notification type 'export_ready'
  - [ ] Titre : "Votre export de données est prêt !"
  - [ ] Body : "Vos données personnelles sont disponibles au téléchargement. Le lien expire dans 7 jours."
  - [ ] Link : lien direct vers fichier ZIP (Supabase Storage signed URL)
  - [ ] Envoyer notification in-app + email
  - [ ] Email : template avec lien téléchargement sécurisé

- [ ] Implémenter téléchargement export (AC: #2)
  - [ ] Créer API Route `/api/exports/[exportId]/download`
  - [ ] Vérifier authorization : client owner ou opérateur owner
  - [ ] Générer signed URL Supabase Storage (expire 1h)
  - [ ] Redirect vers signed URL pour téléchargement
  - [ ] Logger téléchargement dans `activity_logs`

- [ ] Implémenter nettoyage exports expirés (AC: #2)
  - [ ] Créer Edge Function cron (daily) : `supabase/functions/cleanup-expired-exports/index.ts`
  - [ ] Query `data_exports` WHERE expires_at < NOW()
  - [ ] Supprimer fichiers ZIP du Storage
  - [ ] DELETE entrées `data_exports` expirées
  - [ ] Logger nettoyage

- [ ] Créer tests unitaires (TDD)
  - [ ] Test `exportClientData`: client peut exporter ses propres données
  - [ ] Test `exportClientData`: opérateur owner peut exporter données de ses clients
  - [ ] Test `exportClientData`: opérateur non-owner ne peut pas exporter → error UNAUTHORIZED
  - [ ] Test Edge Function : génération JSON + PDF + ZIP
  - [ ] Test Edge Function : notification envoyée après completion
  - [ ] Test API download : authorization vérifiée
  - [ ] Test cleanup : exports expirés supprimés

- [ ] Créer test RLS
  - [ ] Test : client A ne peut pas voir exports de client B
  - [ ] Test : opérateur A ne peut pas voir exports de clients de opérateur B

## Dev Notes

### Architecture Patterns
- **Pattern async**: Export asynchrone via Edge Function (génération prend 1-5 min)
- **Pattern storage**: Fichiers ZIP dans Supabase Storage avec expiration 7 jours
- **Pattern notification**: Notification in-app + email avec lien téléchargement
- **Pattern security**: Signed URLs Supabase pour téléchargement sécurisé (expire 1h)
- **Pattern cleanup**: Cron daily pour suppression exports expirés

### Source Tree Components
```
packages/modules/admin/
├── actions/
│   ├── export-client-data.ts        # CRÉER: Server Action déclenchement export
│   └── export-client-data.test.ts
└── types/
    └── export.types.ts               # CRÉER: types ExportResult, ExportStatus

packages/modules/crm/
└── components/
    └── client-info-tab.tsx           # MODIFIER: ajouter bouton export (section Admin)

apps/client/app/(dashboard)/
└── settings/
    └── page.tsx                      # MODIFIER: ajouter section "Mes données" + bouton export

apps/hub/app/api/exports/[exportId]/
└── download/
    └── route.ts                      # CRÉER: API Route téléchargement export

supabase/functions/
├── generate-client-export/
│   └── index.ts                      # CRÉER: Edge Function génération export
└── cleanup-expired-exports/
    └── index.ts                      # CRÉER: Edge Function cleanup cron

supabase/migrations/
├── [timestamp]_create_data_exports_table.sql     # CRÉER: table tracking exports
└── [timestamp]_create_exports_storage_bucket.sql # CRÉER: bucket Storage pour exports
```

### Testing Standards
- **Unitaires**: Vitest, co-localisés (*.test.ts)
- **Integration**: Tester Edge Function génération complète (JSON + PDF + ZIP)
- **RLS**: Test isolation client (ne peut pas voir exports d'autres clients)
- **Security**: Test signed URLs expiration

### Project Structure Notes
- Alignement avec module admin (Epic 12)
- Utilisation Supabase Storage pour fichiers temporaires
- Edge Functions Deno pour génération asynchrone
- Notification in-app + email (Story 3.2, 3.3)

### Key Technical Decisions

**1. Export asynchrone**
- Génération peut prendre 1-5 minutes (selon volume données)
- Server Action retourne immédiatement avec exportId
- Edge Function génère export en background
- Client reçoit notification quand prêt

**2. Formats export**
- **JSON structuré** : données brutes complètes, machine-readable
- **PDF lisible** : données formatées par catégorie, human-readable
- Les 2 formats dans un ZIP unique
- JSON prioritaire pour portabilité RGPD (machine-readable)

**3. Stockage temporaire**
- Fichiers ZIP dans Supabase Storage bucket `exports`
- Dossier privé par client : `exports/{clientId}/{exportId}.zip`
- Expiration après 7 jours (RGPD pas d'obligation long-terme)
- Cleanup automatique via cron daily

**4. Sécurité téléchargement**
- Signed URLs Supabase (expire 1h)
- Vérification authorization avant génération signed URL
- Logger téléchargement dans activity_logs
- Pas de lien direct permanent (éviter fuites)

**5. Données incluses**
- TOUTES les données personnelles (conformité RGPD Art. 15)
- Fichiers documents inclus (Storage files embedded ou zip séparé)
- Historique complet conversations Elio (peut être volumineux)
- Sessions auth (via Supabase Admin API)
- Facturation si applicable (Epic 11)

**6. Génération PDF**
- Library : pdfmake (client-side rendering) ou puppeteer (server-side HTML→PDF)
- Format : sections par catégorie, table of contents, footer avec date génération
- Style : propre, lisible, logo Foxeo optionnel
- Pagination automatique

### Database Schema Changes

```sql
-- Migration: create data_exports table
CREATE TABLE data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL CHECK (requested_by IN ('client', 'operator')),
  requester_id UUID NOT NULL, -- client_id ou operator_id
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  file_path TEXT,
  file_size_bytes BIGINT,
  expires_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_data_exports_client_id ON data_exports(client_id);
CREATE INDEX idx_data_exports_status ON data_exports(status);
CREATE INDEX idx_data_exports_expires_at ON data_exports(expires_at) WHERE status = 'completed';

-- RLS policies
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "data_exports_select_owner"
  ON data_exports FOR SELECT
  USING (
    (requested_by = 'client' AND requester_id = auth.uid())
    OR
    (requested_by = 'operator' AND EXISTS (
      SELECT 1 FROM clients WHERE clients.id = data_exports.client_id AND clients.operator_id = auth.uid()
    ))
    OR is_admin()
  );

CREATE POLICY "data_exports_insert_authenticated"
  ON data_exports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Migration: create exports storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
CREATE POLICY "exports_select_owner"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'exports'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text -- client can see own folder
      OR is_admin()
    )
  );

CREATE POLICY "exports_insert_system"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'exports'
    AND auth.jwt() ->> 'role' = 'service_role' -- only Edge Function can insert
  );

CREATE POLICY "exports_delete_system"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'exports'
    AND auth.jwt() ->> 'role' = 'service_role' -- only cleanup function can delete
  );
```

### Export JSON Structure

```json
{
  "export_metadata": {
    "client_id": "uuid",
    "generated_at": "2026-02-13T10:30:00Z",
    "expires_at": "2026-02-20T10:30:00Z",
    "format_version": "1.0"
  },
  "personal_information": {
    "name": "...",
    "email": "...",
    "company": "...",
    "client_type": "lab",
    "created_at": "...",
    "last_activity": "..."
  },
  "documents": [
    {
      "id": "uuid",
      "name": "brief-etape-1.pdf",
      "type": "brief",
      "created_at": "...",
      "file_base64": "..." // ou lien Storage
    }
  ],
  "communications": {
    "messages": [...],
    "elio_conversations": [...]
  },
  "parcours_lab": {
    "status": "completed",
    "steps": [...]
  },
  "validation_requests": [...],
  "notifications": [...],
  "consents": [...],
  "sessions": [...],
  "billing": [...]
}
```

### Libraries pour génération PDF

**Option 1: pdfmake (recommandé pour MVP)**
- Lightweight, client-side rendering (peut aussi server-side Node)
- Format declarative (JSON structure → PDF)
- Supporte tables, images, styles
- ~200KB bundle size
- Installation: `npm install pdfmake`

**Option 2: puppeteer (plus puissant, plus lourd)**
- HTML → PDF via Chromium headless
- Parfait pour layouts complexes
- Require Chromium binary (~300MB)
- Meilleur pour server-side (Edge Function Deno compatible via deno-puppeteer)
- Installation: complexe, pas idéal pour MVP

**Recommandation MVP : pdfmake**

### References
- [Source: CLAUDE.md — Architecture Rules]
- [Source: docs/project-context.md — Stack & Versions]
- [Source: _bmad-output/planning-artifacts/architecture/04-implementation-patterns.md — API Response Format, Storage]
- [Source: _bmad-output/planning-artifacts/epics/epic-9-graduation-lab-vers-one-cycle-de-vie-client-stories-detaillees.md — Story 9.5a Requirements]
- [Source: RGPD Art. 15 — Droit d'accès et portabilité des données]
- [Source: Story 3.2 — Module notifications]
- [Source: Epic 12 — Module admin]

### Dependencies
- **Bloquée par**: Story 2.3 (fiche client), Story 3.2 (notifications), Story 3.3 (email)
- **Bloque**: Aucune
- **Référence**: Epic 12 (module admin — backups automatiques)

## Dev Agent Record

### Agent Model Used
(À remplir par le dev agent)

### Debug Log References
(À remplir par le dev agent)

### Completion Notes List
(À remplir par le dev agent)

### File List
(À remplir par le dev agent)
