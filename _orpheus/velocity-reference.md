# Orpheus — Velocity Reference: Foxeo One

> Premier projet de reference pour calibrer les estimations de temps Orpheus.
> Projet: SaaS B2B multi-tenant, stack Next.js 16 + Supabase + Turborepo monorepo.
> Developpeur: MiKL (operateur solo) + Claude Code (AI pair-programming).
> Periode: 8 fevrier — 18 fevrier 2026 (10 jours calendaires, ~8 jours effectifs).

## Contexte de travail

- **Mode**: Developpeur solo + Claude Code (agent AI). MiKL pilote, Claude implemente.
- **Pipeline**: Story → Dev → Tests → Code Review adversarial → Fix → Re-test → Commit → Push
- **Workflow BMAD**: Planification complete en amont (PRD, Architecture, Epics/Stories, UX Design) avant toute ligne de code.
- **Complexite projet**: SaaS B2B multi-dashboard (Hub/Lab/One), multi-tenant, RLS, Realtime, modules plug & play.

## Donnees brutes par story

| # | Story | Date commit | Delta vs precedent | Fichiers | Insertions | Suppressions | Net | Tests |
|---|-------|-------------|-------------------|----------|------------|-------------|-----|-------|
| 1 | 1.1 — Setup monorepo & dashboard shell | 10/02 12:46 | 0h45 | 86 | +3,593 | -6,678 | -3,085 | — |
| 2 | 1.2 — Migrations Supabase fondation | 10/02 15:08 | 2h22 | 18 | +1,845 | -715 | +1,130 | — |
| 3 | 1.3 — Auth client (login, signup, sessions) | 10/02 16:07 | 0h59 | 21 | +1,450 | -139 | +1,311 | — |
| 4 | 1.4 — Auth MiKL (login + 2FA, middleware) | 11/02 11:33 | 19h26* | 23 | +2,617 | -75 | +2,542 | — |
| 5 | 1.5 — RLS & isolation multi-tenant | 11/02 12:17 | 0h44 | 11 | +1,619 | -33 | +1,586 | — |
| 6 | 1.6 — Sessions avancees (multi-device) | 11/02 15:09 | 2h53 | 22 | +1,883 | -8 | +1,875 | — |
| 7 | 1.7 — Design system fondation | 11/02 16:32 | 1h22 | 20 | +1,311 | -210 | +1,101 | — |
| 8 | 1.8 — UX transversale | 11/02 17:49 | 1h17 | 64 | +1,528 | -814 | +714 | — |
| 9 | 1.9 — Consentements & legal | 12/02 12:56 | 19h07* | 26 | +2,527 | -17 | +2,510 | — |
| 10 | 1.10 + 2.1 + 2.2 — i18n + CRM liste + creation client | 13/02 12:49 | 23h53* | 108 | +10,874 | -621 | +10,253 | — |
| 11 | 2.3 — Fiche client multi-onglets | 13/02 15:57 | 3h08 | 39 | +2,803 | -262 | +2,541 | 134 |
| 12 | 2.4 — Parcours Lab, assignation, toggles | 15/02 18:09 | 50h12* | 38 | +3,462 | -92 | +3,370 | 208 |
| 13 | 2.5 — Integration Cursor | 15/02 18:26 | 0h17 | 9 | +506 | -27 | +479 | — |
| 14 | 2.6 — Notes privees, epinglage clients | 15/02 19:30 | 1h03 | 38 | +2,478 | -70 | +2,408 | 284 |
| 15 | 2.7 — Rappels, calendrier deadlines | 15/02 21:38 | 2h09 | 31 | +3,111 | -457 | +2,654 | 312 |
| 16 | 2.8 — Statistiques globales, temps passe | 15/02 23:11 | 1h33 | 36 | +2,755 | -39 | +2,716 | 389 |
| 17 | 2.9a — Suspendre & reactiver client | 16/02 15:08 | 15h57* | 30 | +1,707 | -119 | +1,588 | 1,018 |
| 18 | 2.9b — Cloturer & archiver client | 16/02 16:01 | 0h52 | 24 | +1,426 | -66 | +1,360 | 476 |
| 19 | 2.9c — Upgrade client Ponctuel → Lab/One | 17/02 11:20 | 19h19* | 26 | +1,461 | -40 | +1,421 | 1,086 |
| 20 | 2.10 — Alertes inactivite & import CSV | 17/02 14:04 | 2h44 | 27 | +2,647 | -57 | +2,590 | 562 |
| 21 | 3.1 — Chat messagerie temps reel | 17/02 15:02 | 0h58 | 53 | +3,273 | -54 | +3,219 | 1,193 |
| 22 | 3.2 — Notifications in-app temps reel | 17/02 15:40 | 0h38 | 42 | +2,118 | -124 | +1,994 | 1,246 |
| 23 | 3.3 — Notifications email Resend | 17/02 16:55 | 1h15 | 23 | +1,562 | -42 | +1,520 | 1,280 |
| 24 | **FIX** — Code review 2-4/2-5/2-6 + bug operator_id | 17/02 21:53 | 4h58 | 62 | +1,076 | -277 | +799 | 1,291 |
| 25 | 3.4 — Preferences notification | 18/02 12:22 | 14h29* | 29 | +2,374 | -45 | +2,329 | 96 |
| 26 | 3.5 — Presence en ligne Realtime | 18/02 14:19 | 1h57 | 30 | +1,107 | -60 | +1,047 | 1,376 |
| 27 | 3.6 — Conflits modification concurrente | 18/02 14:38 | 0h19 | 12 | +599 | -28 | +571 | 1,402 |
| 28 | 3.7 — Support client & aide en ligne | 18/02 15:18 | 0h40 | 39 | +2,158 | -57 | +2,101 | 1,450 |

