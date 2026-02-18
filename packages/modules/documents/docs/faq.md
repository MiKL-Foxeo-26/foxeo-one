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
