# FOXEO - Modules & Options Commerciales

> Document de référence pour tous les modules additionnels et options commerciales proposés aux clients FOXEO.

---

## Vue d'ensemble

### Architecture des offres

```
FOXEO-LAB (gratuit)
    → Parcours découverte + brief + devis

FOXEO-ONE (inclus avec projet)
    → Dashboard client de base
    → Chat Élio One
    → Suivi projet

MODULES PREMIUM (options payantes)
    → Fonctionnalités additionnelles
    → Activables par client
```

---

## Modules disponibles

### 1. Module Signature Électronique

**Description** : Permet la signature légale de documents (devis, contrats, avenants) directement depuis FOXEO.

**Fournisseur** : Yousign (API)

**Coût MiKL** : 45€/mois (forfait Pro - signatures illimitées)

**Valeur légale** : Signature électronique avancée (eIDAS)

#### Fonctionnalités incluses
- Signature de devis avec validation légale
- Transformation automatique devis → facture après signature
- Archivage des documents signés (valeur probante)
- Certificat de signature horodaté
- Multi-signataires si nécessaire

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus Pack Pro** | 0€ | 5 signatures/mois incluses dans l'abonnement ONE |
| **Pack Signatures** | +15€/mois | Signatures illimitées |
| **À l'unité** | 2€/signature | Hors forfait |

#### Workflow

```
1. MiKL génère un devis depuis FOXEO-HUB
2. Devis envoyé au client via Élio One
3. Client clique "Accepter et signer"
4. Yousign génère le document à signer
5. Client signe (SMS OTP ou email)
6. Document signé archivé dans dossier client
7. Facture générée automatiquement
8. MiKL notifié "Devis XXX signé ✓"
```

#### Intégration technique

```javascript
// Exemple d'appel API Yousign
{
  "provider": "yousign",
  "api_version": "v3",
  "endpoints": {
    "create_procedure": "/signature_requests",
    "add_document": "/signature_requests/{id}/documents",
    "add_signer": "/signature_requests/{id}/signers",
    "activate": "/signature_requests/{id}/activate"
  },
  "webhooks": {
    "signature_done": "/api/webhooks/yousign/signed",
    "signature_refused": "/api/webhooks/yousign/refused"
  }
}
```

#### Configuration requise
- Compte Yousign Pro (45€/mois)
- Clé API Yousign
- Webhook endpoint pour notifications
- Stockage sécurisé des documents signés

---

### 2. Module Calendrier Synchronisé

**Description** : Synchronisation bidirectionnelle avec calendriers externes (Google Calendar, Outlook, Apple Calendar).

**Fournisseur** : APIs natives (Google, Microsoft, Apple)

**Coût MiKL** : Gratuit (APIs gratuites)

#### Fonctionnalités incluses
- Import/export calendriers externes
- Sync bidirectionnelle temps réel
- Multi-calendriers avec couleurs
- RDV créés sur mobile → apparaissent dans FOXEO
- RDV créés dans FOXEO → apparaissent sur mobile

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus** | 0€ | Fonctionnalité de base pour tous les clients ONE |

#### Intégration technique

```javascript
{
  "providers": {
    "google": {
      "api": "Google Calendar API v3",
      "auth": "OAuth2",
      "scopes": ["calendar.events", "calendar.readonly"]
    },
    "microsoft": {
      "api": "Microsoft Graph API",
      "auth": "OAuth2",
      "scopes": ["Calendars.ReadWrite"]
    },
    "apple": {
      "api": "CalDAV",
      "auth": "App-specific password"
    }
  }
}
```

---

### 3. Module Branding

**Description** : Accès aux outils et livrables branding dans l'espace ONE.

**Fournisseur** : Interne FOXEO

**Coût MiKL** : 0€

#### Fonctionnalités incluses
- Accès aux fichiers logo (tous formats)
- Charte graphique interactive
- Générateur de déclinaisons
- Kit réseaux sociaux
- Guidelines d'utilisation

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus** | 0€ | Activé automatiquement si prestation branding commandée |

---

### 4. Module Site Web

**Description** : Accès aux outils de gestion du site web dans l'espace ONE.

**Fournisseur** : Interne FOXEO

**Coût MiKL** : 0€

