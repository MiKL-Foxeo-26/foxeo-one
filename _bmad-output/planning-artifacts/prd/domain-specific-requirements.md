# Domain-Specific Requirements

## Modules Optionnels (Non Détaillés Ici)

**Qualiopi** : Module optionnel pour les organismes de formation. Développé pour la cliente test (Association) puis proposé comme module supplémentaire. Sera spécifié dans un dossier dédié.

---

## Sécurité — Approche Équilibrée

**Principe : Sécurité Adaptative**

Plus l'action est sensible, plus on sécurise. Les actions courantes restent fluides.

```
CONSULTATION (lecture)     →  Sécurité légère, UX fluide
ACTIONS COURANTES          →  Sécurité standard
ACTIONS SENSIBLES          →  Confirmation requise
ACTIONS CRITIQUES          →  Ré-authentification
```

### Authentification & Sessions

| Paramètre | Valeur | Justification |
|-----------|--------|---------------|
| Access token | 1h | Sécurité sans friction (refresh silencieux) |
| Refresh token | 30 jours | Confort utilisateur |
| Inactivité logout | 8h | Journée de travail couverte |
| Session max | 30 jours | Reconnexion mensuelle |
| Tentatives login | 5 échecs → blocage 5 min | Protection brute force |
| Connexions simultanées | Autorisées | Multi-device |

### 2FA (Authentification Forte)

| Utilisateur | 2FA | Solution |
|-------------|-----|----------|
| **MiKL (Hub)** | ✅ Obligatoire | Google Authenticator (TOTP) |
| **Clients One/Lab** | ⚪ Optionnel | Proposé, pas imposé |

**Flow MiKL :**
1. Email + mot de passe
2. Code Google Authenticator (6 chiffres)
3. Connecté

**Codes de récupération :** 10 codes à usage unique, notés une fois à l'activation (backup urgence si perte téléphone).

### Niveaux de Sécurité par Action

| Niveau | Actions | UX |
|--------|---------|-----|
| 🟢 **Lecture** | Consulter dashboard, voir fiches | Aucune friction |
| 🟡 **Standard** | Créer/modifier fiche, publier événement | Aucune friction |
| 🟠 **Sensible** | Export données, envoi email groupé, suppression | Modale "Confirmer ?" |
| 🔴 **Critique** | Changer mot de passe, supprimer compte, accès admin | Ré-authentification |

### Protection des Données

| Mesure | Implémentation |
|--------|----------------|
| Chiffrement transit | TLS 1.3 obligatoire (HTTPS everywhere) |
| Chiffrement repos | AES-256 pour données sensibles (Supabase) |
| Chiffrement fichiers | Documents clients chiffrés avant stockage |
| Hachage mots de passe | Argon2 (jamais en clair) |
| Tokens API | Hachés en BDD, affichés une seule fois |

### Row Level Security (RLS) — Supabase

Chaque client ne voit QUE ses données, même si quelqu'un exploite une faille.

| Table | Règle RLS |
|-------|-----------|
| `clients` | Admin only |
| `adherents` | Client owner only |
| `formations` | Client owner only |
| `evenements` | Client owner only |
| `factures` | Client owner only |
| `conversations_elio` | Client owner only |
| `validation_hub` | Admin + Client concerné |

### Protection contre les Attaques

| Attaque | Protection |
|---------|------------|
| Injection SQL | Requêtes paramétrées (Supabase client) |
| XSS | Sanitization inputs, CSP headers, React auto-escape |
| CSRF | Tokens CSRF, SameSite cookies |
| Clickjacking | X-Frame-Options: DENY |
| DDoS | Cloudflare/Vercel protection, rate limiting |
| Upload malveillant | Validation MIME type, scan, sandbox |

### Headers de Sécurité

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

### Audit & Monitoring

| Mesure | Implémentation |
|--------|----------------|
| Logs d'accès | Qui accède à quoi, quand, depuis où |
| Logs actions sensibles | Modifications, exports, suppressions |
| Alertes connexion suspecte | Nouvelle IP/device → email (pas blocage) |
| Audit trail | Historique immutable actions critiques |

### Backup & Recovery

| Mesure | Fréquence | Rétention |
|--------|-----------|-----------|
| Backup BDD | Quotidien auto (Supabase) | 30 jours |
| Backup fichiers | Quotidien | 30 jours |
| Backup cold | Hebdomadaire (export externe) | 1 an |

**RPO** (perte max) : 24h | **RTO** (temps restauration) : 4h

### Sécurité API Élio (DeepSeek)

| Mesure | Implémentation |
|--------|----------------|
| Clés API | Variables d'environnement, jamais côté client |
| Proxy backend | Toutes requêtes LLM passent par le serveur |
| Validation inputs | Sanitization avant envoi au LLM |
| Rate limiting | Max requêtes/minute par utilisateur |
| Pas de données sensibles | Ne jamais envoyer mots de passe, tokens au LLM |

### Conformité RGPD

| Exigence | Implémentation |
|----------|----------------|
| Minimisation | Ne collecter que le nécessaire |
| Droit d'accès | Export PDF/JSON de toutes les données |
| Droit à l'effacement | Anonymisation (conservation comptable obligatoire) |
| Portabilité | Export JSON/CSV structuré |
| Notification breach | Procédure sous 72h (CNIL + utilisateurs) |

---
