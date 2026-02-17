# Guide CRM — Gestion de la Relation Client

## Accès au module

Le module CRM est accessible depuis le **Foxeo Hub** (opérateur MiKL uniquement).

Navigation : **Menu principal → CRM**

## Fonctionnalités

### Liste des clients

Visualisez tous vos clients avec :
- Nom et entreprise
- Type de client (Complet / Direct One / Ponctuel)
- Statut actuel (Lab actif, One actif, Inactif, Suspendu)
- Date de création

### Recherche rapide

Utilisez le champ de recherche pour trouver rapidement un client par :
- Nom
- Entreprise
- Email
- Secteur d'activité

La recherche s'effectue en temps réel avec un délai de 300ms.

### Filtres

Filtrez vos clients selon :
- **Type de client** : Complet, Direct One, Ponctuel
- **Statut** : Lab actif, One actif, Inactif, Suspendu
- **Secteur d'activité**

Les filtres sont combinables entre eux et avec la recherche.

### Créer un nouveau client

1. Cliquez sur le bouton **"Créer un client"** en haut de la liste
2. Remplissez le formulaire :
   - **Nom** (obligatoire, 2-100 caractères)
   - **Email** (obligatoire, doit être unique par opérateur)
   - **Entreprise** (optionnel)
   - **Téléphone** (optionnel)
   - **Secteur d'activité** (optionnel)
   - **Type de client** : Ponctuel (défaut), Complet, ou Direct One
3. Cliquez sur **"Créer"**
4. Vous serez redirigé vers la fiche du nouveau client

### Modifier un client

1. Accédez à la fiche du client
2. Cliquez sur le bouton **"Modifier"**
3. Modifiez les champs souhaités (y compris le type de client)
4. Cliquez sur **"Enregistrer"**

### Navigation

Cliquez sur une ligne pour accéder à la fiche complète du client.

### Consulter la fiche d'un client

La fiche client offre une vue 360° avec 4 onglets :

**Onglet Informations (par défaut)**
- Coordonnées complètes : nom, email, téléphone, entreprise, secteur, site web
- Configuration : type de client (badge), statut (badge), date de création, dernière activité
- Parcours Lab : nom du parcours et progression (si applicable)
- Modules One : liste des modules actifs (si applicable)
- Bouton "Modifier" pour éditer les informations

**Onglet Historique**
- Timeline chronologique de tous les événements du client
- Types d'événements : création, changements de statut, validations, visios, graduation
- Affichage avec icônes et dates relatives ("il y a 2 jours")

**Onglet Documents**
- Liste des documents partagés avec le client (briefs, livrables, rapports)
- Chaque document affiche : nom, type, date, visibilité client
- Lien vers le module Documents pour la visualisation complète

**Onglet Échanges**
- Historique des échanges récents : messages, notifications, résumés Élio
- Aperçu du contenu (100 premiers caractères)
- Bouton "Ouvrir le chat complet" pour accéder au module Chat

**Partage de lien**
L'onglet actif est synchronisé avec l'URL (`?tab=historique`). Vous pouvez partager un lien direct vers un onglet spécifique.

### Assigner un parcours Lab

1. Accédez à la fiche d'un client (onglet Informations)
2. Dans la section **"Parcours & Accès"**, cliquez sur **"Assigner un parcours Lab"**
3. Sélectionnez un template de parcours (ex: "Parcours Complet")
4. Activez/désactivez les étapes individuelles selon les besoins du client
5. Cliquez sur **"Assigner"**
6. Le dashboard du client passe automatiquement en mode **Lab**

### Gérer les accès Lab/One

Dans la section **"Accès dashboards"** de la fiche client :
- **Accès Lab** : Active/désactive le dashboard d'incubation. Si désactivé avec un parcours en cours, celui-ci est suspendu (pas supprimé). À la réactivation, le parcours reprend.
- **Accès One** : Active/désactive le dashboard business.
- La désactivation déclenche un dialog de confirmation.

