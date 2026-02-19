# Module Documents — Guide

## Vue d'ensemble

Le module Documents permet aux clients et operateurs de gerer des fichiers sur la plateforme Foxeo. Les fichiers sont stockes dans Supabase Storage avec validation cote client et serveur.

## Fonctionnalites

- **Upload de documents** : Drag & drop ou bouton parcourir avec validation automatique (type + taille)
- **Liste des documents** : DataTable avec nom, type (icone), taille formatee, date, visibilite
- **Suppression** : Suppression du fichier Storage + enregistrement DB
- **Visibilite** : `private` (visible uniquement par l'uploadeur) ou `shared` (visible par client et operateur)
- **Validation** : Types autorises (PDF, DOCX, XLSX, PNG, JPG, SVG, MD, TXT, CSV), taille max 10 Mo
- **Viewer de documents** : Visualisation directe dans le dashboard (Markdown en HTML, PDF en iframe, images)
- **Telechargement PDF** : Telechargement direct ou generation PDF depuis Markdown avec branding Foxeo
- **Signed URLs** : Acces securise aux fichiers via URLs temporaires (1h)

## Acces

| Dashboard | Route | Acces |
|-----------|-------|-------|
| Hub | `/modules/documents/[clientId]` | Operateur voit tous les docs d'un client |
| Hub | `/modules/documents/[clientId]/[documentId]` | Viewer document avec badge visibilite |
| Lab / One | `/modules/documents` | Client voit ses docs + docs partages |
| Lab / One | `/modules/documents/[documentId]` | Viewer document client |

## Partager des documents avec votre client

L'operateur (MiKL) peut partager des documents prives avec son client via le Hub.

### Partage individuel

Chaque document de la liste dispose d'un bouton **"Partager"**. Un clic passe le document de `private` a `shared` : le client le voit immediatement dans son dashboard. Le client est notifie automatiquement.

Pour retirer le partage, le meme bouton affiche **"Partage actif"**. Un clic ouvre une boite de confirmation avant de repasser le document en `private`.

### Partage en lot (batch)

La liste Hub propose des cases a cocher (`showBatchActions=true`). Apres selection de plusieurs documents, la barre d'actions batch apparait avec le bouton **"Partager la selection (N)"**. Un seul clic partage tous les documents selectionnes en une requete. La selection est effacee automatiquement apres succes.

### Comportement visibilite

| Etat | Client voit | Operateur voit |
|------|-------------|----------------|
| `private` | Non | Oui |
| `shared` | Oui | Oui |

## Composants disponibles

- `DocumentUpload` — Zone de depot avec validation
- `DocumentList` — Tableau de documents (+ checkboxes batch si `showBatchActions=true`)
- `DocumentIcon` — Icone par type de fichier
- `DocumentSkeleton` — Skeleton loader
- `DocumentsPageClient` — Page complete (upload + liste)
- `DocumentViewer` — Viewer selon type (Markdown, PDF, image, fallback)
- `DocumentViewerSkeleton` — Skeleton loader du viewer
- `DocumentMetadataPreview` — Apercu metadonnees pour fichiers non visualisables
- `DocumentDownloadButton` — Bouton telechargement / generation PDF
- `DocumentVisibilityBadge` — Badge visibilite (Hub)
- `DocumentViewerPageClient` — Page viewer complete
- `DocumentShareButton` — Bouton partager/retirer partage individuel

## Securite

- **RLS** : Isolation complete entre clients. Un client ne voit jamais les documents prives d'un autre.
- **Storage** : Bucket prive avec politiques RLS. Chemins : `{operatorId}/{clientId}/{filename}`
- **Triple couche** : RLS (DB) + validation serveur (Server Action) + validation client (composant)
