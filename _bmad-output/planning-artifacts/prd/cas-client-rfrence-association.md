# Cas Client Référence — Association

## Contexte

| Aspect | Détail |
|--------|--------|
| **Structure** | Association |
| **Utilisatrice** | Assistante de direction (seule salariée) |
| **Responsabilités** | Admin + Formations + Événements + Adhésions + Partenaires |
| **Problème** | 8+ outils différents, pas de CRM, site WordPress obsolète, workflows manuels |

## Outils Actuels (à remplacer)

| Outil | Usage actuel | Décision |
|-------|--------------|----------|
| Pack Office | Documents, tableaux | Garder (export/import) |
| Teams | Communication interne | Garder |
| HelloAsso | Billetterie, paiements | **Remplacer** (Stripe + custom) |
| Weezevent | Billetterie événements | **Remplacer** (Stripe + custom) |
| WordPress | Site vitrine | **Remplacer** (refonte complète) |
| Microsoft Forms | Inscriptions | **Remplacer** (intégré au site) |
| Doodle | Planification | Garder ou intégrer |
| Adobe Acrobat | PDFs | Génération auto dans One |

## Architecture Cible

```
                         SITE PUBLIC
                    (Vitrine + Espace Adhérent)
┌─────────────────────────────────────────────────────────────┐
│  🌐 site-association.fr                                     │
│                                                             │
│  VITRINE (public)               ESPACE ADHÉRENT (login)     │
│  ├── Accueil                    ├── Mon profil              │
│  ├── Qui sommes-nous            ├── Mes inscriptions        │
│  ├── Formations (catalogue)     ├── Mes formations          │
│  ├── Événements (agenda)        ├── Mes factures            │
│  ├── Adhésion (rejoindre)       ├── Mes attestations        │
│  └── Contact                    └── Mon historique          │
│                                                             │
│  PARCOURS INSCRIPTION                                       │
│  [Voir formation] → [S'inscrire] → [Paiement Stripe]        │
│                   → [Confirmation email]                    │
│                   → [Accès espace adhérent]                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Données temps réel
                              ▼
                      FOXEO ONE (Admin)
┌─────────────────────────────────────────────────────────────┐
│  🦊 Dashboard Association                                   │
│                                                             │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       │
│  │ Tableau │   CRM   │ Forma-  │ Événe-  │ Adhé-   │       │
│  │ de bord │         │ tions   │ ments   │ sions   │       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘       │
│                                                             │
│  📊 TABLEAU DE BORD                                         │
│  ├── KPIs : adhérents actifs, CA formations, CA events      │
│  ├── Alertes : paiements en attente, docs Qualiopi manquants│
│  ├── Agenda : prochaines formations, événements             │
│  └── Actions rapides : voir inscriptions du jour            │
│                                                             │
│  👥 CRM ADHÉRENTS                                           │
│  ├── Fiche unique par personne                              │
│  │   ├── Coordonnées                                        │
│  │   ├── Statut adhésion (actif, expiré, prospect)          │
│  │   ├── Formations suivies                                 │
│  │   ├── Événements participés                              │
│  │   ├── Historique paiements                               │
│  │   └── Notes internes                                     │
│  ├── Segmentation (filtres, tags)                           │
│  ├── Export (CSV, PDF)                                      │
│  └── Communication ciblée (email groupé)                    │
│                                                             │
│  🎓 FORMATIONS (Qualiopi)                                   │
│  ├── Catalogue                                              │
│  │   ├── Créer/modifier formation                           │
│  │   ├── Programme, objectifs, prérequis                    │
│  │   └── Tarifs, durée, formateur                           │
│  ├── Sessions                                               │
│  │   ├── Planifier une session                              │
│  │   ├── Inscrits, liste d'attente                          │
│  │   ├── Émargements (signature électronique)               │
│  │   └── Documents générés auto                             │
│  ├── Conformité Qualiopi                                    │
│  │   ├── Checklist par formation                            │
│  │   ├── Documents requis (convention, programme, etc.)     │
│  │   ├── Alertes documents manquants                        │
│  │   └── Export dossier contrôle                            │
│  └── Facturation                                            │
│      ├── Factures auto après paiement Stripe                │
│      ├── Attestations de formation                          │
│      └── Suivi paiements (OPCO, personnel)                  │
│                                                             │
│  🎉 ÉVÉNEMENTS                                              │
│  ├── Créer événement                                        │
│  │   ├── Titre, description, date, lieu                     │
│  │   ├── Jauge participants                                 │
│  │   ├── Tarif (gratuit, payant, tarif adhérent)            │
│  │   └── Publication sur le site                            │
│  ├── Gestion inscriptions                                   │
│  │   ├── Liste inscrits                                     │
│  │   ├── Paiements Stripe                                   │
│  │   └── Emails confirmation/rappel                         │
│  └── Post-événement                                         │
│      ├── Participants réels                                 │
│      ├── Facturation                                        │
│      └── Communication remerciement                         │
│                                                             │
│  📅 ADHÉSIONS (Campagne Octobre)                            │
│  ├── Configuration campagne                                 │
│  │   ├── Dates ouverture/fermeture                          │
│  │   ├── Tarifs (individuel, famille, bienfaiteur)          │
│  │   └── Avantages par niveau                               │
│  ├── Suivi                                                  │
│  │   ├── Nouveaux, renouvellements, perdus                  │
│  │   ├── Objectif vs réalisé                                │
│  │   └── Relances automatiques                              │
│  └── Comptabilité                                           │
│      ├── Suivi paiements                                    │
│      ├── Export comptable                                   │
│      └── Reçus fiscaux (si applicable)                      │
│                                                             │
│  🤝 PARTENAIRES                                             │
│  ├── Liste partenaires                                      │
│  ├── Événements externes                                    │
│  ├── Mise à disposition adhérents                           │
│  └── Suivi participations                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Élio One — Assistant Agentique

Élio One pour cette cliente n'est pas un simple chatbot. C'est un agent capable d'**actions réelles** dans le système.

### Capacités

| Type | Exemples | Niveau d'autonomie |
|------|----------|-------------------|
| **Requêtes** | "Combien d'inscrits à la formation du 15 mars ?" | Autonome |
| | "Liste des adhérents qui n'ont pas renouvelé" | Autonome |
| | "Qui a une facture impayée depuis plus de 30 jours ?" | Autonome |
| **Actions simples** | "Envoie un email de rappel à ces personnes" | Validation avant envoi |
| | "Génère l'attestation de formation pour Jean Dupont" | Autonome |
| | "Publie cet événement sur le site" | Validation avant publication |
| **Actions complexes** | "Prépare la relance adhésions pour les non-renouvelés" | Propose, MiKL valide |
| | "Génère le dossier Qualiopi pour la formation X" | Autonome (compilation docs) |
| **Alertes proactives** | "3 émargements manquent pour la session d'hier" | Notification auto |
| | "La formation du 20 a atteint 80% de jauge" | Notification auto |
| **Automatisations** | Emails de confirmation post-inscription | 100% auto |
| | Rappels J-7, J-1 avant événement | 100% auto |
| | Facture générée après paiement Stripe | 100% auto |

### Architecture Élio One

```
UTILISATRICE
     │
     │ "Envoie le rappel aux impayés"
     ▼