> `*` = inclut une nuit ou un week-end — temps reel de dev significativement inferieur au delta.

## Totaux du projet

| Metrique | Valeur |
|----------|--------|
| Stories livrees | **30** (28 commits, dont 1 triple) |
| Commits de correction post-story | **1** (code review retroactif + bug systemic) |
| Fichiers totaux modifies | **987** |
| Lignes inserees | **+67,914** |
| Lignes supprimees | **-11,245** |
| Lignes nettes ajoutees | **+56,669** |
| Tests finaux | **1,450** |
| Duree calendaire | **10 jours** (8-18 fev) |
| Jours effectifs de dev | **~8 jours** |

## Classification des stories par type

### Infrastructure / Setup (fondations)
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 1.1 Setup monorepo | 0h45 | 86 | -3,085 | Haute (restructuration) |
| 1.2 Migrations Supabase | 2h22 | 18 | +1,130 | Moyenne |
| 1.5 RLS isolation | 0h44 | 11 | +1,586 | Haute (securite critique) |

### Authentification / Securite
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 1.3 Auth client | 0h59 | 21 | +1,311 | Moyenne |
| 1.4 Auth MiKL + 2FA | — (nuit) | 23 | +2,542 | Haute |
| 1.6 Sessions avancees | 2h53 | 22 | +1,875 | Haute |
| 1.9 Consentements legal | — (nuit) | 26 | +2,510 | Moyenne |

### UI / UX / Design System
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 1.7 Design system | 1h22 | 20 | +1,101 | Moyenne |
| 1.8 UX transversale | 1h17 | 64 | +714 | Moyenne (beaucoup de fichiers, peu de net) |

### CRUD / Module metier (CRM)
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 1.10+2.1+2.2 i18n+CRM | — (nuit) | 108 | +10,253 | Tres haute (3 stories) |
| 2.3 Fiche client | 3h08 | 39 | +2,541 | Moyenne-Haute |
| 2.4 Parcours Lab | — (week-end) | 38 | +3,370 | Haute |
| 2.6 Notes, epinglage | 1h03 | 38 | +2,408 | Moyenne |

### Fonctionnalites avancees (temps reel, lifecycle)
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 2.9a Suspendre client | — (nuit) | 30 | +1,588 | Haute (lifecycle) |
| 2.9b Cloturer client | 0h52 | 24 | +1,360 | Haute (lifecycle) |
| 2.9c Upgrade client | — (nuit) | 26 | +1,421 | Haute (lifecycle) |
| 3.1 Chat temps reel | 0h58 | 53 | +3,219 | Tres haute |
| 3.2 Notifications in-app | 0h38 | 42 | +1,994 | Haute |
| 3.5 Presence Realtime | 1h57 | 30 | +1,047 | Haute |
| 3.6 Conflits concurrence | 0h19 | 12 | +571 | Moyenne |

### Petites stories / Outils
| Story | Delta brut | Fichiers | Net lignes | Complexite estimee |
|-------|-----------|----------|-----------|-------------------|
| 2.5 Integration Cursor | 0h17 | 9 | +479 | Basse |
| 2.7 Rappels calendrier | 2h09 | 31 | +2,654 | Moyenne |
| 2.8 Statistiques | 1h33 | 36 | +2,716 | Moyenne |
| 3.7 Support client | 0h40 | 39 | +2,101 | Moyenne |

## Cout des corrections

