# Story 8.3: Feedback réponses Élio, documents dans le chat & historique configs

Status: ready-for-dev

## Story

As a **utilisateur (MiKL ou client)**,
I want **donner un feedback sur les réponses d'Élio, voir les documents générés directement dans le chat, et (pour MiKL) consulter l'historique des configs Élio**,
So that **Élio s'améliore grâce aux retours, les documents sont accessibles sans quitter la conversation, et MiKL garde la traçabilité des configs**.

## Acceptance Criteria

### AC1 : Feedback sur réponses Élio (FR126)

**Given** Élio envoie une réponse dans le chat
**When** la réponse est affichée
**Then** chaque message d'Élio affiche en bas de bulle deux boutons discrets :

- 👍 (utile) / 👎 (pas utile)
- Les boutons apparaissent au survol (desktop) ou sont toujours visibles (mobile)
- Un seul choix possible par message (toggle : cliquer à nouveau désactive)

**And** au clic, la Server Action `submitFeedback(messageId, rating: 'useful' | 'not_useful')` est exécutée
**And** le feedback est stocké dans `elio_messages.metadata.feedback: { rating, created_at }`
**And** un micro-feedback visuel confirme le choix (le bouton sélectionné change de couleur)
**And** aucune notification n'est envoyée — le feedback est collecté silencieusement pour analyse

### AC2 : Documents dans le chat (FR125)

**Given** Élio génère ou partage un document dans la conversation
**When** le message contient un document (brief, livrable, export)
**Then** le composant `elio-document.tsx` affiche dans la bulle de chat :

- Le nom du document avec une icône de type (PDF, DOC, image)
- Un aperçu inline si possible (markdown rendu, image thumbnail)
- Un bouton "Voir le document complet" qui ouvre le module documents (Epic 4)
- Un bouton "Télécharger" (PDF)

**And** le document est référencé via `elio_messages.metadata.document_id` (FK vers la table `documents`)
**And** si le document est un brief généré par Élio Lab, il affiche le badge "Brief généré par Élio"

### AC3 : Historique des configurations Élio (FR87 — Hub uniquement)

**Given** MiKL veut consulter l'historique des configurations Élio d'un client
**When** il accède à la fiche client dans le Hub (section "Configuration Élio", Story 6.6)
**Then** en plus du formulaire d'édition existant, un onglet "Historique" affiche :

- La liste chronologique des modifications de config Élio (date, champs modifiés, ancienne valeur → nouvelle valeur)
- Les données proviennent de la table `elio_config_history` (ou du versionning JSON mis en place en Story 6.6)
- Chaque entrée est collapsible (clic pour voir le détail)
- Un bouton "Restaurer cette version" permet de revenir à une config précédente

**And** la restauration déclenche une confirmation modale avant exécution
**And** le cache TanStack Query est invalidé après restauration

## Tasks / Subtasks

- [ ] **Task 1** : Ajouter feedback dans `elio_messages.metadata`
  - [ ] 1.1 : Modifier le type `ElioMessage` pour inclure `metadata.feedback`
  - [ ] 1.2 : Créer le type `FeedbackRating = 'useful' | 'not_useful'`

