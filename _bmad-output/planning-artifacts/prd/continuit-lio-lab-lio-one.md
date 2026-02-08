# Continuité Élio Lab → Élio One

## Mémoire Persistante

Lors de la graduation, Élio One hérite de TOUT ce qu'Élio Lab a collecté :

| Donnée | Source | Utilisé par One |
|--------|--------|-----------------|
| Profil communication | Orpheus + Lab | Ton adapté conservé |
| Historique échanges | Lab | Contexte complet |
| Préférences révélées | Lab | Ce qu'il aime/n'aime pas |
| Décisions MiKL | Lab | Ne contredit jamais |
| Briefs produits | Lab | Peut s'y référer |

## Format : client_profile.yaml (évolutif)

```yaml
client_id: "client_xxx"

communication:
  initial:
    date: "date"
    source: "visio_onboarding"
    ton: "pro_decontracte"

  affine:
    date_derniere_maj: "date"
    apprentissages:
      - "Préfère les listes à puces"
      - "Répond mieux le matin"
      - "Aime les analogies sport"

preferences:
  horaires_actifs: ["8h-10h", "14h-16h"]
  canal_prefere: "chat"
  aime: []
  n_aime_pas: []

business:
  secteur: "..."
  outils_actuels: []
  objectifs_exprimes: []
  contraintes: []

historique_lab:
  parcours_type: "..."
  date_graduation: "..."
  etapes_completees: []
  decisions_mikl: []
  echanges_marquants: []

config_elio_one:
  ton: "pro_decontracte"
  contexte_herite: []
  opportunites_identifiees: []
```

---
