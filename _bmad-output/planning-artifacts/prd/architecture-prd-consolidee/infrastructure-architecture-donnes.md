# Infrastructure & Architecture Données

## Vision : "Un Client = Un Dossier = Une Vérité"

Chaque client dispose d'un dossier unique contenant TOUT son historique. Le Hub est une interface visuelle sur ces dossiers.

```
📁 CLIENTS/
└── 📁 client_martin_dupont/
    ├── 📁 _bmad/              ← Projet BMAD (Cursor travaille ici)
    ├── 📁 _private/           ← Notes MiKL, travail en cours
    ├── 📁 documents/          ← Briefs, livrables (visible client)
    ├── 📁 visios/             ← Enregistrements + transcriptions (visible client)
    ├── 📁 chat/               ← Historique conversations Élio (visible client)
    ├── 📁 factures/           ← Devis, factures, paiements (visible client)
    ├── 📁 assets/             ← Logos, images, fichiers client
    └── 📄 fiche-client.yaml   ← Métadonnées (lu par le Hub)
```

## Contrôle de Visibilité

| Dossier | Visible Client | Sync Supabase | Usage |
|---------|----------------|---------------|-------|
| `_bmad/` | Non | Non (local) | Développement BMAD/Cursor |
| `_private/` | Non | Oui | Notes MiKL, brouillons |
| `documents/` | Oui | Oui | Livrables validés |
| `visios/` | Oui | Oui | Enregistrements, transcriptions |
| `chat/` | Oui | Oui | Historique conversations |
| `factures/` | Oui | Oui | Documents comptables |
| `assets/` | Oui | Oui | Fichiers fournis par le client |

## Stack Technique — Architecture Hybride

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DATABASE (PostgreSQL)                              │   │
│  │  • clients (id, nom, email, parcours, statut...)    │   │
│  │  • documents (id, client_id, type, path, visible)   │   │
│  │  • conversations (historique chat Élio)             │   │
│  │  • validation_hub (demandes en attente validation)     │   │
│  │  • factures (métadonnées comptables)                │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AUTH                                               │   │
│  │  • Login clients Lab/One                            │   │
│  │  • Login MiKL Hub                                   │   │
│  │  • Row Level Security (qui voit quoi)               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  REALTIME                                           │   │
│  │  • Notifications Validation Hub                      │   │
│  │  • Updates temps réel dashboards                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (V2+)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   MINIO (Stockage S3)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  BUCKETS                                            │   │
│  │  • /clients/{client_id}/documents/                  │   │
│  │  • /clients/{client_id}/visios/                     │   │
│  │  • /clients/{client_id}/factures/                   │   │
│  │  • /clients/{client_id}/_private/                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Sync bidirectionnelle
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PC LOCAL (Cursor/BMAD)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  C:/Clients/                                        │   │
│  │  └── client_martin/                                 │   │
│  │      ├── _bmad/        ← LOCAL UNIQUEMENT           │   │
│  │      ├── documents/    ← SYNC                       │   │
│  │      └── ...                                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Roadmap Infrastructure

### V1 — MVP (Lancement → 5 clients)

```
SUPABASE CLOUD (hébergé)
├── Database ✅ gratuit jusqu'à 500MB
├── Auth ✅ gratuit jusqu'à 50k users
├── Storage ✅ gratuit jusqu'à 1GB
├── Realtime ✅ inclus
└── Zéro maintenance

+ PC LOCAL
└── Dossiers BMAD / Cursor
```

**Coût : 0€**
**Focus : Produit et premiers clients**

### V2 — Growth (5-20 clients)

```
SUPABASE CLOUD (Plan Pro ~25$/mois)
├── Plus de stockage
├── Backups automatiques
└── Support

+ MINIO SUR VPS FR
├── Serveur Scaleway/OVH (~15€/mois)
├── Stockage souverain France
└── Sync vers PC local (Syncthing)
```

**Coût : ~40-50€/mois**
**Focus : Souveraineté données, optimisation coûts**

### V3 — Scale (20+ clients)

```
SERVEUR FR DÉDIÉ
├── Supabase self-hosted
├── MinIO
├── Nginx reverse proxy
└── Backup automatisé

Specs recommandées :
• 16 Go RAM / 6 vCPU / 500 Go SSD
• ~60-100€/mois
```

**Coût : ~100-150€/mois (serveur + maintenance)**
**Focus : 100% souverain, scalabilité**

## Intégration Hub ↔ Cursor/BMAD

Le Hub dispose d'un bouton "Ouvrir dans Cursor" qui lance directement le projet BMAD du client :

```
[Fiche Client Martin]
    │
    └── [Bouton "Ouvrir BMAD dans Cursor"]
            │
            ▼
        cursor://file/C:/Clients/client_martin/_bmad
            │
            ▼
        Cursor s'ouvre sur le projet
```

## Workflow Fichiers Client

```
1. CLIENT SOUMET UN DOCUMENT (via Lab/One)
   │
   ▼
2. FICHIER UPLOADÉ → Supabase Storage (V1) ou MinIO (V2+)
   │
   ▼
3. MÉTADONNÉES → Supabase Database
   • client_id, nom, type, date, visible=true
   │
   ▼
4. HUB NOTIFIÉ (Realtime)
   • "Nouveau document chez Martin"
   │
   ▼
5. MIKL CONSULTE sur Hub
   • Voit le document dans l'onglet Documents
   │
   ▼
6. MIKL OUVRE CURSOR (si traitement BMAD nécessaire)
   • Fichier sync vers local (si V2+)
   • Travaille dans _bmad/
   │
   ▼
7. MIKL PRODUIT LIVRABLE
   • Output dans documents/
   • Sync vers cloud
   • Marque visible=true
   │
   ▼
8. CLIENT VOIT LE LIVRABLE
   • Apparaît dans son espace "Mes Documents"
   • Peut télécharger
```

## Résilience & Backup

| Scénario | Solution | Temps de reprise |
|----------|----------|------------------|
| PC local plante | Re-sync depuis cloud | 30 min - 2h |
| Supabase down | Leur SLA (99.9%) | Quelques minutes |
| Perte données client | Backup Supabase + export régulier | < 1h |
| Catastrophe totale | Backup froid sur disque externe | 2-4h |

**Règle d'or : Le PC local n'est JAMAIS la source de vérité.**

---
