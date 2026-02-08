---
stepsCompleted: [1, 2, "3-epic1", "3-epic2", "3-epic3", "3-epic4", "3-epic5", "3-epic6", "3-epic7", "3-epic8", "3-epic9", "3-epic10", "3-epic11", "3-epic12"]
currentStep: 3
currentEpic: "COMPLETE"
nextAction: "Toutes les stories sont creees — passer a l'etape 4 (validation finale) via menu [C] Continue"
lastSession: "2026-02-08"
note: "Epic 1 (10), Epic 2 (12), Epic 3 (7), Epic 4 (7), Epic 5 (6), Epic 6 (6), Epic 7 (6), Epic 8 (11), Epic 9 (5), Epic 10 (4), Epic 11 (5), Epic 12 (6) — TOUS TERMINES. 85 stories au total couvrant 170 FRs (161 in-scope, 9 Orpheus hors périmètre). Pret pour step-04-final-validation.md."
inputDocuments:
  - "_bmad-output/planning-artifacts/prd/index.md"
  - "_bmad-output/planning-artifacts/prd/functional-requirements-foxeo-plateforme.md"
  - "_bmad-output/planning-artifacts/prd/non-functional-requirements.md"
  - "_bmad-output/planning-artifacts/prd/product-scope.md"
  - "_bmad-output/planning-artifacts/prd/project-scoping-phased-development.md"
  - "_bmad-output/planning-artifacts/prd/domain-specific-requirements.md"
  - "_bmad-output/planning-artifacts/prd/saas-b2b-specific-requirements.md"
  - "_bmad-output/planning-artifacts/prd/executive-summary.md"
  - "_bmad-output/planning-artifacts/prd/cas-client-rfrence-association.md"
  - "_bmad-output/planning-artifacts/prd/systme-de-parcours-flexibles.md"
  - "_bmad-output/planning-artifacts/prd/architecture-agents-interconnects.md"
  - "_bmad-output/planning-artifacts/prd/continuit-lio-lab-lio-one.md"
  - "_bmad-output/planning-artifacts/prd/workflow-volutions-lio-one.md"
  - "_bmad-output/planning-artifacts/prd/infrastructure-architecture-donnes.md"
  - "_bmad-output/planning-artifacts/prd/architecture-flux-onboarding-client.md"
  - "_bmad-output/planning-artifacts/prd/user-journeys.md"
  - "_bmad-output/planning-artifacts/prd/architecture-agents-ia-rvise.md"
  - "_bmad-output/planning-artifacts/prd/stack-llm-cots-ia.md"
  - "_bmad-output/planning-artifacts/prd/architecture-documentaire.md"
  - "_bmad-output/planning-artifacts/prd/types-de-clients.md"
  - "_bmad-output/planning-artifacts/prd/innovation-differentiation.md"
  - "_bmad-output/planning-artifacts/architecture/index.md"
  - "_bmad-output/planning-artifacts/architecture/01-project-context-analysis.md"
  - "_bmad-output/planning-artifacts/architecture/02-platform-architecture.md"
  - "_bmad-output/planning-artifacts/architecture/03-core-decisions.md"
  - "_bmad-output/planning-artifacts/architecture/04-implementation-patterns.md"
  - "_bmad-output/planning-artifacts/architecture/05-project-structure.md"
  - "_bmad-output/planning-artifacts/architecture/06-validation-results.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
  - "_bmad-output/planning-artifacts/foxeo-modules-commerciaux.md"
---

# foxeo-dash - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for foxeo-dash, decomposing the requirements from the PRD, UX Design, Architecture, and Modules Commerciaux into implementable stories.

## Requirements Inventory

### Functional Requirements

**Total : 170 FRs** couvrant l'ensemble de l'ecosysteme Foxeo (Hub, Lab, One).
> Mis a jour 08/02/2026 : FR153-168 (propriete client, instance dediee, documentation livrable, surveillance usage).
> Mis a jour 08/02/2026 : FR169-170 (facturation forfait Lab 199€, deduction setup One).

#### Hub — Gestion Clients
| ID | Functional Requirement |
|----|------------------------|
| FR1 | MiKL peut creer une fiche client (nom, entreprise, contact, secteur) |
| FR2 | MiKL peut definir le type de client (Complet, Direct One, Ponctuel) |
| FR3 | MiKL peut voir la liste de tous ses clients avec leur statut (Lab actif, One actif, Ponctuel) |
| FR4 | MiKL peut consulter la fiche complete d'un client (infos, historique, documents, echanges) |
| FR5 | MiKL peut assigner un parcours Lab a un client (type + etapes actives) |
| FR6 | MiKL peut activer/desactiver l'acces Lab ou One d'un client |
| FR7 | MiKL peut ouvrir le dossier BMAD d'un client dans Cursor |

#### Hub — Validation Hub
| ID | Functional Requirement |
|----|------------------------|
| FR8 | MiKL peut voir les demandes en attente de validation (briefs Lab, evolutions One) |
| FR9 | MiKL peut consulter le contexte complet d'une demande (besoin, historique client, priorite) |
| FR10 | MiKL peut valider une demande (brief, livrable) |
| FR11 | MiKL peut refuser une demande avec commentaire |
| FR12 | MiKL peut demander des precisions sur une demande |
| FR13 | MiKL peut choisir une action de traitement (Reactiver Lab, Programmer Visio, Dev direct, Reporter) |
| FR14 | Le client est notifie automatiquement du traitement de sa demande |

#### Orpheus — Cerveau Foxeo (Cursor/BMAD) — HORS PERIMETRE APPLICATIF
| ID | Functional Requirement |
|----|------------------------|
| FR15 | Orpheus (dans Cursor) peut analyser une transcription de visio client |
| FR16 | Orpheus peut generer un Brief Initial structure a partir d'une transcription |
| FR17 | Orpheus peut detecter le profil de communication d'un client |
| FR18 | Orpheus peut recommander un type de parcours Lab |
| FR19 | Orpheus peut generer une config Elio (client_config.yaml) |
| FR20 | Orpheus accumule les apprentissages metier Foxeo (pricing, patterns, durees) |
| FR20b | Orpheus peut generer des estimations prix |
| FR20c | Orpheus peut generer des docs techniques |
| FR20d | Orpheus peut retravailler docs brainstorming Lab |

#### Hub — Elio Hub (Assistant MiKL)
| ID | Functional Requirement |
|----|------------------------|
| FR21 | MiKL peut interagir avec Elio Hub dans le dashboard |
| FR22 | Elio Hub peut aider MiKL sur les fonctionnalites du Hub |
| FR23 | Elio Hub peut rechercher des informations clients |
| FR24 | Elio Hub peut corriger et adapter la redaction de MiKL au profil client |
| FR25 | Elio Hub peut generer des brouillons de reponses (emails, messages Validation Hub) |

#### Lab — Parcours Creation
| ID | Functional Requirement |
|----|------------------------|
| FR26 | Le client Lab peut voir son parcours assigne (etapes actives) |
| FR27 | Le client Lab peut voir sa progression dans le parcours |
| FR28 | Le client Lab peut consulter les briefs produits a chaque etape |
| FR29 | Le client Lab peut soumettre un brief pour validation MiKL |
| FR30 | Le client Lab est notifie quand un brief est valide/refuse |
| FR31 | Le client Lab peut voir un teasing de Foxeo One (motivation graduation) |

#### Lab — Elio Lab (Agent Accompagnement)
| ID | Functional Requirement |
|----|------------------------|
| FR32 | Le client Lab peut converser avec Elio Lab |
| FR33 | Elio Lab pose les questions guidees selon l'etape active |
| FR34 | Elio Lab genere les briefs a partir des reponses client |
| FR35 | Elio Lab adapte son ton selon le profil de communication du client |
| FR36 | Elio Lab soumet automatiquement les briefs au Validation Hub |
| FR37 | Elio Lab recoit et applique la config generee par Orpheus |

#### One — Structure Dashboard
| ID | Functional Requirement |
|----|------------------------|
| FR38 | Le client One peut acceder a son dashboard personnalise |
| FR39 | Le client One peut voir les modules actives pour lui |
| FR40 | Le client One peut consulter ses documents (briefs herites du Lab, livrables) |
| FR41 | Le client One peut voir un teasing du Lab (si nouveau projet) |
| FR42 | MiKL peut configurer les modules actifs pour chaque client One |
| FR43 | MiKL peut injecter de la documentation dans Elio One apres un deploiement |

#### One — Elio One (Agent Client)
| ID | Functional Requirement |
|----|------------------------|
| FR44 | Le client One peut converser avec Elio One |
| FR45 | Elio One peut repondre aux questions sur les fonctionnalites |
| FR46 | Elio One peut guider le client dans son dashboard |
| FR47 | Elio One peut collecter une demande d'evolution et la soumettre |
| FR48 | Elio One+ peut executer des actions sur les modules actifs |
| FR49 | Elio One+ peut generer des documents |
| FR50 | Elio One+ peut alerter proactivement le client |
| FR51 | Elio One herite du contexte Lab (profil comm, briefs, historique) |

#### Commun — Authentification & Securite
| ID | Functional Requirement |
|----|------------------------|
| FR52 | Les clients peuvent se connecter avec email + mot de passe |
| FR53 | MiKL peut se connecter avec email + mot de passe + 2FA |
| FR54 | Le systeme gere les sessions (access token, refresh, inactivite) |
| FR55 | Chaque client ne peut acceder qu'a ses propres donnees (RLS) |
| FR56 | Les actions sensibles requierent une confirmation |

#### Commun — Communication
| ID | Functional Requirement |
|----|------------------------|
| FR57 | Le client peut echanger avec MiKL via chat asynchrone |
| FR58 | Le client peut consulter l'historique de ses visios avec MiKL |
| FR59 | Le client peut consulter les transcriptions de ses visios |
| FR60 | Le client peut demander une visio avec MiKL |
| FR61 | Le systeme envoie des notifications (validation, messages, alertes) |

#### Commun — Documents
| ID | Functional Requirement |
|----|------------------------|
| FR62 | Le client peut consulter ses documents dans le dashboard (rendu HTML) |
| FR63 | Le client peut telecharger ses documents en PDF |
| FR64 | MiKL peut partager un document avec un client (visible/non visible) |
| FR65 | Les documents valides sont copies dans le dossier BMAD local |

#### Commun — Profil Communication
| ID | Functional Requirement |
|----|------------------------|
| FR66 | Le systeme stocke le profil de communication de chaque client |
| FR67 | Le profil est detecte par Orpheus et affine par Elio Lab |
| FR68 | Le profil est transmis a Elio One lors de la graduation |
| FR69 | Les agents adaptent leur ton selon le profil (tutoiement, longueur, style) |

#### Onboarding & Parcours
| ID | Functional Requirement |
|----|------------------------|
| FR70 | Le nouveau client Lab voit un ecran de bienvenue a sa premiere connexion |
| FR71 | Le client Lab peut acceder a un tutoriel de prise en main |
| FR72 | Le client One voit un ecran de graduation avec recapitulatif de son parcours Lab |
| FR73 | Le systeme affiche des etats vides explicatifs (pas de document, pas de message) |

#### Graduation Lab → One
| ID | Functional Requirement |
|----|------------------------|
| FR74 | MiKL peut declencher la graduation d'un client Lab vers One |
| FR75 | Le systeme migre automatiquement le contexte Lab vers One (profil, briefs, historique) |
| FR76 | Le client recoit une notification de graduation avec acces a son nouveau dashboard |

#### Gestion MiKL Avancee
| ID | Functional Requirement |
|----|------------------------|
| FR77 | MiKL peut creer et envoyer un devis a un client |
| FR78 | MiKL peut suivre le statut d'un devis (envoye, accepte, refuse) |
| FR79 | MiKL peut ajouter des notes privees sur un client (non visibles par le client) |
| FR80 | MiKL peut voir des statistiques globales (clients actifs, taux graduation, revenus) |
| FR81 | MiKL peut voir le temps passe estime par client |

#### Gestion des Erreurs & Edge Cases
| ID | Functional Requirement |
|----|------------------------|
| FR82 | Le systeme affiche un message explicite en cas d'erreur (pas d'ecran blanc) |
| FR83 | Le systeme gere gracieusement les timeouts API Elio |
| FR84 | Le systeme alerte MiKL si un client Lab est inactif depuis X jours |
| FR85 | Le systeme archive (pas supprime) les donnees d'un client desactive |

#### Synchronisation & Technique
| ID | Functional Requirement |
|----|------------------------|
| FR86 | Le systeme synchronise les documents valides vers le dossier BMAD local |
| FR87 | Le systeme garde un historique des configs Elio par client |

#### Parcours Alternatifs & Cycle de Vie
| ID | Functional Requirement |
|----|------------------------|
| FR88 | Le client Lab peut demander a abandonner son parcours |
| FR89 | MiKL peut suspendre ou cloturer un client (avec archivage donnees) |
| FR90 | MiKL peut upgrader un client ponctuel vers Lab ou One |
| FR91 | MiKL peut changer le tier d'abonnement d'un client One |
| FR92 | Le client peut demander l'export de toutes ses donnees (RGPD) |
| FR93 | Le systeme conserve les donnees d'un client resilie pendant une periode definie avant suppression |

#### Facturation & Abonnements
| ID | Functional Requirement |
|----|------------------------|
| FR94 | Le systeme gere les abonnements recurrents via Stripe |
| FR95 | Le systeme notifie MiKL et le client en cas d'echec de paiement recurrent |
| FR96 | Le client peut consulter son historique de facturation |
| FR97 | MiKL peut generer un avoir pour un client |
| FR98 | Le client peut mettre a jour ses informations de paiement |

#### Notifications & Preferences
| ID | Functional Requirement |
|----|------------------------|
| FR99 | Le systeme envoie des notifications par email ET in-app |
| FR100 | Le client peut configurer ses preferences de notification |
| FR101 | MiKL peut configurer les notifications pour un client specifique |

#### Administration & Monitoring
| ID | Functional Requirement |
|----|------------------------|
| FR102 | MiKL peut consulter les logs d'activite par client |
| FR103 | MiKL peut activer un mode maintenance avec message aux clients |
| FR104 | MiKL peut declencher un export complet des donnees d'un client |
| FR105 | Le systeme effectue des backups automatiques avec possibilite de restauration |

#### Recherche & Navigation
| ID | Functional Requirement |
|----|------------------------|
| FR106 | MiKL peut rechercher rapidement parmi tous ses clients |
| FR107 | Le client peut rechercher dans ses documents |
| FR108 | Le systeme affiche un fil d'ariane indiquant la position dans l'interface |

#### Support & Feedback
| ID | Functional Requirement |
|----|------------------------|
| FR109 | Le client peut signaler un probleme ou bug depuis l'interface |
| FR110 | MiKL peut consulter les problemes signales par les clients |
| FR111 | Le client peut acceder a une aide en ligne / FAQ dans l'app |

#### Multi-Device & Sessions
| ID | Functional Requirement |
|----|------------------------|
| FR112 | Le systeme supporte les connexions simultanees sur plusieurs appareils |
| FR113 | MiKL peut forcer la deconnexion de toutes les sessions d'un client |
| FR114 | Le client peut voir ses sessions actives et en revoquer |

#### Preparation Integrations (Structure P2)
| ID | Functional Requirement |
|----|------------------------|
| FR115 | Le systeme prevoit une structure pour webhooks sortants (P2) |
| FR116 | Le systeme prevoit une structure pour API client (P2) |

#### Accessibilite & Responsive
| ID | Functional Requirement |
|----|------------------------|
| FR117 | Les dashboards sont utilisables sur mobile et tablette (responsive) |
| FR118 | Les dashboards respectent les standards d'accessibilite de base (contraste, navigation clavier) |
| FR119 | Le systeme prevoit une structure multi-langue (P3) |

#### Analytics & Metriques
| ID | Functional Requirement |
|----|------------------------|
| FR120 | Le systeme collecte des metriques d'usage anonymisees |
| FR121 | MiKL peut consulter des statistiques d'utilisation par fonctionnalite |

#### Experience Elio Detaillee
| ID | Functional Requirement |
|----|------------------------|
| FR122 | Le systeme affiche un indicateur visuel quand Elio reflechit |
| FR123 | L'historique des conversations Elio est persistant entre sessions |
| FR124 | Le client peut demarrer une nouvelle conversation Elio (sans perdre l'historique) |
| FR125 | Elio peut envoyer des documents generes directement dans le chat |
| FR126 | Le client peut donner un feedback sur une reponse Elio (utile/pas utile) |

#### Temps Reel & Synchronisation
| ID | Functional Requirement |
|----|------------------------|
| FR127 | Les notifications apparaissent en temps reel (sans rechargement) |
| FR128 | Le systeme gere les conflits de modification concurrente |
| FR129 | Le systeme indique si le client/MiKL est actuellement en ligne |

#### Workflow MiKL Quotidien
| ID | Functional Requirement |
|----|------------------------|
| FR130 | MiKL peut marquer un element comme "a traiter plus tard" |
| FR131 | MiKL peut epingler des clients prioritaires |
| FR132 | MiKL peut creer des rappels personnels (tache + date) |
| FR133 | MiKL peut voir un calendrier de ses rappels et deadlines |

#### Feedback & UX
| ID | Functional Requirement |
|----|------------------------|
| FR134 | Le systeme affiche des messages de confirmation apres chaque action |
| FR135 | Les formulaires longs sauvegardent automatiquement en brouillon |
| FR136 | Le client peut annuler certaines actions recentes (undo) |

#### Templates & Personnalisation
| ID | Functional Requirement |
|----|------------------------|
| FR137 | MiKL peut creer des templates de parcours Lab reutilisables |
| FR138 | MiKL peut personnaliser les templates d'emails automatiques |
| FR139 | MiKL peut personnaliser le branding du dashboard One (logo, couleurs) |

#### Legal & Consentements
| ID | Functional Requirement |
|----|------------------------|
| FR140 | Le client doit accepter les CGU lors de son inscription |
| FR141 | Le systeme notifie les clients des mises a jour de CGU |
| FR142 | Le systeme demande un consentement explicite pour le traitement IA |
| FR143 | Le systeme conserve une trace horodatee des consentements |

#### Gestion des Fichiers
| ID | Functional Requirement |
|----|------------------------|
| FR144 | Le systeme limite la taille des fichiers uploades |
| FR145 | Le systeme valide le type des fichiers uploades |
| FR146 | Le client peut organiser ses documents en dossiers |

#### Etat Systeme & Monitoring
| ID | Functional Requirement |
|----|------------------------|
| FR147 | MiKL peut voir un indicateur de sante du systeme |
| FR148 | Le systeme alerte MiKL en cas de dysfonctionnement |

#### Import/Export Avance
| ID | Functional Requirement |
|----|------------------------|
| FR149 | MiKL peut importer des clients en masse (CSV) |
| FR150 | Les exports sont disponibles en formats standards (CSV, JSON, PDF) |

#### Robustesse Technique
| ID | Functional Requirement |
|----|------------------------|
| FR151 | Le systeme affiche un message explicite si le navigateur n'est pas supporte |
| FR152 | Le systeme gere gracieusement les connexions instables (retry, messages) |

### NonFunctional Requirements

**Total : 39 NFRs** definissant les criteres de qualite du systeme.

#### Performance
| ID | NFR |
|----|-----|
| NFR-P1 | Les pages du dashboard se chargent en moins de 2 secondes (First Contentful Paint) |
| NFR-P2 | Les actions utilisateur (clic, soumission) repondent en moins de 500ms |
| NFR-P3 | Elio repond (premier token) en moins de 3 secondes |
| NFR-P4 | La recherche retourne des resultats en moins de 1 seconde |
| NFR-P5 | Les notifications temps reel apparaissent en moins de 2 secondes apres l'evenement |
| NFR-P6 | L'export PDF d'un document se genere en moins de 5 secondes |

#### Securite
| ID | NFR |
|----|-----|
| NFR-S1 | Toutes les communications utilisent HTTPS/TLS 1.3 |
| NFR-S2 | Les donnees sensibles sont chiffrees au repos (AES-256) |
| NFR-S3 | Les mots de passe sont haches avec Argon2 |
| NFR-S4 | Les sessions expirent apres 8h d'inactivite |
| NFR-S5 | Le systeme bloque apres 5 tentatives de login echouees (5 min) |
| NFR-S6 | Les tokens API ne sont affiches qu'une seule fois a la creation |
| NFR-S7 | Les donnees d'un client sont isolees des autres (RLS Supabase) |
| NFR-S8 | Les cles API LLM ne transitent jamais cote client |
| NFR-S9 | Le systeme est conforme RGPD (export, suppression, consentement) |

#### Scalabilite
| ID | NFR |
|----|-----|
| NFR-SC1 | Le systeme supporte 50 clients simultanes sans degradation |
| NFR-SC2 | Le systeme supporte 100 requetes Elio/heure par client |
| NFR-SC3 | Le stockage supporte 1 Go/client minimum |
| NFR-SC4 | L'architecture permet une migration vers VPS dedie sans refonte |

#### Accessibilite
| ID | NFR |
|----|-----|
| NFR-A1 | Les dashboards sont utilisables sur ecrans >=320px (mobile) |
| NFR-A2 | Le contraste texte/fond respecte WCAG AA (ratio 4.5:1) |
| NFR-A3 | La navigation au clavier est fonctionnelle sur toutes les pages |
| NFR-A4 | Les elements interactifs ont des labels accessibles |

#### Integrations
| ID | NFR |
|----|-----|
| NFR-I1 | Les appels Stripe timeout apres 30 secondes avec retry |
| NFR-I2 | Les appels DeepSeek timeout apres 60 secondes avec message gracieux |
| NFR-I3 | Les webhooks Stripe sont traites en moins de 5 secondes |
| NFR-I4 | Les emails transactionnels sont envoyes en moins de 10 secondes |
| NFR-I5 | Le systeme gere les indisponibilites des services tiers avec messages explicites |

#### Fiabilite & Disponibilite
| ID | NFR |
|----|-----|
| NFR-R1 | Le systeme vise une disponibilite de 99.5% (hors maintenance planifiee) |
| NFR-R2 | Les backups sont effectues quotidiennement avec retention 30 jours |
| NFR-R3 | Le RPO (perte de donnees max) est de 24h |
| NFR-R4 | Le RTO (temps de restauration) est de 4h |
| NFR-R5 | Les erreurs sont loguees avec contexte pour diagnostic |
| NFR-R6 | Le systeme reste fonctionnel si un service externe est down (mode degrade) |

#### Maintenabilite & Qualite Code
| ID | NFR |
|----|-----|
| NFR-M1 | Chaque FR est couverte par des tests unitaires (couverture >80%) |
| NFR-M2 | Le code passe un linting sans erreur avant commit |
| NFR-M3 | Chaque deploiement inclut une phase de nettoyage/refactoring |
| NFR-M4 | Les dependances sont mises a jour mensuellement (securite) |
| NFR-M5 | Le code suit les conventions du projet (documentees) |

### Additional Requirements

#### Architecture — Fondation existante et decisions structurantes

- **Starter Template** : Monorepo Turborepo existant avec Next.js 16.1, React 19, Tailwind CSS 4, TypeScript, Vitest. Packages existants : @foxeo/ui, @foxeo/utils, @foxeo/tsconfig. A ajouter : @supabase/supabase-js ^2.95.x, @supabase/ssr, @tanstack/react-query ^5.90.x, zustand ^5.0.x, react-hook-form ^7.71.x
- **2 applications Next.js** : apps/hub/ (Foxeo-Hub, operateur MiKL) + apps/client/ (dashboard unifie Lab+One). Deploiement independant : hub.foxeo.io / app.foxeo.io
- **15 modules plug & play** avec contrat ModuleManifest strict (id, name, version, navigation, routes, apiRoutes, requiredTables, targets, dependencies). Modules : core-dashboard, chat, elio, documents, visio, crm, notifications, facturation, parcours-lab, validation-hub, agenda, analytics, admin, historique-lab, templates
- **Multi-tenancy natif** : table operators (MiKL = operator_id: 1), RLS par operator_id + client_id, prepare pour commercialisation du Hub
- **Configuration-driven** via table client_config (active_modules, dashboard_type, theme_variant, custom_branding, elio_config, parcours_config)
- **Auth triple couche** : RLS (donnees Supabase) + Middleware Next.js (routes) + UI (composants). Middleware hub verifie admin+2FA, middleware client verifie client_id+config
- **3 patterns data fetching stricts** : Server Components RSC (lecture), Server Actions (mutation), API Routes (webhooks externes uniquement). Aucun cas gris autorise
- **Pattern reponse unique** : { data, error } partout (style Supabase), jamais de throw dans Server Actions
- **TanStack Query** = source de verite donnees serveur. Zustand = etat UI uniquement. Realtime invalide le cache TanStack Query
- **Deploiement** : Vercel auto-deploy (frontend) + VPS Docker Compose (OpenVidu, Invoice Ninja, Cal.com). 3 environnements : dev local, preview Vercel, production
- **15 migrations Supabase** planifiees : operators, clients, client_configs, module_manifests, messages, documents, notifications, meetings, parcours, validation_requests, elio_conversations, activity_logs, consents, rls_policies, rls_functions
- **5 quality gates CI** bloquants : tests RLS isolation, contract tests modules, lint + TypeScript strict, tests unitaires >80%, build successful
- **Tests co-localises** : *.test.ts a cote du fichier source, pas de dossier __tests__ separe
- **Skeleton loaders obligatoires** par module (loading.tsx), jamais de spinners
- **Conventions nommage** : DB=snake_case, API/JSON=camelCase, fichiers=kebab-case, composants=PascalCase
- **Transformation snake_case<->camelCase** a la frontiere DB/API via helper @foxeo/utils
- **Services self-hosted des le MVP** : OpenVidu (visio+enregistrement+transcription), Invoice Ninja (facturation PDP), Cal.com (prise de RDV)
- **Monitoring** : Vercel Analytics + Supabase Dashboard + Sentry
- **Premiere priorite implementation** : 1) Setup monorepo (packages/supabase, packages/types, turbo tasks) 2) Migrations Supabase 3) Module core-dashboard + shell 4) Auth flow 5) Premier module metier

#### UX Design — Specifications visuelles et interaction

- **Style "Minimal Futuriste"** : Dark mode pour les 3 dashboards, fond noir profond (#020402)
- **3 palettes couleurs distinctes** : Hub (Cyan/Turquoise), Lab (Violet/Purple), One (Orange vif + Bleu-gris) sur base noir profond commune
- **Desktop first + Responsive** des V1, app native mobile V2/V3
- **Composants** : shadcn/ui + Radix UI + Tremor (300+ blocks dashboard)
- **Typographie** : Poppins (titres/UI) + Inter (corps)
- **Format couleurs** : OKLCH (Tailwind CSS v4 ready)
- **Densite adaptee** : Hub=compact (data-dense), Lab=spacious (emotionnel), One=comfortable (operationnel)
- **2 chats distincts** : Chat Elio (IA, prive client, MiKL n'y a PAS acces) + Chat MiKL (direct humain, MiKL y a acces complet)
- **Systeme d'escalade** : Elio propose l'escalade vers MiKL quand il ne sait pas repondre
- **Flux onboarding prospect** : Points d'entree (QR, LinkedIn, Site, Mobile) -> Cal.com -> Salle d'attente (formulaire + API INSEE SIRET) -> OpenVidu (enregistre) -> Hub MiKL (choix statut Chaud/Tiede/Froid/Non)
- **Statuts post-visio** avec comportements differencies : email adapte, relance auto ou non, statut CRM
- **Graduation Lab -> One** : animation de passage, message d'accueil, pas de changement de couleur brutal
- **Zero friction actions recurrentes** : Valider, repondre, avancer = 1-2 clics max
- **Progression visible partout** : barres de progression, celebrations
- **Elio omnipresent mais discret** : disponible sans etre intrusif
- **Etats vides explicatifs** : messages engageants quand pas de contenu

#### Modules Commerciaux — Options et tarification

- **7 modules commerciaux** disponibles pour clients One : Signature electronique (Yousign API), Calendrier synchronise (Google/Microsoft/Apple APIs), Branding (interne), Site Web (interne), SEO (Google Search Console + option SEMrush/Ahrefs), Reseaux Sociaux (APIs natives Meta/LinkedIn), Maintenance (interne)
- **Activation automatique** des modules selon prestation commandee (branding -> module Branding, site -> module Site Web, etc.)
- **Grille tarifaire ONE** : abonnement de base (dashboard, chat Elio, suivi projet, documents, 5 signatures/mois, sync calendrier) + options additionnelles (signatures illimitees +15EUR/mois, SEO avance +25EUR/mois, reseaux sociaux autonome +20EUR/mois, support prioritaire +30EUR/mois)
- **Interface ClientModules** TypeScript definissant la configuration par module (enabled, plan, usage, connectedCalendars, etc.)

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Creer fiche client |
| FR2 | Epic 2 | Definir type client |
| FR3 | Epic 2 | Liste clients avec statut |
| FR4 | Epic 2 | Fiche complete client |
| FR5 | Epic 2 | Assigner parcours Lab |
| FR6 | Epic 2 | Activer/desactiver acces |
| FR7 | Epic 2 | Ouvrir dossier BMAD Cursor |
| FR8 | Epic 7 | Voir demandes en attente |
| FR9 | Epic 7 | Contexte complet demande |
| FR10 | Epic 7 | Valider demande |
| FR11 | Epic 7 | Refuser avec commentaire |
| FR12 | Epic 7 | Demander precisions |
| FR13 | Epic 7 | Choisir action traitement |
| FR14 | Epic 7 | Notification auto client |
| FR15 | HP | Orpheus - analyser transcription (hors perimetre) |
| FR16 | HP | Orpheus - generer brief (hors perimetre) |
| FR17 | HP | Orpheus - detecter profil comm (hors perimetre) |
| FR18 | HP | Orpheus - recommander parcours (hors perimetre) |
| FR19 | HP | Orpheus - generer config Elio (hors perimetre) |
| FR20 | HP | Orpheus - apprentissages metier (hors perimetre) |
| FR20b | HP | Orpheus - estimations prix (hors perimetre) |
| FR20c | HP | Orpheus - docs techniques (hors perimetre) |
| FR20d | HP | Orpheus - retravailler docs (hors perimetre) |
| FR21 | Epic 8 | Interagir avec Elio Hub |
| FR22 | Epic 8 | Elio Hub aide fonctionnalites |
| FR23 | Epic 8 | Elio Hub recherche clients |
| FR24 | Epic 8 | Elio Hub adapter redaction |
| FR25 | Epic 8 | Elio Hub brouillons reponses |
| FR26 | Epic 6 | Client Lab voir parcours |
| FR27 | Epic 6 | Client Lab progression |
| FR28 | Epic 6 | Client Lab consulter briefs |
| FR29 | Epic 6 | Client Lab soumettre brief |
| FR30 | Epic 6 | Client Lab notifie validation |
| FR31 | Epic 6 | Client Lab teasing One |
| FR32 | Epic 6 | Converser Elio Lab |
| FR33 | Epic 6 | Elio Lab questions guidees |
| FR34 | Epic 6 | Elio Lab generer briefs |
| FR35 | Epic 6 | Elio Lab adapter ton |
| FR36 | Epic 6 | Elio Lab soumettre auto |
| FR37 | Epic 6 | Elio Lab appliquer config |
| FR38 | Epic 10 | Client One dashboard personnalise |
| FR39 | Epic 10 | Client One modules actives |
| FR40 | Epic 10 | Client One documents herites |
| FR41 | Epic 10 | Client One teasing Lab |
| FR42 | Epic 10 | MiKL configurer modules |
| FR43 | Epic 10 | MiKL injecter doc Elio |
| FR44 | Epic 8 | Client One converser Elio |
| FR45 | Epic 8 | Elio One FAQ |
| FR46 | Epic 8 | Elio One guidance |
| FR47 | Epic 8 | Elio One demande evolution |
| FR48 | Epic 8 | Elio One+ actions |
| FR49 | Epic 8 | Elio One+ documents |
| FR50 | Epic 8 | Elio One+ alertes |
| FR51 | Epic 8 | Elio One heritage contexte Lab |
| FR52 | Epic 1 | Login client email+mdp |
| FR53 | Epic 1 | Login MiKL email+mdp+2FA |
| FR54 | Epic 1 | Gestion sessions |
| FR55 | Epic 1 | Isolation donnees RLS |
| FR56 | Epic 1 | Confirmation actions sensibles |
| FR57 | Epic 3 | Chat asynchrone MiKL-client |
| FR58 | Epic 5 | Historique visios |
| FR59 | Epic 5 | Transcriptions visios |
| FR60 | Epic 5 | Demander visio |
| FR61 | Epic 3 | Notifications systeme |
| FR62 | Epic 4 | Consulter documents HTML |
| FR63 | Epic 4 | Telecharger PDF |
| FR64 | Epic 4 | Partager document |
| FR65 | Epic 4 | Copie dossier BMAD |
| FR66 | Epic 8 | Stocker profil communication |
| FR67 | Epic 8 | Profil detecte par Orpheus affine par Elio |
| FR68 | Epic 8 | Profil transmis a Elio One |
| FR69 | Epic 8 | Agents adaptent ton selon profil |
| FR70 | Epic 5 | Ecran bienvenue premiere connexion |
| FR71 | Epic 5 | Tutoriel prise en main |
| FR72 | Epic 5 | Ecran graduation recapitulatif |
| FR73 | Epic 1 | Etats vides explicatifs |
| FR74 | Epic 9 | Declencher graduation |
| FR75 | Epic 9 | Migration auto contexte Lab-One |
| FR76 | Epic 9 | Notification graduation |
| FR77 | Epic 11 | Creer et envoyer devis |
| FR78 | Epic 11 | Suivre statut devis |
| FR79 | Epic 2 | Notes privees client |
| FR80 | Epic 2 | Statistiques globales |
| FR81 | Epic 2 | Temps passe par client |
| FR82 | Epic 1 | Messages erreur explicites |
| FR83 | Epic 8 | Gestion timeouts API Elio |
| FR84 | Epic 2 | Alerte client Lab inactif |
| FR85 | Epic 2 | Archivage donnees client desactive |
| FR86 | Epic 4 | Sync documents vers BMAD local |
| FR87 | Epic 8 | Historique configs Elio |
| FR88 | Epic 9 | Client Lab abandon parcours |
| FR89 | Epic 2 | Suspendre/cloturer client |
| FR90 | Epic 2 | Upgrader client ponctuel |
| FR91 | Epic 9 | Changer tier abonnement |
| FR92 | Epic 9 | Export donnees RGPD |
| FR93 | Epic 9 | Retention donnees resiliation |
| FR94 | Epic 11 | Abonnements recurrents Stripe |
| FR95 | Epic 11 | Notification echec paiement |
| FR96 | Epic 11 | Historique facturation |
| FR97 | Epic 11 | Generer avoir |
| FR98 | Epic 11 | MAJ informations paiement |
| FR99 | Epic 3 | Notifications email + in-app |
| FR100 | Epic 3 | Preferences notification client |
| FR101 | Epic 3 | Config notifications par client |
| FR102 | Epic 12 | Logs activite par client |
| FR103 | Epic 12 | Mode maintenance |
| FR104 | Epic 12 | Export complet donnees client |
| FR105 | Epic 12 | Backups automatiques |
| FR106 | Epic 2 | Recherche rapide clients |
| FR107 | Epic 4 | Recherche dans documents |
| FR108 | Epic 1 | Fil d'ariane |
| FR109 | Epic 3 | Signaler probleme/bug |
| FR110 | Epic 3 | Consulter problemes signales |
| FR111 | Epic 3 | Aide en ligne / FAQ |
| FR112 | Epic 1 | Connexions simultanees multi-device |
| FR113 | Epic 1 | Forcer deconnexion sessions |
| FR114 | Epic 1 | Voir/revoquer sessions actives |
| FR115 | Epic 12 | Structure webhooks sortants P2 |
| FR116 | Epic 12 | Structure API client P2 |
| FR117 | Epic 1 | Responsive mobile/tablette |
| FR118 | Epic 1 | Accessibilite WCAG AA |
| FR119 | Epic 1 | Structure multi-langue P3 |
| FR120 | Epic 12 | Metriques usage anonymisees |
| FR121 | Epic 12 | Stats utilisation par fonctionnalite |
| FR122 | Epic 8 | Indicateur Elio reflechit |
| FR123 | Epic 8 | Historique conversations persistant |
| FR124 | Epic 8 | Nouvelle conversation sans perte |
| FR125 | Epic 8 | Documents dans chat Elio |
| FR126 | Epic 8 | Feedback reponse Elio |
| FR127 | Epic 3 | Notifications temps reel |
| FR128 | Epic 3 | Conflits modification concurrente |
| FR129 | Epic 3 | Indicateur en ligne |
| FR130 | Epic 2 | Marquer a traiter plus tard |
| FR131 | Epic 2 | Epingler clients prioritaires |
| FR132 | Epic 2 | Creer rappels personnels |
| FR133 | Epic 2 | Calendrier rappels/deadlines |
| FR134 | Epic 1 | Messages confirmation actions |
| FR135 | Epic 4 | Autosave brouillons formulaires |
| FR136 | Epic 4 | Undo actions recentes |
| FR137 | Epic 12 | Templates parcours Lab |
| FR138 | Epic 12 | Templates emails automatiques |
| FR139 | Epic 10 | Personnaliser branding dashboard One |
| FR140 | Epic 1 | Accepter CGU inscription |
| FR141 | Epic 1 | Notification MAJ CGU |
| FR142 | Epic 1 | Consentement traitement IA |
| FR143 | Epic 1 | Trace horodatee consentements |
| FR144 | Epic 4 | Limite taille fichiers |
| FR145 | Epic 4 | Validation type fichiers |
| FR146 | Epic 4 | Organiser documents en dossiers |
| FR147 | Epic 12 | Indicateur sante systeme |
| FR148 | Epic 12 | Alerte dysfonctionnement |
| FR149 | Epic 2 | Import clients CSV |
| FR150 | Epic 4 | Export formats standards |
| FR151 | Epic 1 | Message navigateur non supporte |
| FR152 | Epic 1 | Gestion connexions instables |
| FR153 | Epic 12 (Story 12.6) | Instance deployee dediee par client One |
| FR154 | Epic 10 | Client One proprietaire code + donnees |
| FR155 | Epic 1 | Communication Hub↔One via API REST + HMAC |
| FR156 | Epic 12 (Story 12.6) | Provisioning instance One via Hub |
| FR157 | Epic 9 (Story 9.5) | Client quitte One = export code + DB + docs |
| FR158 | Epic 12 (Story 12.8) | Documentation obligatoire par module |
| FR159 | Epic 12 (Story 12.8) | Documentation accessible via module documents |
| FR160 | Epic 12 (Story 12.8) | Documentation alimente Elio One |
| FR161 | Epic 9 + 12 (Stories 9.5, 12.8) | Documentation incluse dans export client |
| FR162 | Epic 12 (Story 12.7) | Surveillance usage ressources par instance |
| FR163 | Epic 12 (Story 12.7) | Alertes seuils capacite (60/80/95%) |
| FR164 | Epic 12 (Story 12.7) | Tableau de bord sante instances |
| FR165 | Epic 12 (Story 12.7) | Initier upgrade tier instance |
| FR166 | Epic 9 (Story 9.1) | Graduation provisionne instance dediee |
| FR167 | Epic 9 (Story 9.1) | Graduation migre donnees Lab vers instance One |
| FR168 | Epic 9 (Story 9.5) | Lab = propriete Foxeo, client recupere documents |
| FR169 | Epic 11 (Story 11.5) | Paiement forfait Lab 199€ + activation dashboard Lab |
| FR170 | Epic 11 (Story 11.5) | Deduction Lab 199€ du setup One si graduation |

## Impact Assessment — Passage Instance Par Client (08/02/2026)

> **Changement architectural majeur** : Foxeo One passe d'un modele multi-tenant a une instance dediee par client (Vercel + Supabase propre). Le Lab reste multi-tenant. Le Hub reste instance unique. 16 nouveaux FRs (FR153-168).

### Epics impactes

| Epic | Impact | Detail |
|------|--------|--------|
| **Epic 1** | MODERE | Story 1.1 doit mentionner le dual deployment model (client/ = template Lab + One) |
| **Epic 9** | ELEVE | Graduation = provisioning nouvelle instance. Stories 9.1, 9.2, 9.5 a adapter |
| **Epic 10** | MODERE | Module activation One = redeploy instance. Notes a ajouter |
| **Epic 12** | ELEVE | Nouvelles stories : provisioning, monitoring instances, documentation check. Stories 12.1, 12.4 a adapter |

### Nouveaux FRs mappes

| FR | Epic | Description |
|----|------|-------------|
| FR153 | Epic 12 (Story 12.6) | Instance deployee dediee par client One |
| FR154 | Epic 10 | Client One proprietaire code + donnees |
| FR155 | Epic 1 | Communication Hub↔One via API REST + HMAC |
| FR156 | Epic 12 (Story 12.6) | Provisioning instance One via Hub |
| FR157 | Epic 9 (Story 9.5) | Client quitte One = export code + DB + docs |
| FR158 | Epic 12 (Story 12.8) | Documentation obligatoire par module (guide, FAQ, flows) |
| FR159 | Epic 12 (Story 12.8) | Documentation accessible via module documents |
| FR160 | Epic 12 (Story 12.8) | Documentation alimente Elio One |
| FR161 | Epic 9 + 12 (Stories 9.5, 12.8) | Documentation incluse dans export client |
| FR162 | Epic 12 (Story 12.7) | Surveillance usage ressources par instance |
| FR163 | Epic 12 (Story 12.7) | Alertes seuils capacite (60/80/95%) |
| FR164 | Epic 12 (Story 12.7) | Tableau de bord sante instances |
| FR165 | Epic 12 (Story 12.7) | Initier upgrade tier instance |
| FR166 | Epic 9 (Story 9.1) | Graduation provisionne instance dediee |
| FR167 | Epic 9 (Story 9.1) | Graduation migre donnees Lab vers instance One |
| FR168 | Epic 9 (Story 9.5) | Lab = propriete Foxeo, client recupere documents |

### Notes d'impact par story existante

- **Story 9.1** : Ajouter etape provisioning (Supabase + Vercel) avant migration des donnees. Le `dashboard_type` routing devient URL d'instance.
- **Story 9.2** : Le client est redirige vers `{slug}.foxeo.io` au lieu de `app.foxeo.io`. Les conversations Elio sont migrees vers l'instance dediee.
- **Story 9.5** : Simplifie pour One — suppression directe de l'instance (pas d'anonymisation dans une DB partagee). Lab : anonymisation classique dans DB partagee.
- **Story 12.1** : Les logs d'activite sont locaux a chaque instance. Le Hub aggrege via API. Mode maintenance = notification a toutes les instances.
- **Story 12.4** : Analytics Hub doit collecter des metriques depuis chaque instance One via API health check.
- **Story 12.5** : Ajouter monitoring usage (DB rows, storage, bandwidth) par instance avec seuils d'alerte.

## Epic List

### Epic 1 : Fondation Plateforme & Authentification
MiKL et les clients peuvent acceder aux dashboards Foxeo de maniere securisee avec isolation des donnees, design responsive et dark mode "Minimal Futuriste". Setup monorepo + packages partages, migrations Supabase, dashboard shell avec module registry, auth (2FA MiKL, login client), RLS Lab, middleware, CGU/consentements, multi-device, etats vides, messages confirmation, robustesse. **Modele dual** : Lab multi-tenant (RLS) + One instance par client. Communication Hub↔Instances via API REST + HMAC.
**FRs couverts:** FR52, FR53, FR54, FR55, FR56, FR73, FR82, FR108, FR112, FR113, FR114, FR117, FR118, FR119, FR134, FR140, FR141, FR142, FR143, FR151, FR152, **FR155**

### Epic 2 : Gestion de la Relation Client (CRM Hub)
MiKL peut creer, gerer et piloter l'ensemble de son portefeuille clients depuis le Hub avec recherche, rappels, statistiques et gestion du cycle de vie.
**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR79, FR80, FR81, FR84, FR85, FR89, FR90, FR106, FR130, FR131, FR132, FR133, FR149

### Epic 3 : Communication Temps Reel & Notifications
MiKL et les clients communiquent en temps reel via chat asynchrone avec un systeme de notifications complet (email + in-app), indicateur de presence et support/FAQ.
**FRs couverts:** FR57, FR61, FR99, FR100, FR101, FR109, FR110, FR111, FR127, FR128, FR129

### Epic 4 : Gestion Documentaire
Clients et MiKL peuvent gerer, visualiser, partager et exporter des documents avec viewer HTML, PDF, recherche, autosave et organisation en dossiers.
**FRs couverts:** FR62, FR63, FR64, FR65, FR86, FR107, FR135, FR136, FR144, FR145, FR146, FR150

### Epic 5 : Visioconference & Onboarding Prospect
MiKL conduit des visios enregistrees/transcrites avec prospects/clients via OpenVidu, et les nouveaux prospects vivent un parcours d'onboarding fluide (Cal.com, salle d'attente, post-visio).
**FRs couverts:** FR58, FR59, FR60, FR70, FR71, FR72

