# Architecture

État : phase 2. L’interface tourne dans le navigateur. Le backend décrit ci-dessous n’est pas encore écrit.

## Composants prévus

```text
Navigateur
  frontend/          HTML, CSS, JavaScript, Leaflet
        |
        |  fetch /api/...
        v
  backend/src/server.js -> app.js
        routes -> controllers -> services
        validators, middlewares, config, utils
        |
        +--> Supabase PostgreSQL (RLS)
        +--> Supabase Auth
        +--> Supabase Storage (photos, si configuré)
        +--> API Gemini (classification, résumé, aide au rapprochement)
```

Le frontend ne doit jamais contenir `SUPABASE_SERVICE_ROLE_KEY` ni `GEMINI_API_KEY`.

## Responsabilités backend

| Dossier | Rôle |
| --- | --- |
| `routes/` | Déclarer les endpoints |
| `controllers/` | Lire la requête HTTP et renvoyer la réponse |
| `services/` | Logique métier |
| `validators/` | Contrôler les entrées |
| `middlewares/` | Authentification, autorisations, erreurs, limite de fréquence |
| `config/` | Lire l’environnement |
| `utils/` | Fonctions réutilisables sans règle métier |

## Trajet actuel d’un signalement

1. Le formulaire valide les champs dans le navigateur.
2. Si les champs sont valides, un brouillon est écrit dans `sessionStorage` de l’onglet, avec le statut `submitted`.
3. La liste, le détail, l’accueil et la carte relisent les fiches fictives et ces brouillons.
4. Fermer l’onglet efface les brouillons. Aucun `POST /api/reports` n’existe.

Cible des phases suivantes : validation serveur, enregistrement Supabase, auteur authentifié, suggestion Gemini séparée du statut, score de similarité qui ne fusionne rien.

## Carte

Leaflet 1.9.4 est servi localement. Les tuiles viennent du serveur public OpenStreetMap, avec attribution. Ce serveur n’est pas une infrastructure garantie. Si une tuile échoue, la page le dit et garde la liste.

Le centre par défaut, autour de Lomé, est un cadre de démonstration. Ce n’est pas un incident.

## Fichiers absents volontairement

- `backend/src/app.js` et `backend/src/server.js` : phase 3.
- Migrations SQL et politiques RLS : phase 4. `database/schema.sql` ne contient qu’un commentaire.
- Les fiches fictives sont dans `frontend/js/demo-data.js`, pas dans `database/seeds/`.

## Données

Les statuts prévus sont `submitted`, `under_review`, `in_progress`, `resolved` et `rejected`. Les transitions et les rôles (visiteur, utilisateur, modérateur, administrateur) seront fixés avec le schéma, pas dans le navigateur.
