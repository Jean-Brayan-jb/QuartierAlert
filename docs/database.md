# Base de données

Aucune table n’existe. `database/schema.sql` ne contient pas d’instruction `CREATE`. `database/migrations/` et `database/seeds/` sont vides. Aucun projet Supabase n’est relié à ce dépôt.

Les fiches visibles dans l’interface sont des données fictives du navigateur (`frontend/js/demo-data.js`) et, éventuellement, des brouillons `sessionStorage`. Elles ne sont pas dans PostgreSQL.

## Tables prévues (phase 4)

- `profiles` — identifiant Supabase Auth, nom d’affichage, dates. Pas de mot de passe.
- `reports` — signalement, catégorie, statut, lieu textuel, coordonnées facultatives, image facultative, auteur.
- `report_status_history` — ancien statut, nouveau statut, auteur du changement, note.
- `report_ai_analyses` — suggestions du modèle, distinctes des champs validés du signalement.
- `report_relations` — paires de signalements proches, sans relation d’un signalement avec lui-même.

Les clés, contraintes, index, règles de suppression et politiques RLS seront écrits dans une migration versionnée. Les scripts de démonstration ne devront pas effacer des données existantes.

## Rôles prévus

Le rôle ne sera pas lu depuis un champ envoyé librement par le navigateur. Les politiques RLS et le backend devront tous les deux refuser une action non autorisée.