- [ ] **Task 2** : Créer le composant `elio-feedback.tsx` (AC: #1, FR126)
  - [ ] 2.1 : Créer le composant avec 2 boutons 👍 / 👎
  - [ ] 2.2 : Boutons discrets au survol (desktop)
  - [ ] 2.3 : Boutons visibles (mobile < 768px)
  - [ ] 2.4 : Toggle : un seul choix possible, cliquer à nouveau désactive
  - [ ] 2.5 : Micro-feedback visuel (changement couleur bouton)

- [ ] **Task 3** : Créer la Server Action `submitFeedback()` (AC: #1)
  - [ ] 3.1 : Créer `actions/submit-feedback.ts`
  - [ ] 3.2 : Mettre à jour `elio_messages.metadata.feedback`
  - [ ] 3.3 : Retourner `{ data: success, error: null }`
  - [ ] 3.4 : Pas de notification envoyée (collecte silencieuse)

- [ ] **Task 4** : Créer le composant `elio-document.tsx` (AC: #2, FR125)
  - [ ] 4.1 : Créer le composant avec affichage nom + icône type
  - [ ] 4.2 : Aperçu inline (markdown rendu, image thumbnail)
  - [ ] 4.3 : Bouton "Voir le document complet" → module documents
  - [ ] 4.4 : Bouton "Télécharger" (PDF)
  - [ ] 4.5 : Badge "Brief généré par Élio" si applicable

- [ ] **Task 5** : Ajouter `document_id` dans `elio_messages.metadata`
  - [ ] 5.1 : Modifier le type `ElioMessage.metadata.documentId`
  - [ ] 5.2 : Créer la référence FK vers `documents.id`

- [ ] **Task 6** : Créer la migration `elio_config_history` (AC: #3)
  - [ ] 6.1 : Créer `supabase/migrations/00012_elio_config_history.sql`
  - [ ] 6.2 : Table avec id, client_id, field_changed, old_value, new_value, changed_at, changed_by
  - [ ] 6.3 : Policies RLS (opérateur voit historique de ses clients)
  - [ ] 6.4 : Trigger pour enregistrer les modifications de `client_configs.elio_config`

- [ ] **Task 7** : Créer le composant historique config (AC: #3, FR87)
  - [ ] 7.1 : Créer `components/elio-config-history.tsx` (Hub uniquement)
  - [ ] 7.2 : Afficher liste chronologique des modifications
  - [ ] 7.3 : Affichage collapsible par entrée (détails au clic)
  - [ ] 7.4 : Bouton "Restaurer cette version" avec confirmation modale

- [ ] **Task 8** : Créer la Server Action `restoreElioConfig()`
  - [ ] 8.1 : Créer `actions/restore-elio-config.ts`
  - [ ] 8.2 : Restaurer la config depuis l'historique
  - [ ] 8.3 : Invalider le cache `['elio-config']`
  - [ ] 8.4 : Enregistrer la restauration dans l'historique

- [ ] **Task 9** : Intégrer feedback dans `elio-message.tsx`
  - [ ] 9.1 : Ajouter `elio-feedback.tsx` en bas de chaque message Élio
  - [ ] 9.2 : Afficher le feedback existant si déjà donné
  - [ ] 9.3 : Gérer l'état optimiste (TanStack Query)

- [ ] **Task 10** : Intégrer documents dans les messages
  - [ ] 10.1 : Détecter si `message.metadata.documentId` existe
  - [ ] 10.2 : Afficher `elio-document.tsx` dans la bulle
  - [ ] 10.3 : Fetch document info depuis la table `documents`

- [ ] **Task 11** : Tests
  - [ ] 11.1 : Tester `submitFeedback()` (utile/pas utile, toggle)
  - [ ] 11.2 : Tester `elio-document.tsx` (aperçu, download, navigation)
  - [ ] 11.3 : Tester historique config (affichage, restauration)

## Dev Notes

### Migration elio_config_history

```sql
-- Table elio_config_history
CREATE TABLE elio_config_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_elio_config_history_client_id ON elio_config_history(client_id);
CREATE INDEX idx_elio_config_history_changed_at ON elio_config_history(changed_at DESC);

-- RLS policies
ALTER TABLE elio_config_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators can view config history of their clients"
  ON elio_config_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = elio_config_history.client_id
      AND clients.operator_id = auth.uid()
    )
  );

-- Trigger pour enregistrer les modifications
CREATE OR REPLACE FUNCTION log_elio_config_changes()
RETURNS TRIGGER AS $$
DECLARE
  old_config JSONB;
  new_config JSONB;
  changed_field TEXT;
BEGIN
  old_config := OLD.elio_config;
  new_config := NEW.elio_config;

  -- Comparer les configs et enregistrer les différences
  -- (simplifié — à adapter selon la structure exacte de elio_config)
  IF old_config IS DISTINCT FROM new_config THEN
    INSERT INTO elio_config_history (client_id, field_changed, old_value, new_value, changed_by)
    VALUES (NEW.id, 'elio_config', old_config, new_config, auth.uid());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_elio_config_changes
  AFTER UPDATE ON client_configs
  FOR EACH ROW
  WHEN (OLD.elio_config IS DISTINCT FROM NEW.elio_config)
  EXECUTE FUNCTION log_elio_config_changes();
```

### Types feedback

```typescript
// types/elio.types.ts
export type FeedbackRating = 'useful' | 'not_useful'

export interface ElioMessageMetadata {
  feedback?: {
    rating: FeedbackRating
    createdAt: string
  }
  documentId?: string
  profileObservation?: string
  draftType?: 'email' | 'validation_hub' | 'chat'
  evolutionBrief?: boolean
}
```

### Composant elio-feedback.tsx

```typescript
// components/elio-feedback.tsx
'use client'

import { useState, useTransition } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { submitFeedback } from '../actions/submit-feedback'
import { cn } from '@foxeo/utils'

interface ElioFeedbackProps {
  messageId: string
  currentFeedback?: FeedbackRating
}

export function ElioFeedback({ messageId, currentFeedback }: ElioFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackRating | null>(currentFeedback ?? null)
  const [isPending, startTransition] = useTransition()

  const handleFeedback = (rating: FeedbackRating) => {
    // Toggle : cliquer à nouveau désactive
    const newRating = feedback === rating ? null : rating

    // Optimistic update
    setFeedback(newRating)

    startTransition(async () => {
      await submitFeedback(messageId, newRating)
    })
  }

  return (
    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
      <button
        onClick={() => handleFeedback('useful')}
        disabled={isPending}
        className={cn(
          'p-1 rounded-full hover:bg-accent transition-colors',
          feedback === 'useful' && 'text-green-500 bg-green-500/10'
        )}
        aria-label="Réponse utile"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFeedback('not_useful')}
        disabled={isPending}
        className={cn(
          'p-1 rounded-full hover:bg-accent transition-colors',
          feedback === 'not_useful' && 'text-red-500 bg-red-500/10'
        )}
        aria-label="Réponse pas utile"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
    </div>
  )
}
```

### Composant elio-document.tsx

```typescript
// components/elio-document.tsx
'use client'

import { FileText, Download, ExternalLink } from 'lucide-react'
import { Button } from '@foxeo/ui'
import { useRouter } from 'next/navigation'

interface ElioDocumentProps {
  documentId: string
  documentName: string
  documentType: 'pdf' | 'doc' | 'image' | 'markdown'
  isElioGenerated?: boolean
  preview?: string
}

export function ElioDocument({
  documentId,
  documentName,
  documentType,
  isElioGenerated,
  preview,
}: ElioDocumentProps) {
  const router = useRouter()

  const icons = {
    pdf: <FileText className="w-5 h-5 text-red-500" />,
    doc: <FileText className="w-5 h-5 text-blue-500" />,
    image: <FileText className="w-5 h-5 text-purple-500" />,
    markdown: <FileText className="w-5 h-5 text-green-500" />,
  }

  return (
    <div className="border rounded-lg p-4 my-2 bg-card">
      <div className="flex items-start gap-3">
        {icons[documentType]}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{documentName}</h4>
            {isElioGenerated && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                Brief généré par Élio
              </span>
            )}
          </div>

          {preview && (
            <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {preview}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/modules/documents/${documentId}`)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir le document complet
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(`/api/documents/${documentId}/download`, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### References

- [Source: Epic 8 — Story 8.3](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-83)
- [Source: PRD — FR87, FR125, FR126](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.2
**FRs couvertes** : FR87 (historique configs), FR125 (documents dans chat), FR126 (feedback)