### Notes privées sur un client

Dans la fiche client (onglet Informations), la section **"Notes privées"** vous permet d'ajouter des annotations personnelles sur le client. Ces notes ne sont jamais visibles par le client — elles sont strictement réservées à votre usage interne.

**Ajouter une note :**
1. Dans la section "Notes privées", saisissez votre note dans le champ de texte
2. Cliquez sur "Ajouter"
3. La note apparaît immédiatement dans la liste, ordonnée de la plus récente à la plus ancienne

**Modifier ou supprimer une note :**
- Cliquez sur le menu contextuel (trois points) d'une note
- Choisissez "Modifier" pour éditer le contenu
- Choisissez "Supprimer" (une confirmation sera demandée)

Utilisez les notes pour :
- Garder une trace de vos échanges informels
- Noter des détails importants sur les besoins ou contraintes du client
- Conserver des rappels personnels pour la relation client

### Épingler un client prioritaire

Pour accéder rapidement à vos clients les plus importants, épinglez-les en haut de la liste.

**Comment épingler :**
1. Sur la liste des clients, cliquez sur l'icône d'épingle à côté du nom du client
2. Le client épinglé remonte automatiquement en haut de la liste
3. Les clients épinglés ont un indicateur visuel distinctif

**Pour désépingler :**
- Cliquez à nouveau sur l'icône d'épingle

**Tri automatique :** Les clients épinglés apparaissent toujours en haut de liste, avant les autres clients. Parmi les épinglés, le tri par date de création s'applique.

### Reporter un client ("À traiter plus tard")

Si vous devez temporairement mettre de côté un client, utilisez la fonction "À traiter plus tard".

**Comment reporter :**
1. Sur la fiche client ou depuis la liste, cliquez sur "À traiter plus tard"
2. Choisissez une date de rappel
3. Cliquez sur "Valider"
4. Le client affiche un indicateur "Reporté" avec la date

**Comportement automatique :**
- L'indicateur "Reporté" disparaît automatiquement une fois la date passée
- Aucune action manuelle n'est nécessaire
- Vous pouvez annuler le report à tout moment en cliquant sur "Annuler le report"

### Ouvrir le dossier client dans Cursor

Dans le header de la fiche client, le bouton **"Ouvrir dans Cursor"** vous permet d'accéder directement au dossier BMAD du client pour travailler avec Orpheus.

**Fonctionnement :**
1. Le bouton génère un lien `cursor://file/` pointant vers le dossier du client
2. Le chemin est construit selon la convention : `{bmad_base_path}/clients/{client-slug}/`
3. Le slug est dérivé du nom de l'entreprise (ou du nom client si pas d'entreprise)
4. Cliquer ouvre Cursor directement dans ce dossier

**Si le dossier n'existe pas encore :**
- Un message d'alerte s'affiche avec le chemin attendu
- Un bouton "Copier le chemin" copie le chemin dans le presse-papier
- Créez le dossier manuellement, puis utilisez le bouton

**Si le protocole Cursor n'est pas supporté :**
- Un message explique comment ouvrir manuellement
- Le chemin complet est affiché avec un bouton "Copier"
- Instructions : File → Open Folder dans Cursor

**Configuration (optionnel) :**
Vous pouvez personnaliser le chemin de base BMAD via la variable d'environnement :
```
NEXT_PUBLIC_BMAD_BASE_PATH=/votre/chemin/bmad
```
Par défaut : `/Users/mikl/bmad`

### Cycle de vie du client — Suspendre, Clôturer, Réactiver

Le module CRM permet de gérer le cycle de vie complet de vos clients avec trois actions principales : **Suspendre**, **Clôturer** et **Réactiver**.

#### Suspendre un client

Mettre un client en pause temporaire lorsqu'il ne peut pas poursuivre son parcours (attente de paiement, demande du client, etc.).

