# Architecture

État : phase 3 implémentée. L’interface de démonstration et l’API fonctionnent séparément.

## Composants prévus

```text
Navigateur
  frontend/          HTML, CSS, JavaScript, Leaflet
  (les pages de démonstration ne sont pas encore connectées à l’API)

  backend/src/server.js -> app.js
        routes -> controllers -> services -> repositories
        validators, middleware d’erreurs, utils
        |
        +--> dépôt en mémoire (phase 3)
        +--> Supabase PostgreSQL (RLS), cible phase 4
        +--> Supabase Auth et Storage, phases ultérieures
        +--> API Gemini, phase 6
```

Le frontend ne doit jamais contenir `SUPABASE_SERVICE_ROLE_KEY` ni `GEMINI_API_KEY`.

## Responsabilités backend

| Dossier | Rôle |
| --- | --- |
| `routes/` | Déclarer les endpoints |
| `controllers/` | Valider les paramètres et renvoyer la réponse HTTP |
| `services/` | Logique métier |
| `validators/` | Contrôler les entrées |
| `middleware/` | Erreurs centralisées et adaptation des promesses Express |
| `repositories/` | Accès au stockage remplaçable |
| `utils/` | Fonctions réutilisables sans règle métier |

## API actuelle et trajet d’un signalement

1. Le client appelle `POST /api/reports` avec le titre, la description, la catégorie, le lieu textuel et éventuellement les deux coordonnées.
2. Le validateur serveur normalise les chaînes et refuse les propriétés non autorisées.
3. Le service fixe l’identifiant, la date de création et le statut initial `submitted`.
4. Le dépôt mémoire garde le signalement jusqu’au redémarrage du processus.
5. `GET /api/reports` et `GET /api/reports/:id` lisent ce dépôt.

Le frontend n’appelle pas encore cette API : il conserve son parcours de démonstration indépendant. La phase 5 assurera la transition vers les données serveur.

Le contrat du dépôt (`list`, `findById`, `create`) permet d’ajouter une implémentation Supabase en phase 4 sans changer les routes ni les contrôleurs.

## Limites de sécurité actuelles

L’API ne met pas encore en œuvre l’authentification, CORS, les rôles, la limitation de fréquence ou les politiques RLS. Le dépôt mémoire n’est pas persistant ni partagé entre instances. Ne pas l’exposer comme service de production.

## Carte

Leaflet 1.9.4 est servi localement. Les tuiles viennent du serveur public OpenStreetMap, avec attribution. Ce serveur n’est pas une infrastructure garantie. Si une tuile échoue, la page le dit et garde la liste.

Le centre par défaut, autour de Lomé, est un cadre de démonstration. Ce n’est pas un incident.

## Éléments absents volontairement

- Migrations SQL et politiques RLS : phase 4. `database/schema.sql` ne contient qu’un commentaire.
- Intégration du frontend à l’API : phase 5.
- Authentification, stockage des photos, IA et administration : phases ultérieures.
- Les fiches fictives sont dans `frontend/js/demo-data.js`, pas dans `database/seeds/`.

## Données

Les statuts prévus sont `submitted`, `under_review`, `in_progress`, `resolved` et `rejected`. Les transitions et les rôles (visiteur, utilisateur, modérateur, administrateur) seront fixés avec le schéma, pas dans le navigateur.
