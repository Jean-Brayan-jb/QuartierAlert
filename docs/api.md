# API REST

L’API est démarrée avec `npm start` et écoute sur le port `3000` par défaut. Le port peut être remplacé avec la variable d’environnement `PORT`. Les réponses sont en JSON.

Les signalements sont gardés dans un dépôt en mémoire. Celui-ci est initialement vide et distinct des fiches fictives du frontend.

## Routes disponibles

### `GET /api/health`

Réponse `200` :

```json
{
  "success": true,
  "message": "QuartierAlert API is running",
  "data": { "status": "ok" }
}
```

### `GET /api/reports`

Paramètres facultatifs : `limit` (1 à 100, défaut 20) et `offset` (entier positif, défaut 0).

Réponse `200` :

```json
{
  "success": true,
  "data": {
    "reports": [],
    "pagination": { "limit": 20, "offset": 0, "total": 0, "hasMore": false }
  }
}
```

### `GET /api/reports/:id`

Les identifiants non vides sont limités aux caractères alphanumériques, `_` et `-` (100 caractères maximum). Réponse `200` sous la forme `{ "success": true, "data": { ... } }`, ou `404` si aucun signalement ne correspond.

### `POST /api/reports`

Envoyer `Content-Type: application/json` :

```json
{
  "title": "Fuite près du marché",
  "description": "De l’eau coule au bord de la chaussée depuis ce matin et gêne le passage.",
  "category": "eau",
  "locationText": "Rue fictive des Palmiers",
  "latitude": 6.1,
  "longitude": 1.2
}
```

Le titre doit faire 8 à 120 caractères, la description 30 à 2 000 caractères et le lieu textuel 1 à 180 caractères après suppression des espaces superflus. Les catégories autorisées sont `dechets`, `eau`, `routes`, `eclairage`, `environnement`, `inondation` et `autre`.

La latitude et la longitude sont facultatives, mais doivent être absentes ensemble, toutes deux `null`, ou être deux nombres valides dans les limites respectives de −90 à 90 et −180 à 180. Le serveur crée l’identifiant, la date et le statut `submitted`. Le client ne peut pas définir `status`, `role`, `authorId`, ni d’autres propriétés non listées.

Réponse `201` : `{ "success": true, "message": "...", "data": { ... } }`. `imagePath` vaut `null` car le téléversement de photos n’est pas encore implémenté.

## Erreurs

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "La requête contient des données invalides.",
    "details": [{ "field": "title", "message": "..." }]
  }
}
```

Codes utilisés : `400` pour une entrée invalide, `404` pour une ressource absente, `413` pour un corps dépassant 10 Ko, `415` pour un type de contenu non pris en charge, et `500` pour une erreur interne.

## Limites et routes futures

Le stockage en mémoire est perdu au redémarrage et n’est pas partagé entre plusieurs processus. Il ne remplace pas Supabase. Le frontend n’est pas encore connecté à cette API. L’authentification, les routes de modification, l’administration, l’historique, les statistiques et l’analyse IA restent à développer dans les phases suivantes.
