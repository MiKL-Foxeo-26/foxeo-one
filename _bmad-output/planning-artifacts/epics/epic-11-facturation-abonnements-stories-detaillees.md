# Epic 11 : Facturation & Abonnements — Stories detaillees

**Objectif :** MiKL et les clients gerent devis, factures et abonnements via Invoice Ninja (self-hosted) et Stripe avec suivi complet des paiements et notifications d'echec.

**FRs couverts:** FR77, FR78, FR94, FR95, FR96, FR97, FR98, **FR169, FR170**

**NFRs pertinentes:** NFR-I1, NFR-I3, NFR-S1, NFR-S7, NFR-P2, NFR-A1 a NFR-A4, NFR-M1 a NFR-M5

**Note architecturale :** La facturation est geree par Invoice Ninja 5 (self-hosted Docker) avec Stripe Connect OAuth pour les paiements. Foxeo Hub expose une UI custom (React) qui communique via un API proxy vers Invoice Ninja. Les clients accedent a une vue lecture seule "Mes Factures". Les webhooks Stripe et Invoice Ninja sont recus par les API Routes (`apps/hub/app/api/webhooks/`). Invoice Ninja gere nativement : devis, factures, factures recurrentes, avoirs, envoi email, generation PDF, rappels automatiques.

---

## Story 11.1 : Module Facturation — Structure, integration Invoice Ninja & types

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

## Story 11.2 : Creation & envoi de devis par MiKL

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

## Story 11.3 : Abonnements recurrents Stripe & gestion des echecs de paiement

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

## Story 11.4 : Historique facturation client, avoirs & informations de paiement

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

## Story 11.5 : Facturation Lab 199€ — Paiement forfait & deduction setup One

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

## Resume Epic 11 — Couverture FRs

| Story | Titre | FRs couvertes |
|-------|-------|---------------|
| 11.1 | Module Facturation — structure, integration Invoice Ninja & types | — (fondation technique) |
| 11.2 | Creation & envoi de devis par MiKL | FR77, FR78 |
| 11.3 | Abonnements recurrents Stripe & gestion echecs paiement | FR94, FR95 |
| 11.4 | Historique facturation, avoirs & informations de paiement | FR96, FR97, FR98 |
| 11.5 | Facturation Lab 199€ — Paiement forfait & deduction setup One | FR169, FR170 |

**Toutes les 9 FRs de l'Epic 11 sont couvertes.**

---
