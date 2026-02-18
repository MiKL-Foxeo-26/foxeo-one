# Module Documents — Guide

## Vue d'ensemble

Le module Documents permet aux clients et operateurs de gerer des fichiers sur la plateforme Foxeo. Les fichiers sont stockes dans Supabase Storage avec validation cote client et serveur.

## Fonctionnalites

- **Upload de documents** : Drag & drop ou bouton parcourir avec validation automatique (type + taille)
- **Liste des documents** : DataTable avec nom, type (icone), taille formatee, date, visibilite
- **Suppression** : Suppression du fichier Storage + enregistrement DB
- **Visibilite** : `private` (visible uniquement par l'uploadeur) ou `shared` (visible par client et operateur)
- **Validation** : Types autorises (PDF, DOCX, XLSX, PNG, JPG, SVG, MD, TXT, CSV), taille max 10 Mo

## Acces

| Dashboard | Route | Acces |
|-----------|-------|-------|
| Hub | `/modules/documents/[clientId]` | Operateur voit tous les docs d'un client |
| Lab / One | `/modules/documents` | Client voit ses docs + docs partages |

## Composants disponibles

- `DocumentUpload` — Zone de depot avec validation
- `DocumentList` — Tableau de documents
- `DocumentIcon` — Icone par type de fichier
- `DocumentSkeleton` — Skeleton loader
- `DocumentsPageClient` — Page complete (upload + liste)

## Securite

- **RLS** : Isolation complete entre clients. Un client ne voit jamais les documents prives d'un autre.
- **Storage** : Bucket prive avec politiques RLS. Chemins : `{operatorId}/{clientId}/{filename}`
- **Triple couche** : RLS (DB) + validation serveur (Server Action) + validation client (composant)
