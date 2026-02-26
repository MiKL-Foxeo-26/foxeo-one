# Guide — Module Élio

## Vue d'ensemble

Élio est l'assistant IA personnel intégré au parcours Foxeo. Il adapte ses réponses selon le profil de communication de chaque client.

## Fonctionnalités Story 6.4

### Profil de communication
Élio peut être personnalisé selon 4 dimensions :
- **Ton** : formal, casual, technique, amical
- **Longueur des réponses** : concises, détaillées, équilibrées
- **Style d'interaction** : directif, exploratif, collaboratif
- **Préférences contexte** : exemples concrets, théorie, mix

### Dialog de personnalisation initiale
Au premier usage, un dialog guide le client pour configurer son profil Élio en 4 questions rapides. Le skip est possible → valeurs par défaut appliquées.

### Suggestions guidées
Des suggestions contextuelles (chips) sont affichées selon l'étape du parcours en cours. Un clic remplit et envoie le message.

### Modification du profil
Le profil est modifiable à tout moment dans **Paramètres > Profil de communication Élio**.

## Architecture

- `types/communication-profile.types.ts` — Types TypeScript
- `actions/create-communication-profile.ts` — Server Action création
- `actions/update-communication-profile.ts` — Server Action mise à jour
- `actions/get-communication-profile.ts` — Server Action lecture
- `utils/build-system-prompt.ts` — Construction du prompt système Claude
- `components/personalize-elio-dialog.tsx` — Dialog personnalisation initiale
- `components/elio-guided-suggestions.tsx` — Chips suggestions étape
- `data/elio-suggestions.ts` — Données suggestions par étape
