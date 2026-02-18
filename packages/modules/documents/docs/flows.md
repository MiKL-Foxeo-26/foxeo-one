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
