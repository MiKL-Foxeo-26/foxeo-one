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

### Statuts parcours

| Statut | Description |
|--------|-------------|
| En cours | Parcours actif, le client progresse |
| Suspendu | Parcours mis en pause (accès Lab désactivé) |
| Terminé | Toutes les étapes sont complétées |

## Prochaines fonctionnalités

- Notes privées et rappels (Stories 2.6-2.7)
- Statistiques temps passé par client (Story 2.8)
- Suspendre/réactiver/clôturer un client (Stories 2.9a-2.9c)
