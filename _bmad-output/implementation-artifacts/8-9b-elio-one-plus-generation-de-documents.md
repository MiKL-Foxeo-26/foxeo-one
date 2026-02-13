# Story 8.9b: Élio One+ — Génération de documents

Status: ready-for-dev

## Story

As a **client One+**,
I want **qu'Élio génère des documents (attestations, récapitulatifs, exports) à ma demande**,
So that **je gagne du temps sur les tâches administratives répétitives**.

## Acceptance Criteria

### AC1 : Génération de document (FR49)

**Given** un client One+ demande la génération d'un document
**When** il écrit :
- "Génère une attestation de présence pour Marie Dupont"
- "Crée un récapitulatif des événements du mois"

**Then** Élio One+ :

1. Collecte les informations manquantes (si besoin, 1-2 questions max)
2. Génère le document via le LLM (contenu structuré)
3. Affiche le document dans le chat via `elio-document.tsx` (Story 8.3, FR125)
4. Propose les actions :
   - "Télécharger en PDF"
   - "Enregistrer dans vos documents"
   - "Envoyer par email"

**And** le document est créé dans la table `documents` avec `source='elio_generated'`
**And** le document est lié à la conversation via `elio_messages.metadata.document_id`

### AC2 : Types de documents supportés

**Given** les types de documents générables
**Then** Élio One+ peut générer :

- **Attestations** : Attestation de présence, attestation de paiement
- **Récapitulatifs** : Récapitulatif mensuel, rapport d'activité
- **Exports** : Export membres, export événements, export factures

**And** chaque type a un template de génération

### AC3 : Collecte d'informations pour génération

**Given** Élio détecte qu'il manque des informations pour générer le document
**When** le client demande "Génère une attestation"
**Then** Élio pose des questions (max 2) :

- "Pour qui dois-je générer cette attestation ?" (si nom non mentionné)
- "Quelle période ? (ex: janvier 2026, dernier trimestre)" (si période non mentionnée)

**And** les questions s'adaptent au profil de communication

### AC4 : Enregistrement et partage

**Given** le document est généré
**When** le client choisit une action
**Then** :

- **"Télécharger en PDF"** : Conversion en PDF + téléchargement
- **"Enregistrer dans vos documents"** : Création dans la table `documents`, visible dans le module documents
- **"Envoyer par email"** : Ouverture d'un draft email avec le document en pièce jointe

## Tasks / Subtasks