### Epic 6 : Parcours Lab — Accompagnement Creation
Les clients en creation suivent un parcours structure guide par Elio Lab, qui pose les questions, genere et soumet les briefs automatiquement au Validation Hub.
**FRs couverts:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37

### Epic 7 : Validation Hub
MiKL examine, valide ou refuse les soumissions clients via un workflow structure avec contexte complet et choix d'actions de traitement.
**FRs couverts:** FR8, FR9, FR10, FR11, FR12, FR13, FR14

### Epic 8 : Agents IA Elio (Hub, Lab, One)
MiKL et les clients beneficient d'une assistance IA contextuelle adaptee a leur role avec profil de communication personnalise, historique persistant et feedback.
**FRs couverts:** FR21, FR22, FR23, FR24, FR25, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR66, FR67, FR68, FR69, FR83, FR87, FR122, FR123, FR124, FR125, FR126

### Epic 9 : Graduation Lab vers One & Cycle de Vie Client
Les clients transitent de Lab vers One avec **provisioning d'une instance dediee** (Supabase + Vercel) et migration complete du contexte. MiKL gere le cycle de vie complet (abandon, changement tier, export RGPD, retention). **Le client quitte One** avec code + DB + documentation. Lab = propriete Foxeo (client recupere uniquement ses documents).
**FRs couverts:** FR74, FR75, FR76, FR88, FR91, FR92, FR93, **FR157, FR161, FR166, FR167, FR168**

### Epic 10 : Dashboard One & Modules Commerciaux
Les clients etablis accedent a un dashboard personnalise **deploye sur leur instance dediee** avec des modules metier activables (signature Yousign, calendrier sync, branding, site web, SEO, reseaux sociaux, maintenance). **Le client est proprietaire** de son code et de ses donnees.
**FRs couverts:** FR38, FR39, FR40, FR41, FR42, FR43, FR139, **FR154**

### Epic 11 : Facturation & Abonnements
MiKL et les clients gerent devis, factures et abonnements via Stripe et Invoice Ninja avec suivi complet des paiements. Inclut le forfait Lab a 199€ (paiement unique, deduction setup One).
**FRs couverts:** FR77, FR78, FR94, FR95, FR96, FR97, FR98, **FR169, FR170**

### Epic 12 : Administration, Analytics, Templates & Monitoring Instances
MiKL pilote la plateforme avec outils d'administration, **monitoring des instances One** (usage, seuils, upgrade), analytics, templates personnalisables, **verification documentation obligatoire** et preparation des integrations futures. **Provisioning** de nouvelles instances One depuis le Hub.
**FRs couverts:** FR102, FR103, FR104, FR105, FR115, FR116, FR120, FR121, FR137, FR138, FR147, FR148, **FR155, FR156, FR158, FR159, FR160, FR162, FR163, FR164, FR165**

---

## Epic 1 : Fondation Plateforme & Authentification — Stories detaillees

**Objectif :** MiKL et les clients peuvent acceder aux dashboards Foxeo de maniere securisee avec isolation des donnees, design responsive et dark mode "Minimal Futuriste".

**FRs couverts:** FR52, FR53, FR54, FR55, FR56, FR73, FR82, FR108, FR112, FR113, FR114, FR117, FR118, FR119, FR134, FR140, FR141, FR142, FR143, FR151, FR152

**NFRs pertinentes:** NFR-P1, NFR-S1 a NFR-S9, NFR-A1 a NFR-A4, NFR-R5, NFR-M1 a NFR-M5

---

### Story 1.1 : Setup monorepo, packages partages & dashboard shell

> **Technical Enabler** — Story technique fondationnelle, pas de valeur utilisateur directe.

As a **MiKL (operateur)**,
I want **deux applications distinctes (Hub operateur + Client Lab/One) avec un systeme de modules activables et un design system partage**,
So that **chaque audience a une experience dediee et optimisee des le depart**.

**Acceptance Criteria :**

**Given** le starter template Turborepo existant avec @foxeo/ui, @foxeo/utils, @foxeo/tsconfig
**When** la story est completee
**Then** les packages suivants existent et sont fonctionnels :
- `packages/supabase/` avec client.ts, server.ts, middleware.ts, realtime.ts, providers (query-provider, realtime-provider, theme-provider)
- `packages/types/` avec index.ts, module-manifest.ts, action-response.ts, auth.types.ts, client-config.types.ts
- `packages/utils/` mis a jour avec case-transform.ts, format-currency.ts, validation-schemas.ts, module-registry.ts
**And** les dependances sont installees : @supabase/supabase-js ^2.95.x, @supabase/ssr, @tanstack/react-query ^5.90.x, zustand ^5.0.x, react-hook-form ^7.71.x, @hookform/resolvers

**Given** les packages partages en place
**When** les apps hub/ et client/ sont configurees
**Then** chaque app possede :
- `app/(auth)/login/page.tsx` et `app/(auth)/layout.tsx` (placeholder)
- `app/(dashboard)/layout.tsx` avec dashboard shell (sidebar dynamique, header, slot contenu)
- `app/(dashboard)/loading.tsx` avec shell-skeleton
- `app/(dashboard)/modules/[moduleId]/page.tsx` qui charge les modules via registry
- `app/(dashboard)/modules/[moduleId]/loading.tsx` et `error.tsx`
- `middleware.ts` (placeholder auth)
- `layout.tsx` root avec providers (QueryProvider, RealtimeProvider, ThemeProvider)
**And** `turbo dev` lance les deux apps simultanement sans erreur
**And** `turbo build` compile sans erreur TypeScript
**And** le turbo.json contient les tasks : build, dev, lint, test, test:rls, test:contracts, test:e2e, gen:types, clean

**Given** le module core-dashboard existe
**When** le module registry est actif
**Then** le registry auto-decouvre les manifests des modules dans packages/modules/
**And** le dashboard shell affiche la sidebar avec les modules decouverts
**And** la route dynamique [moduleId] charge le bon module via le registry

---

### Story 1.2 : Migrations Supabase fondation

> **Technical Enabler** — Story technique fondationnelle, pas de valeur utilisateur directe.

