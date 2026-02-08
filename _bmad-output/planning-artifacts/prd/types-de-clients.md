# Types de Clients

## Classification des Clients

Tous les clients ne passent pas par le parcours complet. Foxeo Hub gère 3 types de clients :

| Type | Parcours | Ce qu'il a | Cas d'usage |
|------|----------|------------|-------------|
| **Complet** | Hub → Lab → One | Tout l'écosystème (Élio Lab + Élio One + Dashboard personnalisé) | Création de business, accompagnement long |
| **Direct One** | Hub → One | Dashboard sans maturation Lab | Client qui sait ce qu'il veut, besoin clair |
| **Ponctuel** | Hub uniquement | Fiche client + échanges + factures | Mission ponctuelle, petit contrat |

## Client Ponctuel (CRM Only)

Le client ponctuel n'a pas d'Élio, pas de dashboard dédié. Juste :
- Fiche contact dans le Hub
- Historique des échanges
- Documents partagés
- Facturation

**Opportunité de conversion** : Un client ponctuel qui revient plusieurs fois peut "graduer" vers un abonnement One.

## Indicateurs Visuels dans le Hub

| Type | Indicateur |
|------|------------|
| Complet (Lab+One actifs) | 🟢 |
| Direct One (One actif) | 🟡 |
| Ponctuel (CRM only) | ⚪ |

## Modèle de Données Client

```yaml
client:
  id: "client_xxx"
  type: "complet" | "direct_one" | "ponctuel"
  has_lab: boolean
  has_one: boolean
  modules_actifs: []
```

---
