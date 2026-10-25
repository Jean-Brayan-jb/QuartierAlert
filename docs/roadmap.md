# Roadmap

## Phase 1 — Initialisation

Faite. Structure, `package.json`, `.gitignore`, `.env.example`, documentation d’état. Pas de fonctionnalité métier.

## Phase 2 — Interface

Faite, sans API.

- Accueil, navigation, liste, détail, formulaire, carte, à propos, connexion.
- Indicateurs calculés sur les fiches chargées. Bandeau « données fictives ».
- Formulaire validé dans le navigateur. Brouillon d’onglet seulement.
- États de chargement, d’erreur (`?erreur=1`) et de liste vide.
- Leaflet 1.9.4, filtres, signalements sans coordonnées.

Reste pour plus tard : administration, statuts modifiables, authentification réelle.

## Phase 3 — Backend

Implémentée. Express, `GET /api/health`, `GET /api/reports`, `GET /api/reports/:id` et `POST /api/reports`, validation, erreurs centralisées, pagination et tests. Le dépôt en mémoire est vide au démarrage, temporaire et remplaçable. Le frontend n’est pas encore connecté.

## Phase 4 — Base de données

Migrations, contraintes, RLS, jeu de démonstration qui ne touche pas à des données de production.

## Phase 5 — Intégration

Le formulaire et les listes lisent et écrivent l’API. Les statistiques viennent des données enregistrées.

## Phase 6 — Gemini

Classification, résumé, priorité indicative, suggestions de doublons. Fonctionnement dégradé si la clé est absente. Tests sur réponses simulées.

## Phase 7 — Carte et administration

Marqueurs, filtres, tableau de bord, historique, changement de statut réservé aux rôles prévus.

## Phase 8 — Finalisation

Tests, affichage mobile, permissions, variables d’environnement, documentation, scénario de démonstration.
