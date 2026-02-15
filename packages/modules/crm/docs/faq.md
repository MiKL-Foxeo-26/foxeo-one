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

### Notes privées

**Q: Les notes privées sont-elles visibles par le client ?**
R: Non, absolument pas. Les notes privées sont strictement réservées à votre usage interne. Le client ne peut ni les voir ni en être informé.

**Q: Puis-je modifier ou supprimer une note après l'avoir créée ?**
R: Oui, chaque note dispose d'un menu contextuel (trois points) permettant de la modifier ou de la supprimer. La suppression demande une confirmation.

**Q: Y a-t-il une limite au nombre de notes par client ?**
R: Non, vous pouvez ajouter autant de notes que nécessaire. Elles sont ordonnées de la plus récente à la plus ancienne pour faciliter la lecture.

**Q: Les notes sont-elles limitées en taille ?**
R: Chaque note peut contenir jusqu'à 5000 caractères, ce qui est largement suffisant pour des annotations détaillées.

### Épinglage et report de clients

**Q: Combien de clients puis-je épingler ?**
R: Aucune limite. Cependant, pour que l'épinglage reste utile, il est recommandé de ne garder épinglés que vos clients actifs prioritaires.

**Q: Que se passe-t-il quand j'épingle plusieurs clients ?**
R: Tous les clients épinglés apparaissent en haut de la liste, triés par date de création (les plus récents en premier). Les clients non-épinglés apparaissent ensuite.

**Q: Comment savoir quand un client reporté doit être traité ?**
R: L'indicateur "Reporté" disparaît automatiquement une fois la date de rappel passée. Vous pouvez consulter votre liste de clients pour voir lesquels ne sont plus reportés.

**Q: Puis-je modifier la date de report d'un client ?**
R: Oui, cliquez à nouveau sur "À traiter plus tard" et choisissez une nouvelle date. Vous pouvez également annuler complètement le report.

**Q: Le report d'un client affecte-t-il son parcours ou ses accès ?**
R: Non, le report est uniquement un indicateur visuel pour votre organisation personnelle. Il n'a aucun impact sur le parcours, les accès ou les fonctionnalités du client.

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

### Intégration Cursor

**Q: Comment ouvrir le dossier BMAD d'un client dans Cursor ?**
R: Dans la fiche client, cliquez sur le bouton "Ouvrir dans Cursor" dans le header. Si Cursor est installé et que le dossier existe, l'éditeur s'ouvrira automatiquement dans le dossier du client.

**Q: Que faire si le dossier BMAD du client n'existe pas ?**
R: Un message d'alerte vous indiquera le chemin attendu (ex: `/Users/mikl/bmad/clients/nom-entreprise`). Cliquez sur "Copier le chemin", créez le dossier manuellement, puis utilisez à nouveau le bouton.

**Q: Le bouton Cursor ne fonctionne pas, que faire ?**
R: Si le protocole `cursor://` n'est pas supporté par votre navigateur, un message de fallback s'affichera avec le chemin complet. Copiez-le et ouvrez manuellement dans Cursor via File → Open Folder.

**Q: Comment personnaliser le chemin de base BMAD ?**
R: Définissez la variable d'environnement `NEXT_PUBLIC_BMAD_BASE_PATH` dans votre fichier `.env.local`. Par défaut, le chemin est `/Users/mikl/bmad`.

**Q: Le slug du client est-il basé sur le nom ou l'entreprise ?**
R: Si le client a une entreprise renseignée, le slug est basé sur le nom de l'entreprise (ex: "Acme Corp" → `acme-corp`). Sinon, il est basé sur le nom du client (ex: "Jean Dupont" → `jean-dupont`).

**Q: Les caractères spéciaux et accents sont-ils gérés ?**
R: Oui, le slug est normalisé automatiquement : les accents sont retirés, les caractères spéciaux sont remplacés par des tirets, tout est en minuscules (ex: "Café & Restaurant" → `cafe-restaurant`).

### Rappels et calendrier

**Q: Les rappels sont-ils partagés avec les clients ?**
R: Non, les rappels sont strictement personnels. Seul l'opérateur peut les voir et les gérer. C'est un outil de planification interne.

**Q: Puis-je créer un rappel sans l'associer à un client ?**
R: Oui, le champ "Client associé" est optionnel. Vous pouvez créer des rappels généraux non liés à un client spécifique.

**Q: Que se passe-t-il si je supprime un client qui a des rappels associés ?**
R: Les rappels restent dans votre liste mais ne sont plus liés à un client (client_id devient null). Vous ne perdez pas vos rappels.

**Q: Comment voir rapidement combien de rappels j'ai en retard ?**
R: Cliquez sur l'onglet "En retard" dans la vue Rappels. Tous les rappels non complétés avec une date passée s'affichent.

**Q: Le calendrier affiche-t-il seulement le mois en cours ?**
R: Non, vous pouvez naviguer librement entre les mois avec les flèches ← →. Le système charge automatiquement les rappels du mois affiché.

**Q: Y a-t-il une limite au nombre de rappels ?**
R: Non, vous pouvez créer autant de rappels que nécessaire. L'affichage du calendrier reste performant même avec des centaines de rappels.

**Q: Puis-je modifier la date d'échéance d'un rappel après sa création ?**
R: Oui, via le menu actions (⋮) → Modifier, vous pouvez changer le titre, la description et la date d'échéance.

**Q: Que signifie "marquer comme complété" ?**
R: C'est une action qui indique que la tâche du rappel est terminée. Le rappel reste visible (en grisé) mais n'apparaît plus dans "À venir" ou "En retard".

**Q: Les rappels complétés sont-ils automatiquement supprimés ?**
R: Non, ils restent dans votre historique. Vous devez les supprimer manuellement si vous souhaitez les retirer définitivement.

**Q: Puis-je "décocher" un rappel complété ?**
R: Oui, cliquez à nouveau sur la checkbox pour le marquer comme non complété. Le rappel redeviendra actif.

### Statistiques et temps passé

**Q: Comment accéder aux statistiques du CRM ?**
R: Depuis le module CRM, utilisez la sous-navigation : Clients | Rappels | **Statistiques**. Vous pouvez aussi accéder directement via l'URL `/modules/crm/stats`.

**Q: Comment est calculé le temps passé par client ?**
R: Le temps est estimé à partir des activités enregistrées : 2 minutes par message envoyé, 5 minutes par validation Hub (approbation ou refus), et la durée réelle des visioconférences. Ces constantes sont configurables.

**Q: Pourquoi le MRR affiche "Module Facturation requis" ?**
R: Le MRR (revenu mensuel récurrent) nécessite le module Facturation (Epic 11). Tant que ce module n'est pas activé, un placeholder est affiché.

**Q: Les statistiques sont-elles en temps réel ?**
R: Les données sont mises en cache pendant 10 minutes pour optimiser les performances. Rechargez la page pour forcer une mise à jour des données.

**Q: Que signifie le taux de graduation ?**
R: C'est le pourcentage de clients ayant un parcours Lab de type "Complet" qui ont gradué vers un dashboard One. Il mesure le taux de conversion de l'accompagnement.

**Q: Puis-je trier le tableau du temps passé ?**
R: Oui, cliquez sur les en-têtes de colonne (Client, Temps total, Dernière activité) pour trier par ordre croissant ou décroissant.

**Q: Le temps passé est-il exact ?**
R: Le temps des visios est exact (durée réelle). Pour les messages et validations, ce sont des estimations moyennes (2 min/message, 5 min/validation) qui donnent un ordre de grandeur fiable.

## Besoin d'aide ?

Contactez le support technique via le module d'aide en ligne.
