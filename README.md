# QuartierAlert

« Un problème signalé, une communauté mobilisée. »

Application web communautaire pour signaler les problèmes d’un quartier, les consulter et suivre leur évolution. Projet civic-tech prévu pour un hackathon au Togo.

L’intelligence artificielle doit aider à organiser l’information. Elle ne vérifie pas les faits à la place des personnes et ne résout pas les problèmes physiques.

## Problème et solution

Les habitants constatent des dépôts de déchets, des fuites d’eau, des voies endommagées, des lampadaires en panne, des problèmes d’assainissement ou d’inondation, sans outil commun pour les décrire et les suivre.

QuartierAlert doit transformer un constat local en signalement structuré, consultable et traçable. Un signalement n’est pas transmis automatiquement à une mairie ou à une institution : aucun partenaire institutionnel n’est déclaré.

## Fonctionnalités et état d’avancement

**Phase 1 — initialisation : en place.**

**Phase 2 — interface : en place, en démonstration.** Les pages se parlent entre elles. Les chiffres sont calculés à partir de fiches fictives, plus les brouillons saisis dans l’onglet. Rien n’est envoyé à un serveur.

| Fonctionnalité | État |
| --- | --- |
| Accueil, liste, détail, formulaire, carte, à propos, connexion | Visibles. Indicateurs, répartition et carte de fiche calculés sur les données chargées |
| Administration et changement de statut | Non commencé (phase 7) |
| API REST | Non commencé (phase 3) |
| PostgreSQL, Supabase Auth, RLS | Non commencé (phase 4). La page Connexion ne crée pas de compte |
| Persistance d’un signalement | Non commencé (phase 5). `sessionStorage` seulement |
| Classification, résumé et doublons (Gemini) | Non commencé (phase 6) |
| Tests | `npm test` couvre la validation, les calculs, les fiches fictives et les pages. Le parcours navigateur se vérifie à part |

## Technologies

L’interface est en HTML, CSS et JavaScript, sans framework. Leaflet 1.9.4 (dernière version publiée sur npm au moment de l’intégration) est copié dans `frontend/assets/vendor/leaflet/` sous licence BSD 2-Clause.

La suite prévue :
- Backend : Node.js, Express, API REST.
- Données et comptes : Supabase (PostgreSQL, Auth, Storage si les photos sont configurées).
- Assistance : API Gemini, côté serveur uniquement.
- Tests : exécuteur de tests Node.js (`node --test`).

Vérifié sur cette machine lors de l’initialisation : Node.js v26.11.1, npm 12.2.0. Le `package.json` demande Node.js 20 ou plus.

## Installation

```bash
git clone <url-du-depot> QuartierAlert
cd QuartierAlert
```

Aucune dépendance npm n’est déclarée pour l’instant. `npm install` n’est pas nécessaire tant que la phase 3 n’a pas ajouté Express et les autres paquets.

## Configuration

```bash
cp .env.example .env
```

Renseigner `.env` seulement au moment où le serveur et Supabase existeront. Les noms attendus sont dans `.env.example`. Le fichier `.env` est ignoré par Git.

Variables prévues :

| Variable | Usage |
| --- | --- |
| `PORT` | Port HTTP du backend |
| `NODE_ENV` | `development` ou `production` |
| `CORS_ORIGIN` | Origines autorisées, séparées par des virgules |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | Clé anon, soumise aux politiques RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend seulement. Ne jamais l’envoyer au navigateur |
| `GEMINI_API_KEY` | Backend seulement. L’application devra fonctionner sans elle |

Aucun projet Supabase ni clé Gemini n’est fourni avec ce dépôt.

## Démarrage

Interface :

```bash
npm run frontend
```

Ouvrir `http://127.0.0.1:4173`. Le module JavaScript ne fonctionne pas en ouvrant le fichier directement (`file://`). Le port se change avec `FRONTEND_PORT` dans l’environnement de la commande, pas via `.env` : ce fichier n’est pas encore lu.

```bash
npm start
```

Cette commande échoue volontairement. Le serveur API n’existe pas encore (`backend/src/server.js` sera créé en phase 3).

## Tests

```bash
npm test
```

22 tests Node.js passent sur cette machine après la phase 2 : validation, statistiques, fiches fictives, chemins du serveur statique et présence des pages. Cela ne remplace pas une vérification dans le navigateur.

## Structure

```text
frontend/          pages, styles, scripts, illustrations, Leaflet 1.9.4
backend/src/       dossiers vides (API en phase 3)
database/          schema.sql commenté, migrations et seeds vides
docs/              documentation d’état
tests/             validation, statistiques, données, pages, chemins
scripts/           serveur statique de l’interface
```

`backend/src/app.js` et `backend/src/server.js` ne sont pas encore créés.

## Sécurité

Mesures déjà en place :

- `.env` et les variantes locales sont ignorés par Git.
- `.env.example` ne contient aucune valeur secrète.
- La clé `service_role` est documentée comme réservée au backend.
- Le serveur statique refuse les chemins qui sortent de `frontend/`, n’accepte que GET et HEAD, et envoie des en-têtes de base.
- Les textes saisis sont affichés comme texte, pas comme HTML.
- Une photo locale dont l’adresse n’est pas une illustration `assets/demo/` n’est pas affichée.
- La position GPS n’est demandée qu’au clic.

Mesures pas encore en place : validation serveur, CORS de l’API, limitation de fréquence, authentification, politiques RLS. Les en-têtes du serveur statique ne protègent pas une future API. Prévoir Supabase ne rend pas l’application sûre.

## Roadmap

L’ordre retenu est décrit dans [docs/roadmap.md](docs/roadmap.md). Prochaine étape proposée : phase 3, l’API.

## Limites

- Aucune donnée n’est enregistrée sur un serveur. Un brouillon d’onglet disparaît à sa fermeture.
- Les indicateurs portent sur des fiches fictives, annoncées comme telles.
- Aucun compte ne peut être créé.
- La carte dépend du serveur public de tuiles OpenStreetMap, qui n’est pas un service garanti.
- L’assistance IA n’existe pas.
- Aucun organisme public n’est partenaire du projet.

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Branche par fonctionnalité, pas de secret dans Git, pas de fusion sans avoir exécuté les tests qui existent.
