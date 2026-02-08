# Stack LLM & Coûts IA

## Choix Technologique

| Agent | Modèle | Justification | Coût |
|-------|--------|---------------|------|
| **Orpheus** | Claude (via BMAD) | Abonnement Max existant, analyses complexes | 0€ |
| **Élio Hub** | DeepSeek V3.2 | Rapport qualité/prix optimal | ~1€/mois |
| **Élio Lab** | DeepSeek V3.2 | Excellent pour le conversationnel | ~0.40€/parcours |
| **Élio One** | DeepSeek V3.2 | Function calling natif, très économique | 0.15-0.50€/mois |

## Pricing DeepSeek V3.2 (Janvier 2026)

| Type | Prix pour 1M tokens |
|------|---------------------|
| Input | $0.28 |
| Output | $0.42 |
| Input (cache hit) | $0.028 |

## Estimation Coûts Mensuels

### Scénario MVP (1 client One actif)

| Agent | Usage | Coût/mois |
|-------|-------|-----------|
| Orpheus | Via abonnement | 0€ |
| Élio Hub | Usage MiKL | ~1€ |
| Élio Lab | 2 parcours | ~0.80€ |
| Élio One | 1 client | ~0.50€ |
| **TOTAL** | | **~2.30€** |

### Scénario Growth (10 clients One actifs)

| Agent | Usage | Coût/mois |
|-------|-------|-----------|
| Orpheus | Via abonnement | 0€ |
| Élio Hub | Usage MiKL | ~1€ |
| Élio Lab | 5 parcours | ~2€ |
| Élio One | 10 clients | ~5€ |
| **TOTAL** | | **~8€** |

### Scénario Scale (50 clients One actifs)

| Agent | Usage | Coût/mois |
|-------|-------|-----------|
| Orpheus | Via abonnement | 0€ |
| Élio Hub | Usage MiKL | ~1€ |
| Élio Lab | 10 parcours | ~4€ |
| Élio One | 50 clients | ~25€ |
| **TOTAL** | | **~30€** |

## Grille Tarifaire Révisée

| Offre | Cible | Prix/mois | Élio | Coût IA | Marge IA |
|-------|-------|-----------|------|---------|----------|
| **Ponctuel** | Projet unique | TJM | ❌ | 0€ | — |
| **Lab** | Client en création | 199€ (forfait) | Élio Lab | ~0.40€/parcours | — |
| **Essentiel** | TPE, Asso | 49€ | Élio One | ~0.15€ | 99.7% |
| **Agentique** | PME | 99€ | Élio One+ | ~0.50€ | 99.5% |

---
