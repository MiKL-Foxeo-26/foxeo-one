# OpenVidu — Setup Docker local et production

## Configuration locale (développement)

### Prérequis

- Docker Desktop installé et démarré
- Ports 4443 disponibles

### Démarrage

```bash
cd docker/openvidu
docker compose up -d
```

OpenVidu CE sera accessible sur : `https://localhost:4443`

**Note :** OpenVidu utilise un certificat auto-signé en local. Votre navigateur affichera un avertissement → acceptez l'exception de sécurité.

### Variables d'environnement

Dans `.env.local` (apps/hub et apps/client) :

```bash
OPENVIDU_URL=https://localhost:4443
OPENVIDU_SECRET=MY_SECRET  # doit correspondre à OPENVIDU_SECRET dans docker-compose.yml
```

Dans Supabase Edge Functions (via `supabase secrets set`) :

```bash
supabase secrets set OPENVIDU_URL=https://your-openvidu-host:4443
supabase secrets set OPENVIDU_SECRET=MY_SECRET
```

### Vérification

Accédez à l'interface d'administration OpenVidu :
- URL : `https://localhost:4443/dashboard`
- Login : `OPENVIDUAPP`
- Password : `MY_SECRET` (votre `OPENVIDU_SECRET`)

### Arrêt

```bash
cd docker/openvidu
docker compose down
```

## Configuration production (VPS / Kubernetes)

### Option 1 : OpenVidu CE sur VPS (recommandé pour commencer)

1. Suivre le guide officiel : https://docs.openvidu.io/en/stable/deployment/ce/on-premises/
2. Installer sur un VPS dédié (min. 4 vCPU, 8 GB RAM)
3. Configurer un domaine avec certificat SSL (Let's Encrypt)
4. Mettre à jour les variables d'environnement dans Vercel :
   ```
   OPENVIDU_URL=https://openvidu.votredomaine.com
   OPENVIDU_SECRET=votre_secret_production
   ```

### Option 2 : OpenVidu PRO (cloud managé)

Pour les projets nécessitant scalabilité automatique, OpenVidu PRO offre une solution managée.

### Sécurité

- `OPENVIDU_SECRET` ne doit **jamais** apparaître dans le code source
- Il est uniquement utilisé dans la Supabase Edge Function `get-openvidu-token`
- Les tokens OpenVidu sont éphémères (durée de vie = durée de la session)
- RLS Supabase garantit qu'un utilisateur ne peut obtenir un token que pour ses propres meetings

## Troubleshooting

### Erreur "Connection failed" dans la salle de visio

1. Vérifiez que OpenVidu est démarré : `docker compose ps`
2. Vérifiez `OPENVIDU_URL` (doit inclure le port)
3. Acceptez le certificat auto-signé dans le navigateur

### Erreur "Unauthorized" lors de la génération du token

- Vérifiez que `OPENVIDU_SECRET` correspond entre `.env.local` et `docker-compose.yml`
- Vérifiez les secrets Supabase Edge Functions

### Caméra/Micro non disponibles

- Accordez les permissions caméra/micro dans le navigateur
- En local, utilisez `localhost` (pas `127.0.0.1`) — certains navigateurs refusent WebRTC sur 127.0.0.1