- [ ] **Task 1** : Créer la détection intention "génération document" (AC: #1, FR49)
  - [ ] 1.1 : Modifier `utils/detect-intent.ts`
  - [ ] 1.2 : Patterns : "génère", "crée un document", "attestation", "récapitulatif"
  - [ ] 1.3 : Extraire : type document, bénéficiaire, période

- [ ] **Task 2** : Créer les templates de génération (AC: #2)
  - [ ] 2.1 : Créer `config/document-templates.ts`
  - [ ] 2.2 : Template attestation de présence
  - [ ] 2.3 : Template attestation de paiement
  - [ ] 2.4 : Template récapitulatif mensuel
  - [ ] 2.5 : Template export données

- [ ] **Task 3** : Créer le système de collecte d'infos (AC: #3)
  - [ ] 3.1 : Créer `utils/document-collection.ts`
  - [ ] 3.2 : State machine : initial → collecte infos → génération → affichage
  - [ ] 3.3 : Questions adaptées au profil communication
  - [ ] 3.4 : Max 2 questions

- [ ] **Task 4** : Créer la Server Action génération (AC: #1)
  - [ ] 4.1 : Créer `actions/generate-document.ts`
  - [ ] 4.2 : Appeler DeepSeek avec template + données
  - [ ] 4.3 : Générer le contenu structuré (markdown/HTML)
  - [ ] 4.4 : Retourner `{ data: documentContent, error: null }`

- [ ] **Task 5** : Créer le document dans la table `documents`
  - [ ] 5.1 : Créer `actions/save-generated-document.ts`
  - [ ] 5.2 : INSERT dans `documents` avec `source='elio_generated'`
  - [ ] 5.3 : Lier à la conversation via `elio_messages.metadata.document_id`

- [ ] **Task 6** : Conversion PDF (AC: #4)
  - [ ] 6.1 : Créer `actions/convert-to-pdf.ts`
  - [ ] 6.2 : Utiliser une lib de conversion (ex: `puppeteer`, `react-pdf`)
  - [ ] 6.3 : Upload dans Supabase Storage
  - [ ] 6.4 : Retourner signed URL

- [ ] **Task 7** : Affichage avec actions (AC: #1, #4)
  - [ ] 7.1 : Utiliser `elio-document.tsx` (Story 8.3)
  - [ ] 7.2 : Boutons : Télécharger PDF, Enregistrer, Envoyer email
  - [ ] 7.3 : Gérer les clics sur chaque bouton

- [ ] **Task 8** : Envoi email avec document (AC: #4)
  - [ ] 8.1 : Créer `actions/send-document-email.ts`
  - [ ] 8.2 : Draft email avec document en pièce jointe
  - [ ] 8.3 : Ouverture client email (mailto: avec attachment)

- [ ] **Task 9** : Tests
  - [ ] 9.1 : Tester détection intention génération
  - [ ] 9.2 : Tester collecte infos (questions adaptées)
  - [ ] 9.3 : Tester génération (attestation, récapitulatif, export)
  - [ ] 9.4 : Tester conversion PDF
  - [ ] 9.5 : Tester enregistrement dans documents

## Dev Notes

### Templates de génération

```typescript
// config/document-templates.ts
export const DOCUMENT_TEMPLATES = {
  attestation_presence: {
    name: 'Attestation de présence',
    prompt: `
Génère une attestation de présence formelle pour :
- Bénéficiaire : {beneficiary}
- Période : {period}
- Événements/cours suivis : {events}

Format attendu :
---
ATTESTATION DE PRÉSENCE

Je soussigné(e) [Nom organisation], certifie que [Bénéficiaire] a assisté aux événements suivants :
[Liste des événements avec dates]

Fait à [Ville], le [Date]

[Signature]
---
`,
  },
  attestation_paiement: {
    name: 'Attestation de paiement',
    prompt: `
Génère une attestation de paiement formelle pour :
- Bénéficiaire : {beneficiary}
- Montant : {amount}
- Période : {period}
- Motif : {reason}

Format attendu :
---
ATTESTATION DE PAIEMENT

Je soussigné(e) [Nom organisation], certifie avoir reçu de [Bénéficiaire] la somme de [Montant] au titre de [Motif].

Fait à [Ville], le [Date]

[Signature]
---
`,
  },
  recap_mensuel: {
    name: 'Récapitulatif mensuel',
    prompt: `
Génère un récapitulatif mensuel structuré pour :
- Mois : {month}
- Données : {data}

Sections :
1. Résumé du mois
2. Statistiques clés
3. Événements importants
4. Points d'attention

Format : Markdown structuré
`,
  },
  export_data: {
    name: 'Export de données',
    prompt: `
Génère un export de données au format tableau :
- Type : {type}
- Période : {period}
- Données : {data}

Format : CSV ou Markdown table
`,
  },
}
```

### State machine collecte infos document

```typescript
// utils/document-collection.ts
export interface DocumentCollectionData {
  type: 'attestation_presence' | 'attestation_paiement' | 'recap_mensuel' | 'export_data'
  beneficiary?: string
  period?: string
  data?: unknown
}

export function getDocumentQuestions(
  type: string,
  profile: CommunicationProfile
): string[] {
  const tutoiement = profile.tutoiement

  const questions = {
    attestation_presence: [
      tutoiement
        ? 'Pour qui dois-je générer cette attestation ?'
        : 'Pour qui dois-je générer cette attestation ?',
      tutoiement
        ? 'Quelle période veux-tu couvrir ? (ex: janvier 2026)'
        : 'Quelle période voulez-vous couvrir ? (ex: janvier 2026)',
    ],
    attestation_paiement: [
      tutoiement ? 'Pour qui ?' : 'Pour qui ?',
      tutoiement ? 'Quel montant ?' : 'Quel montant ?',
    ],
    recap_mensuel: [
      tutoiement ? 'Quel mois ?' : 'Quel mois ?',
    ],
    export_data: [
      tutoiement
        ? 'Quel type de données veux-tu exporter ?'
        : 'Quel type de données voulez-vous exporter ?',
    ],
  }

  return questions[type as keyof typeof questions] ?? []
}
```

### Server Action génération

```typescript
// actions/generate-document.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'
import { DOCUMENT_TEMPLATES } from '../config/document-templates'

export async function generateDocument(
  clientId: string,
  type: string,
  data: Record<string, unknown>
): Promise<ActionResponse<string>> {
  const supabase = createServerClient()

  // 1. Récupérer le template
  const template = DOCUMENT_TEMPLATES[type as keyof typeof DOCUMENT_TEMPLATES]

  if (!template) {
    return {
      data: null,
      error: { message: 'Type de document inconnu', code: 'INVALID_TYPE' },
    }
  }

  // 2. Construire le prompt avec les données
  let prompt = template.prompt
  for (const [key, value] of Object.entries(data)) {
    prompt = prompt.replace(`{${key}}`, String(value))
  }

  // 3. Appeler DeepSeek
  const { data: content, error } = await supabase.functions.invoke('elio-chat', {
    body: {
      systemPrompt: 'Tu es un assistant de génération de documents professionnels.',
      message: prompt,
    },
  })

  if (error) {
    return {
      data: null,
      error: { message: 'Erreur génération document', code: 'LLM_ERROR' },
    }
  }

  return { data: content, error: null }
}
```

### Conversion PDF

```typescript
// actions/convert-to-pdf.ts
'use server'

import { createServerClient } from '@foxeo/supabase/server'
import puppeteer from 'puppeteer'

export async function convertToPDF(
  content: string,
  fileName: string
): Promise<ActionResponse<string>> {
  const supabase = createServerClient()

  try {
    // 1. Lancer Puppeteer
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // 2. Charger le contenu HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  ${content}
</body>
</html>
`
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // 3. Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    })

    await browser.close()

    // 4. Upload dans Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`generated/${fileName}.pdf`, pdfBuffer, {
        contentType: 'application/pdf',
      })

    if (error) {
      return { data: null, error: { message: 'Erreur upload PDF', code: 'STORAGE_ERROR' } }
    }

    // 5. Retourner signed URL
    const { data: signedUrl } = await supabase.storage
      .from('documents')
      .createSignedUrl(data.path, 3600)

    return { data: signedUrl.signedUrl, error: null }
  } catch (err) {
    return {
      data: null,
      error: { message: 'Erreur conversion PDF', code: 'PDF_ERROR', details: err },
    }
  }
}
```

### References

- [Source: Epic 8 — Story 8.9b](file:///_bmad-output/planning-artifacts/epics/epic-8-agents-ia-elio-hub-lab-one-stories-detaillees.md#story-89b)
- [Source: PRD — FR49](file:///_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md)

---

**Story créée le** : 2026-02-13
**Story prête pour développement** : ✅ Oui
**Dépendances** : Story 8.1, 8.3, 8.9a
**FRs couvertes** : FR49 (génération documents One+)
