# QuartierAlert

« Un problème signalé, une communauté mobilisée. »

Application web communautaire pour signaler les problèmes d’un quartier, les consulter et suivre leur évolution. Projet civic-tech prévu pour un hackathon au Togo.

L’intelligence artificielle doit aider à organiser l’information. Elle ne vérifie pas les faits à la place des personnes et ne résout pas les problèmes physiques.

## Problème et solution

Les habitants constatent des dépôts de déchets, des fuites d’eau, des voies endommagées, des lampadaires en panne, des problèmes d’assainissement ou d’inondation, sans outil commun pour les décrire et les suivre.

QuartierAlert doit transformer un constat local en signalement structuré, consultable et traçable. Un signalement n’est pas transmis automatiquement à une mairie ou à une institution : aucun partenaire institutionnel n’est déclaré.

## Fonctionnalités et état d’avancement

**Phase 1 — initialisation : en place.**

**Phase 2 — interface : en place, en démonstration.** Les pages se parlent entre elles. Les chiffres sont calculés à partir de fiches fictives, plus les brouillons saisis dans l’onglet.

**Phase 3 — API : implémentée avec un stockage temporaire en mémoire.** L’API peut lire et créer des signalements, mais le frontend n’y est pas encore connecté et les données disparaissent au redémarrage.

| Fonctionnalité | État |
| --- | --- |
| Accueil, liste, détail, formulaire, carte, à propos, connexion | Visibles, données fictives ou brouillon d’onglet |
| Administration et changement de statut | Non commencé (phase 7) |
| API REST (santé, lecture, création, validation) | Implémentée en phase 3, stockage en mémoire |
| PostgreSQL, Supabase Auth, RLS | Non commencé (phase 4). La page Connexion ne crée pas de compte |
| Persistance durable d’un signalement | Non commencé (phase 4). L’API phase 3 utilise la mémoire volatile ; le frontend utilise encore `sessionStorage` |
| Classification, résumé et doublons (Gemini) | Non commencé (phase 6) |
| Tests | `npm test` couvre l’API, la validation, les calculs, les fiches fictives et les pages. Le parcours navigateur se vérifie à part |

## Technologies

L’interface est en HTML, CSS et JavaScript, sans framework. Leaflet 1.9.4 (dernière version publiée sur npm au moment de l’intégration) est copié dans `frontend/assets/vendor/leaflet/` sous licence BSD 2-Clause.

Le backend utilise Node.js et Express pour l’API REST.

La suite prévue :
- Données et comptes : Supabase (PostgreSQL, Auth, Storage si les photos sont configurées).
- Assistance : API Gemini, côté serveur uniquement.
- Tests : exécuteur de tests Node.js (`node --test`).

Vérifié sur cette machine lors de l’initialisation : Node.js v26.11.1, npm 12.2.0. Le `package.json` demande Node.js 20 ou plus.

## Installation

```bash
git clone <url-du-depot> QuartierAlert
cd QuartierAlert
```

Installer Express, dépendance du backend :

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
```

Renseigner `.env` uniquement lors de l’intégration Supabase/Gemini. Le serveur API lit actuellement `PORT` depuis l’environnement du processus ; il ne charge pas `.env`. Le fichier `.env` est ignoré par Git.

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

Dans un autre terminal, démarrer l’API :

```bash
npm start
```

L’API est disponible sur `http://127.0.0.1:3000/api`. Les routes et exemples sont documentés dans [docs/api.md](docs/api.md).

## Tests

```bash
npm test
```

Les tests Node.js couvrent la validation métier, l’interface et les routes de l’API. Ils ne remplacent pas une vérification dans le navigateur.

## Structure

```text
frontend/          pages, styles, scripts, illustrations, Leaflet 1.9.4
backend/src/       application Express, routes, contrôleurs, service et dépôt mémoire
database/          schema.sql commenté, migrations et seeds vides
docs/              documentation d’état
tests/             tests métier, pages, serveur statique et API HTTP
scripts/           serveur statique de l’interface
```

Le serveur API et le serveur frontend sont distincts et se lancent dans deux terminaux.

## Sécurité

Mesures déjà en place :

- `.env` et les variantes locales sont ignorés par Git.
- `.env.example` ne contient aucune valeur secrète.
- La clé `service_role` est documentée comme réservée au backend.
- Le serveur statique refuse les chemins qui sortent de `frontend/`, n’accepte que GET et HEAD, et envoie des en-têtes de base.
- L’API limite les corps JSON à 10 Ko, valide les données et n’accepte aucun statut, rôle ou auteur fourni par le client.
- Les erreurs API n’exposent pas les traces internes.
- Les textes saisis sont affichés comme texte, pas comme HTML.
- Une photo locale dont l’adresse n’est pas une illustration `assets/demo/` n’est pas affichée.
- La position GPS n’est demandée qu’au clic.

Mesures pas encore en place : CORS, limitation de fréquence, authentification et politiques RLS. Le dépôt mémoire n’est pas une base durable et l’API ne doit pas être exposée telle quelle en production. Les en-têtes du serveur statique ne protègent pas l’API.

## Roadmap

L’ordre retenu est décrit dans [docs/roadmap.md](docs/roadmap.md). Prochaine étape proposée : phase 4, les migrations PostgreSQL et les politiques RLS.

## Limites

- Les brouillons du frontend disparaissent à la fermeture de l’onglet. Les signalements créés par l’API restent en mémoire jusqu’au redémarrage du serveur.
- Le frontend continue à utiliser les fiches fictives et les brouillons locaux ; il ne consomme pas encore l’API.
- Les indicateurs portent sur des fiches fictives, annoncées comme telles.
- Aucun compte ne peut être créé.
- La carte dépend du serveur public de tuiles OpenStreetMap, qui n’est pas un service garanti.
- L’assistance IA n’existe pas.
- Aucun organisme public n’est partenaire du projet.

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Branche par fonctionnalité, pas de secret dans Git, pas de fusion sans avoir exécuté les tests qui existent.