As a **MiKL (operateur)**,
I want **la base de donnees initialisee avec les tables fondamentales (operateurs, clients, configurations, consentements, logs d'activite)**,
So that **la structure de donnees est en place pour gerer mes clients et leur multi-tenancy**.

**Acceptance Criteria :**

**Given** le dossier supabase/ avec config.toml
**When** les migrations sont executees
**Then** la table `operators` existe avec les colonnes : id (UUID PK), email, name, role, two_factor_enabled, created_at, updated_at
**And** la table `clients` existe avec les colonnes : id (UUID PK), operator_id (FK operators), email, name, company, contact, sector, client_type (Complet/Direct One/Ponctuel), status, auth_user_id (FK auth.users), created_at, updated_at
**And** la table `client_configs` existe avec les colonnes : client_id (UUID PK FK clients), operator_id (FK operators), active_modules (TEXT[] DEFAULT ARRAY['core-dashboard']), dashboard_type (TEXT DEFAULT 'one'), theme_variant, custom_branding (JSONB), elio_config (JSONB), parcours_config (JSONB), created_at, updated_at
**And** la table `consents` existe avec les colonnes : id (UUID PK), client_id (FK clients), consent_type (TEXT : 'cgu', 'ia_processing'), accepted (BOOLEAN), version (TEXT), ip_address, user_agent, created_at
**And** la table `activity_logs` existe avec les colonnes : id (UUID PK), actor_type (TEXT CHECK IN ('client', 'operator', 'system', 'elio') NOT NULL), actor_id (UUID NOT NULL), action (TEXT NOT NULL), entity_type (TEXT NOT NULL — 'client', 'parcours', 'document', 'validation_request', 'payment', etc.), entity_id (UUID nullable), metadata (JSONB nullable), created_at (TIMESTAMP DEFAULT NOW())
**And** un index `idx_activity_logs_actor_created_at` est cree sur (actor_id, created_at)
**And** un index `idx_activity_logs_entity` est cree sur (entity_type, entity_id)
**And** les policies RLS activity_logs : MiKL voit tous les logs de ses clients, le client ne voit PAS les logs (table interne operateur)
**And** toutes les tables utilisent snake_case et les conventions de nommage definies dans l'architecture
**And** les triggers `updated_at` sont en place sur operators, clients, client_configs

**Given** les migrations executees
**When** le seed.sql est joue
**Then** un operateur MiKL (operator_id: 1) est cree avec les donnees de base
**And** les modules socle sont enregistres

**Given** les tables creees
**When** `turbo gen:types` est execute
**Then** le fichier `packages/types/src/database.types.ts` est genere et reflete le schema

---

### Story 1.3 : Authentification client (inscription, login, sessions)

As a **client Foxeo**,
I want **pouvoir m'inscrire avec email + mot de passe, me connecter et avoir une session persistante**,
So that **j'accede de maniere securisee a mon dashboard personnalise**.

**Acceptance Criteria :**

**Given** un client avec un compte existant
**When** il accede a app.foxeo.io/login et saisit email + mot de passe valides
**Then** il est redirige vers le dashboard (dashboard)/
**And** un access token et un refresh token sont crees via Supabase Auth
**And** les cookies de session sont configures cote serveur via @supabase/ssr

**Given** un client non authentifie
**When** il tente d'acceder a une route /(dashboard)/*
**Then** le middleware client/ le redirige vers /login
**And** l'URL demandee est stockee pour redirection post-login

**Given** un client authentifie avec session active
**When** il reste inactif pendant 8 heures (NFR-S4)
**Then** sa session expire automatiquement
**And** il est redirige vers /login avec un message explicatif

**Given** un client authentifie
**When** il clique sur "Se deconnecter"
**Then** la session est invalidee cote serveur
**And** les cookies sont supprimes
**And** il est redirige vers /login

**Given** un utilisateur qui tente de se connecter
**When** il echoue 5 fois consecutivement (NFR-S5)
**Then** le compte est bloque pendant 5 minutes
**And** un message explicite informe de la duree du blocage

**Given** le login page client
**When** elle est affichee
**Then** elle utilise le dark mode (#020402) et le design "Minimal Futuriste"
**And** elle est responsive (fonctionne sur mobile >=320px, NFR-A1)

---

### Story 1.4 : Authentification MiKL (login + 2FA, middleware hub admin)

As **MiKL (operateur)**,
I want **me connecter avec email + mot de passe + 2FA et avoir un acces protege au Hub**,
So that **mon acces administrateur est hautement securise**.

**Acceptance Criteria :**

**Given** MiKL avec un compte operateur
**When** il accede a hub.foxeo.io/login et saisit email + mot de passe valides
**Then** il est redirige vers l'ecran de saisie du code 2FA (TOTP)

**Given** MiKL sur l'ecran 2FA
**When** il saisit le code TOTP correct
**Then** il est redirige vers le dashboard Hub /(dashboard)/
**And** la session est creee avec le flag admin verifie

**Given** MiKL sur l'ecran 2FA
**When** il saisit un code TOTP incorrect
**Then** un message d'erreur explicite s'affiche
**And** le compteur d'echecs s'incremente

**Given** un utilisateur non authentifie ou sans role admin
**When** il tente d'acceder a une route hub.foxeo.io/(dashboard)/*
**Then** le middleware hub/ verifie admin + 2FA
**And** il est redirige vers /login

**Given** MiKL sur la page de premiere configuration 2FA
**When** il scanne le QR code et valide avec un code TOTP
**Then** le 2FA est active sur son compte
**And** des codes de recuperation sont generes et affiches une seule fois

**Given** le login page Hub
**When** elle est affichee
**Then** elle utilise la palette Hub (Cyan/Turquoise sur fond #020402)
**And** elle est responsive

---

### Story 1.5 : RLS & isolation donnees multi-tenant

As a **operateur de la plateforme**,
I want **que chaque client ne puisse acceder qu'a ses propres donnees et que chaque operateur ne voie que ses clients**,
So that **la securite et la confidentialite des donnees sont garanties nativement au niveau base de donnees**.

**Acceptance Criteria :**

**Given** les tables operators, clients, client_configs, consents
**When** les migrations RLS sont executees (00014_rls_policies.sql, 00015_rls_functions.sql)
**Then** les fonctions SQL `is_admin()`, `is_owner(client_id)`, `is_operator(operator_id)` sont creees
**And** les policies RLS sont appliquees :
- `clients_select_owner` : un client ne peut lire que sa propre fiche
- `clients_select_operator` : un operateur voit tous ses clients
- `client_configs_select_owner` : un client ne lit que sa config
- `consents_select_owner` : un client ne voit que ses consentements
- `consents_insert_authenticated` : un client peut creer ses consentements

**Given** un client A authentifie
**When** il tente de lire les donnees du client B via l'API Supabase
**Then** la requete retourne un resultat vide (pas d'erreur, pas de donnees)
**And** le test RLS `client-isolation.test.ts` verifie ce scenario

**Given** un operateur A authentifie
**When** il tente de lire les clients de l'operateur B
**Then** la requete retourne un resultat vide
**And** le test RLS `operator-isolation.test.ts` verifie ce scenario

**Given** les tests RLS
**When** le CI s'execute
**Then** les tests RLS passent comme quality gate bloquant
**And** si un test d'isolation echoue, le build est casse

---

### Story 1.6 : Gestion sessions avancee (multi-device, voir/revoquer, forcer deconnexion)

As a **client Foxeo**,
I want **pouvoir voir mes sessions actives et en revoquer, et me connecter simultanement sur plusieurs appareils**,
So that **j'ai le controle total sur la securite de mon compte**.

**Acceptance Criteria :**

**Given** un client connecte sur plusieurs appareils (mobile + desktop)
**When** il se connecte sur un nouvel appareil
**Then** les deux sessions coexistent sans conflit (FR112)
**And** chaque session est identifiee (appareil, navigateur, derniere activite)

**Given** un client connecte
**When** il accede a la page "Sessions actives" dans ses parametres
**Then** il voit la liste de toutes ses sessions avec : appareil, navigateur, IP approximative, date derniere activite, indicateur "session courante" (FR114)

**Given** un client qui visualise ses sessions
**When** il revoque une session specifique
**Then** la session ciblee est invalidee immediatement
**And** l'appareil concerne est redirige vers /login
**And** un message de confirmation s'affiche (FR134)

**Given** MiKL dans le Hub
**When** il force la deconnexion de toutes les sessions d'un client (FR113)
**Then** toutes les sessions du client sont invalidees
**And** le client est redirige vers /login sur tous ses appareils
**And** une notification est envoyee au client

---

### Story 1.7 : Design system fondation (dark mode, palettes, responsive, accessibilite)

As a **utilisateur (MiKL ou client)**,
I want **une interface dark mode "Minimal Futuriste" avec la palette adaptee a mon dashboard, responsive et accessible**,
So that **j'ai une experience visuelle coherente, agreable et utilisable sur tous mes appareils**.

**Acceptance Criteria :**

**Given** le package @foxeo/ui existant
**When** les themes sont configures
**Then** 3 fichiers CSS OKLCH existent dans packages/ui/src/themes/ :
- `hub.css` — palette Cyan/Turquoise sur fond #020402
- `lab.css` — palette Violet/Purple sur fond #020402
- `one.css` — palette Orange vif + Bleu-gris sur fond #020402
**And** les variables CSS sont utilisees via Tailwind v4 `@theme`
**And** le fond noir profond (#020402) est commun aux 3 palettes

**Given** le globals.css de chaque app
**When** l'app hub est chargee
**Then** la palette Hub est active
**When** l'app client est chargee avec dashboard_type='lab'
**Then** la palette Lab est active
**When** l'app client est chargee avec dashboard_type='one'
**Then** la palette One est active

**Given** la densite configuree par dashboard
**When** le Hub est affiche
**Then** la densite est `compact` (data-dense)
**When** le Lab est affiche
**Then** la densite est `spacious` (emotionnel)
**When** le One est affiche
**Then** la densite est `comfortable` (operationnel)

**Given** les typographies definies
**When** l'interface est rendue
**Then** Poppins est utilise pour les titres et UI
**And** Inter est utilise pour le corps de texte

**Given** un utilisateur sur mobile (>=320px, NFR-A1)
**When** il accede au dashboard
**Then** la sidebar se collapse en menu hamburger
**And** tous les composants sont utilisables sans scroll horizontal

**Given** les standards d'accessibilite (NFR-A2, A3, A4)
**When** l'interface est evaluee
**Then** le contraste texte/fond respecte WCAG AA (ratio 4.5:1)
**And** la navigation au clavier fonctionne sur toutes les pages
**And** les elements interactifs ont des labels accessibles (aria-label)

---

### Story 1.8 : UX transversale (fil d'ariane, etats vides, messages confirmation, erreurs, robustesse)

As a **utilisateur (MiKL ou client)**,
I want **un fil d'ariane clair, des etats vides explicatifs, des messages de confirmation apres chaque action, des messages d'erreur explicites et une gestion gracieuse des connexions instables**,
So that **je sais toujours ou je suis, ce que je peux faire et ce qui se passe**.

**Acceptance Criteria :**

**Given** un utilisateur qui navigue dans le dashboard
**When** il est dans un module (ex: /modules/crm/clients/123)
**Then** un fil d'ariane affiche sa position : Dashboard > CRM > Client > Fiche (FR108)
**And** chaque niveau est cliquable pour remonter

**Given** un utilisateur qui accede a une section sans contenu
**When** la liste est vide (pas de documents, pas de messages, pas de clients)
**Then** un etat vide explicatif s'affiche avec illustration, message engageant et CTA (FR73)
**And** le composant `EmptyState` de @foxeo/ui est utilise

**Given** un utilisateur qui effectue une action (creation, modification, suppression)
**When** l'action reussit
**Then** un toast de confirmation s'affiche (FR134)
**And** le message est contextualise ("Client cree avec succes", "Document partage")

**Given** une erreur cote serveur ou reseau
**When** l'erreur survient
**Then** un message explicite s'affiche — jamais d'ecran blanc (FR82)
**And** l'error boundary du module capture le crash sans affecter le reste du shell
**And** le message indique la nature de l'erreur et une action possible

**Given** un navigateur non supporte
**When** l'utilisateur accede a l'application
**Then** un message explicite informe que le navigateur n'est pas compatible (FR151)

**Given** une connexion reseau instable
**When** une requete echoue a cause du reseau
**Then** le systeme retente automatiquement (retry)
**And** un message discret informe de la perte de connexion (FR152)
**And** quand la connexion revient, les donnees se resynchronisent

**Given** une action sensible (suppression, modification critique)
**When** l'utilisateur la declenche
**Then** une boite de dialogue de confirmation s'affiche avant execution (FR56)

---

### Story 1.9 : Consentements & legal (CGU, traitement IA, traces, notification MAJ)

As a **client Foxeo**,
I want **accepter les CGU et le consentement IA lors de mon inscription, et etre notifie des mises a jour**,
So that **la plateforme est conforme RGPD et je garde le controle sur mes donnees**.

**Acceptance Criteria :**

**Given** un nouveau client qui s'inscrit
**When** il arrive sur le formulaire d'inscription
**Then** il doit cocher l'acceptation des CGU avant de pouvoir valider (FR140)
**And** un lien vers les CGU completes est fourni
**And** une case separee demande le consentement explicite pour le traitement IA (FR142)
**And** le consentement IA est clairement explique (ce qu'Elio fait avec les donnees)

**Given** un client qui accepte les CGU et/ou le consentement IA
**When** il valide
**Then** une entree est creee dans la table `consents` avec : client_id, consent_type, accepted=true, version, ip_address, user_agent, created_at (FR143)
**And** la trace est horodatee et immuable (pas de UPDATE, seulement des INSERT)

**Given** MiKL met a jour les CGU (nouvelle version)
**When** un client se connecte apres la mise a jour
**Then** un ecran interstitiel lui presente les changements et demande une nouvelle acceptation (FR141)
**And** le client ne peut pas acceder au dashboard tant qu'il n'a pas accepte
**And** un nouveau consentement est enregistre avec la nouvelle version

**Given** un client qui refuse le consentement IA
**When** il utilise la plateforme
**Then** les fonctionnalites Elio sont desactivees pour ce client
**And** le reste de la plateforme fonctionne normalement

---

### Story 1.10 : Structure multi-langue P3 (preparation i18n)

> **Technical Enabler** — Preparation structurelle, valeur differee a P3.

As a **MiKL (operateur)**,
I want **la plateforme structuree pour supporter facilement plusieurs langues a l'avenir**,
So that **quand je voudrai proposer Foxeo en anglais, il n'y aura pas de refactoring massif**.

**Acceptance Criteria :**

**Given** l'architecture actuelle en francais uniquement
**When** la structure i18n est mise en place
**Then** un dossier `messages/` (ou `locales/`) existe dans chaque app avec un fichier `fr.json` contenant les chaines UI principales
**And** un helper `t()` ou un hook `useTranslations()` est disponible dans @foxeo/utils
**And** les chaines statiques des composants partages (@foxeo/ui) passent par ce helper

**Given** la structure i18n en place
**When** un developpeur ajoute un nouveau composant
**Then** il utilise `t('cle.sous_cle')` au lieu de chaines en dur
**And** la cle est ajoutee dans `fr.json`

**Given** que P3 arrive et qu'on veut ajouter l'anglais
**When** un fichier `en.json` est ajoute
**Then** le systeme peut switcher entre les langues sans modification de composants
**And** le Next.js middleware gere la detection de langue (FR119)

---

### Resume Epic 1 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 1.1 | Setup monorepo, packages & dashboard shell | — (fondation technique) |
| 1.2 | Migrations Supabase fondation | — (fondation donnees) |
| 1.3 | Auth client (inscription, login, sessions) | FR52, FR54 |
| 1.4 | Auth MiKL (login + 2FA, middleware hub) | FR53 |
| 1.5 | RLS & isolation donnees multi-tenant | FR55 |
| 1.6 | Gestion sessions avancee | FR112, FR113, FR114 |
| 1.7 | Design system fondation | FR117, FR118 |
| 1.8 | UX transversale | FR56, FR73, FR82, FR108, FR134, FR151, FR152 |
| 1.9 | Consentements & legal | FR140, FR141, FR142, FR143 |
| 1.10 | Structure multi-langue P3 | FR119 |

**Toutes les 21 FRs de l'Epic 1 sont couvertes.**

---

## Epic 2 : Gestion de la Relation Client (CRM Hub) — Stories detaillees

**Objectif :** MiKL peut creer, gerer et piloter l'ensemble de son portefeuille clients depuis le Hub avec recherche, rappels, statistiques et gestion du cycle de vie.

**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR79, FR80, FR81, FR84, FR85, FR89, FR90, FR106, FR130, FR131, FR132, FR133, FR149

**NFRs pertinentes:** NFR-P1, NFR-P2, NFR-P4, NFR-S7, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

---

### Story 2.1 : Module CRM — Liste clients, filtres & recherche rapide

As a **MiKL (operateur)**,
I want **voir la liste de tous mes clients avec leur statut, les filtrer et rechercher rapidement un client**,
So that **j'ai une vision d'ensemble de mon portefeuille et je retrouve instantanement n'importe quel client**.

**Acceptance Criteria :**

**Given** MiKL est authentifie sur le Hub
**When** il accede au module CRM (`/modules/crm`)
**Then** le module CRM est enregistre dans le module registry avec son manifest (id: `crm`, targets: `['hub']`, navigation, routes, requiredTables: `['clients', 'client_configs']`)
**And** le dossier `packages/modules/crm/` est structure selon le pattern standard (index.ts, manifest.ts, components/, hooks/, actions/, types/)
**And** la page par defaut affiche la liste de tous ses clients (filtres par `operator_id` via RLS)
**And** un skeleton loader s'affiche pendant le chargement (loading.tsx, jamais de spinner)

**Given** la liste des clients est chargee
**When** MiKL visualise la liste
**Then** chaque ligne affiche : nom, entreprise, type de client (Complet / Direct One / Ponctuel), statut (Lab actif, One actif, Inactif, Suspendu), date de creation
**And** la liste utilise le composant `DataTable` de @foxeo/ui
**And** la liste est paginee (20 elements par page par defaut)
**And** la liste est triable par nom, entreprise, type, statut, date de creation
**And** les donnees sont fetched via TanStack Query avec queryKey `['clients', operatorId]`
**And** la densite est `compact` (data-dense, palette Hub Cyan/Turquoise)

**Given** MiKL sur la liste clients
**When** il saisit du texte dans le champ de recherche rapide
**Then** la liste se filtre en temps reel (cote client si < 500 clients, sinon requete serveur avec debounce 300ms)
**And** la recherche porte sur : nom, entreprise, email, secteur (FR106)
**And** les resultats apparaissent en moins de 1 seconde (NFR-P4)

**Given** MiKL sur la liste clients
**When** il utilise les filtres
**Then** il peut filtrer par : type de client (Complet / Direct One / Ponctuel), statut (Lab actif / One actif / Inactif / Suspendu), secteur d'activite
**And** les filtres sont combinables entre eux et avec la recherche

**Given** la liste affichee avec resultats
**When** MiKL clique sur un client
**Then** il est redirige vers la fiche complete du client (`/modules/crm/clients/[clientId]`)

**Given** aucun client ne correspond aux filtres ou a la recherche
**When** la liste est vide
**Then** un etat vide explicatif s'affiche avec message engageant et CTA "Creer un client" (composant EmptyState de @foxeo/ui)

---

### Story 2.2 : Creation & edition de fiche client

As a **MiKL (operateur)**,
I want **creer et modifier une fiche client avec toutes les informations de base et definir son type**,
So that **chaque nouveau client est enregistre dans mon portefeuille avec les donnees necessaires a son suivi**.

**Acceptance Criteria :**

**Given** MiKL sur la page liste clients ou la fiche client
**When** il clique sur "Creer un client" (bouton CTA)
**Then** un formulaire de creation s'affiche (dialog modal ou page dediee)
**And** le formulaire contient les champs : nom (obligatoire), email (obligatoire, unique par operateur), entreprise, telephone, secteur d'activite, type de client (Complet / Direct One / Ponctuel, obligatoire, defaut: Ponctuel) (FR1, FR2)
**And** le formulaire utilise react-hook-form avec validation Zod
**And** les schemas de validation sont dans @foxeo/utils/validation-schemas.ts

**Given** MiKL remplit le formulaire de creation
**When** il soumet le formulaire avec des donnees valides
**Then** une Server Action `createClient()` est executee
**And** la reponse suit le pattern `{ data, error }` (jamais de throw)
**And** un enregistrement est cree dans la table `clients` avec `operator_id` = MiKL
**And** un enregistrement `client_configs` est cree avec les modules par defaut (`['core-dashboard']`)
**And** un toast de confirmation s'affiche ("Client cree avec succes")
**And** le cache TanStack Query `['clients', operatorId]` est invalide
**And** MiKL est redirige vers la fiche du nouveau client

**Given** MiKL sur la fiche d'un client existant
**When** il clique sur "Modifier"
**Then** le formulaire d'edition s'affiche, prerempli avec les donnees actuelles
**And** il peut modifier tous les champs y compris le type de client (FR2)

**Given** MiKL soumet le formulaire d'edition avec des donnees valides
**When** la Server Action `updateClient()` s'execute
**Then** la fiche est mise a jour en base
**And** un toast de confirmation s'affiche ("Client mis a jour")
**And** le cache TanStack Query est invalide pour la liste et la fiche

**Given** MiKL soumet un formulaire avec un email deja utilise par un autre client du meme operateur
**When** la validation echoue
**Then** un message d'erreur clair s'affiche a cote du champ email ("Cet email est deja associe a un client")

**Given** MiKL tente de creer un client
**When** une erreur serveur survient
**Then** un toast d'erreur s'affiche avec un message explicite (FR82)
**And** le formulaire reste affiche avec les donnees saisies (pas de perte de donnees)

---

### Story 2.3 : Fiche client complete (vue detaillee multi-onglets)

As a **MiKL (operateur)**,
I want **consulter la fiche complete d'un client avec ses informations, son historique, ses documents et ses echanges dans une vue a onglets**,
So that **j'ai une vision 360° de chaque client sans naviguer entre plusieurs pages**.

**Acceptance Criteria :**

**Given** MiKL clique sur un client dans la liste CRM
**When** la fiche client se charge (`/modules/crm/clients/[clientId]`)
**Then** la page affiche un header avec : nom du client, entreprise, type (badge couleur), statut (badge), date de creation (FR4)
**And** un skeleton loader s'affiche pendant le chargement
**And** les donnees sont fetched via TanStack Query avec queryKey `['client', clientId]`

**Given** la fiche client est chargee
**When** MiKL visualise la fiche
**Then** 4 onglets sont disponibles : Informations, Historique, Documents, Echanges
**And** l'onglet actif est "Informations" par defaut
**And** l'etat de l'onglet actif est gere via URL query param (`?tab=informations`) pour permettre le partage de lien

**Given** l'onglet "Informations" est actif
**When** MiKL le consulte
**Then** il voit : coordonnees completes (nom, email, telephone, entreprise, secteur), type de client, statut actuel, parcours Lab assigne (si applicable), modules One actives (si applicable), date de creation, derniere activite
**And** un bouton "Modifier" permet d'editer les informations (formulaire de Story 2.2)

**Given** l'onglet "Historique" est actif
**When** MiKL le consulte
**Then** il voit une timeline chronologique des evenements du client : creation du compte, changements de statut, validations Hub, visios, passages Lab vers One
**And** la timeline est ordonnee du plus recent au plus ancien
**And** les donnees proviennent de la table `activity_logs` (creee en Story 1.2)
**And** le composant `ClientTimeline` (packages/modules/crm/components/client-timeline.tsx) affiche les evenements

**Given** l'onglet "Documents" est actif
**When** MiKL le consulte
**Then** il voit la liste des documents partages avec ce client (briefs, livrables, rapports)
**And** chaque document affiche : nom, type, date, statut (visible/non visible par le client)
**And** cette vue requete Supabase directement (table `documents`, filtre par client_id) — pas d'import du module Documents

**Given** l'onglet "Echanges" est actif
**When** MiKL le consulte
**Then** il voit l'historique des echanges : messages chat recents, resumes Elio, notifications echangees
**And** un lien rapide "Ouvrir le chat" redirige vers le module Chat avec le contexte client

---

### Story 2.4 : Assignation parcours Lab & gestion des acces

As a **MiKL (operateur)**,
I want **assigner un parcours Lab a un client et activer ou desactiver ses acces Lab et One**,
So that **je controle precisement le niveau de service de chaque client**.

**Acceptance Criteria :**

**Given** MiKL sur la fiche d'un client (onglet Informations)
**When** il clique sur "Assigner un parcours Lab"
**Then** un dialog s'ouvre avec : selection du type de parcours (a partir des templates existants dans `parcours_templates`, migration 00009), liste des etapes du parcours selectionne, possibilite d'activer/desactiver des etapes individuelles (FR5)
**And** si aucun template de parcours n'existe encore, un etat vide suggere d'en creer un (info contextuelle mentionnant le module Templates — Epic 12)

**Given** MiKL selectionne un parcours et valide
**When** la Server Action `assignParcours()` s'execute
**Then** un enregistrement est cree dans la table `parcours` (migration 00009) avec : client_id, template_id, etapes actives, statut "en_cours"
**And** la `client_configs` est mise a jour avec `dashboard_type: 'lab'` et `parcours_config` contenant la configuration
**And** un toast confirme "Parcours Lab assigne avec succes"
**And** le cache TanStack Query est invalide (`['client', clientId]`, `['clients', operatorId]`)

**Given** MiKL sur la fiche d'un client
**When** il clique sur le toggle "Acces Lab" ou "Acces One" (FR6)
**Then** l'acces correspondant est active ou desactive
**And** la `client_configs` est mise a jour (`dashboard_type` ajuste)
**And** si desactivation : une boite de dialogue de confirmation s'affiche ("Le client perdra l'acces a son dashboard Lab/One")
**And** un toast confirme l'action
**And** l'action est tracee dans `activity_logs`

**Given** MiKL desactive l'acces Lab d'un client en cours de parcours
**When** la desactivation est confirmee
**Then** le parcours est suspendu (pas supprime) avec son etat courant preserve
**And** si MiKL reactive l'acces, le parcours reprend la ou il en etait

---

### Story 2.5 : Integration Cursor (ouverture dossier BMAD client)

As a **MiKL (operateur)**,
I want **ouvrir le dossier BMAD d'un client directement dans Cursor depuis la fiche CRM**,
So that **je peux travailler avec Orpheus sur les documents du client sans quitter mon flux de travail**.

**Acceptance Criteria :**

**Given** MiKL sur la fiche d'un client
**When** il clique sur le bouton "Ouvrir dans Cursor" (FR7)
**Then** le systeme genere un lien avec le protocole custom `cursor://file/` pointant vers le dossier BMAD du client
**And** le chemin du dossier est construit a partir d'une convention configurable (defaut : `{bmad_base_path}/clients/{client_slug}/`)
**And** le `client_slug` est derive du nom de l'entreprise ou du nom du client (kebab-case)
**And** Cursor s'ouvre avec le dossier du client

**Given** le dossier BMAD du client n'existe pas encore
**When** MiKL clique sur "Ouvrir dans Cursor"
**Then** un message informe que le dossier n'a pas encore ete cree
**And** un bouton "Copier le chemin" permet de copier le chemin attendu dans le presse-papier
**And** des instructions indiquent comment initialiser le dossier BMAD

**Given** la fonctionnalite depend d'une app desktop installee (Cursor)
**When** le protocole custom n'est pas supporte par le navigateur
**Then** un fallback affiche le chemin complet du dossier avec un bouton "Copier dans le presse-papier"
**And** un message explique comment ouvrir manuellement dans Cursor

---

### Story 2.6 : Notes privees, epinglage & "a traiter plus tard"

As a **MiKL (operateur)**,
I want **ajouter des notes privees sur un client, epingler des clients prioritaires et marquer des elements a traiter plus tard**,
So that **j'organise mon travail quotidien et conserve mes observations sans que le client les voie**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** les migrations sont executees
**Then** la table `client_notes` est creee avec : id (UUID PK), client_id (FK clients), operator_id (FK operators), content (TEXT NOT NULL), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** les colonnes `is_pinned` (BOOLEAN DEFAULT false) et `deferred_until` (TIMESTAMP nullable) sont ajoutees a la table `clients`
**And** un trigger `trg_client_notes_updated_at` est en place
**And** les policies RLS assurent que seul l'operateur proprietaire voit les notes : `client_notes_select_operator`, `client_notes_insert_operator`, `client_notes_update_operator`, `client_notes_delete_operator`

**Given** MiKL sur la fiche d'un client, onglet Informations
**When** il accede a la section "Notes privees"
**Then** il voit la liste de ses notes, ordonnees de la plus recente a la plus ancienne (FR79)
**And** chaque note affiche le contenu et la date de creation
**And** un badge "Prive" indique clairement que le client n'y a pas acces
**And** les donnees sont fetched via TanStack Query avec queryKey `['client-notes', clientId]`

**Given** MiKL veut ajouter une note
**When** il saisit du texte dans le champ de saisie et valide
**Then** une Server Action `createClientNote()` cree la note dans `client_notes`
**And** la reponse suit le pattern `{ data, error }`
**And** un toast confirme "Note ajoutee"
**And** le cache TanStack Query `['client-notes', clientId]` est invalide

**Given** MiKL veut modifier ou supprimer une note existante
**When** il clique sur le menu contextuel de la note
**Then** il peut editer le contenu en place ou supprimer la note (avec confirmation)
**And** les Server Actions `updateClientNote()` et `deleteClientNote()` sont utilisees

**Given** MiKL sur la liste clients
**When** il clique sur l'icone epingle d'un client (FR131)
**Then** le champ `is_pinned` du client est mis a jour via Server Action `togglePinClient()`
**And** les clients epingles apparaissent en haut de la liste avec un indicateur visuel (icone epingle, fond subtil accent)
**And** le tri "Epingles d'abord" est applique par defaut

**Given** MiKL sur une fiche client ou la liste clients
**When** il marque un client "A traiter plus tard" avec une date (FR130)
**Then** le champ `deferred_until` est mis a jour via Server Action `deferClient()`
**And** le client reste visible dans la liste mais avec un indicateur visuel "Reporte" et la date
**And** quand la date est atteinte, l'element reapparait sans le flag "Reporte"

---

### Story 2.7 : Rappels personnels & calendrier deadlines

As a **MiKL (operateur)**,
I want **creer des rappels personnels avec une tache et une date, et visualiser mes rappels et deadlines dans un calendrier**,
So that **je n'oublie aucune action importante et je planifie mon travail efficacement**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** les migrations sont executees
**Then** la table `reminders` est creee avec : id (UUID PK), operator_id (FK operators NOT NULL), client_id (FK clients nullable), title (TEXT NOT NULL), description (TEXT nullable), due_date (TIMESTAMP WITH TIME ZONE NOT NULL), completed (BOOLEAN DEFAULT false), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** un index `idx_reminders_operator_id_due_date` est cree pour les requetes calendrier
**And** un trigger `trg_reminders_updated_at` est en place
**And** les policies RLS assurent que seul l'operateur proprietaire voit ses rappels : `reminders_select_operator`, `reminders_insert_operator`, `reminders_update_operator`, `reminders_delete_operator`

**Given** MiKL dans le module CRM ou sur une fiche client
**When** il clique sur "Nouveau rappel" (FR132)
**Then** un dialog s'ouvre avec les champs : titre (obligatoire), description (optionnel), date d'echeance (obligatoire, date picker), client associe (optionnel, auto-rempli si cree depuis une fiche client)
**And** le formulaire utilise react-hook-form avec validation Zod

**Given** MiKL soumet un rappel valide
**When** la Server Action `createReminder()` s'execute
**Then** le rappel est cree dans la table `reminders`
**And** la reponse suit le pattern `{ data, error }`
**And** un toast confirme "Rappel cree"
**And** le cache TanStack Query `['reminders', operatorId]` est invalide

**Given** MiKL accede a la vue calendrier des rappels (FR133)
**When** la page se charge
**Then** un calendrier mensuel affiche les rappels et deadlines sous forme de points/badges sur les jours concernes
**And** un clic sur un jour affiche la liste detaillee des rappels de ce jour
**And** les rappels passes non completes sont visuellement marques en rouge (en retard)
**And** les rappels completes sont barres ou grises
**And** une navigation mois precedent / mois suivant est disponible

**Given** MiKL consulte un rappel
**When** il le marque comme complete
**Then** le champ `completed` est mis a jour via Server Action `toggleReminderComplete()`
**And** le rappel passe en style "complete" (barre/grise)
**And** le cache TanStack Query est invalide

**Given** MiKL consulte la liste des rappels
**When** il filtre par statut
**Then** il peut voir : Tous, A venir, En retard, Completes
**And** le filtre par defaut est "A venir"

---

### Story 2.8 : Statistiques globales & temps passe par client

As a **MiKL (operateur)**,
I want **voir des statistiques globales sur mon portefeuille (clients actifs, taux de graduation, revenus) et le temps passe estime par client**,
So that **je pilote mon activite avec des donnees concretes et je mesure la rentabilite de chaque client**.

**Acceptance Criteria :**

**Given** MiKL accede a la section statistiques du module CRM
**When** la page se charge
**Then** un dashboard de KPIs s'affiche avec les indicateurs suivants (FR80) :
- Nombre total de clients (avec repartition actifs / inactifs / suspendus)
- Repartition par type (Complet / Direct One / Ponctuel) sous forme de donut chart ou barres
- Nombre de clients Lab actifs
- Nombre de clients One actifs
- Taux de graduation Lab vers One (pourcentage, nombre total de graduations)
- Revenus recurrents mensuels estimes (MRR, si donnees facturation disponibles — sinon afficher "Module Facturation requis")
**And** les KPIs utilisent des cards avec sparklines ou indicateurs de tendance (composants Tremor)
**And** les donnees sont calculees cote serveur via Server Component (RSC) avec requete agregee Supabase
**And** un skeleton loader specifique aux stats s'affiche pendant le calcul

**Given** les statistiques sont affichees
**When** MiKL survole un KPI
**Then** un tooltip affiche le detail de calcul (ex: "12 clients Lab actifs sur 25 clients total")

**Given** MiKL consulte la section temps passe (FR81)
**When** la page se charge
**Then** une liste par client affiche le temps passe estime
**And** le temps est calcule a partir des activites loguees dans `activity_logs` : duree des visios, nombre de messages, nombre de validations Hub
**And** le calcul utilise des durees moyennes parametrables par type d'activite (ex: visio = duree reelle, message = 2 min, validation = 5 min)
**And** chaque ligne affiche : nom du client, type, temps total estime, derniere activite
**And** un tri par "plus de temps passe" est disponible

**Given** les statistiques sont chargees
**When** la page s'affiche
**Then** le chargement respecte NFR-P1 (< 2 secondes)

---

### Story 2.9a : Suspendre & reactiver un client

As a **MiKL (operateur)**,
I want **suspendre temporairement un client et le reactiver quand necessaire**,
So that **je peux gerer les situations ou un client doit etre temporairement desactive sans perdre ses donnees**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** les migrations sont executees
**Then** la colonne `archived_at` (TIMESTAMP nullable) est ajoutee a la table `clients`
**And** les statuts possibles pour un client sont : 'actif', 'suspendu', 'cloture' (via contrainte CHECK ou enum)

**Given** MiKL sur la fiche d'un client actif
**When** il clique sur "Suspendre le client" (FR89)
**Then** une boite de dialogue de confirmation s'affiche avec : raison de la suspension (optionnel), consequences listees ("Le client ne pourra plus acceder a son dashboard")
**And** si confirme, la Server Action `suspendClient()` met le statut a "suspendu"
**And** le middleware client bloque l'acces au dashboard pour ce client (verification du statut)
**And** un toast confirme "Client suspendu"
**And** une entree est creee dans `activity_logs` (type: 'client_suspended')
**And** le cache TanStack Query est invalide

**Given** MiKL sur la fiche d'un client suspendu
**When** il clique sur "Reactiver le client"
**Then** la Server Action `reactivateClient()` repasse le statut a "actif"
**And** le client retrouve l'acces a son dashboard avec toutes ses donnees intactes
**And** une entree est creee dans `activity_logs` (type: 'client_reactivated')

---

### Story 2.9b : Cloturer un client & archiver les donnees

As a **MiKL (operateur)**,
I want **cloturer definitivement un client avec archivage automatique de ses donnees**,
So that **le client est proprement desactive et ses donnees sont conservees en lecture seule**.

**Acceptance Criteria :**

**Given** MiKL sur la fiche d'un client
**When** il clique sur "Cloturer le client" (FR89)
**Then** une boite de dialogue de confirmation avec double validation s'affiche (saisir le nom du client pour confirmer)
**And** le message indique : "Cette action archivera toutes les donnees du client. Le client ne pourra plus se connecter."
**And** si confirme, la Server Action `closeClient()` met le statut a "cloture" et `archived_at` a la date courante (FR85)
**And** le client n'apparait plus dans la liste par defaut (filtre "Clotures" necessaire pour le voir)
**And** une entree est creee dans `activity_logs` (type: 'client_closed')

**Given** un client cloture avec des donnees archivees
**When** MiKL consulte la fiche d'un client cloture (via filtre "Clotures")
**Then** les donnees sont accessibles en lecture seule (tous les boutons d'edition sont desactives)
**And** un bandeau informe "Client cloture le {date}" avec un bouton "Reactiver" qui repasse le statut a "actif" et supprime le flag `archived_at`

---

### Story 2.9c : Upgrader un client Ponctuel vers Lab ou One

As a **MiKL (operateur)**,
I want **upgrader un client Ponctuel vers un parcours Lab ou un dashboard One**,
So that **je peux faire evoluer la relation client selon ses besoins**.

**Acceptance Criteria :**

**Given** MiKL sur la fiche d'un client Ponctuel
**When** il clique sur "Upgrader vers Lab" ou "Upgrader vers One" (FR90)
**Then** un dialog s'affiche avec : type cible (Lab ou One, preselectionne selon le bouton clique), configuration initiale selon le type :
- Lab : selection du template de parcours, etapes a activer
- One : selection des modules a activer, dashboard_type
**And** si confirme, la Server Action `upgradeClient()` met a jour : `client_type`, `client_configs` (dashboard_type, active_modules ou parcours_config)
**And** un toast confirme "Client upgrade vers Lab/One"
**And** une entree est creee dans `activity_logs` (type: 'client_upgraded')

---

### Story 2.10 : Alertes inactivite Lab & import clients CSV

As a **MiKL (operateur)**,
I want **etre alerte quand un client Lab est inactif depuis trop longtemps et pouvoir importer des clients en masse via CSV**,
So that **aucun client Lab ne tombe dans l'oubli et je peux migrer rapidement ma base clients existante**.

**Acceptance Criteria :**

**Given** le systeme de detection d'inactivite est configure
**When** un client Lab n'a eu aucune activite (login, message, soumission) depuis X jours (configurable par operateur, defaut: 7 jours) (FR84)
**Then** une notification est creee dans la table `notifications` a destination de MiKL
**And** la notification contient : nom du client, nombre de jours d'inactivite, derniere activite, lien vers la fiche client
**And** la detection est geree par une Supabase Edge Function declenchee par `pg_cron` (execution quotidienne)
**And** l'alerte n'est envoyee qu'une seule fois par periode d'inactivite (flag `inactivity_alert_sent` dans `client_configs` ou table dediee)
**And** si le client redevient actif, le flag est reinitialise pour permettre une future alerte

**Given** MiKL recoit une alerte d'inactivite
**When** il consulte l'alerte dans le centre de notifications
**Then** il peut : ouvrir la fiche client, envoyer un message au client via Chat, marquer "A traiter plus tard" (Story 2.6), ou ignorer l'alerte

**Given** MiKL veut importer des clients en masse (FR149)
**When** il accede a la fonctionnalite "Import CSV" dans le module CRM (bouton dans le header de la liste clients)
**Then** il peut uploader un fichier CSV
**And** un template CSV telecharger est fourni avec les colonnes attendues : nom (obligatoire), email (obligatoire), entreprise, telephone, secteur, type_client (Complet/Direct One/Ponctuel, defaut: Ponctuel)

**Given** MiKL uploade un fichier CSV
**When** le fichier est traite cote client (parsing)
**Then** le systeme valide chaque ligne : email au format valide, email unique (non present en base pour cet operateur), champs obligatoires presents
**And** un apercu s'affiche sous forme de tableau avec : nombre de lignes valides (vert), nombre de lignes en erreur (rouge), detail des erreurs par ligne
**And** MiKL peut exclure les lignes en erreur avant de confirmer

**Given** MiKL confirme l'import apres apercu
**When** la Server Action `importClientsCSV()` s'execute
**Then** les clients valides sont crees en batch (insertion multiple Supabase)
**And** chaque client recoit une `client_configs` par defaut (`['core-dashboard']`, dashboard_type selon type_client)
**And** un resume s'affiche : "X clients importes avec succes, Y ignores"
**And** le cache TanStack Query `['clients', operatorId]` est invalide
**And** une entree dans `activity_logs` trace l'import (type: 'csv_import', nombre de clients, date, operateur)

**Given** le fichier CSV depasse 500 lignes
**When** MiKL tente l'import
**Then** un message informe que l'import sera traite en arriere-plan (Supabase Edge Function)
**And** MiKL sera notifie quand l'import sera termine (notification in-app)

---

### Resume Epic 2 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 2.1 | Module CRM — Liste clients, filtres & recherche | FR3, FR106 |
| 2.2 | Creation & edition de fiche client | FR1, FR2 |
| 2.3 | Fiche client complete (vue detaillee multi-onglets) | FR4 |
| 2.4 | Assignation parcours Lab & gestion des acces | FR5, FR6 |
| 2.5 | Integration Cursor (ouverture dossier BMAD client) | FR7 |
| 2.6 | Notes privees, epinglage & "a traiter plus tard" | FR79, FR130, FR131 |
| 2.7 | Rappels personnels & calendrier deadlines | FR132, FR133 |
| 2.8 | Statistiques globales & temps passe par client | FR80, FR81 |
| 2.9a | Suspendre & reactiver un client | FR89 |
| 2.9b | Cloturer un client & archiver les donnees | FR85, FR89 |
| 2.9c | Upgrader un client Ponctuel vers Lab/One | FR90 |
| 2.10 | Alertes inactivite Lab & import clients CSV | FR84, FR149 |

**Toutes les 20 FRs de l'Epic 2 sont couvertes.**

---

## Epic 3 : Communication Temps Reel & Notifications — Stories detaillees

**Objectif :** MiKL et les clients communiquent en temps reel via chat asynchrone avec un systeme de notifications complet (email + in-app), indicateur de presence et support/FAQ.

**FRs couverts:** FR57, FR61, FR99, FR100, FR101, FR109, FR110, FR111, FR127, FR128, FR129

**NFRs pertinentes:** NFR-P2, NFR-P5, NFR-I4, NFR-I5, NFR-S7, NFR-R6, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

---

### Story 3.1 : Module Chat — Migration messages & messagerie temps reel MiKL-client

As a **client Foxeo (Lab ou One)**,
I want **echanger avec MiKL via un chat asynchrone en temps reel depuis mon dashboard**,
So that **je peux poser mes questions et recevoir des reponses directes de MiKL sans delai**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00005_messages.sql est executee
**Then** la table `messages` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), sender_type (TEXT CHECK IN ('client', 'operator') NOT NULL), content (TEXT NOT NULL), read_at (TIMESTAMP nullable), created_at (TIMESTAMP DEFAULT NOW())
**And** un index `idx_messages_client_id_created_at` est cree pour les requetes de conversation
**And** les policies RLS sont appliquees :
- `messages_select_owner` : un client ne voit que ses propres messages
- `messages_select_operator` : un operateur voit les messages de ses clients
- `messages_insert_authenticated` : client et operateur peuvent inserer des messages
**And** un test RLS `message-isolation.test.ts` verifie que le client A ne voit pas les messages du client B

**Given** le module Chat n'existe pas encore
**When** la story est completee
**Then** le module `packages/modules/chat/` est structure selon le pattern standard :
- `manifest.ts` avec id: `chat`, targets: `['hub', 'client-lab', 'client-one']`, requiredTables: `['messages']`
- `components/` : chat-window.tsx, chat-message.tsx, chat-input.tsx, chat-list.tsx
- `hooks/` : use-chat-messages.ts
- `actions/` : send-message.ts
- `types/` : chat.types.ts
- `index.ts` barrel export

**Given** un client authentifie accede au module Chat
**When** la fenetre de chat se charge
**Then** l'historique des messages MiKL-client s'affiche (ordonne chronologiquement, plus ancien en haut)
**And** les messages sont fetches via TanStack Query avec queryKey `['messages', clientId]`
**And** un skeleton loader s'affiche pendant le chargement
**And** les messages du client sont alignes a droite, ceux de MiKL a gauche
**And** chaque message affiche : contenu, heure, indicateur lu/non lu

**Given** le client saisit un message dans le champ de saisie
**When** il envoie le message (bouton ou Entree)
**Then** une Server Action `sendMessage()` cree le message dans la table `messages` avec sender_type='client'
**And** la reponse suit le pattern `{ data, error }`
**And** le message apparait immediatement dans la conversation (optimistic update TanStack Query)
**And** l'action repond en moins de 500ms (NFR-P2)

**Given** MiKL est sur le Hub et accede au Chat
**When** il selectionne un client dans la liste des conversations
**Then** la liste des conversations (chat-list.tsx) affiche tous les clients avec : dernier message, date, indicateur non lu
**And** la conversation selectionnee s'affiche dans la fenetre de chat
**And** MiKL peut envoyer un message avec sender_type='operator'

**Given** un nouveau message est envoye (par le client ou MiKL)
**When** l'autre partie a le chat ouvert
**Then** le message apparait en temps reel via Supabase Realtime (channel: `chat:room:{clientId}`)
**And** le Realtime trigger invalide le cache TanStack Query `['messages', clientId]` — pas de state local
**And** le message apparait en moins de 2 secondes apres l'envoi (NFR-P5)

**Given** un client envoie un message
**When** MiKL n'a pas le chat ouvert
**Then** le compteur de messages non lus s'incremente dans la sidebar du Hub (badge sur le module Chat)

---

### Story 3.2 : Module Notifications — Infrastructure in-app & temps reel

As a **utilisateur (MiKL ou client)**,
I want **recevoir des notifications in-app en temps reel pour les evenements importants (validations, messages, alertes)**,
So that **je suis informe immediatement de ce qui necessite mon attention**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00007_notifications.sql est executee
**Then** la table `notifications` est creee avec : id (UUID PK), recipient_type (TEXT CHECK IN ('client', 'operator') NOT NULL), recipient_id (UUID NOT NULL), type (TEXT NOT NULL — 'message', 'validation', 'alert', 'system', 'graduation', 'payment'), title (TEXT NOT NULL), body (TEXT), link (TEXT nullable — URL relative de redirection), read_at (TIMESTAMP nullable), created_at (TIMESTAMP DEFAULT NOW())
**And** un index `idx_notifications_recipient_created_at` est cree
**And** les policies RLS :
- `notifications_select_owner` : chaque utilisateur ne voit que ses propres notifications
- `notifications_update_owner` : chaque utilisateur ne peut marquer comme lues que ses propres notifications

**Given** le module Notifications n'existe pas encore
**When** la story est completee
**Then** le module `packages/modules/notifications/` est structure :
- `manifest.ts` avec id: `notifications`, targets: `['hub', 'client-lab', 'client-one']`, requiredTables: `['notifications']`
- `components/` : notification-center.tsx, notification-badge.tsx
- `hooks/` : use-notifications.ts
- `actions/` : mark-as-read.ts, create-notification.ts (Server Action utilitaire, appelee par d'autres modules)
- `types/` : notification.types.ts

**Given** un utilisateur est authentifie
**When** il voit le header du dashboard
**Then** un badge notification (notification-badge.tsx) affiche le nombre de notifications non lues
**And** les donnees sont fetches via TanStack Query avec queryKey `['notifications', recipientId, 'unread-count']`

**Given** un utilisateur clique sur le badge notification
**When** le centre de notifications s'ouvre (dropdown ou panneau lateral)
**Then** la liste des notifications s'affiche ordonnee de la plus recente a la plus ancienne
**And** chaque notification affiche : icone par type, titre, body (tronque), date relative (formatRelativeDate de @foxeo/utils)
**And** les notifications non lues sont visuellement distinguees (fond accent subtil)
**And** un bouton "Tout marquer comme lu" est disponible

**Given** un utilisateur clique sur une notification
**When** la notification a un lien de redirection
**Then** il est redirige vers la page concernee (ex: fiche client, validation Hub, chat)
**And** la notification est marquee comme lue automatiquement (Server Action `markAsRead()`)

**Given** un nouvel evenement genere une notification (ex: nouveau message, validation en attente)
**When** la notification est creee en base
**Then** elle apparait en temps reel via Supabase Realtime (channel: `client:notifications:{recipientId}`)
**And** le Realtime trigger invalide le cache TanStack Query `['notifications', recipientId, 'unread-count']`
**And** la notification apparait en moins de 2 secondes apres l'evenement (NFR-P5)
**And** un toast discret s'affiche brievement avec le titre de la notification (FR61)

---

### Story 3.3 : Notifications email transactionnelles

As a **utilisateur (MiKL ou client)**,
I want **recevoir les notifications importantes par email en plus de l'in-app**,
So that **je suis informe meme quand je ne suis pas connecte a la plateforme**.

**Acceptance Criteria :**

**Given** l'infrastructure d'envoi d'emails n'existe pas encore
**When** la story est completee
**Then** un service d'envoi email est configure via Supabase Edge Functions (ou Resend/Postmark selon le choix technique)
**And** les templates email sont definis dans un dossier `supabase/functions/emails/` ou equivalent
**And** le service gere le retry en cas d'echec d'envoi (NFR-I5)

**Given** les types de notifications email sont definis
**When** un evenement declencheur survient
**Then** un email est envoye pour les types suivants (FR99) :
- `validation` : "Votre brief a ete valide/refuse" (vers client)
- `message` : "Nouveau message de MiKL" (vers client) / "Nouveau message de {client}" (vers MiKL)
- `alert` : "Client Lab inactif depuis X jours" (vers MiKL)
- `graduation` : "Felicitations ! Votre espace One est pret" (vers client)
- `payment` : "Echec de paiement" (vers client + MiKL)
**And** chaque email est envoye en moins de 10 secondes apres l'evenement (NFR-I4)

**Given** un email transactionnel est envoye
**When** le contenu est genere
**Then** l'email utilise un template HTML responsive au branding Foxeo
**And** le template inclut : logo Foxeo, titre, corps, bouton CTA (lien vers la plateforme), pied de page avec lien de desabonnement
**And** les emails sont envoyes depuis une adresse noreply@foxeo.io (ou similaire)

**Given** la double delivery est active (email + in-app)
**When** un evenement declencheur survient
**Then** une notification in-app EST TOUJOURS creee (Story 3.2)
**And** un email est envoye EN PLUS si les preferences du destinataire l'autorisent (defaut: oui pour tous les types)
**And** la notification in-app ne depend pas du succes de l'email (envoi asynchrone)

**Given** le service email externe est indisponible
**When** un email echoue apres retries
**Then** l'erreur est loguee dans `activity_logs` avec le contexte (destinataire, type, erreur)
**And** la notification in-app reste fonctionnelle (mode degrade, NFR-R6)
**And** MiKL est alerte si le taux d'echec depasse un seuil

---

### Story 3.4 : Preferences de notification (client & MiKL)

As a **client Foxeo**,
I want **configurer mes preferences de notification pour choisir quels types de notifications je recois et par quel canal**,
So that **je ne suis pas submerge par des notifications non pertinentes**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la structure de preferences est mise en place
**Then** la table `notifications` est etendue (ou une table `notification_preferences` est creee) avec : id (UUID PK), user_type (TEXT CHECK IN ('client', 'operator')), user_id (UUID NOT NULL), notification_type (TEXT NOT NULL), channel_email (BOOLEAN DEFAULT true), channel_inapp (BOOLEAN DEFAULT true), created_at, updated_at
**And** les policies RLS assurent que chaque utilisateur ne gere que ses propres preferences

**Given** un client accede a ses parametres de notification (FR100)
**When** il ouvre la page de preferences
**Then** il voit une liste de types de notifications avec pour chacun un toggle email et un toggle in-app :
- Messages de MiKL : email [on/off] | in-app [on/off]
- Validations Hub : email [on/off] | in-app [on/off]
- Alertes systeme : email [on/off] | in-app [on/off]
- Graduation : email [on/off] | in-app [on/off]
**And** les toggles in-app "systeme" et "graduation" ne peuvent pas etre desactives (notifications critiques)
**And** les preferences par defaut sont : tout active

**Given** un client modifie une preference
**When** il change un toggle
**Then** la modification est sauvegardee immediatement via Server Action `updateNotificationPrefs()`
**And** la reponse suit le pattern `{ data, error }`
**And** un toast discret confirme "Preferences mises a jour"

**Given** MiKL veut configurer les notifications pour un client specifique (FR101)
**When** il accede a la fiche client (onglet Informations ou section dediee)
**Then** il peut forcer certains types de notifications pour ce client (ex: activer les alertes meme si le client les a desactivees — cas critique)
**And** les overrides MiKL sont prioritaires sur les preferences client

**Given** un evenement genere une notification
**When** le systeme verifie les preferences avant envoi
**Then** la notification in-app est creee seulement si channel_inapp=true pour ce type
**And** l'email est envoye seulement si channel_email=true pour ce type
**And** les overrides MiKL sont verifies en premier

---

### Story 3.5 : Indicateur de presence en ligne

As a **utilisateur (MiKL ou client)**,
I want **voir si mon interlocuteur est actuellement en ligne**,
So that **je sais si je peux attendre une reponse rapide ou non**.

**Acceptance Criteria :**

**Given** le systeme de presence n'existe pas encore
**When** la story est completee
**Then** le hook `use-chat-presence.ts` dans le module Chat utilise Supabase Realtime Presence API
**And** le channel de presence suit le pattern : `presence:operator:{operatorId}` (FR129)

**Given** un utilisateur est authentifie et a une page ouverte
**When** il est connecte a la plateforme
**Then** son statut est synchronise via Supabase Realtime Presence avec : user_id, user_type ('client' | 'operator'), online_at (timestamp)
**And** le statut est automatiquement retire quand l'utilisateur ferme la page ou perd la connexion

**Given** un client ouvre le Chat MiKL
**When** le chat se charge
**Then** un indicateur visuel affiche le statut de MiKL : en ligne (point vert), hors ligne (point gris)
**And** si MiKL est hors ligne, un message discret indique "MiKL vous repondra des que possible"

**Given** MiKL ouvre le Chat dans le Hub
**When** il consulte la liste des conversations
**Then** chaque client affiche son indicateur de presence (en ligne / hors ligne)
**And** MiKL peut trier la liste par "En ligne d'abord"

**Given** MiKL consulte la liste des clients dans le CRM
**When** la liste se charge
**Then** un point de presence est affiche a cote du nom de chaque client (vert si en ligne, gris sinon)
**And** cette information est mise a jour en temps reel sans rechargement

**Given** un utilisateur perd temporairement sa connexion
**When** la connexion Realtime Presence est interrompue
**Then** le statut passe a hors ligne apres un timeout de 30 secondes (pas instantanement pour eviter les faux negatifs)
**And** quand la connexion revient, le statut repasse automatiquement a en ligne

---

### Story 3.6 : Gestion des conflits de modification concurrente

As a **utilisateur (MiKL ou client)**,
I want **etre prevenu si quelqu'un d'autre a modifie les memes donnees que moi pendant que je les editais**,
So that **je ne perds pas mon travail et les modifications ne s'ecrasent pas silencieusement**.

**Acceptance Criteria :**

**Given** le mecanisme de verrouillage optimiste n'existe pas encore
**When** la story est completee
**Then** un helper `optimisticLock()` est disponible dans @foxeo/utils
**And** le pattern est base sur le champ `updated_at` existant sur les tables clients, client_configs, documents

**Given** MiKL ouvre un formulaire d'edition (ex: fiche client, document)
**When** le formulaire se charge
**Then** le `updated_at` de l'enregistrement est stocke comme reference (version du formulaire)

**Given** MiKL soumet une modification
**When** la Server Action execute l'update
**Then** la requete Supabase inclut un filtre `.eq('updated_at', originalUpdatedAt)` (FR128)
**And** si le `updated_at` en base correspond : la modification s'applique normalement
**And** si le `updated_at` en base differe (quelqu'un d'autre a modifie entre-temps) : la requete retourne 0 rows affected

**Given** un conflit de modification est detecte
**When** la Server Action detecte 0 rows affected
**Then** la reponse retourne `{ data: null, error: { message: 'Les donnees ont ete modifiees par un autre utilisateur. Veuillez recharger.', code: 'CONFLICT' } }`
**And** le composant affiche un dialog de conflit avec les options :
- "Recharger les donnees" : recharge la version actuelle (perd les modifications locales)
- "Forcer ma version" : re-soumet avec le nouveau `updated_at` (ecrase l'autre modification)
**And** le choix par defaut est "Recharger les donnees" (principe de prudence)

**Given** les formulaires critiques (fiche client, config modules)
**When** ils sont ouverts simultanement par MiKL sur deux onglets
**Then** le mecanisme de conflit fonctionne entre onglets du meme utilisateur
**And** un message explicatif aide MiKL a comprendre la situation

---

### Story 3.7 : Support client — Signalement de problemes & aide en ligne

As a **client Foxeo**,
I want **signaler un probleme ou bug depuis l'interface et acceder a une aide en ligne / FAQ**,
So that **je peux obtenir de l'aide rapidement sans quitter la plateforme**.

**Acceptance Criteria :**

**Given** le systeme de signalement n'existe pas encore
**When** la story est completee
**Then** la table `support_tickets` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), type (TEXT CHECK IN ('bug', 'question', 'suggestion') DEFAULT 'bug'), subject (TEXT NOT NULL), description (TEXT NOT NULL), screenshot_url (TEXT nullable), status (TEXT CHECK IN ('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open'), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** les policies RLS :
- `support_tickets_select_owner` : un client ne voit que ses propres tickets
- `support_tickets_select_operator` : un operateur voit les tickets de ses clients
- `support_tickets_insert_authenticated` : un client peut creer un ticket

**Given** un client rencontre un probleme
**When** il clique sur le bouton "Signaler un probleme" (accessible depuis le menu utilisateur ou footer de chaque page) (FR109)
**Then** un dialog s'ouvre avec : type (Bug / Question / Suggestion), sujet (obligatoire), description (obligatoire), capture d'ecran (optionnel — upload vers Supabase Storage)
**And** le formulaire utilise react-hook-form avec validation Zod

**Given** le client soumet un signalement
**When** la Server Action `createSupportTicket()` s'execute
**Then** le ticket est cree dans `support_tickets`
**And** une notification est envoyee a MiKL (type: 'alert', titre: "Nouveau signalement de {client}")
**And** un toast confirme "Votre signalement a ete envoye. MiKL vous repondra rapidement."
**And** le client peut voir le statut de ses signalements dans une section "Mes signalements"

**Given** MiKL accede au Hub
**When** il consulte les problemes signales (FR110)
**Then** une vue dans le module CRM ou un onglet dedie affiche la liste des tickets : client, type, sujet, statut, date
**And** les tickets sont triables par statut (priorite aux 'open') et par date
**And** MiKL peut changer le statut d'un ticket (open → in_progress → resolved → closed)
**And** MiKL peut repondre directement au client via le Chat (lien rapide)

**Given** un client cherche de l'aide
**When** il clique sur "Aide" ou "FAQ" (accessible depuis le menu utilisateur) (FR111)
**Then** une page ou un panneau lateral affiche une FAQ structuree par categories :
- Premiers pas (comment fonctionne mon espace, qu'est-ce qu'Elio)
- Mon parcours Lab (comment avancer, comment soumettre)
- Mon espace One (mes modules, comment demander une evolution)
- Compte & securite (mot de passe, sessions, donnees)
- Contact MiKL (comment joindre MiKL, delais de reponse)
**And** une barre de recherche permet de filtrer les questions
**And** les reponses sont stockees en dur dans le code (fichier JSON ou composant) — pas de CMS en V1
**And** un lien "Contacter MiKL" et "Signaler un probleme" sont accessibles en bas de la FAQ

---

### Resume Epic 3 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 3.1 | Module Chat — messagerie temps reel MiKL-client | FR57 |
| 3.2 | Module Notifications — infrastructure in-app & temps reel | FR61, FR127 |
| 3.3 | Notifications email transactionnelles | FR99 |
| 3.4 | Preferences de notification (client & MiKL) | FR100, FR101 |
| 3.5 | Indicateur de presence en ligne | FR129 |
| 3.6 | Gestion des conflits de modification concurrente | FR128 |
| 3.7 | Support client — signalement de problemes & aide en ligne | FR109, FR110, FR111 |

**Toutes les 11 FRs de l'Epic 3 sont couvertes.**

---

## Epic 4 : Gestion Documentaire — Stories detaillees

**Objectif :** Clients et MiKL peuvent gerer, visualiser, partager et exporter des documents avec viewer HTML, PDF, recherche, autosave et organisation en dossiers.

**FRs couverts:** FR62, FR63, FR64, FR65, FR86, FR107, FR135, FR136, FR144, FR145, FR146, FR150

**NFRs pertinentes:** NFR-P1, NFR-P6, NFR-SC3, NFR-S7, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

---

### Story 4.1 : Module Documents — Migration, structure & upload avec validation

As a **utilisateur (MiKL ou client)**,
I want **uploader des documents sur la plateforme avec validation automatique du type et de la taille**,
So that **seuls les fichiers autorises et de taille raisonnable sont stockes sur la plateforme**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00006_documents.sql est executee
**Then** la table `documents` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), name (TEXT NOT NULL), file_path (TEXT NOT NULL — chemin Supabase Storage), file_type (TEXT NOT NULL), file_size (INTEGER NOT NULL — en octets), folder_id (UUID nullable FK self-referencing ou table separee), tags (TEXT[] DEFAULT ARRAY[]::TEXT[]), visibility (TEXT CHECK IN ('private', 'shared') DEFAULT 'private'), uploaded_by (TEXT CHECK IN ('client', 'operator') NOT NULL), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** les policies RLS :
- `documents_select_owner` : un client ne voit que ses documents partages (visibility='shared') et ceux qu'il a uploades
- `documents_select_operator` : un operateur voit tous les documents de ses clients
- `documents_insert_authenticated` : client et operateur peuvent inserer
- `documents_update_operator` : seul l'operateur peut modifier (visibility, folder, tags)

**Given** le module Documents n'existe pas encore
**When** la story est completee
**Then** le module `packages/modules/documents/` est structure :
- `manifest.ts` avec id: `documents`, targets: `['hub', 'client-lab', 'client-one']`, requiredTables: `['documents']`
- `components/` : document-list.tsx, document-upload.tsx
- `hooks/` : use-documents.ts
- `actions/` : upload-document.ts
- `types/` : document.types.ts
- `index.ts` barrel export

**Given** un utilisateur (client ou MiKL) veut uploader un document
**When** il utilise le composant document-upload.tsx (drag & drop ou bouton parcourir)
**Then** le systeme valide AVANT l'upload :
- **Type de fichier** (FR145) : seuls les types autorises sont acceptes (PDF, DOCX, XLSX, PNG, JPG, SVG, MD, TXT, CSV)
- **Taille de fichier** (FR144) : maximum 10 Mo par fichier (constante MAX_FILE_SIZE dans @foxeo/utils)
**And** si le fichier est invalide, un message d'erreur clair s'affiche ("Type de fichier non autorise" ou "Fichier trop volumineux (max 10 Mo)")

**Given** un fichier valide est selectionne
**When** l'upload demarre
**Then** le fichier est uploade vers Supabase Storage dans le bucket `documents/{operator_id}/{client_id}/`
**And** une barre de progression s'affiche pendant l'upload
**And** une Server Action `uploadDocument()` cree l'enregistrement dans la table `documents` avec les metadonnees
**And** la reponse suit le pattern `{ data, error }`
**And** un toast confirme "Document uploade avec succes"
**And** le cache TanStack Query `['documents', clientId]` est invalide

**Given** la liste des documents est affichee
**When** l'utilisateur la consulte
**Then** chaque document affiche : nom, type (icone), taille formatee, date, tag de visibilite (prive/partage)
**And** la liste utilise le composant DataTable de @foxeo/ui
**And** un skeleton loader s'affiche pendant le chargement

---

### Story 4.2 : Visualisation documents (viewer HTML) & telechargement PDF

As a **client Foxeo**,
I want **consulter mes documents directement dans le dashboard (rendu HTML) et les telecharger en PDF**,
So that **j'accede a mes livrables sans quitter la plateforme et je peux les conserver hors ligne**.

**Acceptance Criteria :**

**Given** un client clique sur un document dans la liste
**When** le viewer se charge (document-viewer.tsx)
**Then** le document est affiche en rendu HTML dans un panneau ou une page dediee (FR62)
**And** les formats supportes pour le rendu HTML sont : Markdown (rendu HTML natif), PDF (viewer embarque via iframe ou composant), images (PNG, JPG, SVG — affichage direct)
**And** les fichiers non visualisables (DOCX, XLSX, CSV) affichent un apercu des metadonnees avec un bouton "Telecharger"
**And** un skeleton loader s'affiche pendant le chargement du document
**And** le viewer est responsive (fonctionne sur mobile >=320px)

**Given** un client consulte un document
**When** il clique sur "Telecharger en PDF" (FR63)
**Then** si le document est deja un PDF, le fichier est telecharge directement via signed URL Supabase Storage
**And** si le document est un Markdown, un PDF est genere cote serveur (via Server Action `generatePDF()`) et telecharge
**And** la generation PDF prend moins de 5 secondes (NFR-P6)
**And** le PDF genere conserve le branding Foxeo (header avec logo, footer avec date)

**Given** MiKL consulte un document dans le Hub
**When** le viewer se charge
**Then** les memes fonctionnalites sont disponibles
**And** MiKL peut voir un badge "Visible par le client" ou "Non visible" sur chaque document

**Given** le document est un fichier volumineux
**When** le viewer se charge
**Then** le fichier est telecharge via signed URL Supabase Storage (URL temporaire, expiration 1h)
**And** le signed URL est genere cote serveur (pas d'exposition des chemins internes)

---

### Story 4.3 : Partage de documents MiKL-client & visibilite

As a **MiKL (operateur)**,
I want **partager un document avec un client et controler sa visibilite (visible ou non visible)**,
So that **je decide precisement ce que le client peut voir dans son espace documents**.

**Acceptance Criteria :**

**Given** MiKL sur le Hub, dans le module Documents ou dans la fiche client (onglet Documents)
**When** il uploade un document pour un client
**Then** le document est cree avec `visibility: 'private'` par defaut et `uploaded_by: 'operator'`
**And** le document n'est PAS visible par le client tant que MiKL ne le partage pas (FR64)

**Given** MiKL consulte un document d'un client
**When** il clique sur "Partager avec le client" (toggle ou bouton)
**Then** une Server Action `shareDocument()` met a jour `visibility: 'shared'`
**And** une notification est envoyee au client ("MiKL a partage un nouveau document avec vous")
**And** un toast confirme "Document partage avec le client"
**And** le cache TanStack Query est invalide

**Given** MiKL veut retirer le partage d'un document
**When** il clique sur "Retirer le partage"
**Then** une boite de dialogue de confirmation s'affiche ("Le client ne pourra plus voir ce document")
**And** si confirme, `visibility` repasse a `'private'`
**And** le document disparait de la vue client (mais pas supprime)
**And** un toast confirme "Partage retire"

**Given** MiKL veut partager plusieurs documents a la fois
**When** il selectionne plusieurs documents dans la liste (checkboxes)
**Then** un bouton "Partager la selection" permet de partager en batch
**And** une Server Action `shareDocumentsBatch()` met a jour tous les documents selectionnes

**Given** un client consulte ses documents
**When** la liste se charge
**Then** il ne voit que les documents avec `visibility: 'shared'` ET les documents qu'il a lui-meme uploades
**And** la RLS garantit ce filtrage au niveau base de donnees

---

### Story 4.4 : Organisation en dossiers & recherche dans les documents

As a **client Foxeo**,
I want **organiser mes documents en dossiers et rechercher rapidement dans mes documents**,
So that **je retrouve facilement un document specifique meme avec beaucoup de fichiers**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration est executee
**Then** la table `document_folders` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), name (TEXT NOT NULL), parent_id (UUID nullable FK document_folders — pour les sous-dossiers), created_at (TIMESTAMP DEFAULT NOW())
**And** la colonne `folder_id` dans `documents` reference `document_folders(id)`
**And** les policies RLS :
- `document_folders_select_owner` : un client ne voit que ses dossiers
- `document_folders_select_operator` : un operateur voit les dossiers de ses clients

**Given** un client accede a ses documents
**When** la page se charge
**Then** une arborescence de dossiers s'affiche a gauche (folder-tree.tsx) avec les dossiers du client (FR146)
**And** les documents sans dossier apparaissent dans un dossier virtuel "Non classes"
**And** un clic sur un dossier filtre la liste de documents a droite
**And** le client peut creer un nouveau dossier (nom obligatoire)
**And** le client peut renommer ou supprimer un dossier vide

**Given** un client veut deplacer un document dans un dossier
**When** il utilise le drag & drop ou le menu contextuel "Deplacer vers..."
**Then** le `folder_id` du document est mis a jour via Server Action `moveDocument()`
**And** un toast confirme "Document deplace dans {nom_dossier}"

**Given** MiKL consulte les documents d'un client dans le Hub
**When** il visualise la structure
**Then** il voit la meme arborescence de dossiers que le client
**And** MiKL peut creer des dossiers et deplacer des documents pour le client

**Given** un utilisateur veut rechercher dans ses documents (FR107)
**When** il saisit du texte dans le champ de recherche
**Then** la recherche porte sur : nom du document, tags, type de fichier
**And** les resultats se filtrent en temps reel
**And** les resultats apparaissent en moins de 1 seconde (NFR-P4)
**And** la recherche fonctionne a travers tous les dossiers (pas limitee au dossier actif)

---

### Story 4.5 : Synchronisation documents vers dossier BMAD local

As a **MiKL (operateur)**,
I want **que les documents valides soient automatiquement synchronises vers le dossier BMAD local du client**,
So that **Orpheus (dans Cursor) a toujours acces aux derniers documents valides sans manipulation manuelle**.

**Acceptance Criteria :**

**Given** un document est valide (via le Validation Hub ou directement par MiKL)
**When** le statut du document passe a "valide"
**Then** le systeme declenche une synchronisation vers le dossier BMAD local du client (FR65, FR86)
**And** le chemin de destination suit la convention : `{bmad_base_path}/clients/{client_slug}/documents/{document_name}`

**Given** l'architecture de synchronisation
**When** le mecanisme est mis en place
**Then** la synchronisation est geree par une Supabase Edge Function declenchee par un trigger sur la table `documents` (event: UPDATE, condition: visibility='shared' ET status='validated')
**And** la Edge Function telecharge le fichier depuis Supabase Storage et l'ecrit dans le dossier BMAD (si accessible — ex: via API filesystem, mount partage, ou notification a un agent local)

**Given** le dossier BMAD local n'est pas accessible depuis le serveur (cas courant — DD externe de MiKL)
**When** la synchronisation ne peut pas se faire automatiquement
**Then** un mecanisme alternatif est prevu :
- Option 1 : Un bouton "Sync vers BMAD" dans le Hub telecharge un ZIP des documents valides du client
- Option 2 : Un script local (CLI) que MiKL peut executer pour pull les documents valides depuis Supabase Storage
**And** le statut de synchronisation est trace : `last_synced_at` dans la fiche client ou les metadonnees du document

**Given** un document deja synchronise est mis a jour
**When** une nouvelle version est uploadee
**Then** l'ancienne version locale est remplacee par la nouvelle
**And** un log de synchronisation est cree dans `activity_logs`

---

### Story 4.6 : Autosave brouillons & undo actions recentes

As a **utilisateur (MiKL ou client)**,
I want **que les formulaires longs sauvegardent automatiquement en brouillon et que je puisse annuler certaines actions recentes**,
So that **je ne perds jamais mon travail en cours et je peux corriger une erreur rapidement**.

**Acceptance Criteria :**

**Given** un utilisateur remplit un formulaire long (creation client, edition de document, signalement, brief Lab)
**When** il commence a saisir des donnees
**Then** le formulaire sauvegarde automatiquement en brouillon toutes les 30 secondes (FR135)
**And** le brouillon est stocke dans le localStorage du navigateur (cle : `draft:{formType}:{entityId}`)
**And** un indicateur discret affiche "Brouillon sauvegarde" avec l'heure de la derniere sauvegarde
**And** Zustand n'est PAS utilise pour ca (localStorage direct via react-hook-form watch + effet)

**Given** un utilisateur revient sur un formulaire avec un brouillon existant
**When** le formulaire se charge
**Then** un bandeau s'affiche : "Un brouillon a ete trouve (sauvegarde le {date}). Reprendre ? [Oui] [Non, recommencer]"
**And** si "Oui" : le formulaire est prerempli avec les donnees du brouillon
**And** si "Non" : le brouillon est supprime et le formulaire est vide

**Given** un utilisateur soumet avec succes un formulaire
**When** la soumission reussit
**Then** le brouillon correspondant est automatiquement supprime du localStorage

**Given** un utilisateur effectue une action reversible (ex: supprimer un document, retirer un partage, supprimer une note)
**When** l'action est executee
**Then** un toast s'affiche avec un bouton "Annuler" pendant 5 secondes (FR136)
**And** si l'utilisateur clique sur "Annuler" dans le delai : l'action est inversee (Server Action undo ou re-creation)
**And** si le delai expire : l'action est definitive

**Given** le pattern d'undo est implemente
**When** il est utilise
**Then** un helper `useUndoableAction()` dans `packages/modules/documents/hooks/` encapsule la logique :
- Execute l'action immediatement (optimistic)
- Affiche le toast avec timer
- Inverse l'action si "Annuler" clique
- Confirme l'action apres expiration du timer
**And** les actions supportant l'undo sont : suppression de document, retrait de partage, suppression de note privee, suppression de rappel

---

### Story 4.7 : Export documents en formats standards

As a **utilisateur (MiKL ou client)**,
I want **exporter mes documents et donnees en formats standards (CSV, JSON, PDF)**,
So that **je peux utiliser mes donnees en dehors de la plateforme et rester conforme aux obligations de portabilite**.

**Acceptance Criteria :**

**Given** un client ou MiKL consulte une liste de documents
**When** il clique sur "Exporter" (FR150)
**Then** un menu propose les formats d'export : PDF (document individuel), CSV (liste des documents avec metadonnees), JSON (liste structuree)
**And** le format par defaut est PDF pour un document unique, CSV pour une liste

**Given** un utilisateur exporte un document individuel en PDF
**When** l'export est declenche
**Then** le fichier PDF est telecharge directement (si deja en PDF) ou genere cote serveur (si Markdown/HTML)
**And** le PDF inclut le branding Foxeo (header logo, footer date + "Genere depuis Foxeo")
**And** l'export prend moins de 5 secondes (NFR-P6)

**Given** MiKL exporte la liste des documents d'un client en CSV
**When** l'export est declenche
**Then** un fichier CSV est genere cote serveur via Server Action `exportDocumentsCSV()`
**And** le CSV contient les colonnes : nom, type, taille, dossier, visibilite, date_creation, date_modification
**And** l'encodage est UTF-8 avec BOM pour compatibilite Excel
**And** le fichier est telecharge automatiquement

**Given** MiKL exporte les donnees en JSON
**When** l'export est declenche
**Then** un fichier JSON structure est genere avec les metadonnees completes de chaque document
**And** le JSON suit le format camelCase (convention API)
**And** le fichier est telecharge automatiquement

**Given** un export est en cours
**When** le traitement prend du temps (> 1 seconde)
**Then** un indicateur de progression s'affiche
**And** l'utilisateur peut continuer a naviguer pendant l'export (generation en arriere-plan cote serveur)

---

### Resume Epic 4 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 4.1 | Module Documents — migration, structure & upload avec validation | FR144, FR145 |
| 4.2 | Visualisation documents (viewer HTML) & telechargement PDF | FR62, FR63 |
| 4.3 | Partage de documents MiKL-client & visibilite | FR64 |
| 4.4 | Organisation en dossiers & recherche dans les documents | FR146, FR107 |
| 4.5 | Synchronisation documents vers dossier BMAD local | FR65, FR86 |
| 4.6 | Autosave brouillons & undo actions recentes | FR135, FR136 |
| 4.7 | Export documents en formats standards | FR150 |

**Toutes les 12 FRs de l'Epic 4 sont couvertes.**

---

## Epic 5 : Visioconference & Onboarding Prospect — Stories detaillees

**Objectif :** MiKL conduit des visios enregistrees/transcrites avec prospects/clients via OpenVidu, et les nouveaux prospects vivent un parcours d'onboarding fluide (Cal.com, salle d'attente, post-visio).

**FRs couverts:** FR58, FR59, FR60, FR70, FR71, FR72

**NFRs pertinentes:** NFR-P1, NFR-I2, NFR-I5, NFR-S7, NFR-R6, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Services self-hosted requis:** OpenVidu (visio + enregistrement + transcription), Cal.com (prise de RDV)

---

### Story 5.1 : Module Visio — Migration meetings & salle de visio OpenVidu

As a **MiKL (operateur)**,
I want **lancer des visios avec mes clients et prospects via OpenVidu integre dans le Hub**,
So that **je conduis mes rendez-vous directement depuis Foxeo sans outil externe**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00008_meetings.sql est executee
**Then** la table `meetings` est creee avec : id (UUID PK), client_id (FK clients nullable — null pour les prospects pas encore clients), operator_id (FK operators NOT NULL), prospect_name (TEXT nullable), prospect_email (TEXT nullable), status (TEXT CHECK IN ('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled'), scheduled_at (TIMESTAMP WITH TIME ZONE), started_at (TIMESTAMP nullable), ended_at (TIMESTAMP nullable), duration_seconds (INTEGER nullable), openvidu_room_id (TEXT nullable), recording_url (TEXT nullable), transcript_url (TEXT nullable), notes (TEXT nullable), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** un index `idx_meetings_operator_id_scheduled_at` est cree
**And** les policies RLS :
- `meetings_select_owner` : un client ne voit que ses propres meetings
- `meetings_select_operator` : un operateur voit tous ses meetings
- `meetings_insert_operator` : seul l'operateur peut creer un meeting
- `meetings_update_operator` : seul l'operateur peut modifier un meeting

**Given** le module Visio n'existe pas encore
**When** la story est completee
**Then** le module `packages/modules/visio/` est structure :
- `manifest.ts` avec id: `visio`, targets: `['hub', 'client-lab', 'client-one']`, requiredTables: `['meetings']`
- `components/` : visio-room.tsx, visio-controls.tsx
- `hooks/` : use-visio-room.ts
- `actions/` : create-room.ts
- `types/` : visio.types.ts
- `index.ts` barrel export

**Given** MiKL veut lancer une visio
**When** il cree une salle depuis le Hub (bouton "Nouvelle visio" ou depuis la fiche client)
**Then** une Server Action `createRoom()` cree une session OpenVidu via l'API serveur
**And** un enregistrement `meetings` est cree avec le `openvidu_room_id`
**And** un lien d'acces est genere pour le client/prospect
**And** MiKL est redirige vers la salle de visio (visio-room.tsx)

**Given** MiKL est dans la salle de visio
**When** la visio est en cours
**Then** les controles video s'affichent (visio-controls.tsx) : camera on/off, micro on/off, partage d'ecran, quitter
**And** le flux video utilise le SDK OpenVidu cote client (WebRTC)
**And** le statut du meeting passe a 'in_progress' et `started_at` est enregistre

**Given** un client/prospect rejoint la visio
**When** il clique sur le lien d'acces
**Then** il rejoint la salle sans avoir besoin de compte (acces par token temporaire OpenVidu)
**And** les deux participants se voient et s'entendent
**And** la connexion est en HTTPS/TLS (NFR-S1)

**Given** la visio se termine
**When** MiKL ou le dernier participant quitte
**Then** le statut du meeting passe a 'completed'
**And** `ended_at` et `duration_seconds` sont calcules et enregistres
**And** une entree est creee dans `activity_logs`

**Given** le service OpenVidu est indisponible
**When** la creation de salle echoue
**Then** un message explicite s'affiche ("Le service de visioconference est temporairement indisponible") (NFR-I5, NFR-R6)
**And** MiKL peut reessayer ou planifier la visio plus tard

---

### Story 5.2 : Enregistrement visio, transcription automatique & historique

As a **client Foxeo**,
I want **consulter l'historique de mes visios avec MiKL et acceder aux transcriptions**,
So that **je peux revoir les points discutes et retrouver les decisions prises**.

**Acceptance Criteria :**

**Given** MiKL lance une visio
**When** la visio demarre
**Then** l'enregistrement audio/video demarre automatiquement via OpenVidu Egress (Server Action `startRecording()` — Hub uniquement)
**And** un indicateur visuel informe tous les participants que la visio est enregistree
**And** le consentement a l'enregistrement a ete donne par le prospect en salle d'attente (Story 5.4)

**Given** la visio se termine et l'enregistrement est disponible
**When** OpenVidu Egress notifie via webhook (`/api/webhooks/openvidu/route.ts`)
**Then** le fichier d'enregistrement est stocke dans Supabase Storage (bucket `recordings/{operator_id}/{meeting_id}/`)
**And** le champ `recording_url` du meeting est mis a jour avec le chemin Storage

**Given** un enregistrement est disponible
**When** la transcription automatique est declenchee
**Then** une Supabase Edge Function traite le fichier audio via un service de transcription (Deepgram ou equivalent)
**And** la transcription est stockee dans Supabase Storage (format texte/JSON)
**And** le champ `transcript_url` du meeting est mis a jour
**And** le traitement se fait en arriere-plan (pas de blocage utilisateur)
**And** le timeout est de 60 secondes max (NFR-I2)

**Given** un client accede au module Visio (FR58)
**When** il consulte l'historique de ses visios
**Then** il voit la liste de ses meetings avec : date, duree, statut (avec/sans enregistrement, avec/sans transcription)
**And** les donnees sont fetches via TanStack Query avec queryKey `['meetings', clientId]`
**And** la liste est ordonnee du plus recent au plus ancien
**And** un skeleton loader s'affiche pendant le chargement

**Given** un client clique sur un meeting avec transcription (FR59)
**When** le viewer de transcription se charge (transcription-viewer.tsx)
**Then** la transcription s'affiche en texte formatte avec horodatage si disponible
**And** si un enregistrement existe, un player audio/video integre permet de reecouter
**And** une option "Telecharger la transcription" (PDF ou TXT) est disponible

**Given** MiKL consulte l'historique dans le Hub
**When** il voit la liste des meetings
**Then** il peut filtrer par client, par date, par statut (avec/sans transcription)
**And** il peut ajouter des notes post-visio sur chaque meeting (champ `notes`)

---

### Story 5.3 : Demande de visio, prise de RDV Cal.com & salle d'attente

As a **client Foxeo**,
I want **demander une visio avec MiKL et prendre rendez-vous facilement**,
So that **je peux planifier un echange video quand j'en ai besoin**.

**Acceptance Criteria :**

**Given** un client authentifie sur son dashboard
**When** il clique sur "Demander une visio" (FR60)
**Then** un composant Cal.com embarque (iframe ou SDK) s'affiche avec les creneaux disponibles de MiKL
**And** le client peut selectionner un creneau et confirmer la reservation
**And** les informations du client (nom, email) sont pre-remplies depuis sa fiche

**Given** un prospect (pas encore client) veut prendre RDV
**When** il accede au lien Cal.com Foxeo (via QR code, LinkedIn, site web)
**Then** il voit les creneaux disponibles de MiKL sur la page Cal.com
**And** il saisit les informations legeres : prenom, nom, email, societe (optionnel)
**And** il recoit un email de confirmation avec le lien de la visio

**Given** un RDV est confirme via Cal.com
**When** le webhook Cal.com est recu (`/api/webhooks/cal-com/route.ts`)
**Then** un enregistrement `meetings` est cree dans Supabase avec : scheduled_at, prospect_name/email (si prospect) ou client_id (si client existant), status='scheduled'
**And** une notification est envoyee a MiKL ("Nouveau RDV planifie avec {nom}")
**And** si le prospect est un client existant (match par email), le client_id est associe automatiquement

**Given** un prospect arrive 5 minutes avant le RDV
**When** il clique sur le lien de la visio
**Then** il accede a la salle d'attente (page publique dans apps/hub ou page dediee)
**And** la salle d'attente affiche un formulaire complementaire :
- Telephone (obligatoire)
- SIRET si entreprise (obligatoire, avec auto-complete via API INSEE Sirene)
- OU Ville si pas d'entreprise (obligatoire)
- Consentement enregistrement (obligatoire, avec explication du benefice : "Vous recevrez la transcription")
**And** le message "C'est la seule fois qu'on vous le demande" rassure le prospect
**And** une fois le formulaire valide, le prospect rejoint la salle de visio OpenVidu

**Given** le formulaire de salle d'attente est soumis
**When** le SIRET est saisi
**Then** l'API INSEE Sirene est appelee pour auto-completer : raison sociale, adresse, code NAF/APE
**And** en cas d'echec de l'API INSEE (timeout, indisponibilite), le prospect peut saisir manuellement les informations (NFR-I5)

---

### Story 5.4 : Flux post-visio & onboarding prospect

As a **MiKL (operateur)**,
I want **qualifier un prospect apres une visio avec un statut et un email adapte, et creer automatiquement sa fiche client**,
So that **chaque prospect est traite rapidement et integre dans mon CRM sans double saisie**.

**Acceptance Criteria :**

**Given** une visio se termine avec un prospect
**When** MiKL revient sur le Hub
**Then** un ecran post-visio s'affiche automatiquement (ou via notification) avec :
- Resume genere par Elio Hub (modifiable par MiKL) — si le module Elio est disponible, sinon champ resume vide a remplir
- Informations du prospect (pre-remplies depuis la salle d'attente : nom, email, telephone, societe, SIRET)
- Choix du statut prospect (obligatoire) : Chaud, Tiede, Froid, Non

**Given** MiKL selectionne un statut prospect
**When** il valide le formulaire post-visio
**Then** le comportement s'adapte au statut choisi :

| Statut | Email envoye | Relance auto | Action CRM |
|--------|-------------|-------------|------------|
| Chaud | Resume + lien creation espace | Non | → Fiche client creee (type selon decision MiKL) |
| Tiede | Resume commercial | Auto J+3, J+7 (configurable) | → Prospect chaud dans CRM |
| Froid | Resume + "A disposition" | Non | → Prospect froid dans CRM |
| Non | Remerciement + transcription | Non | → Prospect ferme dans CRM |

**And** un email adapte au statut est genere (apercu modifiable avant envoi)
**And** MiKL peut choisir : "Envoyer maintenant", "Programmer", "Standby"

**Given** le statut est "Chaud"
**When** MiKL valide
**Then** une fiche client est creee automatiquement dans la table `clients` avec les informations du prospect (nom, email, entreprise, telephone, secteur deduit du code NAF)
**And** MiKL choisit le type de client (Complet / Direct One) et le parcours (Lab ou One direct)
**And** le client recoit un email avec ses identifiants de connexion
**And** le meeting est associe au client_id nouvellement cree

**Given** le statut est "Tiede"
**When** la relance automatique est activee
**Then** un rappel est cree dans la table `reminders` (Story 2.7) aux dates configurees (J+3, J+7)
**And** un email de relance est envoye automatiquement aux dates prevues (via Edge Function cron)
**And** MiKL peut desactiver la relance a tout moment

**Given** le meeting post-visio est traite
**When** le flux est termine
**Then** une entree est creee dans `activity_logs` (type: 'prospect_qualified', details: statut choisi)
**And** le meeting est mis a jour avec les notes de MiKL

---

### Story 5.5 : Ecran de bienvenue premiere connexion & tutoriel Lab

As a **nouveau client Lab**,
I want **voir un ecran de bienvenue a ma premiere connexion et acceder a un tutoriel de prise en main**,
So that **je comprends immediatement comment fonctionne mon espace et par ou commencer**.

**Acceptance Criteria :**

**Given** un nouveau client Lab se connecte pour la premiere fois (FR70)
**When** le dashboard client se charge
**Then** une modale de bienvenue s'affiche (welcome-screen.tsx dans core-dashboard) avec :
- Message d'accueil personnalise avec le prenom du client
- Presentation d'Elio ("Voici Elio, votre assistant IA disponible 24/7")
- Explication du fonctionnement de l'espace Lab (3-4 points cles en visuel)
- Bouton "C'est parti !" pour fermer la modale
**And** la premiere connexion est detectee via un flag `first_login` dans `client_configs` ou via l'absence d'activite dans `activity_logs`
**And** la modale ne s'affiche qu'une seule fois (le flag est mis a jour apres affichage)
**And** l'animation est fluide avec la palette Lab (Violet/Purple sur fond #020402)

**Given** le client a ferme la modale de bienvenue
**When** il veut revoir les explications
**Then** un lien "Tutoriel" est accessible dans le menu utilisateur ou la FAQ (FR71)

**Given** le client accede au tutoriel (FR71)
**When** la page ou le panneau tutorial se charge
**Then** un guide pas-a-pas s'affiche avec les etapes cles :
1. "Voici votre parcours" — explication du parcours Lab et des etapes
2. "Discutez avec Elio" — comment utiliser le chat IA
3. "Soumettez vos briefs" — comment envoyer un travail a MiKL pour validation
4. "Echangez avec MiKL" — comment utiliser le chat direct
5. "Consultez vos documents" — ou trouver les livrables
**And** chaque etape est illustree (screenshot ou illustration)
**And** un bouton "Passer" permet de sauter le tutoriel
**And** le tutoriel est stocke en dur dans le code (composant React, pas de CMS V1)

---

### Story 5.6 : Ecran de graduation Lab vers One

As a **client Foxeo qui termine son parcours Lab**,
I want **voir un ecran de celebration avec le recapitulatif de mon parcours Lab lors de ma graduation vers One**,
So that **je ressens la progression accomplie et je suis motive pour utiliser mon nouvel espace**.

**Acceptance Criteria :**

**Given** un client Lab est gradue vers One par MiKL (Epic 9)
**When** le client se connecte a son dashboard apres la graduation (FR72)
**Then** un ecran de graduation s'affiche (welcome-screen.tsx mode graduation dans core-dashboard) avec :
- Animation de celebration (confetti, transition de couleur subtile Lab→One)
- Message "Felicitations {prenom} ! Votre espace professionnel est pret"
- Recapitulatif du parcours Lab : nombre d'etapes completees, briefs valides, duree du parcours
- Apercu de ce qui est nouveau dans One : modules actives, fonctionnalites supplementaires
- Bouton "Decouvrir mon espace One"
**And** la transition visuelle passe progressivement de la palette Lab (Violet/Purple) a la palette One (Orange vif + Bleu-gris) — pas de changement brutal

**Given** le client ferme l'ecran de graduation
**When** il arrive sur le dashboard One
**Then** ses donnees Lab sont accessibles via l'onglet "Historique Lab" (module historique-lab, Epic 10)
**And** Elio One l'accueille avec un message contextualise qui fait reference a son parcours Lab
**And** le flag de graduation est enregistre pour ne plus afficher l'ecran (une seule fois)

**Given** MiKL dans le Hub
**When** il consulte la fiche du client gradue
**Then** l'historique affiche l'evenement de graduation avec la date et les metriques (duree Lab, etapes completees)

---

### Resume Epic 5 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 5.1 | Module Visio — migration meetings & salle de visio OpenVidu | — (fondation technique visio) |
| 5.2 | Enregistrement, transcription & historique visios | FR58, FR59 |
| 5.3 | Demande de visio, prise de RDV Cal.com & salle d'attente | FR60 |
| 5.4 | Flux post-visio & onboarding prospect | — (flux UX onboarding) |
| 5.5 | Ecran de bienvenue premiere connexion & tutoriel Lab | FR70, FR71 |
| 5.6 | Ecran de graduation Lab vers One | FR72 |

**Toutes les 6 FRs de l'Epic 5 sont couvertes.** Les stories 5.1 et 5.4 couvrent les fondations techniques et le flux onboarding prospect defini dans la specification UX.

---

## Epic 6 : Parcours Lab — Accompagnement Creation — Stories detaillees

**Objectif :** Les clients en creation suivent un parcours structure guide par Elio Lab, qui pose les questions, genere et soumet les briefs automatiquement au Validation Hub.

**FRs couverts:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37

**NFRs pertinentes:** NFR-P1, NFR-P3, NFR-I2, NFR-S7, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** Cet epic cree le module parcours-lab (parcours, progression, briefs) ET le comportement specifique d'Elio Lab (conversation guidee, generation de briefs, soumission auto). L'infrastructure Elio partagee (historique persistant, indicateur de reflexion, feedback) sera consolidee dans l'Epic 8. L'interface de chat Elio Lab creee ici sera enrichie en Epic 8.

---

### Story 6.1 : Module Parcours Lab — Migration, structure, vue parcours & progression

As a **client Lab**,
I want **voir mon parcours assigne avec les etapes actives et ma progression**,
So that **je sais exactement ou j'en suis et ce qu'il me reste a accomplir**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00009_parcours.sql est executee
**Then** la table `parcours_templates` est creee avec : id (UUID PK), operator_id (FK operators NOT NULL), name (TEXT NOT NULL), description (TEXT), steps (JSONB NOT NULL — tableau d'objets {id, title, description, order, default_active}), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** la table `parcours` est creee avec : id (UUID PK), client_id (FK clients NOT NULL UNIQUE), operator_id (FK operators NOT NULL), template_id (FK parcours_templates NOT NULL), active_steps (JSONB NOT NULL — tableau d'objets {step_id, status: 'pending'|'in_progress'|'completed'|'skipped', started_at, completed_at}), current_step_id (TEXT nullable), status (TEXT CHECK IN ('not_started', 'in_progress', 'completed', 'suspended', 'abandoned') DEFAULT 'not_started'), started_at (TIMESTAMP nullable), completed_at (TIMESTAMP nullable), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** les policies RLS :
- `parcours_select_owner` : un client ne voit que son propre parcours
- `parcours_select_operator` : un operateur voit les parcours de ses clients
- `parcours_templates_select_operator` : un operateur voit ses templates

**Given** le module Parcours Lab n'existe pas encore
**When** la story est completee
**Then** le module `packages/modules/parcours-lab/` est structure :
- `manifest.ts` avec id: `parcours-lab`, targets: `['client-lab']`, requiredTables: `['parcours', 'parcours_templates']`
- `components/` : parcours-progress.tsx, etape-detail.tsx
- `hooks/` : use-parcours.ts
- `actions/` : (vide pour l'instant, les actions viennent dans les stories suivantes)
- `types/` : parcours.types.ts
- `index.ts` barrel export

**Given** un client Lab authentifie accede a son dashboard
**When** il accede au module Parcours Lab (`/modules/parcours-lab`)
**Then** la page affiche son parcours assigne avec (FR26) :
- Titre du parcours (issu du template)
- Liste des etapes actives avec leur statut (a faire, en cours, terminee)
- L'etape courante est mise en evidence visuellement
**And** les donnees sont fetches via TanStack Query avec queryKey `['parcours', clientId]`
**And** un skeleton loader s'affiche pendant le chargement
**And** la densite est `spacious` (palette Lab Violet/Purple sur fond #020402)

**Given** le parcours du client est charge
**When** la progression est calculee (FR27)
**Then** une barre de progression globale s'affiche en haut : "Etape X sur Y — Z% complete"
**And** chaque etape affiche un indicateur individuel (icone check, en cours, a faire)
**And** la progression est calculee : (etapes completees / etapes actives totales) * 100
**And** quand une etape est completee, une micro-celebration s'affiche (animation subtile, message encourageant)

---

### Story 6.2 : Consultation des briefs par etape & teasing Foxeo One

As a **client Lab**,
I want **consulter les briefs produits a chaque etape et voir un apercu motivant de Foxeo One**,
So that **je retrouve facilement mes livrables et je suis motive pour avancer vers la graduation**.

**Acceptance Criteria :**

**Given** un client Lab consulte son parcours
**When** il clique sur une etape completee ou en cours (FR28)
**Then** le detail de l'etape s'affiche (etape-detail.tsx) avec :
- Titre et description de l'etape
- Statut actuel (en cours, terminee)
- Brief(s) produit(s) a cette etape (lien vers les documents du module Documents)
- Date de debut et de completion (si terminee)
**And** les briefs sont recuperes depuis la table `documents` filtres par client_id et tag d'etape
**And** un clic sur un brief ouvre le viewer HTML (Story 4.2)

**Given** un client Lab n'a pas encore produit de brief pour une etape
**When** il consulte le detail de l'etape
**Then** un etat vide s'affiche avec le message "Discutez avec Elio pour commencer cette etape" et un CTA vers le chat Elio Lab

**Given** un client Lab navigue dans son espace
**When** il consulte la section "Teasing Foxeo One" (FR31)
**Then** un encart ou une section dediee presente Foxeo One de maniere attractive :
- Titre "Votre futur espace professionnel"
- 3-4 fonctionnalites cles de One (modules, outils metier, autonomie)
- Visuels teasing (screenshots ou illustrations style One)
- Message motivant lie a la progression ("Plus que X etapes avant votre graduation !")
**And** le composant one-teasing.tsx est utilise
**And** le teasing est affiche en bas de la page parcours ou dans un onglet dedie
**And** le contenu est statique (composant React, pas de donnees dynamiques)

---

### Story 6.3 : Soumission de brief pour validation & notifications

As a **client Lab**,
I want **soumettre un brief a MiKL pour validation et etre notifie du resultat**,
So that **je sais quand mon travail est valide et que je peux passer a l'etape suivante**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00010_validation_requests.sql est executee
**Then** la table `validation_requests` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), parcours_id (FK parcours nullable), step_id (TEXT nullable), type (TEXT CHECK IN ('brief_lab', 'evolution_one') NOT NULL), title (TEXT NOT NULL), content (TEXT NOT NULL), document_ids (UUID[] DEFAULT ARRAY[]::UUID[]), status (TEXT CHECK IN ('pending', 'approved', 'rejected', 'needs_clarification') DEFAULT 'pending'), reviewer_comment (TEXT nullable), submitted_at (TIMESTAMP DEFAULT NOW()), reviewed_at (TIMESTAMP nullable), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** les policies RLS :
- `validation_requests_select_owner` : un client ne voit que ses propres soumissions
- `validation_requests_select_operator` : un operateur voit les soumissions de ses clients
- `validation_requests_insert_authenticated` : un client peut soumettre

**Given** un client Lab a travaille sur un brief (via Elio ou manuellement)
**When** il clique sur "Soumettre a MiKL" depuis le detail de l'etape (brief-submit.tsx) (FR29)
**Then** un formulaire de soumission s'affiche avec :
- Titre du brief (pre-rempli avec le nom de l'etape)
- Contenu/resume (pre-rempli si genere par Elio, editable)
- Documents joints (selection parmi les documents de l'etape)
- Bouton "Soumettre pour validation"
**And** le formulaire utilise react-hook-form avec validation Zod

**Given** le client soumet le brief
**When** la Server Action `submitBrief()` s'execute
**Then** un enregistrement est cree dans `validation_requests` avec type='brief_lab', parcours_id et step_id
**And** le statut de l'etape dans `parcours.active_steps` passe a 'in_progress' (si pas deja)
**And** une notification est envoyee a MiKL (type: 'validation', titre: "Nouveau brief a valider de {client}")
**And** un toast confirme "Brief soumis pour validation"
**And** le cache TanStack Query est invalide

**Given** MiKL valide ou refuse le brief (via Validation Hub — Epic 7)
**When** le statut de la validation_request change
**Then** une notification est envoyee au client (FR30) :
- Si approuve : "Votre brief '{titre}' a ete valide par MiKL !" avec lien vers l'etape
- Si refuse : "MiKL a demande des modifications sur '{titre}'" avec le commentaire de MiKL
- Si demande de precisions : "MiKL a une question sur '{titre}'" avec le commentaire
**And** la notification apparait en temps reel (Supabase Realtime)

**Given** un brief est valide (status='approved')
**When** le statut est mis a jour
**Then** l'etape correspondante dans `parcours.active_steps` passe a 'completed'
**And** le `current_step_id` avance a l'etape suivante (si elle existe)
**And** la barre de progression se met a jour
**And** une micro-celebration s'affiche au client lors de sa prochaine visite

**Given** toutes les etapes du parcours sont completees
**When** la derniere etape est validee
**Then** le statut du parcours passe a 'completed'
**And** une notification speciale est envoyee au client ("Felicitations ! Votre parcours est termine !")
**And** MiKL est notifie ("Le client {nom} a termine son parcours Lab — pret pour la graduation")

---

> **Prerequis :** Story 8.1 (architecture Elio unifiee) doit etre implementee avant les Stories 6.4-6.6. Les stories ci-dessous construisent les fonctionnalites Lab-specifiques sur le module unifie `modules/elio/` cree en Story 8.1.

### Story 6.4 : Elio Lab — Conversation guidee & adaptation au profil communication

As a **client Lab**,
I want **converser avec Elio Lab qui me pose les bonnes questions selon mon etape active et adapte son ton a mon profil**,
So that **je suis guide naturellement dans mon parcours sans me sentir perdu**.

**Acceptance Criteria :**

**Given** les besoins en donnees de cette story
**When** la migration 00011_elio_conversations.sql est executee
**Then** la table `elio_conversations` est creee avec : id (UUID PK), client_id (FK clients NOT NULL), operator_id (FK operators NOT NULL), dashboard_type (TEXT CHECK IN ('lab', 'one', 'hub') NOT NULL), title (TEXT DEFAULT 'Nouvelle conversation'), created_at (TIMESTAMP DEFAULT NOW()), updated_at (TIMESTAMP DEFAULT NOW())
**And** la table `elio_messages` est creee avec : id (UUID PK), conversation_id (FK elio_conversations NOT NULL), role (TEXT CHECK IN ('user', 'assistant', 'system') NOT NULL), content (TEXT NOT NULL), metadata (JSONB nullable — pour les briefs generes, actions, etc.), created_at (TIMESTAMP DEFAULT NOW())
**And** les policies RLS :
- `elio_conversations_select_owner` : un client ne voit que ses propres conversations
- `elio_messages_select_owner` : un client ne voit que les messages de ses conversations
- MiKL n'a PAS acces aux conversations Elio (conformement a la spec UX)

**Given** un client Lab accede au chat Elio
**When** la conversation se charge (FR32)
**Then** l'interface de chat Elio s'affiche avec :
- Historique de la conversation en cours
- Champ de saisie pour ecrire
- Avatar Elio distinctif (different du Chat MiKL)
- Indicateur que c'est un chat IA ("Elio — Votre assistant IA")
**And** la conversation est liee a l'etape active du parcours
**And** les donnees sont fetches via TanStack Query avec queryKey `['elio-conversation', clientId, conversationId]`
**And** la palette Lab (Violet/Purple) est utilisee pour l'interface du chat

**Given** le client demarre une nouvelle conversation ou reprend la conversation active
**When** Elio Lab repond (FR33)
**Then** Elio pose des questions guidees en fonction de l'etape active du parcours :
- Les questions sont definies dans la configuration du parcours template (champ `steps[].elio_prompts` dans parcours_templates)
- Elio suit une sequence de decouverte : contexte → besoin → contraintes → solution
- Elio ne pose qu'une question a la fois et attend la reponse
**And** le premier token de reponse d'Elio apparait en moins de 3 secondes (NFR-P3)
**And** un indicateur "Elio reflechit..." s'affiche pendant la generation

**Given** le profil de communication du client est defini (FR35)
**When** Elio Lab genere ses reponses
**Then** Elio adapte son ton selon le profil stocke dans `client_configs.elio_config.communication_profile` :
- Tutoiement ou vouvoiement selon la preference
- Longueur des reponses (concis vs detaille)
- Style (professionnel, decontracte, pedagogique)
**And** si le profil n'est pas encore defini, Elio utilise un ton neutre et professionnel par defaut

**Given** Elio Lab ne sait pas repondre a une question du client
**When** la confiance de la reponse est basse
**Then** Elio propose l'escalade vers MiKL : "Je ne suis pas sur de pouvoir t'aider la-dessus. Tu veux que je contacte MiKL ?"
**And** si le client accepte, une notification est envoyee a MiKL avec le contexte de la conversation (question + historique recent)
**And** MiKL repond via le Chat direct (module Chat — Epic 3)

**Given** l'integration LLM pour Elio Lab
**When** un message est envoye
**Then** la Server Action `sendToElio()` appelle le LLM (DeepSeek ou equivalent) via Supabase Edge Function
**And** le system prompt inclut : role Elio Lab, etape active, profil communication client, contexte du parcours
**And** le timeout est de 60 secondes (NFR-I2)
**And** en cas d'echec, un message explicite s'affiche ("Elio est temporairement indisponible, reessayez dans quelques instants")

---

### Story 6.5 : Elio Lab — Generation de briefs & soumission automatique au Validation Hub

As a **client Lab**,
I want **qu'Elio Lab genere automatiquement les briefs a partir de mes reponses et les soumette au Validation Hub**,
So that **je n'ai pas a rediger moi-meme et mes idees sont structurees professionnellement**.

**Acceptance Criteria :**

**Given** le client a repondu aux questions guidees d'Elio Lab pour une etape
**When** Elio Lab determine que suffisamment d'informations ont ete collectees (FR34)
**Then** Elio Lab genere un brief structure a partir des reponses du client :
- Le brief suit un format defini par etape dans le template de parcours
- Le brief est genere via appel LLM avec un prompt specifique de structuration
- Le brief est sauvegarde comme document dans la table `documents` (type: 'brief', tag: etape_id)
**And** Elio Lab presente le brief au client dans le chat : "Voici le brief que j'ai prepare pour toi. Tu veux le revoir avant de l'envoyer a MiKL ?"
**And** le brief genere est affiche dans le chat avec un rendu Markdown propre
**And** le client peut demander des modifications ("Change la partie sur...", "Ajoute...")

**Given** le client approuve le brief genere
**When** il confirme l'envoi ("Oui, envoie-le a MiKL" ou clic sur bouton "Soumettre")
**Then** Elio Lab soumet automatiquement le brief au Validation Hub (FR36) :
- Un enregistrement `validation_requests` est cree avec type='brief_lab', contenu du brief, document_ids lies
- Le statut de l'etape dans le parcours passe a 'in_progress'
- Une notification est envoyee a MiKL
**And** Elio Lab confirme dans le chat : "Brief envoye a MiKL ! Tu seras notifie quand il aura valide."
**And** un toast confirme "Brief soumis pour validation"

**Given** le client n'approuve pas le brief
**When** il demande des modifications
**Then** Elio Lab edite le brief en fonction des retours du client
**And** le processus de validation par le client reprend (boucle edition → approbation)
**And** le document brief en base est mis a jour (pas de duplication)

**Given** le client veut soumettre un brief manuellement (sans Elio)
**When** il utilise le composant brief-submit.tsx (Story 6.3)
**Then** la soumission manuelle fonctionne independamment d'Elio
**And** Elio Lab est informe de la soumission manuelle et adapte sa conversation en consequence

---

### Story 6.6 : Elio Lab — Configuration Orpheus & personnalisation agent

As a **MiKL (operateur)**,
I want **qu'Elio Lab recoive et applique la configuration generee par Orpheus pour chaque client**,
So that **chaque client a un Elio Lab personnalise en fonction de son profil et de son projet**.

**Acceptance Criteria :**

**Given** Orpheus (dans Cursor) a genere une configuration Elio pour un client (FR37)
**When** MiKL injecte la config dans la plateforme
**Then** la configuration est stockee dans `client_configs.elio_config` avec la structure suivante :
```json
{
  "communication_profile": {
    "tone": "decontracte",
    "formality": "tu",
    "response_length": "concis",
    "style_notes": "Utiliser des metaphores sportives"
  },
  "parcours_context": {
    "business_type": "coach sportif",
    "key_challenges": ["acquisition clients", "differenciation"],
    "recommended_approach": "focus personal branding"
  },
  "custom_prompts": {
    "greeting": "Salut {prenom} ! Pret a bosser sur ton projet aujourd'hui ?",
    "step_overrides": {}
  }
}
```
**And** la config est validee avec un schema Zod avant sauvegarde

**Given** MiKL veut injecter ou modifier la config Elio d'un client
**When** il accede a la fiche client dans le Hub (section "Configuration Elio")
**Then** un formulaire permet de :
- Coller un JSON de configuration (genere par Orpheus)
- Editer les champs individuellement via un formulaire structure
- Voir un apercu de la personnalisation (message d'accueil, ton)
**And** la validation du schema s'execute avant sauvegarde
**And** un toast confirme "Configuration Elio mise a jour"

**Given** la config Elio est mise a jour pour un client
**When** le client ouvre son chat Elio Lab
**Then** Elio Lab utilise immediatement la nouvelle configuration :
- Le ton et le style sont adaptes selon `communication_profile`
- Le contexte metier est integre dans les questions guidees via `parcours_context`
- Les prompts custom sont appliques si definis dans `custom_prompts`
**And** le changement est transparent pour le client (pas de notification, pas de coupure)

**Given** aucune config Elio n'existe pour un client
**When** le client utilise Elio Lab
**Then** une configuration par defaut est utilisee :
- Ton professionnel, vouvoiement
- Reponses de longueur moyenne
- Questions guidees standard du template de parcours
**And** la config par defaut est definie dans le code (constante DEFAULT_ELIO_CONFIG dans @foxeo/utils)

**Given** l'historique des configs Elio est necessaire
**When** MiKL modifie une config
**Then** l'ancienne version est archivee (insert dans une table `elio_config_history` ou via le trigger updated_at + versionning JSON)
**And** MiKL peut consulter l'historique des modifications de config

---

### Resume Epic 6 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 6.1 | Module Parcours Lab — migration, vue parcours & progression | FR26, FR27 |
| 6.2 | Consultation des briefs par etape & teasing One | FR28, FR31 |
| 6.3 | Soumission de brief pour validation & notifications | FR29, FR30 |
| 6.4 | Elio Lab — conversation guidee & adaptation profil | FR32, FR33, FR35 |
| 6.5 | Elio Lab — generation de briefs & soumission auto | FR34, FR36 |
| 6.6 | Elio Lab — configuration Orpheus & personnalisation | FR37 |

**Toutes les 12 FRs de l'Epic 6 sont couvertes.**

---

## Epic 7 : Validation Hub — Stories detaillees

**Objectif :** MiKL examine, valide ou refuse les soumissions clients (briefs Lab, evolutions One) via un workflow structure avec contexte complet, choix d'actions de traitement et notifications automatiques au client.

**FRs couverts:** FR8, FR9, FR10, FR11, FR12, FR13, FR14

**NFRs pertinentes:** NFR-P1, NFR-P2, NFR-P5, NFR-S7, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** La table `validation_requests` et ses policies RLS ont ete creees dans Story 6.3 (migration 00010_validation_requests.sql). Cet epic construit le module `modules/validation-hub/` cote Hub (targets: ['hub']) avec les composants, hooks, server actions et types necessaires. L'infrastructure de notifications (table `notifications`, Supabase Realtime) provient de l'Epic 3. L'Epic 7 cree les Server Actions qui declenchent les changements de statut et les notifications associees.

---

### Story 7.1 : Module Validation Hub — Structure, types & file d'attente des demandes

As a **MiKL (operateur)**,
I want **voir la liste des demandes en attente de validation avec des filtres et une vue claire des priorites**,
So that **je peux traiter efficacement les soumissions de mes clients sans en oublier**.

**Acceptance Criteria :**

**Given** le module Validation Hub n'existe pas encore
**When** le module est cree
**Then** la structure suivante est en place :
```
modules/validation-hub/
  index.ts                    # Export public du module
  manifest.ts                 # { id: 'validation-hub', name: 'Validation Hub', targets: ['hub'], dependencies: ['crm', 'notifications'] }
  components/
    validation-queue.tsx      # File d'attente des demandes
  hooks/
    use-validation-queue.ts   # Hook TanStack Query
  actions/
    (vide pour l'instant)
  types/
    validation.types.ts       # Types TypeScript
```
**And** le manifest est enregistre dans le module registry (DB + registre local)
**And** le module est accessible depuis la navigation sidebar du Hub

**Given** les types du Validation Hub
**When** validation.types.ts est cree
**Then** les types suivants sont definis :
```typescript
type ValidationRequestType = 'brief_lab' | 'evolution_one'
type ValidationRequestStatus = 'pending' | 'approved' | 'rejected' | 'needs_clarification'

type ValidationRequest = {
  id: string
  clientId: string
  operatorId: string
  parcoursId: string | null
  stepId: string | null
  type: ValidationRequestType
  title: string
  content: string
  documentIds: string[]
  status: ValidationRequestStatus
  reviewerComment: string | null
  submittedAt: string
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  // Relations jointes
  client?: ClientSummary
}

type ClientSummary = {
  id: string
  name: string
  company: string | null
  clientType: string
  avatarUrl: string | null
}

type ValidationQueueFilters = {
  status: ValidationRequestStatus | 'all'
  type: ValidationRequestType | 'all'
  sortBy: 'submitted_at' | 'client_name'
  sortOrder: 'asc' | 'desc'
}
```
**And** les types sont exportes depuis @foxeo/types si le pattern du projet l'exige, sinon depuis le module local

**Given** le hook use-validation-queue est cree
**When** il est utilise dans un composant
**Then** il expose :
- `requests`: liste des ValidationRequest avec les donnees client jointes
- `filters` / `setFilters`: gestion des filtres actifs
- `isLoading`, `error`: etats de chargement
- `pendingCount`: nombre de demandes en attente (pour badge navigation)
**And** la requete Supabase joint `validation_requests` avec `clients` (select client: clients(id, name, company, client_type, avatar_url))
**And** le hook utilise TanStack Query avec une queryKey `['validation-requests', filters]`
**And** le staleTime est configure a 30 secondes (les demandes peuvent arriver a tout moment)

**Given** MiKL accede au module Validation Hub (FR8)
**When** la page se charge
**Then** le composant `validation-queue.tsx` affiche :
- Un header "Validation Hub" avec le compteur de demandes en attente
- Des filtres : statut (Tous, En attente, Approuve, Refuse, Precisions demandees), type (Tous, Brief Lab, Evolution One)
- La liste des demandes sous forme de cartes avec pour chaque demande :
  - Avatar + nom du client + entreprise
  - Type de demande (badge colore : "Brief Lab" en terracotta, "Evolution One" en orange)
  - Titre de la demande
  - Date de soumission (format relatif : "il y a 2h", "hier")
  - Statut actuel (badge : pending=jaune, approved=vert, rejected=rouge, needs_clarification=bleu)
**And** les demandes sont triees par defaut : en attente en premier, puis par date de soumission (les plus anciennes en haut)
**And** la page se charge en moins de 2 secondes (NFR-P1)
**And** le design suit le theme "Minimal Futuriste" dark mode du Hub

**Given** il n'y a aucune demande en attente
**When** MiKL ouvre le Validation Hub
**Then** un etat vide s'affiche avec un message "Aucune demande en attente — tout est a jour !" et une icone appropriee

**Given** MiKL clique sur une demande dans la file
**When** la navigation s'effectue
**Then** il est redirige vers la page de detail de la demande (route : `/modules/validation-hub/[requestId]`)
**And** la transition est fluide (< 500ms, NFR-P2)

---

### Story 7.2 : Vue detaillee d'une demande avec contexte complet

As a **MiKL (operateur)**,
I want **consulter le contexte complet d'une demande de validation (besoin, historique client, priorite, documents joints)**,
So that **je peux prendre une decision eclairee sans avoir a chercher les informations ailleurs**.

**Acceptance Criteria :**

**Given** MiKL clique sur une demande dans la file d'attente (Story 7.1)
**When** la page de detail s'affiche (request-detail.tsx) (FR9)
**Then** la vue est organisee en sections claires :

**Section 1 — En-tete de la demande :**
- Titre de la demande
- Badge type (Brief Lab / Evolution One)
- Badge statut actuel
- Date de soumission (format complet)
- Bouton retour vers la file d'attente

**Section 2 — Informations client :**
- Avatar, nom, entreprise du client
- Type de client (Complet, Direct One, Ponctuel)
- Lien "Voir la fiche client" qui ouvre le CRM (module crm, Epic 2)
- Si type='brief_lab' : etape du parcours Lab associee (nom + numero)

**Section 3 — Contenu de la demande :**
- Le besoin exprime (champ `content` de validation_requests)
- Les documents joints (liste cliquable, ouvre le document via le module documents, Epic 4)
- Si Elio a pre-qualifie : contexte collecte (questions/reponses, priorite estimee)

**Section 4 — Historique pertinent :**
- Dernieres demandes du meme client (3 max, avec statut)
- Derniers messages chat echanges avec ce client (3 max, resumes)
- Si brief Lab : progression du parcours (barre de progression, etape actuelle)

**And** chaque section utilise un composant Card avec le design system du Hub
**And** la page est responsive (colonne unique sur mobile, 2 colonnes sur desktop)
**And** les donnees sont chargees via TanStack Query avec les jointures necessaires

**Given** la demande a un historique d'echanges (statut='needs_clarification' avec des allers-retours)
**When** MiKL consulte le detail
**Then** une section "Echanges" affiche la chronologie des actions :
- "[date] MiKL a demande des precisions : {commentaire}"
- "[date] Le client a re-soumis avec : {nouveau contenu}"
**And** les echanges sont affiches en ordre chronologique

**Given** le contexte est charge
**When** MiKL a lu le detail
**Then** les boutons d'action sont visibles en bas de page (zone fixe sticky) :
- "Valider" (vert)
- "Refuser" (rouge)
- "Demander des precisions" (bleu)
- "Actions de traitement" (dropdown, gris)
**And** les boutons sont desactives si le statut n'est pas 'pending' ou 'needs_clarification' (sauf pour les actions de traitement qui restent actives sur 'approved')

---

### Story 7.3 : Validation & refus de demande avec commentaire

As a **MiKL (operateur)**,
I want **valider ou refuser une demande avec un commentaire optionnel (validation) ou obligatoire (refus)**,
So that **le client sait clairement si son travail est accepte ou ce qu'il doit modifier**.

**Acceptance Criteria :**

**Given** MiKL consulte une demande en statut 'pending' ou 'needs_clarification' (Story 7.2)
**When** il clique sur "Valider" (FR10)
**Then** une modale de confirmation s'affiche avec :
- Resume de la demande (titre, client, type)
- Champ commentaire optionnel (textarea, placeholder: "Commentaire pour le client (optionnel)")
- Boutons "Confirmer la validation" / "Annuler"

**Given** MiKL confirme la validation
**When** la Server Action `approveRequest(requestId, comment?)` s'execute (approve-request.ts)
**Then** les operations suivantes sont effectuees dans une transaction Supabase :
1. `validation_requests.status` → 'approved'
2. `validation_requests.reviewer_comment` → commentaire (si fourni)
3. `validation_requests.reviewed_at` → NOW()
4. Si type='brief_lab' ET parcours_id + step_id non null :
   - L'etape correspondante dans `parcours.active_steps` passe a 'completed' (avec `completed_at: NOW()`)
   - Le `current_step_id` avance a l'etape suivante active (si elle existe)
   - Si c'etait la derniere etape : `parcours.status` → 'completed', `parcours.completed_at` → NOW()
5. Une notification est creee pour le client (FR14) : type='validation', titre="Votre demande '{titre}' a ete validee !", body=commentaire si present, link="/modules/parcours-lab" (si brief_lab)
**And** l'action repond en moins de 500ms (NFR-P2)
**And** un toast confirme "Demande validee avec succes"
**And** le cache TanStack Query est invalide pour ['validation-requests'] ET ['parcours', clientId] (si applicable)
**And** MiKL est redirige vers la file d'attente

**Given** MiKL clique sur "Refuser" (FR11)
**When** la modale de refus s'affiche
**Then** elle contient :
- Resume de la demande (titre, client, type)
- Champ commentaire obligatoire (textarea, placeholder: "Expliquez au client ce qui doit etre modifie...")
- Validation : minimum 10 caracteres
- Boutons "Confirmer le refus" / "Annuler"
**And** le bouton "Confirmer le refus" est desactive tant que le commentaire n'a pas 10 caracteres minimum

**Given** MiKL confirme le refus avec un commentaire
**When** la Server Action `rejectRequest(requestId, comment)` s'execute (reject-request.ts)
**Then** les operations suivantes sont effectuees :
1. `validation_requests.status` → 'rejected'
2. `validation_requests.reviewer_comment` → commentaire
3. `validation_requests.reviewed_at` → NOW()
4. Une notification est creee pour le client (FR14) : type='validation', titre="MiKL a demande des modifications sur '{titre}'", body=commentaire, link="/modules/parcours-lab" (si brief_lab)
**And** un toast confirme "Demande refusee — le client a ete notifie"
**And** le cache TanStack Query est invalide
**And** MiKL est redirige vers la file d'attente

**Given** une erreur survient pendant l'action (ex : probleme reseau)
**When** la Server Action echoue
**Then** un message d'erreur clair s'affiche dans un toast : "Erreur lors du traitement — veuillez reessayer"
**And** le statut de la demande n'a pas change (transaction rollback)
**And** les boutons d'action restent actifs pour retenter

---

### Story 7.4 : Demande de precisions sur une soumission

As a **MiKL (operateur)**,
I want **demander des precisions au client sur une soumission avant de la valider ou la refuser**,
So that **je peux obtenir les informations manquantes sans bloquer le processus**.

**Acceptance Criteria :**

**Given** MiKL consulte une demande en statut 'pending' (Story 7.2)
**When** il clique sur "Demander des precisions" (FR12)
**Then** une modale s'affiche avec :
- Resume de la demande (titre, client)
- Champ question/commentaire obligatoire (textarea, placeholder: "Quelle information vous manque ?")
- Validation : minimum 10 caracteres
- Suggestions rapides (chips cliquables) : "Pouvez-vous detailler le besoin ?", "Avez-vous un exemple concret ?", "Quel est le budget envisage ?"
- Boutons "Envoyer la question" / "Annuler"

**Given** MiKL envoie sa question
**When** la Server Action `requestClarification(requestId, comment)` s'execute (request-clarification.ts)
**Then** les operations suivantes sont effectuees :
1. `validation_requests.status` → 'needs_clarification'
2. `validation_requests.reviewer_comment` → commentaire de MiKL
3. `validation_requests.reviewed_at` → NOW()
4. Une notification est creee pour le client (FR14) : type='validation', titre="MiKL a une question sur '{titre}'", body=commentaire, link="/modules/parcours-lab" (si brief_lab)
**And** un toast confirme "Question envoyee au client"
**And** le cache TanStack Query est invalide
**And** MiKL est redirige vers la file d'attente

**Given** le client repond a la demande de precisions (via re-soumission cote Lab/One)
**When** le client re-soumet avec du contenu mis a jour
**Then** la `validation_request` est mise a jour avec :
- `content` → nouveau contenu
- `status` → 'pending' (retour en attente)
- `updated_at` → NOW()
**And** une notification est envoyee a MiKL : "Le client {nom} a repondu a votre question sur '{titre}'"
**And** la demande remonte dans la file d'attente de MiKL

**Given** MiKL a deja demande des precisions sur une demande
**When** il consulte cette demande une deuxieme fois
**Then** l'historique des echanges est visible dans la section "Echanges" (Story 7.2) :
- Le commentaire de MiKL avec la date
- La reponse du client (si presente)
**And** MiKL peut a nouveau valider, refuser ou redemander des precisions

---

### Story 7.5 : Actions de traitement — workflows post-decision

As a **MiKL (operateur)**,
I want **choisir une action de traitement specifique apres examen d'une demande (reactiver Lab, programmer visio, dev direct, reporter)**,
So that **je peux orienter chaque demande vers le workflow le plus adapte**.

**Acceptance Criteria :**

**Given** MiKL consulte une demande de validation (Story 7.2)
**When** il clique sur le bouton "Actions de traitement" (dropdown)
**Then** le composant `action-picker.tsx` s'affiche avec 4 options (FR13) :

**Option A — Reactiver Lab :**
- Icone + label "Reactiver le parcours Lab"
- Description : "Le besoin est trop complexe — le client doit passer par un parcours complet"
- Disponible uniquement si le client a un parcours Lab existant (parcours_id non null)

**Option B — Programmer Visio :**
- Icone + label "Programmer une visio"
- Description : "Besoin de clarifier en direct avec le client"
- Ouvre le formulaire de prise de RDV Cal.com (integration module agenda, Epic 5)

**Option C — Dev direct :**
- Icone + label "Developper directement"
- Description : "Le besoin est clair — je le developpe"
- Affiche un lien "Ouvrir le dossier BMAD dans Cursor" (FR7, Epic 2)

**Option D — Reporter :**
- Icone + label "Reporter"
- Description : "Pas maintenant — a traiter plus tard"
- Affiche un champ date optionnel (rappel) et un champ raison

**Given** MiKL selectionne "Reactiver Lab" (option A)
**When** il confirme l'action
**Then** les operations suivantes sont effectuees :
1. La demande est marquee 'approved' (car le besoin est reconnu)
2. Le `reviewer_comment` est mis a jour avec "Besoin redirige vers le parcours Lab"
3. Si le parcours etait en status 'completed' ou 'suspended' : il est reactive (status → 'in_progress')
4. Une notification est envoyee au client : "MiKL a examine votre demande — un accompagnement Lab va etre mis en place"
**And** un toast confirme "Parcours Lab reactive"

**Given** MiKL selectionne "Programmer Visio" (option B)
**When** il confirme l'action
**Then** :
1. La demande reste en statut 'pending' (en attente de la visio)
2. Le `reviewer_comment` est mis a jour avec "Visio a programmer"
3. Le formulaire de prise de RDV Cal.com s'ouvre (pre-rempli avec le client)
4. Une notification est envoyee au client : "MiKL souhaite en discuter en visio — un RDV va etre propose"
**And** l'integration avec le module agenda (Epic 5) est utilisee

**Given** MiKL selectionne "Dev direct" (option C)
**When** il confirme l'action
**Then** :
1. La demande est marquee 'approved'
2. Le `reviewer_comment` est mis a jour avec "Pris en charge — developpement direct"
3. Le lien vers le dossier BMAD/Cursor du client est affiche (construit depuis `clients.bmad_project_path` si disponible, sinon message informatif)
4. Une notification est envoyee au client : "Votre demande '{titre}' est prise en charge par MiKL"
**And** un toast confirme "Demande prise en charge — bon dev !"

**Given** MiKL selectionne "Reporter" (option D)
**When** il confirme l'action avec une raison optionnelle et une date de rappel optionnelle
**Then** :
1. La demande reste en statut 'pending' mais le `reviewer_comment` est mis a jour avec "Reporte : {raison}"
2. Si une date de rappel est fournie : un rappel est cree dans le systeme de notifications (notification future avec `created_at` = date de rappel, type='system', titre="Rappel : demande '{titre}' de {client} a traiter")
3. Aucune notification n'est envoyee au client (le report est interne)
**And** un toast confirme "Demande reportee"
**And** la demande reste visible dans la file avec une indication visuelle "Reportee"

**Given** MiKL selectionne une action de traitement
**When** l'action est executee
**Then** le cache TanStack Query est invalide pour toutes les queries impactees
**And** l'historique de la demande est mis a jour avec l'action choisie
**And** MiKL est redirige vers la file d'attente

---

### Story 7.6 : Temps reel, compteur de demandes & abonnement Realtime

As a **MiKL (operateur)**,
I want **voir les nouvelles demandes apparaitre en temps reel et avoir un compteur visible dans la navigation**,
So that **je ne rate aucune demande urgente et je sais toujours combien de soumissions m'attendent**.

**Acceptance Criteria :**

**Given** le module Validation Hub est charge dans le Hub
**When** MiKL est connecte
**Then** un abonnement Supabase Realtime est cree sur la table `validation_requests` :
- Canal : `validation-requests-operator-{operatorId}`
- Filtre : `operator_id=eq.{operatorId}`
- Evenements ecoutes : INSERT, UPDATE
**And** l'abonnement est gere dans le hook `use-validation-queue.ts` (ou un hook dedie `use-validation-realtime.ts`)
**And** l'abonnement est nettoye proprement au demontage du composant (cleanup)

**Given** un nouveau brief Lab ou evolution One est soumis par un client
**When** l'evenement INSERT arrive via Realtime
**Then** :
- Le cache TanStack Query est invalide automatiquement (invalidateQueries(['validation-requests']))
- La liste se met a jour sans rechargement de page
- Une notification toast apparait : "Nouvelle demande de {client} — {titre}"
**And** la notification apparait en moins de 2 secondes (NFR-P5)

**Given** le statut d'une demande change (par un autre onglet, un trigger, ou une re-soumission client)
**When** l'evenement UPDATE arrive via Realtime
**Then** le cache TanStack Query est invalide et la liste se met a jour
**And** si le changement est une re-soumission client (status passe de 'needs_clarification' a 'pending') : un toast specifique "Le client {nom} a repondu a votre question"

**Given** la sidebar du Hub affiche le module Validation Hub
**When** des demandes sont en statut 'pending'
**Then** un badge numerique s'affiche a cote de l'icone "Validation Hub" dans la navigation :
- Couleur rouge si >= 1 demande en attente
- Nombre affiche (ex: "3")
- Le badge se met a jour en temps reel grace a l'abonnement Realtime
**And** le compteur est calcule via le `pendingCount` du hook (ou un hook leger dedie pour la sidebar)
**And** le badge disparait quand toutes les demandes sont traitees

**Given** la vue matinale de MiKL (workflow quotidien)
**When** MiKL arrive sur le dashboard Hub (accueil)
**Then** un widget "Validations en attente" est affiche dans la section "Actions prioritaires" :
- Nombre de demandes en attente
- Derniere demande recue (titre + client + date)
- Lien "Voir toutes les demandes" vers le Validation Hub
**And** ce widget utilise le meme hook `use-validation-queue` avec le filtre status='pending'

---

### Resume Epic 7 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 7.1 | Module Validation Hub — structure, types & file d'attente | FR8 |
| 7.2 | Vue detaillee d'une demande avec contexte complet | FR9 |
| 7.3 | Validation & refus de demande avec commentaire | FR10, FR11, FR14 (partiel) |
| 7.4 | Demande de precisions sur une soumission | FR12, FR14 (partiel) |
| 7.5 | Actions de traitement — workflows post-decision | FR13 |
| 7.6 | Temps reel, compteur de demandes & abonnement Realtime | FR14 (completion) |

**Toutes les 7 FRs de l'Epic 7 sont couvertes.**

---

## Epic 8 : Agents IA Elio (Hub, Lab, One) — Stories detaillees

**Objectif :** MiKL et les clients beneficient d'une assistance IA contextuelle adaptee a leur role (Hub, Lab, One) avec profil de communication personnalise, historique persistant, feedback et fonctionnalites avancees (recherche, correction, generation, actions).

**FRs couverts:** FR21, FR22, FR23, FR24, FR25, FR44, FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR66, FR67, FR68, FR69, FR83, FR87, FR122, FR123, FR124, FR125, FR126

**NFRs pertinentes:** NFR-P1, NFR-P3, NFR-I2, NFR-S7, NFR-S8, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** **Story 8.1 (fondation Elio unifiee) doit etre implementee AVANT les Stories 6.4-6.6** afin que les fonctionnalites Elio Lab soient construites directement sur l'architecture multi-dashboard unifiee. Les tables `elio_conversations` et `elio_messages` (migration 00011) sont creees en Story 6.4. La configuration Orpheus et l'historique de config existent depuis Story 6.6. Story 8.1 cree le module unifie `modules/elio/` (targets: ['hub', 'client-lab', 'client-one']), les composants reutilisables et la gestion des erreurs. Les Stories 6.4-6.6 construisent ensuite les fonctionnalites Lab-specifiques sur cette fondation. Les Stories 8.2-8.9 ajoutent les variantes Hub et One (One + One+). Le modele LLM est DeepSeek V3.2 via Supabase Edge Function ; les cles API ne transitent jamais cote client (NFR-S8).

---

### Story 8.1 : Consolidation infrastructure Elio — Module unifie, composants partages & gestion des erreurs

> **Technical Enabler** — Consolidation technique, benefice indirect pour tous les utilisateurs d'Elio.

As a **client Foxeo (Lab ou One)**,
I want **qu'Elio fonctionne de maniere fiable et coherente quel que soit le dashboard**,
So that **mon experience avec l'assistant IA est fluide, sans bugs ni incoherences entre les contextes**.

**Acceptance Criteria :**

**Given** le module Elio doit etre cree avec une architecture unifiee multi-dashboard (prerequis des Stories 6.4-6.6)
**When** le module unifie est cree
**Then** le module `modules/elio/` est restructure avec une architecture unifiee :
```
modules/elio/
  index.ts                       # Export public du module
  manifest.ts                    # { id: 'elio', targets: ['hub', 'client-lab', 'client-one'], dependencies: [] }
  components/
    elio-chat.tsx                # Chat unifie (dashboard-agnostic)
    elio-thinking.tsx            # Indicateur de reflexion (FR122)
    elio-message.tsx             # Composant message individuel
  hooks/
    use-elio-chat.ts             # Hook principal (conversation, envoi, reception)
    use-elio-config.ts           # Hook resolution config par dashboard_type
  actions/
    send-to-elio.ts              # Server Action existante (refactoree pour multi-dashboard)
  types/
    elio.types.ts                # Types partages
  config/
    system-prompts.ts            # Construction de system prompts par dashboard_type
```
**And** le manifest est mis a jour avec targets: ['hub', 'client-lab', 'client-one']

**Given** le composant elio-chat.tsx est refactorise
**When** il est utilise dans un dashboard
**Then** il recoit un prop `dashboardType: 'hub' | 'lab' | 'one'` qui determine :
- La palette de couleurs Minimal Futuriste (Hub: cyan/turquoise, Lab: violet/purple, One: orange vif/bleu-gris — sur base dark mode)
- Le system prompt de base (via config/system-prompts.ts)
- Les capacites disponibles (guidage parcours pour Lab, FAQ pour One, recherche pour Hub)
**And** les composants internes (message, input, header) s'adaptent au dashboard_type
**And** cette architecture sert de fondation pour les Stories 6.4-6.6 (Elio Lab) et 8.5-8.9 (Elio Hub/One)

**Given** le composant elio-thinking.tsx est extrait (FR122)
**When** Elio genere une reponse
**Then** un indicateur visuel anime s'affiche :
- Animation de type "pulsation" ou "dots" avec le texte "Elio reflechit..."
- L'indicateur est visible dans la zone de chat, a la position ou la reponse va apparaitre
- L'indicateur disparait quand le premier token de la reponse arrive
**And** le composant est reutilisable dans tous les dashboards
**And** le texte est configurable (ex : "Elio analyse votre question..." pour le Hub)

**Given** la gestion des erreurs et timeouts Elio (FR83)
**When** un appel au LLM echoue ou expire
**Then** le systeme gere gracieusement les cas suivants :
- **Timeout (> 60s, NFR-I2)** : Message "Elio est temporairement indisponible. Reessayez dans quelques instants." avec un bouton "Reessayer"
- **Erreur reseau** : Message "Probleme de connexion. Verifiez votre connexion internet." avec bouton "Reessayer"
- **Erreur LLM (500, rate limit)** : Message "Elio est surcharge. Reessayez dans quelques minutes."
- **Erreur inattendue** : Message generique avec log de l'erreur (NFR-R5)
**And** l'indicateur elio-thinking.tsx se masque en cas d'erreur
**And** le message d'erreur s'affiche dans une bulle speciale (icone warning, style distinct)
**And** le champ de saisie reste actif (le client peut reessayer immediatement)
**And** ces comportements sont partages via un composant `elio-error-message.tsx` ou integres dans elio-chat.tsx

**Given** le hook use-elio-config.ts
**When** il est utilise dans un dashboard
**Then** il resout la configuration Elio en fonction du dashboard_type :
- **Lab** : charge `client_configs.elio_config` (profil comm, parcours_context, custom_prompts)
- **One** : charge `client_configs.elio_config` + `client_configs.elio_tier` ('one' | 'one_plus') + documentation modules actifs
- **Hub** : charge la config Hub globale (pas de profil client, config operateur)
**And** la config est mise en cache via TanStack Query

**Given** la construction des system prompts (config/system-prompts.ts)
**When** un message est envoye a Elio
**Then** le system prompt est construit dynamiquement selon le dashboard_type :
- **Base commune** : role Elio, ton adapte au profil communication, contraintes generales
- **Lab** : + etape active du parcours, questions guidees, contexte metier client
- **One** : + documentation modules actifs, capacites FAQ/guidance uniquement
- **One+** : + capacites actions/generation/alertes
- **Hub** : + contexte operateur, fonctionnalites Hub, base de donnees clients accessible
**And** le system prompt est assemble dans `send-to-elio.ts` avant l'appel au LLM

---

### Story 8.2 : Conversations Elio — Liste, commutation & historique persistant complet

As a **utilisateur (MiKL ou client)**,
I want **voir la liste de mes conversations Elio, en demarrer de nouvelles sans perdre les anciennes, et retrouver tout l'historique**,
So that **je peux revenir sur des echanges precedents et organiser mes conversations par sujet**.

**Acceptance Criteria :**

**Given** l'historique des conversations Elio est stocke dans `elio_conversations` + `elio_messages` (Story 6.4) (FR123)
**When** un utilisateur ouvre le module Elio
**Then** ses conversations precedentes sont disponibles et persistantes entre sessions :
- Les conversations sont fetches via TanStack Query avec queryKey `['elio-conversations', userId, dashboardType]`
- L'historique complet des messages est charge a la demande (lazy loading par conversation)
- Les conversations sont triees par date de derniere activite (la plus recente en haut)
**And** la conversation la plus recente est ouverte par defaut

**Given** l'utilisateur veut voir ses conversations (FR123)
**When** il ouvre le panneau de conversations
**Then** une liste laterale (sidebar ou drawer mobile) affiche :
- Chaque conversation avec : titre (auto-genere ou editable), date de dernier message (format relatif), apercu du dernier message (30 caracteres max)
- La conversation active est surlignee
- Un bouton "Nouvelle conversation" en haut de la liste
**And** sur mobile (< 768px), la liste s'affiche en plein ecran avec retour au chat au clic
**And** sur desktop, la liste est un panneau lateral collapsible

**Given** l'utilisateur clique sur "Nouvelle conversation" (FR124)
**When** la Server Action `newConversation(userId, dashboardType)` s'execute (new-conversation.ts)
**Then** :
1. Une nouvelle entree est creee dans `elio_conversations` avec title='Nouvelle conversation', dashboard_type correspondant
2. L'ancienne conversation n'est PAS supprimee ni modifiee
3. Le chat s'ouvre sur la nouvelle conversation vide
4. Elio affiche un message d'accueil adapte au dashboard_type :
   - Lab : "Salut ! On reprend ton parcours ? Sur quoi tu veux bosser ?"
   - One : "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
   - Hub : "Hey MiKL ! Qu'est-ce que je peux faire pour toi ?"
**And** le message d'accueil utilise le profil de communication si disponible (tutoiement/vouvoiement)
**And** le cache TanStack Query est invalide pour ['elio-conversations']

**Given** l'utilisateur navigue entre les conversations
**When** il clique sur une conversation dans la liste
**Then** le chat affiche l'historique complet de cette conversation
**And** le scroll se positionne sur le dernier message
**And** le chargement est progressif si > 50 messages (pagination inverse avec "Charger les messages precedents")
**And** la transition entre conversations est fluide (< 500ms, NFR-P2)

**Given** une conversation accumule plusieurs echanges
**When** le titre est encore "Nouvelle conversation"
**Then** apres 3 messages utilisateur, le titre est auto-genere par le LLM en un appel leger :
- Prompt : "Resume cette conversation en 5 mots max : {3 premiers messages}"
- Le titre est mis a jour dans `elio_conversations.title`
**And** l'utilisateur peut editer le titre manuellement (double-clic ou icone edit)

---

### Story 8.3 : Feedback reponses Elio, documents dans le chat & historique configs

As a **utilisateur (MiKL ou client)**,
I want **donner un feedback sur les reponses d'Elio, voir les documents generes directement dans le chat, et (pour MiKL) consulter l'historique des configs Elio**,
So that **Elio s'ameliore grace aux retours, les documents sont accessibles sans quitter la conversation, et MiKL garde la tracabilite des configs**.

**Acceptance Criteria :**

**Given** Elio envoie une reponse dans le chat
**When** la reponse est affichee (FR126)
**Then** chaque message d'Elio affiche en bas de bulle deux boutons discrets :
- 👍 (utile) / 👎 (pas utile)
- Les boutons apparaissent au survol (desktop) ou sont toujours visibles (mobile)
- Un seul choix possible par message (toggle : cliquer a nouveau desactive)
**And** au clic, la Server Action `submitFeedback(messageId, rating: 'useful' | 'not_useful')` est executee (submit-feedback.ts)
**And** le feedback est stocke dans `elio_messages.metadata.feedback` : `{ rating: 'useful' | 'not_useful', created_at: timestamp }`
**And** un micro-feedback visuel confirme le choix (le bouton selectionne change de couleur)
**And** aucune notification n'est envoyee — le feedback est collecte silencieusement pour analyse

**Given** Elio genere ou partage un document dans la conversation (FR125)
**When** le message contient un document (brief, livrable, export)
**Then** le composant `elio-document.tsx` affiche dans la bulle de chat :
- Le nom du document avec une icone de type (PDF, DOC, image)
- Un apercu inline si possible (markdown rendu, image thumbnail)
- Un bouton "Voir le document complet" qui ouvre le module documents (Epic 4)
- Un bouton "Telecharger" (PDF)
**And** le document est reference via `elio_messages.metadata.document_id` (FK vers la table `documents`)
**And** si le document est un brief genere par Elio Lab, il affiche le badge "Brief genere par Elio"

**Given** MiKL veut consulter l'historique des configurations Elio d'un client (FR87)
**When** il accede a la fiche client dans le Hub (section "Configuration Elio", Story 6.6)
**Then** en plus du formulaire d'edition existant, un onglet "Historique" affiche :
- La liste chronologique des modifications de config Elio (date, champs modifies, ancienne valeur → nouvelle valeur)
- Les donnees proviennent de la table `elio_config_history` (ou du versionning JSON mis en place en Story 6.6)
- Chaque entree est collapsible (clic pour voir le detail)
- Un bouton "Restaurer cette version" permet de revenir a une config precedente
**And** la restauration declenche une confirmation modale avant execution
**And** le cache TanStack Query est invalide apres restauration

---

### Story 8.4 : Profil de communication — Stockage, affinement & transmission graduation

As a **operateur ou agent IA**,
I want **un systeme de profil de communication par client qui est stocke, affine par Elio Lab, et transmis a Elio One lors de la graduation**,
So that **chaque client beneficie d'une communication adaptee a son style tout au long de son parcours Foxeo**.

**Acceptance Criteria :**

**Given** le systeme de profil de communication doit etre formalise (FR66)
**When** la structure est mise en place
**Then** le profil de communication est stocke dans `client_configs.elio_config.communication_profile` avec la structure suivante :
```typescript
type CommunicationProfile = {
  levelTechnical: 'beginner' | 'intermediaire' | 'advanced'
  styleExchange: 'direct' | 'conversationnel' | 'formel'
  adaptedTone: 'formel' | 'pro_decontracte' | 'chaleureux' | 'coach'
  messageLength: 'court' | 'moyen' | 'detaille'
  tutoiement: boolean
  concreteExamples: boolean
  avoid: string[]          // ex: ["jargon technique", "questions ouvertes"]
  privilege: string[]      // ex: ["listes a puces", "questions fermees"]
  styleNotes: string       // notes libres
}
```
**And** un schema Zod `communicationProfileSchema` valide cette structure
**And** un profil par defaut existe dans `@foxeo/utils` (DEFAULT_COMMUNICATION_PROFILE) : `{ levelTechnical: 'intermediaire', styleExchange: 'conversationnel', adaptedTone: 'pro_decontracte', messageLength: 'moyen', tutoiement: false, concreteExamples: true, avoid: [], privilege: [], styleNotes: '' }`

**Given** Orpheus (hors perimetre applicatif) genere un profil de communication pour un client (FR67)
**When** MiKL injecte ce profil via la fiche client (Story 6.6)
**Then** le profil est stocke dans `client_configs.elio_config.communication_profile`
**And** le profil est immediatement utilise par Elio Lab pour adapter ses reponses

**Given** Elio Lab interagit avec un client pendant le parcours (FR67 — affinement)
**When** Elio Lab detecte des preferences de communication non explicites
**Then** le system prompt d'Elio Lab inclut une instruction d'observation :
- "Si tu detectes une preference de communication (longueur, ton, style), note-la dans le champ metadata du message avec la cle 'profile_observation'"
- Exemples : "client prefere les listes", "client frustre par les questions repetitives", "client repond mieux le matin"
**And** ces observations sont stockees dans `elio_messages.metadata.profile_observation` (chaine de texte libre)
**And** MiKL peut consulter ces observations dans la fiche client (section "Observations Elio")
**And** MiKL peut valider une observation pour l'integrer au profil officiel (ajout dans `avoid` ou `privilege` ou `styleNotes`)

**Given** tous les agents Elio doivent adapter leur ton selon le profil (FR69)
**When** un message est envoye a Elio (quel que soit le dashboard)
**Then** le system prompt construit par `config/system-prompts.ts` inclut le bloc suivant :
```
## Profil de communication du client
- Niveau technique : {levelTechnical}
- Style d'echange : {styleExchange}
- Ton adapte : {adaptedTone}
- Longueur des messages : {messageLength}
- Tutoiement : {oui/non}
- Exemples concrets : {oui/non}
- A eviter : {avoid.join(', ')}
- A privilegier : {privilege.join(', ')}
- Notes : {styleNotes}

Adapte TOUTES tes reponses selon ce profil.
```
**And** si aucun profil n'existe, le DEFAULT_COMMUNICATION_PROFILE est utilise
**And** le profil est resolu par le hook `use-elio-config.ts` (Story 8.1)

**Given** un client Lab est diplome vers One (FR68)
**When** la graduation est declenchee (Epic 9)
**Then** le profil de communication est automatiquement transmis :
1. Le `communication_profile` de `client_configs.elio_config` est preserve tel quel (pas de copie — le meme champ est lu par Elio One)
2. Les observations d'Elio Lab (stockees dans les metadata des messages) sont compilees dans un champ `communication_profile.lab_learnings: string[]`
3. L'historique des conversations Lab reste accessible (meme table `elio_conversations`, filtre `dashboard_type='lab'`)
**And** Elio One utilise ce profil des la premiere interaction post-graduation
**And** aucune rupture de ton n'est ressentie par le client

---

### Story 8.5 : Elio Hub — Interface chat MiKL, aide fonctionnalites & recherche client

As a **MiKL (operateur)**,
I want **converser avec Elio Hub pour obtenir de l'aide sur les fonctionnalites, rechercher des informations clients et optimiser mon workflow quotidien**,
So that **j'ai un assistant IA dans mon cockpit qui me fait gagner du temps au quotidien**.

**Acceptance Criteria :**

**Given** MiKL accede au module Elio dans le Hub (FR21)
**When** le chat Elio Hub se charge
**Then** l'interface unifiee elio-chat.tsx s'affiche avec `dashboardType='hub'` :
- Palette Hub : cyan/turquoise (Minimal Futuriste dark mode)
- Header : "Elio Hub — Votre assistant" avec avatar Elio Hub
- Zone de chat avec historique
- Champ de saisie avec placeholder : "Demande-moi n'importe quoi sur Foxeo..."
- Panneau de conversations lateral (Story 8.2)
**And** un message d'accueil s'affiche si c'est la premiere conversation : "Hey MiKL ! Je suis Elio Hub, ton assistant. Je peux t'aider a naviguer dans le Hub, chercher des infos clients, corriger tes textes ou generer des brouillons. Qu'est-ce que tu veux faire ?"

**Given** MiKL demande de l'aide sur une fonctionnalite du Hub (FR22)
**When** il pose une question comme "Comment je cree un nouveau client ?" ou "Ou je vois les demandes en attente ?"
**Then** Elio Hub repond avec :
- Une explication claire de la fonctionnalite
- Le chemin de navigation pour y acceder (ex : "Va dans Clients → Nouveau client")
- Un lien cliquable vers la page concernee si possible
**And** le system prompt de Elio Hub inclut un bloc de documentation des fonctionnalites du Hub :
```
## Fonctionnalites Hub disponibles
- Gestion clients : /clients → creer, modifier, voir fiche complete
- Validation Hub : /modules/validation-hub → examiner et traiter les demandes
- Chat clients : /modules/chat → echanger avec les clients
- Documents : /modules/documents → partager et gerer les documents
- Visio : /modules/visio → planifier et lancer des visioconferences
- Analytics : /modules/analytics → consulter les statistiques
```
**And** si MiKL pose une question hors du perimetre Hub, Elio indique : "Ca sort un peu de mon perimetre, mais je peux essayer de t'aider quand meme !"

**Given** MiKL demande des informations sur un client (FR23)
**When** il pose une question comme "Ou en est Sandrine ?" ou "Quel est le parcours de Thomas ?"
**Then** Elio Hub effectue une recherche dans Supabase via une fonction dediee dans le system prompt :
- Le system prompt inclut un bloc d'instructions : "Tu as acces a la base de donnees clients. Utilise les fonctions disponibles pour chercher des informations."
- La Server Action `sendToElio()` detecte les intentions de recherche et execute les requetes Supabase correspondantes (clients, parcours, validation_requests, documents)
- Elio repond avec les informations trouvees formatees clairement :
  - Nom, entreprise, type de client, statut
  - Parcours actuel (si Lab) avec progression
  - Dernieres demandes de validation
  - Derniers messages echanges
**And** les requetes respectent les policies RLS (operateur voit tous ses clients)
**And** si aucun client ne correspond, Elio repond : "Je n'ai trouve aucun client correspondant a '{recherche}'. Tu veux verifier l'orthographe ?"

**Given** l'implementation technique de la recherche client
**When** Elio Hub recoit une question client
**Then** l'approche technique est la suivante :
1. Le LLM recoit le system prompt avec les schemas de donnees disponibles
2. Le LLM genere une intention structuree (ex : `{ action: 'search_client', query: 'Sandrine' }`)
3. La Server Action parse la reponse LLM, detecte l'intention, execute la requete Supabase
4. Les resultats sont reinjectes dans le contexte LLM pour formulation de la reponse finale
**And** cette mecanique de "tool use / function calling" est implementee dans `send-to-elio.ts` comme un pattern reutilisable

---

### Story 8.6 : Elio Hub — Correction redaction & generation de brouillons

As a **MiKL (operateur)**,
I want **qu'Elio Hub corrige et adapte mes textes au profil de communication du client, et genere des brouillons de reponses**,
So that **ma communication avec les clients est toujours professionnelle et adaptee a leur personnalite**.

**Acceptance Criteria :**

**Given** MiKL veut corriger et adapter un texte au profil d'un client (FR24)
**When** il ecrit dans le chat Elio Hub un message comme "Corrige ca pour Thomas : salu thomas, je tenvoi le devis cmme convenu" ou "Adapte ce texte pour Sandrine : Voici le devis demande."
**Then** Elio Hub :
1. Identifie le client mentionne dans le message
2. Charge le profil de communication du client (`client_configs.elio_config.communication_profile`)
3. Corrige l'orthographe, la grammaire et la ponctuation
4. Adapte le ton selon le profil (tutoiement/vouvoiement, longueur, style)
5. Repond avec le texte corrige et adapte, clairement delimite :
```
Voici la version corrigee et adaptee au profil de Thomas :

---
Salut Thomas ! Je t'envoie le devis comme convenu. Dis-moi si t'as des questions !
---

J'ai corrige l'orthographe et adapte au profil "decontracte + tutoiement" de Thomas.
```
**And** MiKL peut copier le texte corrige en un clic (bouton "Copier")
**And** si le client n'est pas trouve, Elio demande : "Quel client ? Je n'ai pas trouve '{nom}' dans ta base."

**Given** MiKL veut generer un brouillon de reponse (FR25)
**When** il demande "Genere un email pour Sandrine pour lui dire que son devis est pret" ou "Ecris une reponse Validation Hub pour Thomas"
**Then** Elio Hub :
1. Identifie le client et le type de communication (email, message Validation Hub, chat)
2. Charge le profil de communication du client
3. Charge le contexte recent (derniers echanges, dernieres demandes)
4. Genere un brouillon complet adapte :
```
Voici un brouillon pour Sandrine :

---
Objet : Votre devis est pret

Bonjour Sandrine,

J'ai le plaisir de vous informer que le devis pour l'ajout du module SMS a ete finalise. Vous le trouverez en piece jointe.

N'hesitez pas a me contacter si vous avez des questions.

Cordialement,
MiKL — Foxeo
---

J'ai utilise le ton "formel + vouvoiement" du profil de Sandrine. Tu veux modifier quelque chose ?
```
**And** le brouillon est affiche dans une bulle speciale avec les boutons :
- "Copier" — copie dans le presse-papier
- "Modifier" — MiKL peut demander des ajustements ("Plus court", "Ajoute une mention sur le delai")
- "Envoyer" — si c'est un message chat, possibilite d'envoyer directement via le module chat (Epic 3)
**And** les brouillons generes sont stockes dans `elio_messages.metadata.draft_type: 'email' | 'validation_hub' | 'chat'`

**Given** MiKL demande des ajustements sur un brouillon
**When** il ecrit "Plus court" ou "Ajoute la date de livraison" ou "Passe au tutoiement"
**Then** Elio Hub regenere le brouillon en tenant compte de la modification demandee
**And** le nouveau brouillon remplace l'ancien dans la conversation (ou s'affiche en dessous avec mention "Version 2")
**And** le contexte de la conversation est conserve (Elio sait qu'on parle du meme brouillon)

---

### Story 8.7 : Elio One — Chat, FAQ, guidance dashboard & heritage Lab

As a **client One (etabli)**,
I want **converser avec Elio One qui repond a mes questions sur les fonctionnalites, me guide dans mon dashboard et connait mon historique Lab**,
So that **j'ai un assistant qui me connait et m'aide a utiliser efficacement mes outils metier**.

**Acceptance Criteria :**

**Given** un client One accede au module Elio dans son dashboard (FR44)
**When** le chat Elio One se charge
**Then** l'interface unifiee elio-chat.tsx s'affiche avec `dashboardType='one'` :
- Palette One : orange vif + bleu-gris (dark mode)
- Header : "Elio — Votre assistant" avec avatar Elio One
- Zone de chat avec historique
- Champ de saisie avec placeholder adapte au profil communication
- Panneau de conversations lateral (Story 8.2)
**And** le message d'accueil adapte au profil s'affiche :
- Si config custom (Story 6.6) : utilise `custom_prompts.greeting`
- Sinon : "Bonjour ! Je suis Elio, votre assistant. Comment puis-je vous aider ?" (vouvoiement par defaut)
**And** le first token de reponse apparait en moins de 3 secondes (NFR-P3)

**Given** le client One pose une question sur une fonctionnalite (FR45)
**When** il ecrit "Comment je cree un evenement ?" ou "A quoi sert le module calendrier ?"
**Then** Elio One repond en s'appuyant sur la documentation des modules actifs :
- Le system prompt inclut la documentation de chaque module actif du client (injectee par MiKL via FR43, Epic 10)
- La documentation suit la structure : description, parametres, questions_client_possibles, problemes_courants
- Elio repond avec des instructions claires et contextuelles
**And** si la question concerne un module non active, Elio repond : "Cette fonctionnalite n'est pas encore activee pour vous. Vous pouvez demander a MiKL de l'activer."

**Given** le client One demande de l'aide pour naviguer (FR46)
**When** il ecrit "Ou sont mes factures ?" ou "Comment je vois mes documents ?"
**Then** Elio One guide le client :
- Explication du chemin de navigation
- Description de ce qu'il va trouver a cet endroit
- Ton adapte au profil de communication
**And** le system prompt inclut une cartographie des modules et routes du dashboard One

**Given** un client a ete diplome du Lab vers One (FR51)
**When** il utilise Elio One pour la premiere fois
**Then** Elio One herite du contexte Lab :
1. Le profil de communication est deja en place (FR68, Story 8.4) — pas de rupture de ton
2. Les conversations Lab restent consultables (dans la liste des conversations, filtrees par `dashboard_type='lab'`, affichees dans une section "Historique Lab")
3. Les briefs Lab valides sont referenciables par Elio One : "D'apres votre brief sur le branding, vous aviez mentionne..."
4. Les decisions de MiKL pendant le Lab sont connues d'Elio One (integrees dans le system prompt via `parcours_context`)
**And** Elio One ne repose jamais les memes questions que pendant le Lab
**And** le ton est coherent avec celui utilise pendant le parcours Lab

**Given** le client One pose une question hors du perimetre d'Elio (fonctionnalite inexistante, question trop complexe)
**When** la confiance de la reponse est basse
**Then** Elio One propose l'escalade vers MiKL :
- "Je ne suis pas certain de pouvoir vous aider la-dessus. Voulez-vous que je transmette votre question a MiKL ?"
- Si le client accepte : une notification est envoyee a MiKL avec le contexte (question + historique recent)
**And** le meme mecanisme d'escalade que Story 6.4 (Lab) est reutilise

---

### Story 8.8 : Elio One — Collecte d'evolutions & soumission Validation Hub

As a **client One (etabli)**,
I want **qu'Elio One collecte mon besoin d'evolution en quelques questions et le soumette automatiquement a MiKL via le Validation Hub**,
So that **je peux demander de nouvelles fonctionnalites sans effort et sans sortir de ma conversation**.

**Acceptance Criteria :**

**Given** un client One exprime un besoin d'evolution via Elio (FR47)
**When** il ecrit "Je voudrais pouvoir envoyer des SMS de rappel" ou "On pourrait ajouter une fonction export Excel"
**Then** Elio One detecte l'intention d'evolution (mot-cles : "je voudrais", "on pourrait", "il faudrait", "ajouter", "nouveau") et passe en mode collecte :
1. **Question 1 (Clarification besoin)** : "D'accord, je comprends. Pouvez-vous me decrire plus precisement ce que vous attendez ? Par exemple, dans quel contexte vous utiliseriez cette fonction ?"
2. **Question 2 (Priorite)** : "Sur une echelle de 1 a 3, a quel point c'est urgent pour vous ? (1 = ce serait bien, 2 = ca me manque souvent, 3 = ca bloque mon activite)"
3. **Question 3 (optionnelle, si le besoin n'est pas clair)** : "Avez-vous un exemple concret d'un moment ou vous avez eu besoin de cette fonctionnalite ?"
**And** Elio pose les questions une a la fois, en attendant la reponse
**And** le nombre de questions est limite a 3 maximum (pas d'interrogatoire)
**And** le ton s'adapte au profil de communication du client

**Given** Elio One a collecte les reponses du client
**When** la collecte est terminee (2-3 questions posees)
**Then** Elio genere un mini-brief structure :
```
J'ai bien compris votre demande. Voici le resume que je vais envoyer a MiKL :

---
**Demande d'evolution : {titre auto-genere}**
- Besoin : {description structuree}
- Contexte : {reponse question 1}
- Priorite client : {1/2/3}
- Exemple concret : {reponse question 3 si posee}
---

Vous validez ? Je l'envoie a MiKL pour evaluation.
```
**And** le client peut valider ("Oui envoie") ou modifier ("Change le titre" / "Ajoute que...")

**Given** le client valide le mini-brief
**When** Elio One soumet la demande
**Then** les operations suivantes sont effectuees :
1. Un enregistrement est cree dans `validation_requests` avec :
   - type='evolution_one'
   - title={titre auto-genere}
   - content={mini-brief structure}
   - client_id, operator_id
   - status='pending'
2. Une notification est envoyee a MiKL : "Nouvelle demande d'evolution de {client} — {titre}"
3. Elio confirme au client : "C'est envoye ! MiKL va examiner votre demande et vous tiendra informe."
**And** le mini-brief est stocke dans `elio_messages.metadata.evolution_brief: true`
**And** le cache TanStack Query est invalide pour ['validation-requests']

**Given** le client veut annuler pendant la collecte
**When** il ecrit "Non laisse tomber" ou "En fait non"
**Then** Elio One sort du mode collecte : "Pas de souci ! N'hesitez pas si vous changez d'avis."
**And** aucune demande n'est creee dans validation_requests

**Given** Elio One detecte une demande d'evolution mais le besoin est deja couvert
**When** le LLM identifie que la fonctionnalite existe deja (dans la documentation modules actifs)
**Then** Elio One repond : "En fait, cette fonctionnalite existe deja ! Voici comment y acceder : {instructions}"
**And** aucune collecte d'evolution n'est lancee
**And** Elio bascule en mode FAQ/guidance (FR45, FR46)

---

### Story 8.9a : Elio One+ — Systeme de tiers & actions modules

As a **client One+**,
I want **qu'Elio One execute des actions sur mes modules actifs apres verification de mon tier d'abonnement**,
So that **Elio est un veritable co-pilote qui agit sur mes outils a ma demande**.

**Acceptance Criteria :**

**Given** le systeme de tiers Elio (One vs One+)
**When** un client One utilise Elio
**Then** le tier est determine par `client_configs.elio_tier` (valeurs : 'one' | 'one_plus', defaut : 'one')
**And** le system prompt de send-to-elio.ts adapte les capacites :
- **One** : FAQ, guidance, collecte d'evolutions uniquement
- **One+** : tout One + actions, generation, alertes
**And** si un client One tente une action One+, Elio repond :
"Cette fonctionnalite fait partie de l'offre Elio One+. Contactez MiKL pour en savoir plus !"
**And** le check de tier est effectue AVANT l'appel LLM (pas de gaspillage de tokens)

**Given** un client One+ demande une action sur un module actif (FR48)
**When** il ecrit "Envoie un rappel de cotisation aux membres en retard" ou "Cree un evenement pour samedi prochain"
**Then** Elio One+ :
1. Identifie le module cible (adhesions, evenements, etc.) et l'action demandee
2. Verifie que le module est actif pour ce client
3. **Demande TOUJOURS confirmation avant execution** :
```
Je vais envoyer un rappel de cotisation a 12 membres en retard de paiement.

Voici la liste :
- Dupont Marie (3 mois de retard)
- Martin Jean (1 mois de retard)
[...]

Vous confirmez l'envoi ? (Oui / Non / Modifier)
```
4. Sur confirmation, execute l'action via la Server Action du module concerne
5. Confirme l'execution : "C'est fait ! 12 rappels envoyes. Vous serez notifie des reponses."
**And** l'action est logguee dans `activity_logs` avec l'acteur 'elio_one_plus'
**And** les actions destructives (suppression, envoi masse) necessitent une double confirmation
**And** si l'action echoue, un message d'erreur clair est affiche avec option de reessayer

---

### Story 8.9b : Elio One+ — Generation de documents

As a **client One+**,
I want **qu'Elio genere des documents (attestations, recapitulatifs, exports) a ma demande**,
So that **je gagne du temps sur les taches administratives repetitives**.

**Acceptance Criteria :**

**Given** un client One+ demande la generation d'un document (FR49)
**When** il ecrit "Genere une attestation de presence pour Marie Dupont" ou "Cree un recapitulatif des evenements du mois"
**Then** Elio One+ :
1. Collecte les informations manquantes (si besoin, 1-2 questions max)
2. Genere le document via le LLM (contenu structure)
3. Affiche le document dans le chat via elio-document.tsx (Story 8.3, FR125)
4. Propose les actions : "Telecharger en PDF" / "Enregistrer dans vos documents" / "Envoyer par email"
**And** le document est cree dans la table `documents` avec source='elio_generated'
**And** le document est lie a la conversation via `elio_messages.metadata.document_id`

---

### Story 8.9c : Elio One+ — Alertes proactives

As a **client One+**,
I want **qu'Elio m'alerte proactivement quand quelque chose requiert mon attention**,
So that **je suis informe en temps reel sans avoir a surveiller moi-meme tous mes indicateurs**.

**Acceptance Criteria :**

**Given** le systeme d'alertes proactives Elio One+ (FR50)
**When** des conditions specifiques sont detectees
**Then** Elio One+ envoie des alertes proactives au client :
- **Alertes basees sur les donnees** : "3 feuilles d'emargement manquent pour les cours d'hier" / "Vous avez 5 cotisations impayees depuis plus de 30 jours"
- **Alertes basees sur le calendrier** : "Rappel : evenement 'Assemblee Generale' dans 2 jours — 12 inscrits" / "Votre abonnement Foxeo est renouvele dans 7 jours"
- **Alertes basees sur l'activite** : "Vous n'avez pas publie de contenu depuis 2 semaines"
**And** les alertes sont implementees via un systeme de regles configurables :
```typescript
type ProactiveAlert = {
  id: string
  moduleId: string
  condition: string          // SQL-like condition evaluated periodically
  message: string            // Template de message avec variables
  frequency: 'daily' | 'weekly' | 'on_event'
  lastTriggered: string | null
}
```
**And** les alertes sont evaluees par une Supabase Edge Function (cron job quotidien)
**And** les alertes generent une notification in-app de type 'alert' ET un message dans la conversation Elio One
**And** le client peut desactiver une alerte specifique : "Arrete de me rappeler pour les feuilles d'emargement"
**And** les preferences d'alertes sont stockees dans `client_configs.elio_alerts_preferences`

**Given** les alertes proactives sont evaluees
**When** le cron job s'execute (quotidien, 8h00)
**Then** pour chaque client One+ :
1. Les regles d'alerte actives sont evaluees contre les donnees Supabase
2. Les alertes declenchees sont envoyees comme messages Elio + notifications
3. Le `lastTriggered` est mis a jour pour eviter les doublons
**And** le cron job est une Supabase Edge Function planifiee
**And** les alertes sont limitees a 3 par jour par client (anti-spam)

---

### Resume Epic 8 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 8.1 | Consolidation infrastructure Elio — module unifie & gestion erreurs | FR83, FR122 |
| 8.2 | Conversations Elio — liste, commutation & historique persistant | FR123, FR124 |
| 8.3 | Feedback reponses, documents dans le chat & historique configs | FR87, FR125, FR126 |
| 8.4 | Profil de communication — stockage, affinement & transmission | FR66, FR67, FR68, FR69 |
| 8.5 | Elio Hub — chat MiKL, aide fonctionnalites & recherche client | FR21, FR22, FR23 |
| 8.6 | Elio Hub — correction redaction & generation brouillons | FR24, FR25 |
| 8.7 | Elio One — chat, FAQ, guidance & heritage Lab | FR44, FR45, FR46, FR51 |
| 8.8 | Elio One — collecte d'evolutions & soumission Validation Hub | FR47 |
| 8.9a | Elio One+ — systeme de tiers & actions modules | FR48 |
| 8.9b | Elio One+ — generation de documents | FR49 |
| 8.9c | Elio One+ — alertes proactives | FR50 |

**Toutes les 24 FRs de l'Epic 8 sont couvertes.**

---

## Epic 9 : Graduation Lab vers One & Cycle de Vie Client — Stories detaillees

**Objectif :** Les clients transitent de Lab vers One avec **provisioning d'une instance dediee** (Supabase + Vercel) et migration complete du contexte. MiKL gere le cycle de vie complet (abandon parcours, changement tier abonnement, export RGPD, transfert instance, retention donnees).

**FRs couverts:** FR74, FR75, FR76, FR88, FR91, FR92, FR93, **FR157, FR161, FR166, FR167, FR168**

**NFRs pertinentes:** NFR-S7, NFR-S9, NFR-R2, NFR-R3, NFR-P2, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** L'ecran de graduation (animation, recapitulatif) a ete cree dans Story 5.6 (FR72, module core-dashboard). La transmission du profil de communication est geree par Story 8.4 (FR68). Cet epic construit le processus backend de graduation (declenchement, migration donnees, acces), le cycle de vie client (abandon, tier, RGPD) et les policies de retention. Les donnees ne sont JAMAIS supprimees — toujours archivees (FR85, NFR-S9).

---

### Story 9.1 : Graduation Lab vers One — Declenchement & migration automatique du contexte

As a **MiKL (operateur)**,
I want **declencher la graduation d'un client Lab vers One avec migration automatique de tout le contexte (profil, briefs, historique)**,
So that **le client transite en douceur vers son espace professionnel sans perte d'information**.

**Acceptance Criteria :**

**Given** MiKL consulte la fiche d'un client Lab dont le parcours est termine (FR74)
**When** il accede a la section "Parcours Lab" de la fiche client
**Then** un bouton "Graduer vers Foxeo One" est visible si les conditions suivantes sont remplies :
- Le parcours Lab est en statut 'completed' (toutes les etapes validees)
- Le client n'a aucune `validation_request` en statut 'pending'
- Le client n'est pas deja en statut 'one'
**And** si les conditions ne sont pas remplies, le bouton est desactive avec un tooltip explicatif :
- "Parcours non termine — {X} etapes restantes"
- "Demandes de validation en attente — traitez-les d'abord"

**Given** MiKL clique sur "Graduer vers Foxeo One" (FR74)
**When** la modale de confirmation s'affiche
**Then** elle contient :
- Nom et entreprise du client
- Recapitulatif du parcours Lab (duree, etapes completees, briefs valides)
- Choix du tier One initial : "Ponctuel" / "Essentiel (49€/mois — Elio One)" / "Agentique (99€/mois — Elio One+)"
- Choix des modules a activer pour le client (checkboxes depuis la liste des modules disponibles)
- Champ notes de graduation (optionnel, pour MiKL)
- Boutons "Confirmer la graduation" / "Annuler"
**And** le tier "Essentiel" est pre-selectionne par defaut

**Given** MiKL confirme la graduation
**When** la Server Action `graduateClient(clientId, tier, activeModules, notes)` s'execute
**Then** les operations suivantes sont effectuees (FR75, FR166, FR167) :

**Phase A — Provisioning instance dediee (FR153, FR166) :**
Le provisioning complet (creation Supabase, migrations DB, deploiement Vercel, health check) est execute via `provisionOneInstance()` — voir **Story 12.6** pour le processus detaille en 6 etapes. Dans le contexte de graduation, les parametres sont derives de la modale de graduation :
- `slug` → derive du nom d'entreprise du client (kebab-case)
- `modules` → modules choisis par MiKL dans la modale
- `tier` → tier selectionne (Essentiel / Agentique)

**Phase B — Migration des donnees Lab vers l'instance One (FR167) :**
5. Les donnees Lab pertinentes sont migrees vers le Supabase dedie du client :
   - Le `communication_profile` est copie dans la DB One
   - Les `elio_conversations` avec `dashboard_type='lab'` sont copiees (consultables dans "Historique Lab")
   - Les `documents` du Lab sont copies dans le Storage One
   - Le `parcours` complete est copie (lecture seule)
   - Les observations Elio Lab sont compilees dans `communication_profile.lab_learnings`
6. Les donnees Lab ORIGINALES restent dans la DB Lab partagee (archivage, propriete Foxeo — FR168)

**Phase C — Mise a jour du client dans le Hub :**
7. `clients.client_type` → 'one' (etait 'lab')
8. `clients.graduated_at` → NOW()
9. `clients.graduation_notes` → notes de MiKL
10. `client_configs.elio_tier` → tier choisi
11. `client_configs.active_modules` → modules actives
12. `client_configs.graduation_source` → 'lab'

**Phase D — Preparation de l'accueil One :**
13. Un flag `show_graduation_screen` → true est positionne dans la DB One du client
14. L'instance One est prete a recevoir le client

**And** le provisioning est declenche de maniere asynchrone — l'action retourne immediatement le statut 'provisioning' et la progression est suivie via Realtime (channel: `provisioning:{clientId}`)
**And** un toast confirme "Graduation lancee — provisioning en cours pour {nom}"
**And** le cache TanStack Query est invalide pour ['clients', clientId], ['parcours', clientId]
**And** un evenement de graduation est logge dans `activity_logs`

**Given** une erreur survient pendant la graduation
**When** la transaction echoue
**Then** un rollback complet est effectue — aucune donnee n'est modifiee
**And** un message d'erreur explicite s'affiche : "Erreur lors de la graduation — aucune modification effectuee. Reessayez."
**And** l'erreur est logguee avec contexte pour diagnostic (NFR-R5)

---

### Story 9.2 : Graduation Lab vers One — Notification client & activation acces One

As a **client Lab gradue**,
I want **recevoir une notification de graduation et acceder immediatement a mon nouveau dashboard One**,
So that **je sais que mon parcours est termine et je peux commencer a utiliser mes outils professionnels**.

**Acceptance Criteria :**

**Given** la graduation a ete executee avec succes (Story 9.1) (FR76)
**When** la Server Action termine la transaction
**Then** une notification est envoyee au client :
- Type : 'graduation'
- Titre : "Felicitations ! Votre espace professionnel Foxeo One est pret !"
- Body : "Votre parcours Lab est termine. Vous avez maintenant acces a votre dashboard personnalise avec {X} modules actives."
- Link : "/" (redirige vers l'accueil du dashboard One)
**And** la notification est envoyee en temps reel via Supabase Realtime (NFR-P5, < 2 secondes)
**And** un email de graduation est egalement envoye (template specifique) :
- Objet : "Bienvenue dans Foxeo One — Votre espace professionnel est pret"
- Contenu : recapitulatif du parcours Lab, lien de connexion, apercu des modules actives
**And** MiKL est egalement notifie (type : 'system') : "Graduation effectuee — {nom} est maintenant client One"

**Given** le client se connecte apres la graduation
**When** le middleware d'authentification verifie son profil
**Then** :
1. Le client est redirige vers son instance dediee `{slug}.foxeo.io` (au lieu de `lab.foxeo.io`)
   - Le Hub fournit l'URL de l'instance One via `client_instances.instance_url`
   - Le middleware Auth de l'instance Lab detecte le client gradue et redirige
2. Le flag `show_graduation_screen` est detecte
3. L'ecran de graduation (Story 5.6) s'affiche avec l'animation et le recapitulatif
4. Apres fermeture, le flag est mis a false (affichage unique)
**And** si le client etait deja connecte (session active), la redirection se fait au prochain chargement de page

**Given** le client est sur le dashboard One apres la graduation
**When** il ouvre Elio One pour la premiere fois
**Then** Elio One l'accueille avec un message contextualise (Story 8.7) :
- "Felicitations pour la fin de votre parcours Lab ! Je suis Elio One, votre nouvel assistant. Je connais deja votre projet grace a votre parcours — n'hesitez pas a me poser des questions sur vos outils."
- Le ton est adapte au profil de communication herite du Lab (FR68, Story 8.4)
**And** le message d'accueil est un `elio_messages` avec `dashboard_type='one'` dans une nouvelle `elio_conversations`

**Given** le client veut consulter ses donnees Lab apres la graduation
**When** il cherche ses anciens briefs ou conversations
**Then** :
- Les documents Lab sont visibles dans le module documents (meme table, meme client_id)
- Les conversations Lab sont consultables dans le panneau de conversations Elio (section "Historique Lab", filtrees par `dashboard_type='lab'`, lecture seule)
- Le parcours Lab termine est visible dans un onglet "Mon parcours" (lecture seule, module historique-lab, Epic 10)
**And** le client ne peut plus modifier ou soumettre de briefs Lab (acces lecture seule)

---

### Story 9.3 : Demande d'abandon de parcours Lab par le client

As a **client Lab**,
I want **pouvoir demander a abandonner mon parcours si je ne souhaite plus continuer**,
So that **je peux sortir du parcours proprement sans que mes donnees soient perdues**.

**Acceptance Criteria :**

**Given** un client Lab est en cours de parcours (FR88)
**When** il souhaite abandonner
**Then** un bouton "Quitter le parcours" est accessible depuis :
- La page "Mon Parcours" (parcours-progress) — en bas de page, discret
- Les parametres du compte — section "Mon parcours Lab"
**And** le bouton n'est visible que si le parcours est en statut 'in_progress' ou 'not_started'

**Given** le client clique sur "Quitter le parcours"
**When** la modale de confirmation s'affiche
**Then** elle contient :
- Message d'avertissement : "Etes-vous sur de vouloir quitter votre parcours Lab ?"
- Recapitulatif de la progression actuelle : "{X}/{Y} etapes completees"
- Champ raison d'abandon (optionnel, textarea) avec des suggestions :
  - "Je n'ai plus le temps en ce moment"
  - "Le parcours ne correspond pas a mes attentes"
  - "J'ai trouve une autre solution"
  - "Autre raison..."
- Mention rassurante : "Vos donnees et documents seront conserves. MiKL vous contactera pour en discuter."
- Boutons "Confirmer l'abandon" (rouge) / "Continuer mon parcours" (vert, mis en avant)

**Given** le client confirme l'abandon
**When** la Server Action `requestParcourAbandonment(clientId, reason)` s'execute
**Then** les operations suivantes sont effectuees :
1. `parcours.status` → 'abandoned'
2. `parcours.completed_at` → NOW() (date de fin)
3. `activity_logs` → evenement 'parcours_abandoned' avec la raison
4. Une notification est envoyee a MiKL (type : 'alert', priorite haute) :
   - Titre : "Le client {nom} souhaite abandonner son parcours Lab"
   - Body : "Raison : {raison}. Progression : {X}/{Y} etapes. Contactez-le pour en discuter."
   - Link : "/clients/{clientId}"
5. Les donnees du client sont PRESERVEES integralement (pas d'archivage ni suppression)
**And** un toast confirme au client : "Votre demande a ete envoyee a MiKL. Il vous contactera prochainement."
**And** le cache TanStack Query est invalide

**Given** le parcours est abandonne
**When** le client se reconnecte
**Then** :
- La page parcours affiche : "Votre parcours est en pause. MiKL va vous contacter pour en discuter."
- Elio Lab est desactive (le chat affiche : "Votre parcours est en pause. Contactez MiKL si vous souhaitez reprendre.")
- Les documents et briefs restent accessibles en lecture
- Le chat avec MiKL reste actif

**Given** MiKL veut reactiver un parcours abandonne
**When** il accede a la fiche client et clique "Reactiver le parcours"
**Then** `parcours.status` → 'in_progress', `parcours.completed_at` → null
**And** Elio Lab est reactive
**And** le client est notifie : "Bonne nouvelle ! Votre parcours Lab a ete reactive par MiKL."

---

### Story 9.4 : Changement de tier abonnement client One

As a **MiKL (operateur)**,
I want **changer le tier d'abonnement d'un client One (Base, Essentiel, Agentique) avec effet immediat sur les capacites Elio**,
So that **je peux adapter l'offre a l'evolution des besoins du client**.

**Acceptance Criteria :**

**Given** MiKL consulte la fiche d'un client One (FR91)
**When** il accede a la section "Abonnement" de la fiche client
**Then** il voit :
- Le tier actuel du client (Base / Essentiel / Agentique) avec un badge colore
- La date de debut du tier actuel
- Le cout mensuel associe
- Un bouton "Modifier le tier"

**Given** MiKL clique sur "Modifier le tier"
**When** la modale de changement s'affiche
**Then** elle contient :
- Les 3 options de tier avec detail :
  | Tier | Prix | Elio | Description |
  |------|------|------|-------------|
  | Base | Ponctuel | Aucun | Maintenance 1 mois + docs techniques |
  | Essentiel | 49€/mois | One | Maintenance continue, mises a jour, Elio One assistant |
  | Agentique | 99€/mois | One+ | Maintenance continue, mises a jour, Elio One+ agentif |
- Le tier actuel est surligne et indique "(actuel)"
- Un avertissement si downgrade : "Attention : le passage de Agentique a Essentiel desactivera les fonctionnalites Elio One+ (actions, generation de documents, alertes proactives)."
- Boutons "Confirmer le changement" / "Annuler"

**Given** MiKL confirme le changement de tier
**When** la Server Action `changeClientTier(clientId, newTier)` s'execute
**Then** les operations suivantes sont effectuees :
1. `client_configs.elio_tier` → nouveau tier ('one' | 'one_plus' | null pour Base)
2. `client_configs.subscription_tier` → nouveau tier ('base' | 'essentiel' | 'agentique')
3. `client_configs.tier_changed_at` → NOW()
4. `activity_logs` → evenement 'tier_changed' avec ancien et nouveau tier
5. Si upgrade vers One+ : les alertes proactives sont activees (config par defaut)
6. Si downgrade depuis One+ : les alertes proactives sont desactivees, les actions en cours sont preservees
**And** l'effet est immediat : Elio adapte ses capacites des la prochaine interaction
**And** un toast confirme "Tier modifie — {nom} est maintenant en {tier}"
**And** le cache TanStack Query est invalide

**Given** le tier change impacte la facturation (integration future Epic 11)
**When** la Server Action s'execute
**Then** un champ `client_configs.pending_billing_update` → true est positionne pour signaler a l'Epic 11 (Facturation & Abonnements) qu'une mise a jour Stripe est necessaire
**And** pour le MVP, la facturation est geree manuellement par MiKL (pas de Stripe auto dans cet epic)

**Given** le client utilise Elio One apres un changement de tier
**When** il tente une action One+ alors qu'il est en tier One
**Then** Elio One repond : "Cette fonctionnalite fait partie de l'offre Elio One+. Contactez MiKL pour en savoir plus !"
**And** le check de tier est effectue avant l'appel LLM (pas de tokens gaspilles)

---

### Story 9.5a : Export RGPD des donnees client

As a **client Foxeo ou MiKL (operateur)**,
I want **exporter l'ensemble des donnees personnelles d'un client (droit d'acces RGPD)**,
So that **le client peut exercer son droit a la portabilite des donnees**.

**Acceptance Criteria :**

**Given** un client souhaite exporter ses donnees (FR92)
**When** il accede a ses parametres de compte (section "Mes donnees")
**Then** il voit :
- Un bouton "Exporter toutes mes donnees" avec l'explication : "Conformement au RGPD, vous pouvez telecharger l'ensemble de vos donnees personnelles."
- Une estimation du temps de generation ("L'export prend generalement 1 a 5 minutes")

**Given** le client (ou MiKL via la fiche client) declenche l'export
**When** la Server Action `exportClientData(clientId)` s'execute
**Then** un export complet est genere incluant :
1. **Informations personnelles** : nom, email, entreprise, date d'inscription, type de client
2. **Documents** : tous les documents associes (briefs, livrables) — fichiers + metadata
3. **Communications** : historique des messages chat avec MiKL (table `messages`)
4. **Conversations Elio** : historique complet des conversations avec Elio (tables `elio_conversations` + `elio_messages`)
5. **Parcours Lab** : etapes, progression, briefs soumis (si applicable)
6. **Demandes de validation** : historique des `validation_requests`
7. **Notifications** : historique des notifications recues
8. **Consentements** : consentements donnes (CGU, IA, etc.)
9. **Sessions** : historique des connexions
10. **Facturation** : factures et devis (si applicable)
**And** l'export est genere dans 2 formats :
- **JSON structure** : un fichier JSON complet avec toutes les donnees brutes
- **PDF lisible** : un document PDF formate avec les donnees organisees par categorie
**And** les fichiers sont compresses en ZIP
**And** l'export est stocke temporairement dans Supabase Storage (dossier prive, expire apres 7 jours)
**And** un lien de telechargement est envoye par notification in-app ET email

**Given** MiKL peut aussi declencher un export pour un client (FR104 — lien avec Epic 12)
**When** il accede a la fiche client (section "Administration")
**Then** un bouton "Exporter les donnees client" est disponible
**And** le meme processus s'execute
**And** l'export est accessible a MiKL (pas au client) si MiKL l'a declenche pour ses propres besoins

---

### Story 9.5b : Transfert instance One au client sortant

As a **MiKL (operateur)**,
I want **transferer l'instance One dediee a un client qui quitte Foxeo, avec code source, DB et documentation**,
So that **le client est autonome et proprietaire de son outil conformement aux engagements Foxeo (FR154)**.

**Acceptance Criteria :**

**Given** un client One quitte Foxeo et recupere son outil (FR154, FR157)
**When** MiKL declenche la procedure de sortie depuis la fiche client (bouton "Transferer l'instance au client")
**Then** la procedure suivante est executee :
1. Le code source du monorepo client est exporte dans un repo Git dedie
2. La documentation complete de chaque module actif est incluse (guide.md, faq.md, flows.md)
3. Les credentials Supabase sont transferes au client (ou un dump DB est fourni)
4. Les modules service Foxeo sont retires (chat MiKL, visio, Elio) — sauf si inclus dans le perimetre projet
5. Un document "Guide d'autonomie" est genere avec :
   - Architecture technique de l'instance
   - Variables d'environnement documentees
   - Procedure de deploiement sans Foxeo
   - Contacts support technique (optionnel, payant)
6. `client_instances.status` → 'transferred'
7. Le client recoit par email : repo Git + dump DB + documentation + Guide d'autonomie
**And** le dossier BMAD (briefs internes, analyses Orpheus) reste propriete Foxeo — le client recoit les documents strategiques (brief final, PRD, architecture client)
**And** un evenement 'client_instance_transferred' est logge dans `activity_logs`

---

### Story 9.5c : Anonymisation & retention des donnees apres resiliation

As a **MiKL (operateur)**,
I want **archiver, puis anonymiser les donnees des clients resilies apres la periode de retention**,
So that **la plateforme est conforme RGPD et les obligations comptables sont respectees**.

**Acceptance Criteria :**

**Given** un client est resilie (FR93)
**When** son compte est desactive par MiKL
**Then** les donnees sont ARCHIVEES (jamais supprimees immediatement) :
1. `clients.status` → 'archived'
2. `clients.archived_at` → NOW()
3. Le client perd l'acces au dashboard (middleware bloque la connexion)
4. Les donnees restent en base (RLS empeche l'acces mais ne supprime pas)
5. Un champ `clients.retention_until` → NOW() + {periode_retention} est positionne
**And** la periode de retention par defaut est de **90 jours** (configurable)
**And** les obligations comptables sont respectees : les factures sont conservees **10 ans** independamment de la retention client (conformite fiscale francaise)
**And** un evenement 'client_archived' est logge dans `activity_logs`

**Given** la periode de retention est ecoulee
**When** un processus de nettoyage s'execute (Supabase Edge Function, cron hebdomadaire)
**Then** les donnees du client sont anonymisees :
1. `clients.name` → 'Client supprime #{id_court}'
2. `clients.email` → 'deleted_{uuid}@anonymized.foxeo.io'
3. `clients.company` → null
4. Les `elio_conversations` et `elio_messages` sont supprimees
5. Les `messages` (chat MiKL) sont anonymises (contenu → 'Message supprime')
6. Les `documents` sont supprimes du Storage (fichiers physiques)
7. Les `notifications` sont supprimees
8. Le `client_configs` est supprime (sauf `subscription_tier` pour historique facturation)
9. Les `validation_requests` sont conservees (anonymisees) pour les stats
10. Les donnees de facturation sont PRESERVEES (obligation legale 10 ans)
**And** `clients.status` → 'deleted'
**And** un evenement 'client_data_purged' est logge dans `activity_logs`
**And** l'anonymisation est irreversible

**Given** MiKL veut consulter les clients archives
**When** il accede a la liste clients avec le filtre "Archives"
**Then** les clients archives sont visibles avec :
- Mention "Archive" + date d'archivage
- Date de suppression prevue (`retention_until`)
- Bouton "Reactiver" (si dans la periode de retention)
- Les donnees sont encore consultables tant que la retention n'est pas ecoulee
**And** apres la suppression/anonymisation, seul le nom anonymise et les donnees comptables restent

**Given** MiKL veut reactiver un client archive (dans la periode de retention)
**When** il clique sur "Reactiver"
**Then** `clients.status` → le statut precedent ('lab' ou 'one')
**And** `clients.archived_at` → null, `clients.retention_until` → null
**And** le client retrouve l'acces a son dashboard avec toutes ses donnees intactes
**And** une notification est envoyee au client : "Votre compte Foxeo a ete reactive"

---

### Resume Epic 9 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 9.1 | Graduation Lab vers One — provisioning instance & migration contexte | FR74, FR75, FR166, FR167 |
| 9.2 | Graduation Lab vers One — notification & activation acces | FR76 |
| 9.3 | Demande d'abandon parcours Lab par le client | FR88 |
| 9.4 | Changement de tier abonnement client One | FR91 |
| 9.5a | Export RGPD des donnees client | FR92 |
| 9.5b | Transfert instance One au client sortant | FR154, FR157, FR161 |
| 9.5c | Anonymisation & retention des donnees apres resiliation | FR93, FR168 |

**Toutes les 12 FRs de l'Epic 9 sont couvertes.**

---

## Epic 10 : Dashboard One & Modules Commerciaux — Stories detaillees

**Objectif :** Les clients etablis accedent a un dashboard personnalise avec des modules metier activables, consultent leurs documents herites du Lab, et MiKL configure les modules actifs et le branding par client.

**FRs couverts:** FR38, FR39, FR40, FR41, FR42, FR43, FR139

**NFRs pertinentes:** NFR-P1, NFR-P2, NFR-S7, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** Le dashboard shell, le module registry et le systeme de module manifests existent depuis l'Epic 1. L'app `client-one` (apps/client/) est deja deployable. Cet epic construit l'experience One specifique : accueil personnalise, modules visibles, configuration par MiKL, branding. Les modules commerciaux (Signature, Calendrier, Branding, Site Web, SEO, Social, Maintenance) sont definis dans foxeo-modules-commerciaux.md — leur integration complete avec les APIs externes (Yousign, Google Calendar, etc.) est prevue en P2. Cet epic met en place la structure d'activation et l'UI shell de chaque module.

---

### Story 10.1 : Dashboard One — Accueil personnalise, navigation & modules actives

As a **client One (etabli)**,
I want **acceder a mon dashboard personnalise avec les modules actives pour moi et une navigation adaptee**,
So that **j'ai un espace professionnel clair avec uniquement les outils dont j'ai besoin**.

**Acceptance Criteria :**

**Given** un client One se connecte a son dashboard (FR38)
**When** la page d'accueil se charge
**Then** le dashboard One affiche :
- Un header avec le logo Foxeo One (ou branding personnalise si configure)
- Un message d'accueil : "Bonjour {prenom}" avec la date du jour
- Une section "Actions rapides" avec les raccourcis vers les modules les plus utilises
- Une section "Activite recente" : derniers messages MiKL, derniers documents mis a jour, derniere activite Elio
- Un acces rapide a Elio One (widget chat ou bouton flottant)
**And** la page se charge en moins de 2 secondes (NFR-P1)
**And** le design suit la palette One (orange vif + bleu-gris, dark mode) ou le branding personnalise

**Given** le client One a des modules actives (FR39)
**When** il consulte la navigation sidebar
**Then** seuls les modules actives pour ce client sont affiches dans la sidebar :
- La liste provient de `client_configs.active_modules`
- Chaque module affiche son icone et son label (depuis le module manifest)
- Les modules sont tries par categorie : Communication, Documents, Outils metier, Paramètres
- Un module desactive n'apparait PAS dans la navigation
**And** le module registry resout les modules au chargement en verifiant `active_modules` ∩ `module_manifests` avec `targets` incluant 'client-one'
**And** si aucun module n'est active (cas improbable), un message invite a contacter MiKL

**Given** le dashboard One doit s'adapter au client
**When** le composant dashboard-home.tsx se charge
**Then** il utilise les donnees de `client_configs` pour personnaliser :
- Les modules affiches (via `active_modules`)
- Le branding (via `custom_branding` — logo, nom affiche) (FR139, Story 10.4)
- Le message d'accueil (via profil communication si disponible)
**And** les donnees client sont fetches via TanStack Query avec queryKey `['client-config', clientId]`
**And** le layout est responsive : sidebar collapsible sur mobile, grille adaptative pour les widgets

---

### Story 10.2 : Documents herites du Lab, livrables & teasing Lab

As a **client One (etabli)**,
I want **consulter mes documents herites du Lab et mes livrables, et voir un teasing Lab si un nouveau projet est possible**,
So that **je retrouve tout mon travail precedent et je sais que je peux relancer un parcours si besoin**.

**Acceptance Criteria :**

**Given** un client One a ete gradue du Lab (FR40)
**When** il accede au module Documents dans son dashboard One
**Then** il peut voir :
- **Section "Briefs Lab"** : tous les briefs generes et valides pendant le parcours Lab (type='brief', filtres par `source='lab'`)
- **Section "Livrables"** : documents livres par MiKL apres deploiement (type='livrable')
- **Section "Autres documents"** : documents partages par MiKL (type='shared')
**And** chaque document affiche : titre, date, badge de type, apercu (rendu HTML pour markdown, thumbnail pour images/PDF)
**And** le module Documents (Epic 4) est reutilise — les documents Lab sont lies au meme `client_id` et donc automatiquement visibles
**And** un filtre "Origine" permet de distinguer : Lab / One / Tous

**Given** un client Direct One (sans parcours Lab)
**When** il accede aux documents
**Then** la section "Briefs Lab" n'est pas affichee (pas de parcours Lab)
**And** seuls les livrables et documents partages sont visibles

**Given** un client One pourrait beneficier d'un nouveau parcours Lab (FR41)
**When** il accede a la page d'accueil ou au module Documents
**Then** un encart teasing est affiche :
- Titre : "Un nouveau projet en tete ?"
- Description : "Relancez un parcours Lab pour structurer votre prochain projet avec Elio et MiKL."
- Bouton CTA : "En savoir plus" → ouvre le chat avec MiKL pre-rempli avec "Je souhaite lancer un nouveau parcours Lab"
**And** le teasing est visible uniquement si :
- Le client a un parcours Lab termine (`parcours.status='completed'`) OU n'a jamais eu de parcours Lab (Direct One)
- Le client n'a PAS de parcours Lab en cours
**And** MiKL peut desactiver le teasing par client via `client_configs.show_lab_teasing: boolean` (defaut: true)

**Given** un onglet "Mon parcours Lab" est accessible (historique Lab)
**When** le client clique dessus
**Then** il voit son parcours Lab termine en lecture seule (via le module historique-lab) :
- Etapes completees avec dates
- Briefs valides avec liens
- Duree totale du parcours
**And** cette vue est en lecture seule — aucune action possible

---

### Story 10.3 : Configuration modules actifs par MiKL & injection documentation Elio One

As a **MiKL (operateur)**,
I want **configurer les modules actifs pour chaque client One et injecter la documentation dans Elio One apres un deploiement**,
So that **chaque client a un dashboard adapte a ses besoins et Elio One connait les outils deployes**.

**Acceptance Criteria :**

**Given** MiKL consulte la fiche d'un client One dans le Hub (FR42)
**When** il accede a la section "Modules actifs"
**Then** il voit la liste de tous les modules disponibles avec pour chacun :
- Nom et description du module
- Icone du module
- Toggle actif/inactif
- Statut actuel (active/desactive)
- Date d'activation (si active)
**And** les modules de base (core-dashboard, chat, documents, elio) sont toujours actives et non desactivables (grisés)
**And** les modules commerciaux configurables sont :
| Module | Description | Pre-requis |
|--------|-------------|-----------|
| Signature | Signature electronique (Yousign) | Abonnement Signature |
| Calendrier | Synchronisation calendrier | Aucun |
| Branding | Guide de marque | Prestation branding commandee |
| Site Web | Dashboard analytics site | Prestation site commandee |
| SEO | Suivi positionnement | Prestation SEO commandee |
| Social | Reseaux sociaux | Prestation social commandee |
| Maintenance | Suivi maintenance | Contrat maintenance signe |

**Given** MiKL active ou desactive un module
**When** il clique sur le toggle
**Then** la Server Action `updateActiveModules(clientId, moduleId, enabled)` s'execute :
1. Met a jour `client_configs.active_modules` (ajout ou retrait du moduleId)
2. Logge l'evenement dans `activity_logs`
3. L'effet est immediat : au prochain chargement, le client voit/ne voit plus le module
**And** un toast confirme "Module {nom} active/desactive pour {client}"
**And** le cache TanStack Query est invalide

**Given** MiKL deploie une nouvelle fonctionnalite pour un client et veut mettre a jour la documentation Elio (FR43)
**When** il accede a la section "Documentation Elio" de la fiche client
**Then** il voit un formulaire pour injecter la documentation par module :
- Selection du module concerne (dropdown des modules actifs)
- Champ "Description" : ce que le module fait (textarea)
- Champ "Questions frequentes" : paires question/reponse (ajout dynamique)
  - Question : "Comment je fais X ?"
  - Reponse : "Allez dans Y puis Z"
- Champ "Problemes courants" : paires probleme/solution (ajout dynamique)
  - Probleme : "Ca ne marche pas"
  - Diagnostic : "Verifiez 1)... 2)..."
  - Escalade : "Contactez MiKL si..."
- Bouton "Sauvegarder"

**Given** MiKL sauvegarde la documentation Elio
**When** la Server Action `injectElioDocumentation(clientId, moduleId, documentation)` s'execute
**Then** la documentation est stockee dans `client_configs.elio_module_docs` :
```typescript
type ElioModuleDoc = {
  moduleId: string
  description: string
  faq: Array<{ question: string; answer: string }>
  commonIssues: Array<{ problem: string; diagnostic: string; escalation: string }>
  updatedAt: string
}
```
**And** Elio One integre cette documentation dans son system prompt des la prochaine conversation
**And** un toast confirme "Documentation Elio mise a jour pour le module {nom}"
**And** MiKL peut aussi coller un JSON de documentation (genere par Orpheus) pour les cas complexes

---

### Story 10.4 : Personnalisation branding dashboard One par client

As a **MiKL (operateur)**,
I want **personnaliser le branding du dashboard One de chaque client (logo, nom affiche, couleurs)**,
So that **chaque client a un espace qui porte visuellement son identite**.

**Acceptance Criteria :**

**Given** MiKL consulte la fiche d'un client One (FR139)
**When** il accede a la section "Branding"
**Then** il voit un formulaire de personnalisation :
- **Logo** : upload d'image (PNG, SVG, max 2 Mo) avec apercu
- **Nom affiche** : le nom qui apparait dans le header du dashboard (defaut : nom de l'entreprise du client)
- **Couleur d'accent** : color picker pour la couleur dominante du dashboard (defaut : couleur One standard)
- **Apercu en temps reel** : un mini-preview du dashboard avec les modifications appliquees
- Boutons "Sauvegarder" / "Reinitialiser aux valeurs par defaut"

**Given** MiKL sauvegarde le branding
**When** la Server Action `updateClientBranding(clientId, branding)` s'execute
**Then** la configuration est stockee dans `client_configs.custom_branding` :
```typescript
type CustomBranding = {
  logoUrl: string | null        // URL dans Supabase Storage
  displayName: string | null    // Nom affiche
  accentColor: string | null    // Couleur hex (#FF5733)
  updatedAt: string
}
```
**And** le logo est uploade dans Supabase Storage (dossier `/clients/{clientId}/branding/`)
**And** l'effet est immediat au prochain chargement du dashboard client
**And** un toast confirme "Branding mis a jour pour {client}"

**Given** le client One se connecte avec un branding personnalise
**When** le dashboard se charge
**Then** :
- Le logo personnalise remplace le logo Foxeo One dans le header et la sidebar
- Le nom affiche remplace "Foxeo One" dans le header
- La couleur d'accent est appliquee via des CSS custom properties (override de la variable `--accent`)
- Le reste du design (typographie, layout, structure) reste standard
**And** si aucun branding personnalise n'est defini, le design One par defaut est utilise
**And** le branding est charge via le hook `use-elio-config.ts` qui resout aussi le `custom_branding`

---

### Resume Epic 10 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 10.1 | Dashboard One — accueil personnalise & modules actives | FR38, FR39 |
| 10.2 | Documents herites Lab, livrables & teasing Lab | FR40, FR41 |
| 10.3 | Configuration modules actifs & injection documentation Elio | FR42, FR43 |
| 10.4 | Personnalisation branding dashboard One | FR139 |

**Toutes les 7 FRs de l'Epic 10 sont couvertes.**

---

## Epic 11 : Facturation & Abonnements — Stories detaillees

**Objectif :** MiKL et les clients gerent devis, factures et abonnements via Invoice Ninja (self-hosted) et Stripe avec suivi complet des paiements et notifications d'echec.

**FRs couverts:** FR77, FR78, FR94, FR95, FR96, FR97, FR98, **FR169, FR170**

**NFRs pertinentes:** NFR-I1, NFR-I3, NFR-S1, NFR-S7, NFR-P2, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** La facturation est geree par Invoice Ninja 5 (self-hosted Docker) avec Stripe Connect OAuth pour les paiements. Foxeo Hub expose une UI custom (React) qui communique via un API proxy vers Invoice Ninja. Les clients accedent a une vue lecture seule "Mes Factures". Les webhooks Stripe et Invoice Ninja sont recus par les API Routes (`apps/hub/app/api/webhooks/`). Invoice Ninja gere nativement : devis, factures, factures recurrentes, avoirs, envoi email, generation PDF, rappels automatiques.

---

### Story 11.1 : Module Facturation — Structure, integration Invoice Ninja & types

> **Technical Enabler** — Integration technique, prerequis au module facturation visible.

As a **MiKL (operateur)**,
I want **un module de facturation integre dans le Hub connecte a Invoice Ninja**,
So that **je peux gerer devis, factures et paiements de mes clients depuis une interface unifiee**.

**Acceptance Criteria :**

**Given** le module Facturation n'existe pas encore dans Foxeo
**When** le module est cree
**Then** la structure suivante est en place :
```
modules/facturation/
  index.ts
  manifest.ts                    # { id: 'facturation', targets: ['hub', 'client-one'], dependencies: [] }
  components/
    (vide pour l'instant)
  hooks/
    use-billing.ts               # Hook TanStack Query pour les donnees facturation
  actions/
    billing-proxy.ts             # Server Actions proxy vers Invoice Ninja API
  types/
    billing.types.ts             # Types TypeScript
  config/
    invoice-ninja.ts             # Configuration client API Invoice Ninja
```

**Given** le proxy API Invoice Ninja
**When** `config/invoice-ninja.ts` est configure
**Then** il expose un client HTTP configure avec :
- `INVOICE_NINJA_URL` : URL du service Invoice Ninja (depuis env vars)
- `INVOICE_NINJA_TOKEN` : Token API (depuis Supabase Vault, jamais expose cote client, NFR-S8)
- Headers par defaut : `X-Api-Token`, `Content-Type: application/json`
- Timeout : 30 secondes (NFR-I1)
- Retry : 1 retry en cas de timeout ou erreur 5xx

**Given** les types de facturation
**When** `billing.types.ts` est cree
**Then** les types principaux sont definis :
```typescript
type Quote = {
  id: string
  clientId: string
  number: string
  status: 'draft' | 'sent' | 'approved' | 'converted' | 'expired'
  lineItems: LineItem[]
  total: number
  validUntil: string
  createdAt: string
}

type Invoice = {
  id: string
  clientId: string
  number: string
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue' | 'cancelled'
  lineItems: LineItem[]
  total: number
  amountPaid: number
  dueDate: string
  pdfUrl: string | null
  createdAt: string
}

type LineItem = {
  productKey: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

type Payment = {
  id: string
  invoiceId: string
  amount: number
  method: 'stripe' | 'bank_transfer' | 'check' | 'cash'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  transactionReference: string | null
  createdAt: string
}
```

**Given** les API Routes webhook sont necessaires
**When** les routes sont creees
**Then** :
- `apps/hub/app/api/webhooks/invoice-ninja/route.ts` : recoit les webhooks Invoice Ninja (payment.created, invoice.sent, quote.approved, invoice.late)
- `apps/hub/app/api/webhooks/stripe/route.ts` : recoit les webhooks Stripe (charge.succeeded, charge.failed, payment_intent.*)
**And** chaque webhook valide la signature/token avant traitement
**And** les webhooks sont idempotents (verification du `event_id` pour eviter les doublons)
**And** les webhooks sont traites en moins de 5 secondes (NFR-I3)

---

### Story 11.2 : Creation & envoi de devis par MiKL

As a **MiKL (operateur)**,
I want **creer et envoyer des devis a mes clients avec suivi du statut**,
So that **je peux proposer des prestations de maniere professionnelle et suivre les acceptations**.

**Acceptance Criteria :**

**Given** MiKL accede au module Facturation dans le Hub (FR77)
**When** il clique sur "Nouveau devis"
**Then** un formulaire de creation s'affiche avec :
- Selection du client (dropdown des clients actifs)
- Lignes du devis (ajout dynamique) : designation, description, quantite, prix unitaire HT, total ligne
- Total HT, TVA (20% par defaut, configurable), Total TTC
- Conditions : "Devis valable 30 jours" (par defaut, editable)
- Notes publiques (visibles par le client) et notes privees (MiKL uniquement)
- Boutons : "Enregistrer (brouillon)" / "Envoyer au client"
**And** le formulaire utilise react-hook-form avec validation Zod

**Given** MiKL envoie le devis
**When** la Server Action `createAndSendQuote(clientId, lineItems, terms)` s'execute
**Then** :
1. Le devis est cree dans Invoice Ninja via `POST /api/v1/quotes`
2. Si "Envoyer" : le devis est envoye par email au client via `POST /api/v1/email_invoice` (entity='quote')
3. Le statut passe a 'sent'
4. Une notification in-app est envoyee au client : "Nouveau devis de MiKL — {montant} €"
**And** un toast confirme "Devis envoye a {client}"
**And** le devis est visible dans la liste des devis du Hub

**Given** MiKL veut suivre le statut d'un devis (FR78)
**When** il consulte la liste des devis
**Then** il voit pour chaque devis :
- Numero, client, montant, date de creation
- Statut avec badge colore : brouillon (gris), envoye (bleu), accepte (vert), converti (violet), expire (rouge)
- Actions disponibles : "Relancer", "Convertir en facture", "Annuler"
**And** les filtres disponibles : par statut, par client, par periode
**And** les donnees proviennent de Invoice Ninja via `GET /api/v1/quotes?include=client`

**Given** un client accepte un devis
**When** le webhook Invoice Ninja `quote.approved` est recu
**Then** :
1. MiKL est notifie : "Le client {nom} a accepte le devis {numero} — {montant} €"
2. Le devis est automatiquement converti en facture via `PUT /api/v1/quotes/{id}?action=convert`
3. La facture est envoyee par email au client
**And** le cache TanStack Query est invalide

---

### Story 11.3 : Abonnements recurrents Stripe & gestion des echecs de paiement

As a **MiKL (operateur)**,
I want **gerer les abonnements recurrents de mes clients via Stripe avec des alertes en cas d'echec de paiement**,
So that **les paiements sont automatises et je suis prevenu immediatement si un client a un probleme de paiement**.

**Acceptance Criteria :**

**Given** MiKL veut creer un abonnement recurrent pour un client (FR94)
**When** il accede a la fiche client, section "Abonnement"
**Then** il peut configurer la facturation recurrente :
- Type d'abonnement : Ponctuel / Essentiel (49€/mois) / Agentique (99€/mois)
- Frequence : mensuelle (par defaut), trimestrielle, annuelle
- Date de debut
- Modules supplementaires avec surcoait (ex : Signature +15€/mois, SEO Advanced +25€/mois)
- Bouton "Creer l'abonnement"

**Given** MiKL cree l'abonnement
**When** la Server Action `createRecurringInvoice(clientId, plan, frequency, extras)` s'execute
**Then** :
1. Une facture recurrente est creee dans Invoice Ninja via `POST /api/v1/recurring_invoices`
2. Le paiement Stripe est configure via Stripe Connect OAuth (lien de paiement genere)
3. Le client recoit la premiere facture par email avec le lien de paiement Stripe
4. Les factures suivantes sont generees automatiquement par Invoice Ninja selon la frequence
**And** le lien Stripe permet au client de saisir ses informations de paiement (CB)
**And** un toast confirme "Abonnement cree pour {client}"

**Given** un paiement Stripe echoue (FR95)
**When** le webhook Stripe `charge.failed` est recu
**Then** :
1. La facture correspondante est marquee 'overdue' dans Invoice Ninja
2. Une notification prioritaire est envoyee a MiKL : "Echec de paiement pour {client} — facture {numero}, {montant} €. Raison : {raison}"
3. Une notification est envoyee au client : "Votre paiement de {montant} € n'a pas pu etre effectue. Veuillez mettre a jour vos informations de paiement."
4. Un rappel automatique est programme (J+3, J+7 via Invoice Ninja)
**And** l'evenement est logge dans `activity_logs`
**And** apres 3 echecs consecutifs, MiKL est alerte avec priorite critique

**Given** un paiement Stripe reussit
**When** le webhook Stripe `charge.succeeded` est recu
**Then** :
1. Le paiement est enregistre dans Invoice Ninja via `POST /api/v1/payments`
2. La facture est marquee 'paid'
3. Le client est notifie : "Paiement de {montant} € recu — merci !"
**And** le cache TanStack Query est invalide

---

### Story 11.4 : Historique facturation client, avoirs & informations de paiement

As a **client Foxeo ou MiKL (operateur)**,
I want **consulter l'historique de facturation, generer des avoirs et mettre a jour les informations de paiement**,
So that **la gestion financiere est transparente et les corrections sont possibles**.

**Acceptance Criteria :**

**Given** un client One accede a sa section "Mes factures" (FR96)
**When** la page se charge
**Then** il voit :
- La liste de toutes ses factures avec : numero, date, montant, statut (brouillon, envoyee, payee, en retard)
- Pour chaque facture : bouton "Telecharger PDF" (via `GET /api/v1/download/{id}`)
- Pour les factures impayees : bouton "Payer maintenant" (redirige vers le lien Stripe)
- Un resume financier : total paye, montant en attente, prochain prelevement
**And** les donnees proviennent de Invoice Ninja via `GET /api/v1/invoices?client_id={clientId}&include=payments`
**And** le client ne voit que SES factures (filtrage par client_id dans la Server Action)
**And** la vue est lecture seule pour le client

**Given** MiKL veut generer un avoir pour un client (FR97)
**When** il accede a la facture concernee et clique "Creer un avoir"
**Then** un formulaire s'affiche avec :
- Reference de la facture d'origine
- Montant de l'avoir (max = montant de la facture)
- Raison de l'avoir (textarea)
- Bouton "Generer l'avoir"
**And** l'avoir est cree dans Invoice Ninja via `POST /api/v1/credits`
**And** un email est envoye au client avec le PDF de l'avoir
**And** le montant est deduit automatiquement de la prochaine facture recurrente (si applicable)
**And** MiKL est confirme par toast : "Avoir de {montant} € genere pour {client}"

**Given** un client veut mettre a jour ses informations de paiement (FR98)
**When** il accede a ses parametres, section "Paiement"
**Then** il voit :
- La carte bancaire actuelle (4 derniers chiffres, date d'expiration)
- Un bouton "Modifier ma carte"
**And** le bouton redirige vers le portail Stripe Customer (Stripe Customer Portal) pour mise a jour securisee
**And** la mise a jour est geree entierement par Stripe (pas de donnees CB dans Foxeo)
**And** apres la mise a jour, le webhook Stripe `customer.source.updated` est recu et le cache est invalide

---

### Story 11.5 : Facturation Lab 199€ — Paiement forfait & deduction setup One

As a **MiKL (operateur)**,
I want **facturer le forfait Lab a 199€, activer automatiquement l'acces Lab du client, et deduire ce montant du setup One si le client gradue**,
So that **le parcours Lab est financierement clair et le client beneficie de la deduction promise**.

**Acceptance Criteria:**

**Given** MiKL cree un client Lab et doit facturer le forfait Lab (FR169)
**When** il accede a la section "Facturation" de la fiche client et clique "Facturer le Lab"
**Then** une facture est generee via Invoice Ninja avec :
- Description : "Forfait Lab Foxeo — Accompagnement creation de projet"
- Montant : 199€ TTC
- Type : facture unique (pas de recurrence)
- Le statut de la facture est suivi dans `payments` (table Epic 11)
**And** un toast confirme "Facture Lab envoyee a {client}"
**And** l'evenement est logge dans `activity_logs`

**Given** le client Lab paie le forfait 199€
**When** le paiement est confirme (webhook Stripe ou marquage manuel par MiKL)
**Then** :
1. `clients.lab_paid` → true
2. `clients.lab_paid_at` → NOW()
3. `clients.lab_amount` → 19900 (centimes)
4. Le dashboard Lab est active pour le client (si pas deja fait)
5. Elio Lab est active
6. MiKL est notifie : "Paiement Lab recu — {client} a acces au Lab"
**And** le client recoit un email de confirmation : "Votre acces au Lab Foxeo est active !"

**Given** un client Lab gradue vers One (FR170)
**When** MiKL cree le devis setup One pour ce client
**Then** le systeme affiche automatiquement :
- Ligne de deduction : "Deduction forfait Lab" → -199€
- Le montant net du setup est calcule : setup_total - 199€
- Un tooltip explique : "Le forfait Lab (199€) est deduit du setup One, comme convenu."
**And** la deduction est tracee dans les metadonnees de la facture One : `metadata.lab_deduction: 19900`
**And** si le setup One est inferieur a 199€ (cas improbable), le montant net est 0€ (pas de remboursement du surplus)

**Given** MiKL veut voir l'historique des paiements Lab
**When** il filtre les factures par type "Lab"
**Then** il voit toutes les factures Lab avec statut (payee/en attente/annulee)
**And** pour les clients gradues, la mention "Deduit du setup One" est visible

---

### Resume Epic 11 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 11.1 | Module Facturation — structure, integration Invoice Ninja & types | — (fondation technique) |
| 11.2 | Creation & envoi de devis par MiKL | FR77, FR78 |
| 11.3 | Abonnements recurrents Stripe & gestion echecs paiement | FR94, FR95 |
| 11.4 | Historique facturation, avoirs & informations de paiement | FR96, FR97, FR98 |
| 11.5 | Facturation Lab 199€ — Paiement forfait & deduction setup One | FR169, FR170 |

**Toutes les 9 FRs de l'Epic 11 sont couvertes.**

---

## Epic 12 : Administration, Analytics & Templates — Stories detaillees

**Objectif :** MiKL pilote la plateforme avec des outils d'administration (logs, maintenance, backups), du monitoring (sante systeme, alertes, **monitoring instances One** — usage, seuils, upgrade), des analytics (metriques d'usage), des templates personnalisables (parcours Lab, emails), **provisioning** de nouvelles instances One, **verification documentation obligatoire par module** et la preparation des integrations futures (webhooks, API).

**FRs couverts:** FR102, FR103, FR104, FR105, FR115, FR116, FR120, FR121, FR137, FR138, FR147, FR148, **FR153, FR155, FR156, FR158, FR159, FR160, FR162, FR163, FR164, FR165**

**NFRs pertinentes:** NFR-R1 a NFR-R6, NFR-M1 a NFR-M5, NFR-S9, NFR-I5, NFR-P1

**Note architecturale :** Cet epic est le dernier — il construit les outils de pilotage de la plateforme. Le module `admin/` (targets: ['hub']) centralise les fonctionnalites d'administration. Le module `analytics/` gere les metriques. Le module `templates/` gere les templates reutilisables. Les logs d'activite utilisent la table `activity_logs` (creee en Story 1.2, Epic 1). Les integrations P2 (webhooks sortants, API client) sont preparees en structure uniquement — pas d'implementation fonctionnelle.

---

### Story 12.1 : Module Admin — Logs d'activite par client & mode maintenance

As a **MiKL (operateur)**,
I want **consulter les logs d'activite par client et activer un mode maintenance avec message personnalise**,
So that **je peux suivre ce qui se passe sur la plateforme et informer mes clients lors des maintenances**.

**Acceptance Criteria :**

**Given** le module Admin n'existe pas encore
**When** le module est cree
**Then** la structure suivante est en place :
```
modules/admin/
  index.ts
  manifest.ts                    # { id: 'admin', targets: ['hub'], dependencies: [] }
  components/
    activity-logs.tsx            # Vue logs d'activite
    maintenance-mode.tsx         # Controle mode maintenance
  hooks/
    use-activity-logs.ts
    use-maintenance.ts
  actions/
    toggle-maintenance.ts
  types/
    admin.types.ts
```

**Given** les besoins en donnees de cette story
**When** le module Admin est initialise
**Then** la table `activity_logs` (creee en Story 1.2, migration de base) est deja disponible avec : id (UUID PK), actor_type, actor_id, action, entity_type, entity_id, metadata (JSONB), created_at
**And** les index et policies RLS sont deja en place (Story 1.2)

**Given** MiKL accede aux logs d'activite (FR102)
**When** il consulte la page "Logs" du module Admin
**Then** il voit une liste chronologique des evenements avec :
- Date/heure
- Acteur (MiKL, Client {nom}, Systeme, Elio)
- Action (creation client, graduation, validation, paiement, connexion, etc.)
- Entite concernee (avec lien cliquable)
- Details supplementaires (metadata)
**And** les filtres disponibles : par client, par type d'action, par periode, par acteur
**And** la recherche textuelle fonctionne sur les champs action et metadata
**And** la pagination est en place (50 logs par page)
**And** les logs sont fetches via TanStack Query avec queryKey `['activity-logs', filters]`

**Given** MiKL veut activer le mode maintenance (FR103)
**When** il accede a la page "Maintenance" du module Admin
**Then** il voit :
- Toggle "Mode maintenance" (actif/inactif)
- Champ "Message aux clients" (textarea, pre-rempli : "La plateforme est en maintenance. Nous serons de retour tres bientot !")
- Champ "Duree estimee" (optionnel, ex: "30 minutes")
- Apercu du message tel qu'il apparaitra aux clients
- Bouton "Activer la maintenance"

**Given** MiKL active la maintenance
**When** la Server Action `toggleMaintenanceMode(enabled, message, estimatedDuration)` s'execute
**Then** :
1. Un flag `system_config.maintenance_mode` est positionne a `true` dans une table `system_config` (ou dans Supabase Vault)
2. Le message est stocke dans `system_config.maintenance_message`
3. Les middlewares des apps client (hub et client-one/lab) detectent le flag et affichent une page de maintenance au lieu du dashboard :
   - Page epuree avec le logo Foxeo
   - Message personnalise de MiKL
   - Duree estimee (si fournie)
   - "Revenez dans quelques instants"
4. MiKL reste connecte normalement (le Hub n'est PAS affecte par la maintenance)
**And** un toast confirme "Mode maintenance active"
**And** l'evenement est logge dans `activity_logs`

**Given** MiKL desactive la maintenance
**When** il remet le toggle a "inactif"
**Then** `system_config.maintenance_mode` → false
**And** les clients retrouvent immediatement l'acces
**And** un toast confirme "Mode maintenance desactive — clients reconnectes"

---

### Story 12.2 : Export complet donnees client & backups automatiques

As a **MiKL (operateur)**,
I want **exporter l'ensemble des donnees d'un client et avoir la garantie de backups automatiques avec restauration possible**,
So that **je peux fournir les donnees sur demande et je sais que rien n'est perdu**.

**Acceptance Criteria :**

**Given** MiKL veut exporter les donnees completes d'un client (FR104)
**When** il accede a la fiche client, section "Administration" et clique "Exporter toutes les donnees"
**Then** la Server Action `exportClientData(clientId)` s'execute (meme action que Story 9.5 pour le RGPD mais accessible aussi a MiKL) :
- L'export genere un ZIP contenant toutes les donnees du client (cf. Story 9.5 pour le detail)
- Un lien de telechargement est genere (expire apres 7 jours)
- MiKL est notifie quand l'export est pret (notification in-app)
**And** l'export est stocke dans Supabase Storage (dossier `/exports/{clientId}/`)
**And** un toast confirme "Export en cours de generation — vous serez notifie quand il sera pret"
**And** l'evenement est logge dans `activity_logs`

**Given** le systeme doit effectuer des backups automatiques (FR105)
**When** le systeme est operationnel
**Then** les backups sont configures selon la politique suivante :
- **Backup quotidien (Supabase natif)** : sauvegarde automatique de la base de donnees avec retention 30 jours (NFR-R2)
- **Backup hebdomadaire (cold backup)** : export complet vers un stockage externe (Supabase Storage bucket dedie ou S3) avec retention 1 an
- **RPO** : 24 heures maximum de perte de donnees (NFR-R3)
- **RTO** : 4 heures maximum de temps de restauration (NFR-R4)
**And** la configuration est documentee dans un fichier `docs/backup-policy.md` (non cree dans cette story, mais la strategy est implementee)

**Given** MiKL veut verifier l'etat des backups
**When** il accede a la page "Backups" du module Admin
**Then** il voit :
- Date et statut du dernier backup quotidien (Supabase)
- Date et statut du dernier backup hebdomadaire (cold)
- Historique des 30 derniers backups
- Bouton "Declencher un backup manuel" (cold backup)
- Bouton "Restaurer un backup" (avec selection de date et confirmation)
**And** la restauration d'un backup necessite une double confirmation ("Attention : cette action ecrasera les donnees actuelles. Etes-vous sur ?")
**And** les informations de backup sont recuperees via l'API Supabase Management et/ou les metadonnees stockees dans `system_config`

---

### Story 12.3 : Templates reutilisables — Parcours Lab & emails automatiques

As a **MiKL (operateur)**,
I want **creer des templates de parcours Lab reutilisables et personnaliser les emails automatiques de la plateforme**,
So that **je peux onboarder chaque nouveau client avec un parcours pre-configure et garder une communication email coherente**.

**Acceptance Criteria :**

**Given** MiKL veut gerer les templates de parcours Lab (FR137)
**When** il accede au module Templates, section "Parcours Lab"
**Then** il voit la liste des templates existants avec :
- Nom du template (ex: "Parcours Branding Complet", "Parcours Site Web Express")
- Nombre d'etapes
- Nombre de clients qui l'utilisent
- Date de creation / derniere modification
- Actions : "Modifier", "Dupliquer", "Archiver"
- Bouton "Nouveau template"

**Given** MiKL cree ou modifie un template de parcours
**When** il ouvre l'editeur de template
**Then** il peut :
- Definir le nom et la description du template
- Ajouter/supprimer/reordonner des etapes (drag & drop)
- Pour chaque etape :
  - Titre et description
  - Ordre (position dans le parcours)
  - Actif par defaut (toggle)
  - Prompts Elio Lab (les questions guidees pour cette etape)
- Sauvegarder le template
**And** le template est stocke dans `parcours_templates` (table creee en Story 6.1)
**And** la validation Zod verifie que le template a au moins 2 etapes
**And** un template modifie n'impacte PAS les parcours deja en cours (les parcours actifs gardent une copie de la config au moment de l'assignation)

**Given** MiKL veut personnaliser les emails automatiques (FR138)
**When** il accede au module Templates, section "Emails"
**Then** il voit la liste des templates d'emails avec :
| Template | Declencheur | Variables disponibles |
|----------|-------------|----------------------|
| Bienvenue Lab | Premiere connexion client Lab | {prenom}, {entreprise}, {parcours_nom} |
| Brief valide | MiKL valide un brief | {prenom}, {titre_brief}, {commentaire} |
| Brief refuse | MiKL refuse un brief | {prenom}, {titre_brief}, {commentaire} |
| Graduation | Client gradue vers One | {prenom}, {duree_lab}, {modules_actives} |
| Facture envoyee | Facture envoyee | {prenom}, {montant}, {numero_facture} |
| Echec paiement | Paiement echoue | {prenom}, {montant}, {raison} |
| Rappel parcours | Client Lab inactif | {prenom}, {jours_inactif}, {etape_en_cours} |

**Given** MiKL modifie un template d'email
**When** il ouvre l'editeur
**Then** il peut :
- Modifier le sujet de l'email
- Modifier le contenu (editeur texte riche simplifie, pas de HTML brut)
- Inserer des variables via des boutons ({prenom}, {entreprise}, etc.)
- Voir un apercu du rendu
- Bouton "Sauvegarder" / "Reinitialiser au defaut"
**And** les templates sont stockes dans une table `email_templates` (id, template_key, subject, body, variables, updated_at)
**And** les templates par defaut sont pre-inseres en migration

---

### Story 12.4 : Analytics & metriques d'usage

As a **MiKL (operateur)**,
I want **consulter des statistiques d'utilisation de la plateforme par fonctionnalite et des metriques d'usage anonymisees**,
So that **je peux comprendre comment mes clients utilisent la plateforme et optimiser mon offre**.

**Acceptance Criteria :**

**Given** le systeme collecte des metriques d'usage anonymisees (FR120)
**When** les clients et MiKL utilisent la plateforme
**Then** les evenements suivants sont traces (dans `activity_logs` avec `actor_type='system'`) :
- Connexions (par jour, par client)
- Pages visitees (par module)
- Messages envoyes (chat MiKL, Elio)
- Documents consultes/telecharges
- Briefs soumis / valides / refuses
- Temps passe par session (approximation)
**And** les metriques sont anonymisees pour les agregations globales (pas de donnees personnelles dans les stats)
**And** la collecte respecte les consentements RGPD (opt-in lors de l'inscription, Story 1.9)

**Given** MiKL accede au module Analytics (FR121)
**When** la page se charge
**Then** un dashboard analytique affiche :
- **Vue d'ensemble** :
  - Nombre de clients actifs (Lab / One / Total)
  - Taux de graduation Lab → One (pourcentage)
  - Revenus mensuels recurrents (MRR) — si facturation active
  - Nombre de demandes traitees ce mois (Validation Hub)
- **Utilisation par module** :
  - Classement des modules les plus utilises (nombre d'acces)
  - Modules les moins utilises (opportunites de desactivation)
- **Activite Elio** :
  - Nombre de conversations par jour/semaine
  - Ratio feedback positif/negatif
  - Questions les plus frequentes (top 10)
- **Engagement clients** :
  - Clients les plus actifs (top 5)
  - Clients inactifs depuis > 7 jours (alerte)
  - Duree moyenne des parcours Lab
**And** les donnees sont visualisees avec des sparklines, barres et compteurs (style "Minimal Futuriste")
**And** un filtre par periode est disponible (7 jours, 30 jours, 90 jours, 1 an)
**And** les donnees sont fetches via TanStack Query et calculees par des requetes Supabase aggregees (COUNT, AVG, GROUP BY)

---

### Story 12.5a : Monitoring sante systeme & alertes dysfonctionnement

As a **MiKL (operateur)**,
I want **voir un indicateur de sante du systeme et recevoir des alertes en cas de dysfonctionnement**,
So that **je sais que tout fonctionne et je suis informe immediatement en cas de probleme**.

**Acceptance Criteria :**

**Given** MiKL veut voir la sante du systeme (FR147)
**When** il accede a la page "Monitoring" du module Admin
**Then** un dashboard de sante affiche :
- **Statut global** : indicateur vert (tout OK) / orange (degradé) / rouge (problème)
- **Services internes** :
  | Service | Verification | Seuil |
  |---------|-------------|-------|
  | Supabase DB | Requete `SELECT 1` | < 500ms |
  | Supabase Auth | Check session | Fonctionnel |
  | Supabase Realtime | Check connexion | Connecte |
  | Supabase Storage | Check upload/download | Fonctionnel |
- **Services externes** :
  | Service | Verification | Seuil |
  |---------|-------------|-------|
  | Invoice Ninja | `GET /api/v1/ping` | < 2s |
  | Stripe | Status API | Operationnel |
  | DeepSeek (LLM) | `GET /health` ou test prompt | < 5s |
  | Cal.com | API check | < 2s |
  | OpenVidu | API check | < 2s |
- **Metriques systeme** :
  - Temps de reponse moyen des pages (derniere heure)
  - Nombre d'erreurs (derniere heure)
  - Taille de la base de donnees
**And** les checks sont effectues a la demande (bouton "Rafraichir") et/ou periodiquement (toutes les 5 minutes via un cron leger)
**And** les resultats sont stockes dans `system_config.health_checks` (JSONB)

**Given** un dysfonctionnement est detecte (FR148)
**When** un service ne repond pas ou depasse le seuil
**Then** :
1. Le statut global passe a orange (degrade) ou rouge (critique)
2. Une notification prioritaire est envoyee a MiKL : "Alerte systeme — {service} ne repond pas ({details})"
3. L'evenement est logge dans `activity_logs` (type 'system_alert')
4. Si le service est un service externe (Invoice Ninja, Stripe, etc.) : le systeme reste fonctionnel en mode degrade (NFR-R6, NFR-I5) avec message explicite aux utilisateurs
**And** une alerte n'est envoyee qu'une fois par incident (pas de spam, debounce 15 minutes)

---

### Story 12.5b : Preparation integrations P2 — Webhooks & API

As a **MiKL (operateur)**,
I want **avoir la structure de donnees prete pour les integrations futures (webhooks sortants et API client)**,
So that **la plateforme est prete a evoluer vers les integrations en Phase 2 sans migration lourde**.

**Acceptance Criteria :**

**Given** la preparation des integrations futures (FR115, FR116)
**When** la structure est mise en place
**Then** :

**Webhooks sortants (FR115) — Structure P2 :**
- Une page "Webhooks" dans le module Admin affiche : "Fonctionnalite disponible en Phase 2"
- La table `outgoing_webhooks` est creee (en migration) avec : id, url, events (TEXT[]), secret, active, created_at
- Aucune logique d'envoi n'est implementee (P2)
- La UI affiche un placeholder avec description : "Configurez des webhooks sortants pour integrer Foxeo avec vos outils externes"

**API Client (FR116) — Structure P2 :**
- Une page "API" dans le module Admin affiche : "Fonctionnalite disponible en Phase 2"
- La table `api_keys` est creee (en migration) avec : id, client_id, key_hash, name, permissions (TEXT[]), last_used_at, created_at, revoked_at
- Aucune logique d'authentification API n'est implementee (P2)
- La UI affiche un placeholder avec description : "Generez des cles API pour permettre a vos clients d'integrer Foxeo dans leurs systemes"
**And** les tables sont creees pour eviter une migration future, mais restent vides
**And** la mention "Phase 2" est clairement visible sur ces fonctionnalites

---

### Story 12.6 : Provisioning instance One depuis le Hub

As a **MiKL (operateur)**,
I want **provisionner une nouvelle instance Foxeo One dediee (Vercel + Supabase) directement depuis le Hub**,
So that **chaque client One recoit son propre environnement isole avec ses donnees et son code**.

**Acceptance Criteria:**

**Given** MiKL cree un nouveau client Direct One (pas de parcours Lab) (FR156)
**When** il accede a la fiche client et clique "Provisionner instance One"
**Then** une modale de provisioning s'affiche avec :
- Slug de l'instance : champ texte pre-rempli avec le nom de l'entreprise en kebab-case (ex: "association-sport-plus")
- URL resultante : `https://{slug}.foxeo.io`
- Modules a activer (checkboxes)
- Tier Elio initial (Essentiel / Agentique)
- Estimation du cout mensuel infrastructure (~5-7€ sur tiers gratuits)
- Bouton "Lancer le provisioning"

**Given** MiKL lance le provisioning
**When** la Server Action `provisionOneInstance(clientId, slug, modules, tier)` s'execute
**Then** le processus suivant est declenche :

1. **Validation pre-provisioning :**
   - Verification que le slug est unique (pas de collision avec une instance existante)
   - Verification que le client n'a pas deja une instance One active
   - Validation du format du slug (kebab-case, 3-50 caracteres, pas de mots reserves)

2. **Creation projet Supabase (via Supabase Management API) :**
   - Nom du projet : `foxeo-one-{slug}`
   - Region : eu-west-1 (Paris)
   - Plan : Free (upgrade ulterieur si necessaire)
   - Recuperation des credentials (URL, anon key, service role key)

3. **Execution des migrations DB :**
   - Toutes les migrations du template client sont executees sur le nouveau Supabase
   - Tables creees : `client_config`, `elio_conversations`, `elio_messages`, `documents`, `messages`, `notifications`, `activity_logs`
   - Seed data : configuration initiale du client (modules, tier, branding par defaut)

4. **Deploiement Vercel :**
   - Clone du template `apps/client/` en nouveau projet Vercel
   - Configuration des env variables :
     | Variable | Valeur |
     |----------|--------|
     | `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase cree |
     | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique Supabase |
     | `SUPABASE_SERVICE_ROLE_KEY` | Cle service (server-side uniquement) |
     | `INSTANCE_SECRET` | Secret HMAC genere (UUID v4) |
     | `HUB_API_URL` | `https://hub.foxeo.io/api` |
     | `ACTIVE_MODULES` | Liste JSON des modules actives |
     | `ELIO_TIER` | 'one' ou 'one_plus' |
     | `CLIENT_SLUG` | Slug du client |
   - Configuration du domaine : `{slug}.foxeo.io`
   - Declenchement du premier deploiement

5. **Enregistrement dans le Hub :**
   - Insert dans `client_instances` avec status 'provisioning'
   - `instance_url`, `supabase_url`, `vercel_project_id`, `instance_secret`

6. **Health check :**
   - Le Hub ping `GET https://{slug}.foxeo.io/api/hub/health` toutes les 10 secondes (max 5 minutes)
   - Quand l'instance repond `{ status: 'ok' }` :
     - `client_instances.status` → 'active'
     - Notification a MiKL : "Instance {slug}.foxeo.io prete !"
   - Si timeout (5 min) : `status` → 'failed', alerte MiKL avec log d'erreur

**And** l'ensemble du provisioning prend moins de 5 minutes
**And** un indicateur de progression est affiche a MiKL pendant le provisioning :
  - "Creation du projet Supabase..." → "Execution des migrations..." → "Deploiement Vercel..." → "Verification de sante..." → "Instance prete !"
**And** l'evenement 'instance_provisioned' est logge dans `activity_logs`

**Given** le provisioning echoue a une etape
**When** une erreur survient
**Then** :
1. Les etapes deja completees sont nettoyees (rollback) :
   - Suppression du projet Supabase si cree
   - Suppression du projet Vercel si cree
2. `client_instances.status` → 'failed'
3. Le message d'erreur est affiche a MiKL avec le detail de l'etape en echec
4. Un bouton "Reessayer" est disponible
**And** l'erreur est logguee dans `activity_logs` avec le stacktrace

**Given** MiKL veut voir l'etat des instances provisionnees
**When** il accede a la section "Instances" du module Admin (ou page dediee)
**Then** il voit un tableau listant toutes les instances :
| Colonne | Description |
|---------|-------------|
| Client | Nom + entreprise |
| Slug | `{slug}.foxeo.io` (lien cliquable) |
| Statut | Provisioning / Active / Suspended / Archived / Failed |
| Tier | Essentiel / Agentique |
| Modules | Liste des modules actives |
| Cree le | Date de provisioning |
| Derniere sante | Date + statut du dernier health check |
**And** des actions sont disponibles par instance : "Voir les metriques", "Suspendre", "Archiver"

---

### Story 12.7 : Monitoring instances One — usage, seuils & alertes

As a **MiKL (operateur)**,
I want **surveiller l'usage des ressources de chaque instance One et recevoir des alertes quand les seuils sont atteints**,
So that **je peux anticiper les depassements de capacite et proposer un upgrade au client avant qu'il ne soit impacte**.

**Acceptance Criteria:**

**Given** le systeme doit surveiller l'usage de chaque instance One (FR162)
**When** un cron quotidien s'execute (Edge Function Supabase, 6h00)
**Then** pour chaque instance One avec `status='active'` :
1. Le Hub appelle `GET https://{slug}.foxeo.io/api/hub/health` qui retourne :
```typescript
type UsageMetrics = {
  dbRows: number          // Nombre total de lignes en DB
  storageUsedMb: number   // Espace Storage utilise (MB)
  bandwidthUsedGb: number // Bande passante mensuelle (GB)
  edgeFunctionCalls: number // Invocations Edge Functions ce mois
}
```
2. Les metriques sont stockees dans `client_instances.usage_metrics` (JSONB)
3. `client_instances.last_health_check` → NOW()

**Given** les metriques sont collectees
**When** un seuil est atteint (FR163)
**Then** le systeme evalue les seuils suivants :
| Metrique | Seuil gratuit | 60% (info) | 80% (warning) | 95% (critical) |
|----------|---------------|------------|----------------|-----------------|
| DB rows | 500K | 300K | 400K | 475K |
| Storage | 1 GB | 600 MB | 800 MB | 950 MB |
| Bandwidth | 2 GB/mois | 1.2 GB | 1.6 GB | 1.9 GB |
| Edge Functions | 500K/mois | 300K | 400K | 475K |
**And** `client_instances.alert_level` est mis a jour :
- 'none' si aucun seuil atteint
- 'info' si un seuil 60% est atteint
- 'warning' si un seuil 80% est atteint
- 'critical' si un seuil 95% est atteint (le niveau le plus eleve gagne)
**And** une notification est envoyee a MiKL selon le niveau :
- **info** : notification in-app uniquement : "Instance {slug} : usage DB a 60%"
- **warning** : notification in-app + email : "Instance {slug} : usage Storage a 80% — envisager un upgrade"
- **critical** : notification in-app + email + badge rouge dans la liste des instances : "URGENT : Instance {slug} proche de la limite ({metrique} a 95%)"
**And** la notification n'est envoyee qu'une fois par palier franchi (pas de spam si le seuil reste stable)
**And** l'evenement est logge dans `activity_logs`

**Given** MiKL veut consulter la sante de toutes les instances One (FR164)
**When** il accede au "Tableau de bord Instances" dans le module Admin
**Then** il voit :
- **Vue d'ensemble** :
  - Nombre total d'instances actives
  - Nombre d'alertes en cours (par niveau)
  - Cout mensuel estime total des instances
- **Liste des instances** avec indicateurs visuels :
  - Badge vert (none), bleu (info), orange (warning), rouge (critical)
  - Barres de progression pour chaque metrique (DB rows, Storage, Bandwidth)
  - Derniere date de health check
- **Detail par instance** (clic sur une instance) :
  - Historique des metriques sur 30 jours (graphique)
  - Historique des alertes
  - Modules actives
  - Configuration Elio (tier, docs injectees)
  - Bouton "Initier un upgrade"
**And** les donnees sont fetches via TanStack Query avec queryKey `['instances', 'monitoring']`
**And** un filtre par statut d'alerte est disponible

**Given** MiKL veut initier un upgrade de tier infrastructure (FR165)
**When** il clique "Initier un upgrade" depuis le detail d'une instance
**Then** une modale s'affiche avec :
- Metriques actuelles et seuils depassees
- Options d'upgrade :
  | Upgrade | Action | Cout estime |
  |---------|--------|-------------|
  | Supabase Pro | Migrer vers plan Pro ($25/mois) | +25$/mois |
  | Vercel Pro | Migrer vers plan Pro ($20/mois) | +20$/mois |
  | Les deux | Migration combinee | +45$/mois |
- Recommandation automatique basee sur les metriques depassees
- Note : "Le client sera informe du changement et du nouveau cout"
- Boutons "Confirmer l'upgrade" / "Contacter le client d'abord"
**And** "Contacter le client d'abord" ouvre le chat MiKL pre-rempli avec un message type :
  "Bonjour {prenom}, votre espace Foxeo One grandit ! Nous approchons des limites de votre formule actuelle. Je vous propose un upgrade pour assurer la continuite du service. Voulez-vous qu'on en discute ?"
**And** pour le MVP, l'upgrade reel des tiers Supabase/Vercel est effectue manuellement par MiKL (via les dashboards Supabase/Vercel). Le Hub enregistre l'intention et le statut.

---

### Story 12.8 : Documentation obligatoire par module & verification

As a **MiKL (operateur) et client One**,
I want **que chaque module deploye ait une documentation utilisateur obligatoire (guide, FAQ, flows) verifiable et accessible**,
So that **les clients peuvent utiliser leurs outils en autonomie et Elio One dispose d'une base de connaissances precise**.

**Acceptance Criteria:**

**Given** chaque module developpe doit avoir une documentation obligatoire (FR158)
**When** un module est cree dans `packages/modules/[nom]/`
**Then** la structure suivante est requise :
```
packages/modules/[nom]/
  docs/
    guide.md      # Guide utilisateur pas-a-pas
    faq.md        # Questions frequentes
    flows.md      # Diagrammes de flux / parcours utilisateur
```
**And** le contrat ModuleManifest est etendu avec :
```typescript
export interface ModuleManifest {
  // ... champs existants ...
  documentation: {
    hasGuide: boolean     // docs/guide.md existe et n'est pas vide
    hasFaq: boolean       // docs/faq.md existe et n'est pas vide
    hasFlows: boolean     // docs/flows.md existe et n'est pas vide
  }
}
```
**And** un script de validation `scripts/check-module-docs.ts` verifie que tous les modules actifs ont les 3 fichiers de documentation
**And** ce script est execute en CI (pre-deploy) — un module sans documentation ne peut PAS etre deploye

**Given** la documentation module est accessible au client (FR159)
**When** un client One consulte le module Documents
**Then** une section "Documentation" affiche les guides de chaque module actif :
- Organisee par module (un onglet ou accordeon par module)
- Le guide.md est rendu en HTML (Markdown → HTML)
- La FAQ est affichee en format accordeon (question cliquable → reponse)
- Les flows sont affiches comme images/diagrammes
**And** la documentation est chargee depuis les fichiers `docs/` du module (servis par l'API de l'instance)
**And** un champ de recherche textuelle permet de chercher dans toute la documentation

**Given** la documentation alimente Elio One (FR160)
**When** Elio One recoit une question d'un client
**Then** le system prompt de Elio One inclut la documentation de tous les modules actifs :
- Le contenu de `guide.md`, `faq.md` et `flows.md` est injecte dans le contexte
- Si le client pose une question sur un module specifique, Elio repond en s'appuyant sur la documentation
- Si la documentation ne couvre pas la question, Elio repond :
  "Je n'ai pas cette information dans ma documentation. Voulez-vous que je transmette votre question a MiKL ?"
**And** la documentation est cachee en memoire (refreshed au deploy) pour eviter de la relire a chaque conversation
**And** pour les modules avec beaucoup de documentation, seuls les fichiers du module concerne sont injectes (pas toute la doc de tous les modules a chaque conversation)

**Given** la documentation est incluse dans l'export client (FR161)
**When** un client One quitte Foxeo (Story 9.5 — procedure de sortie)
**Then** l'export inclut :
- Un dossier `documentation/` avec un sous-dossier par module actif
- Chaque sous-dossier contient : guide.md, faq.md, flows.md
- Un fichier `documentation/README.md` listant tous les modules documentes
**And** la documentation fait partie du "Guide d'autonomie" fourni au client

---

### Resume Epic 12 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 12.1 | Module Admin — logs d'activite & mode maintenance | FR102, FR103 |
| 12.2 | Export complet donnees client & backups automatiques | FR104, FR105 |
| 12.3 | Templates reutilisables — parcours Lab & emails | FR137, FR138 |
| 12.4 | Analytics & metriques d'usage | FR120, FR121 |
| 12.5a | Monitoring sante systeme & alertes dysfonctionnement | FR147, FR148 |
| 12.5b | Preparation integrations P2 — Webhooks & API | FR115, FR116 |
| 12.6 | Provisioning instance One depuis le Hub | FR153, FR155, FR156 |
| 12.7 | Monitoring instances One — usage, seuils & alertes | FR162, FR163, FR164, FR165 |
| 12.8 | Documentation obligatoire par module & verification | FR158, FR159, FR160, FR161 |

**Toutes les 20 FRs de l'Epic 12 sont couvertes.**
