# FAQ — Module Visio

## Q: Pourquoi est-ce que je vois "Erreur de connexion" dans la salle de visio ?

**A:** Vérifiez que :
1. OpenVidu est démarré (`docker compose up -d` dans `docker/openvidu/`)
2. La variable `OPENVIDU_URL` pointe vers le bon serveur
3. Le `OPENVIDU_SECRET` dans `.env.local` correspond à celui du Docker Compose
4. Votre navigateur a les permissions caméra/micro accordées

## Q: Comment tester localement sans OpenVidu ?

**A:** En mode test, le hook `useOpenVidu` et le SDK `openvidu-browser` sont mockés via Vitest. Vous n'avez pas besoin d'OpenVidu pour lancer les tests unitaires.

Pour tester la visio réelle localement :
```bash
cd docker/openvidu
docker compose up -d
```

## Q: Le token OpenVidu est-il sécurisé ?

**A:** Oui. Le secret OpenVidu (`OPENVIDU_SECRET`) n'est jamais envoyé au navigateur. Il est uniquement utilisé dans la Supabase Edge Function `get-openvidu-token`, qui s'exécute côté serveur. Le navigateur ne reçoit qu'un token éphémère.

## Q: Combien de participants par visio ?

**A:** OpenVidu CE supporte techniquement jusqu'à plusieurs dizaines de participants. Dans le contexte Foxeo (MiKL + un client), 2-4 participants est la cible.

## Q: Les meetings sont-ils enregistrés automatiquement ?

**A:** Pas dans cette story (5.1). L'enregistrement est couvert dans la story 5.2.

## Q: Que se passe-t-il si la connexion est coupée ?

**A:** Le hook `useOpenVidu` écoute les événements `streamDestroyed`. L'utilisateur peut relancer `connect()` pour se reconnecter. Le meeting reste `in_progress` en DB jusqu'à ce que `endMeeting()` soit appelé explicitement.

## Q: Comment accéder à un meeting si je n'ai pas été invité ?

**A:** Les RLS Supabase bloquent l'accès. Un client ne peut voir que ses propres meetings (via `meetings_select_owner`). Un opérateur voit tous les meetings de ses clients (via `meetings_select_operator`).
