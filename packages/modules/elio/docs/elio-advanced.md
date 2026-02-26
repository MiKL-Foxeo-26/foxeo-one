# Élio — Configuration avancée (Orpheus)

## Vue d'ensemble

La **Configuration Orpheus** est l'interface de personnalisation avancée d'Élio, accessible via `Paramètres > Élio Avancé` (`/settings/elio/advanced`).

Elle permet aux clients avancés de modifier les paramètres de l'API Claude utilisés par Élio pour générer ses réponses.

> **Avertissement** : Ces paramètres sont réservés aux utilisateurs avancés. Une mauvaise configuration peut affecter la qualité et la cohérence des réponses d'Élio.

---

## Paramètres configurables

### Modèle Claude

| Modèle | ID | Caractéristiques |
|--------|----|-----------------|
| Haiku 4 | `claude-haiku-4-20250122` | Rapide & économique |
| Sonnet 4 *(défaut)* | `claude-sonnet-4-20250514` | Équilibré — Recommandé |
| Opus 4 | `claude-opus-4-20250514` | Puissant & plus lent |

### Température

- **Plage** : 0.0 → 2.0 (par incrément de 0.1)
- **Défaut** : 1.0
- **Interprétation** :
  - `0.0` → Réponses déterministes, répétables
  - `1.0` → Équilibre créativité/cohérence
  - `2.0` → Très créatif, parfois imprévisible

### Max Tokens

- **Plage** : 100 → 8000
- **Défaut** : 1500
- **Usage** : Limite la longueur des réponses générées

### Instructions personnalisées

- **Type** : Texte libre (optionnel)
- **Usage** : Injectées en fin de system prompt pour chaque appel Élio
- **Exemple** : `"Utilise toujours des analogies avec le cinéma"`

### Fonctionnalités

Flags activables/désactivables :

| Feature | Clé | Description |
|---------|-----|-------------|
| Génération de code | `code_generation` | Élio peut générer et expliquer du code |
| Recherche web | `web_search` | Élio peut référencer des sources en ligne |

---

## Fonctionnement technique

### Table DB : `elio_configs`

```sql
CREATE TABLE elio_configs (
  id UUID PRIMARY KEY,
  client_id UUID UNIQUE REFERENCES clients(id),
  model TEXT DEFAULT 'claude-sonnet-4-20250514',
  temperature NUMERIC DEFAULT 1.0,
  max_tokens INTEGER DEFAULT 1500,
  custom_instructions TEXT,
  enabled_features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### RLS policies

- `elio_configs_select_owner` — lecture par propriétaire uniquement
- `elio_configs_insert_owner` — création par propriétaire uniquement
- `elio_configs_update_owner` — modification par propriétaire uniquement
- `elio_configs_delete_owner` — suppression (reset) par propriétaire uniquement

### Injection dans les prompts

Lors de la génération de briefs (`generateBrief`), la config est récupérée via `getElioConfig()` :

```typescript
const { data: elioConfig } = await getElioConfig()
const activeConfig = elioConfig ?? DEFAULT_ELIO_CONFIG

const message = await anthropic.messages.create({
  model: activeConfig.model,
  max_tokens: activeConfig.maxTokens,
  temperature: activeConfig.temperature,
  // ...
})
```

Si aucune config n'existe, les **valeurs par défaut** sont utilisées.

### Reset / Réinitialisation

Le bouton "Réinitialiser" supprime la ligne en DB. Les valeurs par défaut s'appliquent automatiquement aux prochains appels.

### Debug Mode

Si `ENABLE_ELIO_DEBUG=true` dans les variables d'environnement, une section "Preview System Prompt" est affichée sur la page, montrant le prompt complet qui sera envoyé à l'API (incluant les custom_instructions).

---

## Server Actions

| Action | Fichier | Description |
|--------|---------|-------------|
| `getElioConfig()` | `actions/get-elio-config.ts` | Récupère la config ou retourne les defaults |
| `updateElioConfig(input)` | `actions/update-elio-config.ts` | Crée ou met à jour la config (upsert) |
| `resetElioConfig()` | `actions/reset-elio-config.ts` | Supprime la config → retour aux defaults |

---

## Sécurité

- Les `custom_instructions` peuvent contenir des informations sensibles → **ne jamais logger en production**
- La config est protégée par RLS → isolation totale inter-clients
- Validation côté serveur : temperature [0,2], max_tokens [100,8000], model dans la liste autorisée