**Comment suspendre :**
1. Accédez à la fiche du client
2. Dans le header, cliquez sur le bouton **"Suspendre"**
3. Un dialog de confirmation s'affiche
4. (Optionnel) Ajoutez une raison dans le champ de texte (max 500 caractères)
5. Cliquez sur **"Suspendre le client"**

**Conséquences de la suspension :**
- Le client ne peut plus accéder à son dashboard (Lab ou One)
- Toutes ses données sont conservées intactes
- Le statut passe à "Suspendu" avec badge orange
- L'activité est enregistrée dans l'historique du client
- Vous pouvez réactiver le client à tout moment

#### Clôturer un client

Fermer définitivement un dossier client et archiver ses données en lecture seule.

**Comment clôturer :**
1. Accédez à la fiche du client (statut actif ou suspendu)
2. Dans le header, cliquez sur le bouton **"Clôturer"** (rouge)
3. Un dialog de confirmation avec **double validation** s'affiche
4. **Saisissez le nom exact du client** pour confirmer l'action
5. La validation est insensible à la casse et aux espaces (ex: "Jean Dupont" = "jean dupont")
6. Le bouton "Clôturer définitivement" ne s'active qu'une fois le nom correct saisi
7. Cliquez sur **"Clôturer définitivement"**

**Conséquences de la clôture :**
- Le client ne peut plus se connecter à son dashboard
- Toutes ses données sont archivées en lecture seule
- Le statut passe à "Clôturé" avec badge gris
- Le client n'apparaît plus dans la liste par défaut
- Un bandeau d'information apparaît en haut de la fiche : "Client clôturé le [date]"
- Tous les boutons d'édition sont désactivés
- Vous pouvez toujours consulter les données en lecture seule
- L'activité est enregistrée dans l'historique du client

**Accès aux clients clôturés :**
- Dans la liste des clients, utilisez le filtre **"Statut" → "Clôturé"**
- Les clients clôturés sont exclus par défaut de la liste pour éviter l'encombrement

#### Réactiver un client

Remettre un client suspendu ou clôturé en statut actif.

**Comment réactiver :**
1. Accédez à la fiche du client (suspendu ou clôturé)
2. Cliquez sur le bouton **"Réactiver"**
   - Dans le header pour un client suspendu
   - Dans le bandeau d'information pour un client clôturé
3. La réactivation est immédiate (pas de confirmation)

**Conséquences de la réactivation :**
- Le statut repasse à "Actif" avec badge vert
- Le client peut à nouveau accéder à son dashboard
- Tous les boutons d'édition sont réactivés
- Le client réapparaît dans la liste par défaut
- Les dates `suspended_at` et `archived_at` sont effacées
- L'activité est enregistrée dans l'historique du client

**Cas d'usage typiques :**
- **Suspension** : Retard de paiement, pause demandée par le client, congés prolongés
- **Clôture** : Fin de mission, client ayant quitté l'offre, dossier terminé sans renouvellement
- **Réactivation** : Reprise après suspension, réouverture d'un ancien dossier clôturé

### Statuts parcours

| Statut | Description |
|--------|-------------|
| En cours | Parcours actif, le client progresse |
| Suspendu | Parcours mis en pause (accès Lab désactivé) |
| Terminé | Toutes les étapes sont complétées |

## Rappels personnels & Calendrier

### Accès

Navigation : **CRM → Rappels** (lien dans le menu de navigation CRM)

### Vue calendrier

Le calendrier mensuel affiche tous vos rappels sous forme d'indicateurs colorés par jour :
- **Point bleu** : Rappels à venir
- **Point rouge** : Rappels en retard (non complétés et date passée)
- **Point gris** : Rappels complétés

Cliquez sur un jour pour voir la liste détaillée des rappels de cette date.

### Créer un rappel

