# Flows — Module Élio

## Flow 1 — Personnalisation initiale

```
Client ouvre Élio pour la 1ère fois
  → Vérification : profil existant ? (getC ommunicationProfile)
  → Non : Affichage PersonalizeElioDialog
    → Client répond aux 4 questions (ou skip)
    → createCommunicationProfile() Server Action
    → Dialog fermé, Élio prêt
  → Oui : Élio prêt directement
```

## Flow 2 — Envoi d'un message avec profil injecté

```
Client envoie un message Élio
  → getCommunicationProfile() récupère le profil
  → buildElioSystemPrompt(profile, currentStep) construit le system prompt
  → Appel API Claude avec system prompt + message
  → Réponse adaptée au profil affichée
```

## Flow 3 — Suggestions guidées

```
Client est sur une étape du parcours
  → ElioGuidedSuggestions affiche les chips de l'étape en cours
  → Client clique une suggestion
  → Textarea rempli + message envoyé automatiquement
```

## Flow 5 — Envoi message multi-dashboard (Story 8.1)

```
Client envoie un message via ElioChat (hub | lab | one)
  → useElioChat.sendMessage(content)
  → Message user ajouté dans l'état local
  → ElioThinking affiché (aria-busy=true)
  → sendToElio(dashboardType, message, clientId) Server Action
    → getElioConfig() charge la config
    → buildSystemPrompt({ dashboardType, ... }) construit le prompt
    → supabase.functions.invoke('elio-chat') avec timeout 60s
    → Si succès : ElioMessage retourné → ajouté aux messages
    → Si erreur : ElioErrorMessage affiché avec onRetry
  → ElioThinking masqué (aria-busy=false)
```

## Flow 6 — Gestion des erreurs (FR83)

```
Erreur se produit pendant l'appel LLM
  → ElioThinking disparaît
  → ElioErrorMessage s'affiche (role=alert, aria-live=assertive)
    → TIMEOUT : "Élio est temporairement indisponible..."
    → NETWORK_ERROR : "Problème de connexion..."
    → LLM_ERROR : "Élio est surchargé..."
    → UNKNOWN : "Une erreur inattendue..."
  → Bouton "Réessayer" → useElioChat.retrySend()
  → Champ de saisie reste actif (client peut retenter)
```

## Flow 4 — Modification du profil

```
Client va dans Paramètres > Profil de communication
  → Formulaire avec valeurs actuelles pré-remplies
  → Client modifie les préférences
  → updateCommunicationProfile() Server Action
  → Toast confirmation
  → Cache TanStack Query invalidé
  → Prochains messages utilisent le nouveau profil
```
