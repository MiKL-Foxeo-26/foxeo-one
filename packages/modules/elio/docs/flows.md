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
