# Module Documents — FAQ

## Quels types de fichiers sont acceptes ?

PDF, DOCX, XLSX, PNG, JPG, JPEG, SVG, MD, TXT, CSV. La validation se fait sur l'extension du fichier.

## Quelle est la taille maximale ?

10 Mo par fichier. Cette constante (`MAX_FILE_SIZE`) est definie dans `@foxeo/utils`.

## Ou sont stockes les fichiers ?

Dans Supabase Storage, bucket `documents` (prive). Chemin : `{operatorId}/{clientId}/{uuid}-{filename}`.

## Un client peut-il voir les documents d'un autre client ?

Non. L'isolation est garantie par RLS au niveau de la base de donnees ET du Storage.

## Quelle est la difference entre prive et partage ?

- **Prive** : visible uniquement par l'uploadeur (client ou operateur)
- **Partage** : visible par le client ET l'operateur

## Que se passe-t-il si le Storage echoue pendant un upload ?

L'erreur est retournee a l'utilisateur. Aucun enregistrement n'est cree en base.

## Que se passe-t-il si la DB echoue apres un upload Storage reussi ?

Le fichier uploade est supprime automatiquement du Storage (cleanup). L'erreur DB est retournee.

## Quels formats sont visualisables dans le viewer ?

- **Markdown** (.md) : rendu HTML directement dans le dashboard
- **PDF** (.pdf) : affiche dans un iframe embarque
- **Images** (.png, .jpg, .jpeg, .svg) : affichage direct
- **Autres** (.docx, .xlsx, .csv, .txt) : apercu des metadonnees avec bouton telecharger

## Comment fonctionne le telechargement PDF ?

- Si le document est deja un PDF, il est telecharge directement via signed URL Supabase Storage
- Si le document est un Markdown, un PDF est genere cote serveur avec le branding Foxeo (header logo, footer date)

## Qu'est-ce qu'un signed URL ?

Une URL temporaire (expire apres 1h) generee cote serveur pour acceder a un fichier dans Supabase Storage. Les chemins internes ne sont jamais exposes au client.

## Puis-je retirer un partage apres l'avoir accorde ?

Oui. Cliquez sur **"Partage actif"** dans la liste du Hub. Une boite de confirmation s'affiche avant de repasser le document en `private`. Le client ne verra plus le document dans son dashboard.

## Le client est-il notifie quand je partage un document ?

Oui. Lors du partage individuel (`shareDocument`), une notification est inseree automatiquement en base de donnees. Cette insertion est "fire-and-forget" : si elle echoue, le partage reste valide (l'erreur de notification ne bloque pas l'action).

## Comment fonctionne le partage en lot ?

Selectionnez plusieurs documents avec les cases a cocher dans le Hub, puis cliquez **"Partager la selection"**. Une seule requete SQL met a jour tous les documents selectionnes en `shared`. La selection est automatiquement effacee apres le succes.

## Puis-je partager des documents uploades par le client ?

Oui. L'operateur a toujours acces a tous les documents de son client (policy RLS `documents_select_operator`). Il peut changer leur visibilite en `shared` ou `private`.

## Puis-je supprimer un dossier non vide ?

Non. Un dossier doit etre vide (0 documents) avant de pouvoir etre supprime. L'action `deleteFolder` retourne une erreur `FOLDER_NOT_EMPTY` si des documents sont encore dans le dossier. Deplacez d'abord les documents dans un autre dossier ou dans "Non classes".

## Que devient un document quand son dossier est supprime ?

Le document n'est pas supprime. La colonne `folder_id` est mise a `NULL` automatiquement (contrainte `ON DELETE SET NULL`). Le document apparait dans la vue "Non classes".

## La recherche interroge-t-elle la base de donnees a chaque frappe ?

Non. La recherche s'effectue uniquement sur les donnees deja en cache TanStack Query (filtre JavaScript cote client). Aucune requete DB supplementaire n'est effectuee. La recherche respecte NFR-P4 (< 1 seconde).

## La recherche est-elle limitee au dossier selectionne ?

Non. La recherche traverse tous les documents du client, independamment du dossier actif. C'est un choix delibere : si vous cherchez "contrat" vous trouvez tous vos contrats, meme dans des dossiers differents.
