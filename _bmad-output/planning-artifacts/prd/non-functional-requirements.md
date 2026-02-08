# Non-Functional Requirements

**Total : 39 NFRs** définissant les critères de qualité du système.

## Performance

| ID | NFR |
|----|-----|
| NFR-P1 | Les pages du dashboard se chargent en moins de **2 secondes** (First Contentful Paint) |
| NFR-P2 | Les actions utilisateur (clic, soumission) répondent en moins de **500ms** |
| NFR-P3 | Élio répond (premier token) en moins de **3 secondes** |
| NFR-P4 | La recherche retourne des résultats en moins de **1 seconde** |
| NFR-P5 | Les notifications temps réel apparaissent en moins de **2 secondes** après l'événement |
| NFR-P6 | L'export PDF d'un document se génère en moins de **5 secondes** |

## Sécurité

| ID | NFR |
|----|-----|
| NFR-S1 | Toutes les communications utilisent **HTTPS/TLS 1.3** |
| NFR-S2 | Les données sensibles sont chiffrées au repos (**AES-256**) |
| NFR-S3 | Les mots de passe sont hachés avec **Argon2** |
| NFR-S4 | Les sessions expirent après **8h d'inactivité** |
| NFR-S5 | Le système bloque après **5 tentatives de login échouées** (5 min) |
| NFR-S6 | Les tokens API ne sont affichés qu'**une seule fois** à la création |
| NFR-S7 | Les données d'un client sont **isolées** des autres (RLS Supabase) |
| NFR-S8 | Les clés API LLM ne transitent **jamais côté client** |
| NFR-S9 | Le système est conforme **RGPD** (export, suppression, consentement) |

## Scalabilité

| ID | NFR |
|----|-----|
| NFR-SC1 | Le système supporte **50 clients** simultanés sans dégradation |
| NFR-SC2 | Le système supporte **100 requêtes Élio/heure** par client |
| NFR-SC3 | Le stockage supporte **1 Go/client** minimum |
| NFR-SC4 | L'architecture permet une migration vers **VPS dédié** sans refonte |

## Accessibilité

| ID | NFR |
|----|-----|
| NFR-A1 | Les dashboards sont utilisables sur écrans **≥320px** (mobile) |
| NFR-A2 | Le contraste texte/fond respecte **WCAG AA** (ratio 4.5:1) |
| NFR-A3 | La navigation au **clavier** est fonctionnelle sur toutes les pages |
| NFR-A4 | Les éléments interactifs ont des **labels accessibles** |

## Intégrations

| ID | NFR |
|----|-----|
| NFR-I1 | Les appels Stripe timeout après **30 secondes** avec retry |
| NFR-I2 | Les appels DeepSeek timeout après **60 secondes** avec message gracieux |
| NFR-I3 | Les webhooks Stripe sont traités en moins de **5 secondes** |
| NFR-I4 | Les emails transactionnels sont envoyés en moins de **10 secondes** |
| NFR-I5 | Le système gère les **indisponibilités** des services tiers avec messages explicites |

## Fiabilité & Disponibilité

| ID | NFR |
|----|-----|
| NFR-R1 | Le système vise une disponibilité de **99.5%** (hors maintenance planifiée) |
| NFR-R2 | Les backups sont effectués **quotidiennement** avec rétention 30 jours |
| NFR-R3 | Le **RPO** (perte de données max) est de **24h** |
| NFR-R4 | Le **RTO** (temps de restauration) est de **4h** |
| NFR-R5 | Les erreurs sont **loguées** avec contexte pour diagnostic |
| NFR-R6 | Le système reste **fonctionnel** si un service externe est down (mode dégradé) |

## Maintenabilité & Qualité Code

| ID | NFR |
|----|-----|
| NFR-M1 | Chaque FR est couverte par des **tests unitaires** (couverture >80%) |
| NFR-M2 | Le code passe un **linting** sans erreur avant commit |
| NFR-M3 | Chaque déploiement inclut une phase de **nettoyage/refactoring** |
| NFR-M4 | Les dépendances sont mises à jour **mensuellement** (sécurité) |
| NFR-M5 | Le code suit les **conventions** du projet (documentées) |

---
