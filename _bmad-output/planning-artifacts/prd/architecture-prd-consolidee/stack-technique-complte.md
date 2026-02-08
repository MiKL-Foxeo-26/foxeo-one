# Stack Technique Complète

| Composant | Outil | Rôle |
|-----------|-------|------|
| Prise de RDV | **Cal.com** (self-hosted) | Créneaux, formulaire, confirmation |
| Base de données | **Supabase** (PostgreSQL) | Prospects, clients, templates |
| Visio | **OpenVidu** (self-hosted) | WebRTC, enregistrement |
| Transcription | **Deepgram** (API) | Speech-to-text (~$0.63/h avec diarisation, 200$ crédit gratuit) |
| Résumé IA | **DeepSeek V3.2** (Élio Hub) | Analyse et résumé de la transcription |
| Auto-complete | **API INSEE** (gratuit) | SIRET → infos entreprise |
| Stockage | **Supabase Storage** | Enregistrements, transcriptions |
| Email | **Resend** ou **Postmark** | Envoi transactionnel |
| Frontend | **Next.js 16** | Salle d'attente, dashboard |
| PDF | **Gotenberg** (Docker) | Conversion Markdown → PDF |

---

*Document consolidé le 08 Février 2026*
*Sources originales : architecture-agents-ia-rvise.md, architecture-agents-interconnects.md, architecture-documentaire.md, infrastructure-architecture-donnes.md, architecture-flux-onboarding-client.md*