1. Cliquez sur le bouton **"Nouveau rappel"**
2. Remplissez le formulaire :
   - **Titre** (obligatoire, max 200 caractères)
   - **Description** (optionnel, max 1000 caractères)
   - **Date d'échéance** (obligatoire)
   - **Client associé** (optionnel, auto-rempli si créé depuis une fiche client)
3. Cliquez sur **"Créer"**

**Astuce** : Vous pouvez aussi créer un rappel directement depuis une fiche client via le bouton "Nouveau rappel" dans le header.

### Gérer les rappels

Pour chaque rappel, vous pouvez :
- ✅ **Marquer comme complété** : Cochez la case à gauche du rappel
- ✏️ **Modifier** : Menu actions (⋮) → Modifier
- 🗑️ **Supprimer** : Menu actions (⋮) → Supprimer (confirmation requise)

### Filtrer les rappels

Utilisez les onglets en haut de la page :
- **À venir** : Rappels non complétés avec date future (défaut)
- **En retard** : Rappels non complétés avec date passée
- **Complétés** : Rappels marqués comme terminés
- **Tous** : Afficher tous les rappels

### Navigation par mois

Utilisez les flèches **← →** pour naviguer entre les mois. Le jour actuel est mis en évidence par un contour bleu.

## Statistiques & temps passé par client

### Accès

Navigation : **CRM → Statistiques** (sous-navigation CRM)

### Indicateurs clés (KPIs)

Le tableau de bord statistiques affiche 5 indicateurs principaux :

- **Total clients** : Nombre total de clients dans le portefeuille (répartition actifs/inactifs/suspendus au survol)
- **Clients Lab actifs** : Nombre de clients avec statut Lab actif
- **Clients One actifs** : Nombre de clients avec statut One actif
- **Taux de graduation** : Pourcentage de clients Lab ayant gradué vers One (nombre/total au survol)
- **MRR estimé** : Revenu mensuel récurrent (nécessite le module Facturation, sinon placeholder)

Chaque indicateur dispose d'un **tooltip** au survol affichant le détail du calcul.

### Répartition par type de client

Un graphique en donut affiche la répartition des clients par type :
- **Complet (Lab)** : Clients en parcours d'incubation complet
- **Direct One** : Clients accédant directement au dashboard One
- **Ponctuel** : Clients pour des interventions ponctuelles

La légende montre le nombre et le pourcentage pour chaque type.

### Temps passé par client

Un tableau détaillé estime le temps passé par l'opérateur pour chaque client :

| Colonne | Description |
|---------|-------------|
| Client | Nom et entreprise |
| Type | Badge du type de client |
| Temps total | Estimation basée sur les activités |
| Dernière activité | Date de la dernière interaction |

**Calcul du temps estimé :**
- Messages : 2 minutes par message envoyé
- Validations Hub : 5 minutes par validation (approbation ou refus)
- Visios : Durée réelle de la visioconférence

Le tableau est triable par nom, temps total ou dernière activité. Par défaut, les clients avec le plus de temps passé apparaissent en premier.

### Performance

Les données sont chargées côté serveur (RSC) et mises en cache 10 minutes via TanStack Query. Un skeleton loader spécifique s'affiche pendant le chargement.

### Upgrader un client Ponctuel vers Lab ou One

Pour faire évoluer un client Ponctuel vers un accompagnement plus complet, utilisez les boutons d'upgrade disponibles sur la fiche client.

**Conditions d'accès :**
- Le client doit être de type **Ponctuel** (les boutons sont masqués pour les autres types)
- Le client doit être en statut **Actif**

**Upgrader vers Lab :**
1. Sur la fiche client, cliquez sur **"Upgrader vers Lab"** dans le header
2. Un dialog s'ouvre sur l'onglet "Upgrader vers Lab"
3. Sélectionnez un template de parcours (ex: "Parcours Complet")
4. Configurez les étapes actives du parcours
5. Cliquez sur **"Upgrader"**

