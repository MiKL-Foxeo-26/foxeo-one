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

## Flow 7 — Affinement profil par Élio Lab (Story 8.4 — AC3)

```
Élio Lab en conversation avec un client
  → system prompt inclut instruction d'observation (LAB_OBSERVATION_INSTRUCTIONS)
  → Élio détecte une préférence implicite
  → Élio inclut profile_observation dans metadata du message
    (ex: "Client préfère les listes à puces")
  → Observation stockée dans elio_messages.metadata.profile_observation

MiKL consulte la fiche client (Hub)
  → Section "Observations Élio" via ElioObservations component
  → getElioObservations(clientId) charge les observations Lab
  → MiKL clique "Valider" sur une observation
  → Sélection de la cible (avoid | privilege | styleNotes)
  → integrateObservation() Server Action
  → Observation intégrée dans client_configs.elio_config.communication_profile
  → Toast confirmation + refresh
```

## Flow 8 — Transmission du profil à la graduation (Story 8.4 — AC5, FR68)

```
Graduation Lab → One déclenchée (Epic 9)
  → compileLabLearnings(clientId) Server Action appelée
    → Fetch elio_messages[dashboard_type='lab'] avec profile_observation
    → Compile les observations en string[]
    → Met à jour communication_profile.lab_learnings dans client_configs.elio_config

Résultat :
  → Le même champ client_configs.elio_config.communication_profile est lu par Élio One
  → lab_learnings disponible pour contexte additionnel (éventuellement dans le prompt)
  → Historique Lab accessible via elio_conversations[dashboard_type='lab'] (même table)
  → Aucune rupture de ton : Élio One démarre avec le profil complet du parcours Lab
  → Aucune migration DB nécessaire : elio_config JSONB est flexible
```
