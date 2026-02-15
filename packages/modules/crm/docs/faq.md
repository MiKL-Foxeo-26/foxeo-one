# FAQ — Module CRM

## Questions fréquentes

### Recherche et filtres

**Q: Comment rechercher un client rapidement ?**
R: Utilisez le champ de recherche en haut de la liste. La recherche porte sur le nom, l'entreprise, l'email et le secteur d'activité. Les résultats apparaissent en temps réel.

**Q: Puis-je combiner plusieurs filtres ?**
R: Oui, tous les filtres sont combinables entre eux et avec la recherche. Utilisez le bouton "Réinitialiser les filtres" pour tout effacer.

**Q: La recherche est-elle sensible à la casse ?**
R: Non, la recherche ignore la casse (majuscules/minuscules).

### Liste vide

**Q: Que faire si la liste est vide ?**
R: Si vous n'avez pas encore de clients, cliquez sur le bouton "Créer un client" pour créer votre première fiche. Si vous avez des clients mais que la liste est vide, vérifiez vos filtres actifs.

**Q: Pourquoi je ne vois pas tous mes clients ?**
R: Vérifiez que des filtres ne sont pas actifs. Si des filtres sont appliqués, un indicateur apparaît avec un bouton pour les réinitialiser.

### Création et édition

**Q: Que faire si l'email est déjà utilisé ?**
R: Chaque email doit être unique par opérateur. Si un message d'erreur s'affiche indiquant que l'email est déjà associé à un client, utilisez un email différent ou retrouvez le client existant via la recherche.

**Q: Comment modifier un client ?**
R: Accédez à la fiche du client, puis cliquez sur le bouton "Modifier". Le formulaire s'ouvrira pré-rempli avec les données actuelles. Modifiez les champs souhaités et cliquez sur "Enregistrer".

**Q: Puis-je changer le type de client ?**
R: Oui, le type de client (Complet, Direct One, Ponctuel) peut être modifié à tout moment via le formulaire d'édition.

**Q: Que se passe-t-il en cas d'erreur lors de la création ?**
R: Un message d'erreur s'affiche en haut du formulaire. Vos données saisies sont conservées — vous ne perdez rien. Corrigez l'erreur et réessayez.

### Performance

**Q: Combien de clients puis-je avoir dans la liste ?**
R: La liste supporte des milliers de clients. La pagination et la recherche intelligente garantissent de bonnes performances même avec un large portefeuille.

**Q: Pourquoi la recherche est-elle parfois plus lente ?**
R: Si vous avez plus de 500 clients, la recherche utilise une requête serveur optimisée. Cela peut prendre jusqu'à 1 seconde, mais garantit des résultats précis même avec un grand volume.

### Fiche client

**Q: Comment voir l'historique d'un client ?**
R: Ouvrez la fiche du client en cliquant dessus dans la liste, puis cliquez sur l'onglet **"Historique"**. Vous verrez une timeline chronologique de tous les événements : création, changements de statut, validations, visios, etc.

**Q: Où trouver les documents partagés avec un client ?**
R: Dans la fiche du client, cliquez sur l'onglet **"Documents"**. Vous y verrez la liste de tous les documents partagés (briefs, livrables, rapports) avec leur statut de visibilité.

**Q: Comment partager un lien vers un onglet spécifique de la fiche client ?**
R: L'onglet actif est automatiquement reflété dans l'URL (ex: `?tab=historique`). Copiez simplement l'URL du navigateur et partagez-la. Le destinataire arrivera directement sur le bon onglet.

**Q: Pourquoi certains onglets affichent "Aucun document" ou "Aucun échange" ?**
R: Les onglets Documents et Échanges afficheront du contenu une fois que les modules correspondants (Documents et Chat) seront activés et que des données auront été créées pour ce client.

### Parcours et accès

**Q: Comment assigner un parcours Lab à un client ?**
R: Ouvrez la fiche du client, onglet Informations. Dans la section "Parcours & Accès", cliquez sur "Assigner un parcours Lab". Sélectionnez un template et configurez les étapes actives.

**Q: Que se passe-t-il si je désactive l'accès Lab d'un client en parcours ?**
R: Le parcours est suspendu (pas supprimé). L'état courant est préservé. Si vous réactivez l'accès Lab, le parcours reprend exactement là où il en était.

**Q: Puis-je modifier les étapes d'un parcours après l'assignation ?**
R: Dans cette version, les étapes sont configurées lors de l'assignation. La modification post-assignation sera disponible dans une future story.

**Q: Pourquoi je ne vois pas de templates de parcours ?**
R: Les templates sont créés par l'opérateur. Un template "Parcours Complet" est disponible par défaut. Le CRUD complet des templates sera disponible via le module Templates (Epic 12).

**Q: Quel est l'effet de la désactivation de l'accès One ?**
R: Le client perd l'accès à son dashboard One. Le dashboard_type est modifié en conséquence. L'action est tracée dans les logs d'activité.

## Besoin d'aide ?

Contactez le support technique via le module d'aide en ligne.
