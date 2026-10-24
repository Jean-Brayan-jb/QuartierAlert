# Contribuer à QuartierAlert

## Branches

`main` reçoit le code déjà vérifié. Ouvrir une branche par sujet, par exemple :

- `feat/homepage`
- `feat/report-form`
- `feat/reports-api`
- `feat/supabase-schema`
- `feat/gemini-classification`
- `feat/interactive-map`
- `feat/admin-dashboard`
- `test/api-authorization`
- `docs/project-guide`

## Commits

Écrire un message qui dit pourquoi le changement existe. Exemples : `ajoute le formulaire de signalement`, `rejette les catégories inconnues`.

Ne pas committer `.env`, de clés API, de jetons, ni de photos personnelles.

## Pull requests

Les changements importants passent par une pull request. Le modèle dans `.github/pull_request_template.md` rappelle les contrôles minimaux.

Avant de proposer une fusion :

1. Lancer `npm test` lorsque des tests existent.
2. Vérifier que le README décrit encore ce que le code fait vraiment.
3. Ne pas modifier en silence le travail d’une autre personne sans l’avoir coordonné.

## État actuel

`npm test` exécute les tests Node.js présents. Les lancer avant une pull request. L’API et ses tests d’autorisation ne sont pas encore écrits.
