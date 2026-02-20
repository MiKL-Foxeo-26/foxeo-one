# Module Documents — Flows

## Flow 1: Upload d'un document

```
Utilisateur selectionne fichier (drag & drop ou bouton)
  → Validation client (type + taille)
  → Si invalide → Message d'erreur, pas d'upload
  → Si valide → Optimistic update (affichage immediat)
  → Server Action uploadDocument()
    → Validation serveur (defense en profondeur)
    → Verification identite (operateur ou client)
    → Upload Supabase Storage
    → Insert DB table documents
    → Si erreur DB → Cleanup Storage
  → Toast "Document uploade"
  → Invalidation cache TanStack Query ['documents', clientId]
```

## Flow 2: Liste des documents

```
Page chargee (Server Component)
  → getDocuments({ clientId })
  → RLS filtre automatiquement selon le role
  → DocumentList affiche DataTable
  → TanStack Query maintient le cache
```

## Flow 3: Suppression d'un document

```
Utilisateur clique supprimer
  → Optimistic update (retrait immediat)
  → Server Action deleteDocument({ documentId })
    → Recuperer document (RLS verifie l'acces)
    → Suppression Storage
    → Suppression DB
  → Si erreur → Rollback optimistic update
  → Invalidation cache ['documents', clientId]
```

## Flow 4: Visibilite des documents

```
Document uploade par operateur → visibility = 'private' (defaut)
  → Client ne voit PAS le document
  → Operateur change visibility → 'shared'
  → Client voit le document

Document uploade par client → visibility = 'private' (defaut)
  → Operateur voit TOUJOURS (policy documents_select_operator)
  → Client ne voit que ses propres uploads + documents partages
```

## Flow 5: Visualisation d'un document

```
Utilisateur clique sur un document dans la liste
  → Navigation vers /modules/documents/[documentId]
  → Server Action getDocumentUrl({ documentId })
    → RLS verifie l'acces
    → Genere signed URL (1h)
  → Selon le type de fichier :
    → Markdown → fetch contenu via signed URL → rendu HTML (react-markdown)
    → PDF → affichage iframe avec signed URL
    → Image → affichage <img> avec signed URL
    → Autre → apercu metadonnees + bouton telecharger
```

## Flow 6: Partage individuel MiKL → Client

```
Operateur clique "Partager" sur un document prive (Hub)
  → Server Action shareDocument(documentId)
    → Verification auth (getUser)
    → Verification operateur (operators.auth_user_id)
    → UPDATE documents SET visibility='shared' WHERE id=documentId
    → RLS verifie que l'operateur possede ce document
    → Fire-and-forget : INSERT notifications (client_id, type='document_shared')
  → Invalidation cache TanStack Query ['documents', clientId]
  → Badge passe "Prive" → "Partage"
  → Bouton passe "Partager" → "Partage actif"
  → Client voit le document dans son dashboard

Operateur clique "Partage actif" → AlertDialog confirmation
  → Si confirme : Server Action unshareDocument(documentId)
    → UPDATE documents SET visibility='private'
  → Badge repasse "Prive"
  → Client ne voit plus le document
```

## Flow 7: Partage en lot (batch) MiKL → Client

```
Operateur coche N documents dans la liste Hub
  → Barre batch apparait : "N documents selectionnes"
  → Operateur clique "Partager la selection (N)"
  → Server Action shareDocumentsBatch({ documentIds: [N ids], clientId })
    → Validation Zod (array.min(1))
    → Verification auth
    → Verification operateur (possede le clientId)
    → UPDATE documents SET visibility='shared' WHERE id IN (N ids)
    → Retourne { count: N, documentIds: [...] }
  → Invalidation cache ['documents', clientId]
  → Selection effacee automatiquement (onSuccess callback)
  → Barre batch disparait
  → N documents passent en "Partage"
```

## Flow 8: Telechargement / Generation PDF

```
Utilisateur clique "Telecharger" ou "Telecharger en PDF"
  → Si PDF natif → telechargement direct via signed URL
  → Si Markdown → Server Action generatePdf({ documentId })
    → Telecharge contenu Markdown depuis Storage
    → Convertit Markdown → HTML
    → Enveloppe dans template PDF brande Foxeo
    → Retourne HTML brande
    → Telechargement cote client
  → Toast "Document telecharge"
```

## Flow 9: Creation d'un dossier

```
Utilisateur clique "+ Nouveau dossier" dans FolderTree
  → Dialog s'ouvre avec champ nom
  → Utilisateur saisit le nom (min 1 char, max 100)
  → Clic "Creer"
  → useFolderMutations.useCreateFolder.mutate({ clientId, operatorId, name })
    → Server Action createFolder()
      → Verification auth
      → Validation Zod
      → INSERT document_folders
    → Invalidation cache ['folders', clientId]
  → Nouveau dossier apparait dans l'arborescence
```

## Flow 10: Deplacement d'un document

```
Utilisateur survole un document → Menu contextuel "Deplacer vers..."
  → Selection du dossier cible (ou "Non classes" = null)
  → useFolderMutations.useMoveDocument.mutate({ documentId, folderId })
    → Server Action moveDocument()
      → Verification auth
      → Verification document existe (RLS)
      → Verification dossier existe (si folderId non null)
      → UPDATE documents SET folder_id = folderId
    → Invalidation cache ['folders', clientId] + ['documents', clientId]
  → Toast "Document deplace dans {nom_dossier}"
```

## Flow 11: Recherche dans les documents

```
Utilisateur tape dans DocumentSearch (debounce 200ms)
  → searchQuery propagee a DocumentsPageClient
  → DocumentList recoit searchQuery prop
  → filteredDocuments = documents.filter(d =>
      d.name.includes(q) || d.fileType.includes(q) || d.tags.some(t => t.includes(q))
    )
  → AUCUNE requete DB supplementaire
  → Resultats < 1 seconde (cache TanStack Query deja charge)
  → Si 0 resultats → "Aucun document trouve"
  → Clic X → clear, tous les documents reapparaissent
```