ÉLIO ONE (Agent)
     │
     ├─→ 1. Comprend l'intention
     │
     ├─→ 2. Requête Supabase : SELECT * FROM factures WHERE statut = 'impayé'
     │
     ├─→ 3. Génère la liste (5 personnes)
     │
     ├─→ 4. Prépare les emails (template rappel)
     │
     ├─→ 5. DEMANDE VALIDATION : "J'ai préparé 5 emails de rappel. Envoyer ?"
     │
     └─→ 6. Sur validation → Envoie via Resend/Sendgrid
                          → Log l'action dans historique
                          → Confirme : "5 rappels envoyés"
```

## Stack Technique

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Frontend** | Next.js 14+ (App Router) | SEO, performance, React moderne |
| **UI Components** | shadcn/ui + Tailwind | Rapide, customisable, accessible |
| **Backend** | Supabase | DB + Auth + Realtime + Storage + API |
| **Paiements** | Stripe | Checkout, subscriptions, invoicing |
| **Emails** | Resend ou Sendgrid | Transactionnels + marketing |
| **Élio One** | Agent IA custom (basé sur Claude) | Agentique, actions réelles |
| **Hébergement** | Vercel (V1) → VPS FR (V2) | Simple puis souverain |
| **Domaine** | Existant ou nouveau | À définir avec cliente |

## Livrables Attendus

| Livrable | Description |
|----------|-------------|
| **Site public** | Vitrine moderne + espace adhérent |
| **Foxeo One** | Dashboard admin complet |
| **CRM** | Gestion adhérents centralisée |
| **Module Formations** | Catalogue, inscriptions, Qualiopi |
| **Module Événements** | Création, inscriptions, facturation |
| **Module Adhésions** | Campagne, renouvellement (Octobre) |
| **Élio One** | Assistant agentique fonctionnel |
| **Intégration Stripe** | Paiements, factures auto |
| **Documentation** | Guide utilisateur pour la cliente |

---