| Type | Commit | Fichiers | Net lignes | Temps estime |
|------|--------|----------|-----------|-------------|
| Code review retroactif (3 stories) | d98f3cc | 62 | +799 | ~5h (4h58 delta) |

**Ratio correction / dev**: Ce commit de correction represente environ **1.2%** du code net total (+799 / +56,669), mais a touche **62 fichiers** — correction transversale d'un bug systemic (`operator_id`).

**A surveiller**: Les corrections post-story sont inevitables. Orpheus devrait prevoir un **buffer de 15-25%** sur chaque estimation pour:
- Code review fixes (HIGH/MEDIUM)
- Bugs systemiques decouverts tardivement
- Regressions de tests

## Velocite de reference — Temps machine (Claude Code)

> **IMPORTANT**: Ces temps representent le temps **machine** (Claude Code execute, MiKL supervise).
> Le temps humain reel = temps machine + temps de pilotage + pauses + decisions.

### Par taille de story (temps machine estime, hors nuits)

| Taille | Criteres | Temps machine moyen | Exemples |
|--------|----------|-------------------|----------|
| **XS** | <10 fichiers, <500 lignes net | ~20 min | Story 2.5 (Cursor), 3.6 (conflits) |
| **S** | 10-25 fichiers, 500-1,500 lignes net | ~50 min | Story 1.3, 1.5, 2.9b, 3.2, 3.3 |
| **M** | 25-40 fichiers, 1,500-2,800 lignes net | ~1h30 | Story 1.6, 2.3, 2.6, 2.7, 2.8, 3.4, 3.5, 3.7 |
| **L** | 40-70 fichiers, 2,800-4,000 lignes net | ~2h30 | Story 2.4, 3.1 |
| **XL** | 70+ fichiers, 4,000+ lignes net | ~4h+ | Stories 1.10+2.1+2.2 (triple) |

### Multiplicateurs a appliquer

| Facteur | Multiplicateur | Raison |
|---------|---------------|--------|
| Temps humain vs machine | x1.5 — x2.0 | Pilotage, decisions, reviews manuelles |
| Premiere story d'un type | x1.3 | Pas de patterns existants a suivre |
| Securite / Auth / RLS | x1.4 | Tests supplementaires, criticite |
| Temps reel / Realtime | x1.3 | Complexite infrastructure |
| Multi-tenant | x1.2 | Tests isolation |
| Corrections post-epic | +20% sur l'epic | Buffer code review + bugs |

## Formule d'estimation Orpheus (v0.1)

```
Temps_estime = Temps_base(taille) × Multiplicateur(type) × Multiplicateur(contexte) + Buffer_corrections

Ou:
- Temps_base: XS=20min, S=50min, M=1h30, L=2h30, XL=4h+
- Multiplicateur(type): Auth=1.4, Realtime=1.3, CRUD=1.0, UI=0.9, Integration=0.8
- Multiplicateur(contexte): 1er projet=1.3, patterns existants=1.0, refacto=1.2
- Buffer_corrections: +20% par epic pour corrections post-delivery
```

### Exemple d'application

> **Story**: "Ajouter un module de facturation avec paiement Stripe"
> - Taille estimee: L (40+ fichiers, ~3,000 lignes)
> - Type: Integration externe (x1.0) + CRUD (x1.0)
> - Contexte: Nouveau module mais patterns existants (x1.0)
> - Temps_base: 2h30 machine
> - Temps humain: 2h30 × 1.75 = ~4h20
> - Avec buffer corrections: 4h20 + 20% = ~5h15

## Notes pour calibration future

1. **Ce referentiel est un point de depart**. Il sera affine au fil des projets.
2. **Les temps delta qui incluent des nuits ne sont PAS des temps de dev**. Utiliser uniquement les deltas courts (meme journee) comme reference fiable.
3. **La velocite augmente au fil du projet** : les premieres stories sont plus lentes (setup, patterns a etablir), les stories suivantes beneficient des patterns existants.
4. **L'effet Claude Code est significatif** : un dev solo humain sans AI pair-programming serait probablement 3-5x plus lent sur ces memes stories.
5. **Les stories groupees** (1.10+2.1+2.2) faussent les metriques individuelles — eviter a l'avenir.
6. **Le nombre de tests n'est pas toujours croissant** dans les commit messages — certains runs etaient partiels.

## Prochaines etapes

- [ ] Ajouter les donnees des epics 4-12 au fur et a mesure
- [ ] Tracker separement le temps de correction par story (pas seulement par epic)
- [ ] Comparer avec d'autres projets pour calibrer les multiplicateurs
- [ ] Integrer Orpheus dans le workflow BMAD pour estimation automatique a la creation de story
