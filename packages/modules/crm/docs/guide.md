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

## Prochaines fonctionnalités

- Notes privées et rappels (Stories 2.6-2.7)
- Statistiques temps passé par client (Story 2.8)