#### Fonctionnalités incluses
- Tableau de bord analytics simplifié
- Demandes de modifications via chat
- Prévisualisation des changements
- Historique des mises à jour

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus** | 0€ | Activé automatiquement si prestation site commandée |

---

### 5. Module SEO

**Description** : Suivi du référencement et recommandations.

**Fournisseur** : APIs externes (Google Search Console, SEMrush/Ahrefs)

**Coût MiKL** : Variable selon outil choisi

#### Fonctionnalités incluses
- Positions mots-clés
- Trafic organique
- Recommandations Élio One
- Alertes de variations

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Basique** | 0€ | Google Search Console uniquement |
| **Avancé** | +25€/mois | Données SEMrush/Ahrefs + recommandations IA |

---

### 6. Module Réseaux Sociaux

**Description** : Gestion simplifiée des réseaux sociaux.

**Fournisseur** : APIs natives (Meta, LinkedIn, etc.)

**Coût MiKL** : Gratuit (APIs gratuites)

#### Fonctionnalités incluses
- Planification de posts
- Analytics unifiés
- Suggestions de contenu Élio One
- Réponses aux commentaires

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus** | 0€ | Activé si prestation réseaux sociaux commandée |
| **Autonome** | +20€/mois | Accès sans prestation associée |

---

### 7. Module Maintenance

**Description** : Suivi de la maintenance technique du site.

**Fournisseur** : Interne FOXEO

**Coût MiKL** : 0€

#### Fonctionnalités incluses
- Statut du site (uptime)
- Mises à jour effectuées
- Sauvegardes
- Alertes de sécurité

#### Tarification client

| Option | Prix | Description |
|--------|------|-------------|
| **Inclus** | 0€ | Activé si contrat maintenance signé |

---

## Récapitulatif des coûts MiKL

| Service | Coût mensuel | Notes |
|---------|--------------|-------|
| Yousign Pro | 45€ | Signatures illimitées |
| Google APIs | 0€ | Calendar, OAuth |
| Microsoft Graph | 0€ | Calendar sync |
| INSEE API | 0€ | Données entreprises |
| **TOTAL fixe** | **45€/mois** | |

---

## Grille tarifaire clients ONE

### Abonnement de base ONE

| Inclus dans ONE | Description |
|-----------------|-------------|
| Dashboard personnel | Accès espace client |
| Chat Élio One | Assistant IA dédié |
| Suivi projet | Timeline des avancées |
| Documents partagés | Accès fichiers projet |
| 5 signatures/mois | Module signature de base |
| Sync calendrier | Google/Outlook/Apple |

### Options additionnelles

| Option | Prix/mois | Description |
|--------|-----------|-------------|
| Signatures illimitées | +15€ | Pack signature premium |
| SEO Avancé | +25€ | Données SEMrush + IA |
| Réseaux Sociaux autonome | +20€ | Sans prestation associée |
| Support prioritaire | +30€ | Réponse < 4h garantie |

---

## Notes d'implémentation

### Activation des modules

```typescript
interface ClientModules {
  signature: {
    enabled: boolean;
    plan: 'basic' | 'unlimited';
    usage: number; // signatures ce mois
  };
  calendar: {
    enabled: boolean;
    connectedCalendars: string[];
  };
  branding: {
    enabled: boolean;
    activatedAt: Date | null;
  };
  website: {
    enabled: boolean;
    siteUrl: string | null;
  };
  seo: {
    enabled: boolean;
    plan: 'basic' | 'advanced';
  };
  social: {
    enabled: boolean;
    connectedNetworks: string[];
  };
  maintenance: {
    enabled: boolean;
    contractEndDate: Date | null;
  };
}
```

### Logique d'activation automatique

```
SI prestation_branding commandée → activer module Branding
SI prestation_site commandée → activer module Site Web
SI prestation_seo commandée → activer module SEO (basic)
SI prestation_social commandée → activer module Réseaux Sociaux
SI contrat_maintenance signé → activer module Maintenance
```

---

## Évolutions futures envisagées

- [ ] Module Facturation client (pour leurs propres clients)
- [ ] Module CRM simplifié
- [ ] Module Newsletter
- [ ] Module E-commerce (si sites marchands)
- [ ] Module Formation (tutoriels personnalisés)

---

*Dernière mise à jour : 2026-02-03*