**Conséquences de l'upgrade vers Lab :**
- Le type client passe à **Complet**
- Un parcours Lab est créé avec les étapes sélectionnées
- Le dashboard passe en mode **Lab**
- L'action est enregistrée dans l'historique (`client_upgraded`)

**Upgrader vers One :**
1. Sur la fiche client, cliquez sur **"Upgrader vers One"** dans le header
2. Un dialog s'ouvre sur l'onglet "Upgrader vers One"
3. Sélectionnez les modules à activer (Core Dashboard inclus par défaut)
4. Cliquez sur **"Upgrader"**

**Conséquences de l'upgrade vers One :**
- Le type client passe à **Direct One**
- Le dashboard passe en mode **One** avec les modules sélectionnés
- L'action est enregistrée dans l'historique (`client_upgraded`)

**Note :** À ce stade du développement, peu de modules supplémentaires sont disponibles. Le module Core Dashboard est activé par défaut et ne peut pas être désactivé.

## Alertes inactivité Lab

### Détection automatique

Le système détecte automatiquement les clients Lab inactifs. Une Edge Function quotidienne (8h) vérifie si un client Lab n'a eu aucune activité (login, message, soumission) depuis X jours.

**Seuil configurable :** Par défaut 7 jours. Chaque opérateur peut ajuster ce seuil dans ses préférences (colonne `inactivity_threshold_days`).

**Notification :**
Lorsqu'un client est détecté comme inactif, une notification est créée avec :
- Nom du client
- Nombre de jours d'inactivité
- Date de la dernière activité
- Lien direct vers la fiche client

**Alerte unique :** L'alerte n'est envoyée qu'une fois par période d'inactivité. Si le client redevient actif (nouvelle activité loguée), le flag est automatiquement réinitialisé.

### Actions sur une alerte d'inactivité

Depuis la notification, vous pouvez :
1. **Voir la fiche** — Ouvrir directement la fiche client
2. **À traiter plus tard** — Reporter le traitement (Story 2.6)
3. **Ignorer** — Marquer la notification comme lue

## Import clients CSV

### Importer des clients en masse

1. Depuis la liste des clients, cliquez sur le bouton **"Import CSV"** (à côté de "Créer un client")
2. **Étape 1 — Upload :** Sélectionnez un fichier CSV ou téléchargez le template
3. **Étape 2 — Aperçu :** Vérifiez les données avant import
   - Lignes valides : fond vert
   - Lignes en erreur : fond rouge avec détail des erreurs
   - Décochez les lignes valides que vous souhaitez exclure
4. **Étape 3 — Résultat :** Résumé "X clients importés, Y ignorés"

### Format du fichier CSV

Colonnes attendues :

| Colonne | Obligatoire | Description |
|---------|:-----------:|-------------|
| `nom` | Oui | Nom du client |
| `email` | Oui | Email (doit être unique par opérateur) |
| `entreprise` | Non | Nom de l'entreprise |
| `telephone` | Non | Numéro de téléphone |
| `secteur` | Non | Secteur d'activité |
| `type_client` | Non | complet, direct_one, ponctuel (défaut: ponctuel) |

**Template :** Cliquez sur "Télécharger le template CSV" pour obtenir un fichier pré-rempli avec les colonnes correctes et des exemples.

### Validation automatique

Avant l'import, le système vérifie :
- Présence des champs obligatoires (nom, email)
- Format email valide
- Type client valide (complet, direct_one, ponctuel)
- Pas de doublons d'email dans le fichier
- Pas de doublons avec les clients existants en base

### Après l'import

- Chaque client reçoit automatiquement une `client_config` par défaut (module `core-dashboard`, dashboard Lab ou One selon le type)
- Le cache de la liste clients est invalidé automatiquement
- L'import est tracé dans les logs d'activité

### Limitations

- Maximum 500 lignes par import
- Les lignes en erreur sont ignorées (pas de blocage)
- Pas de librairie CSV externe — le parser gère les guillemets, virgules dans les valeurs, et l'encodage UTF-8 avec BOM
