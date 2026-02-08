# Workflow Évolutions Élio One

## Principe

Élio One = **collecteur intelligent**, pas décideur. Il qualifie la demande et la soumet à MiKL.

## Flow

```
CLIENT demande une évolution
            │
            ▼
ÉLIO ONE collecte (3-5 questions MAX)
• Qualifie le besoin rapidement
• Ne s'engage sur rien
            │
            ▼
VALIDATION HUB → Mini-brief à MiKL
• Demande structurée
• Contexte client (hérité)
            │
            ▼
MIKL DÉCIDE parmi 4 options :

[A] Réactiver Élio Lab
    → Besoin complexe, parcours à faire
    → Élio Lab reprend avec le client

[B] Programmer visio
    → Besoin de clarifier en live
    → MiKL envoie lien calendrier

[C] Développer direct
    → C'est clair, MiKL code
    → Puis met à jour doc Élio One

[D] Refuser / Reporter
    → Pas maintenant, noté pour plus tard
            │
            ▼
POST-DÉPLOIEMENT (si option C)
• Module déployé sur Foxeo One du client
• Documentation injectée dans Élio One
• Élio One peut assister sur le nouvel outil
```

## Mise à jour Doc Élio One

Après chaque déploiement, MiKL alimente Élio One :

```yaml
modules_actifs:
  - module_existant
  - nouveau_module  # AJOUTÉ

documentation_elio:
  nouveau_module:
    description: "Ce que fait le module"
    parametres: {}
    questions_client_possibles:
      - question: "Comment je fais X ?"
        reponse: "Tu vas dans..."
    problemes_courants:
      - probleme: "Ça ne marche pas"
        diagnostic: "Vérifier 1) ... 2) ..."
        escalade_si: "Contacter MiKL si..."
```

---
