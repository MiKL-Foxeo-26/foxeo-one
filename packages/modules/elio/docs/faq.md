# FAQ — Module Élio

## Le profil est-il obligatoire ?
Non. Le dialog de personnalisation peut être skippé. Dans ce cas, les valeurs par défaut sont appliquées : ton amical, longueur équilibrée, style collaboratif.

## Le profil est-il visible dans le chat ?
Non. Le profil est injecté dans le system prompt côté serveur et n'est jamais exposé dans l'interface utilisateur.

## Puis-je changer mon profil après la configuration initiale ?
Oui, via **Paramètres > Profil de communication Élio**. Les changements s'appliquent immédiatement aux nouvelles conversations.

## Les suggestions guidées sont-elles personnalisables ?
Non dans cette version (Story 6.4). Les suggestions sont définies par étape de parcours et sont les mêmes pour tous les clients.

## L'historique des conversations est-il géré ici ?
Non. La gestion de l'historique des conversations est dans Epic 8 (Story 8.2).

## Élio est disponible sur quels dashboards ?
Depuis Story 8.1, Élio est disponible sur les 3 dashboards : Hub (cyan), Lab (violet), One (orange).

## Que se passe-t-il si Élio ne répond pas ?
L'indicateur "Élio réfléchit..." disparaît et un message d'erreur s'affiche avec un bouton "Réessayer". Le délai maximum est de 60 secondes (NFR-I2).

## L'API DeepSeek est-elle sécurisée ?
Oui. Les clés API ne transitent jamais côté client. Tout passe par une Supabase Edge Function qui gère l'authentification sécurisée (NFR-S8).
