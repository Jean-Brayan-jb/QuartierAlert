# Installation

## Prérequis

- Git
- Node.js 20 ou plus (vérifié en phase 1 avec Node.js v26.11.1 et npm 12.2.0)

Supabase et une clé Gemini ne sont pas requis : aucun code ne les appelle.

## Obtenir le dépôt

```bash
git clone <url-du-depot> QuartierAlert
cd QuartierAlert
cp .env.example .env
```

Laisser les valeurs vides tant que les phases 3 et 4 ne les lisent pas.

## Lancer l’interface

```bash
npm run frontend
```

Puis ouvrir `http://127.0.0.1:4173`. Pour un autre port : `FRONTEND_PORT=8080 npm run frontend`. Le fichier `.env` n’est pas chargé.

Ajouter `?erreur=1` à l’accueil, à la liste ou à la carte pour voir l’état d’erreur, puis utiliser Réessayer.

## Ce qui ne fonctionne pas encore

| Commande | Résultat actuel |
| --- | --- |
| `npm install` | Rien à installer : `package.json` ne déclare aucune dépendance |
| `npm start` | Échec explicite : l’API n’existe pas |
| `npm test` | Exécute les tests Node.js de l’interface et des calculs |
| Ouvrir `frontend/index.html` via `file://` | Les modules JavaScript sont bloqués par le navigateur |

## Erreurs fréquentes

**`npm start` se termine par le code 1.** Comportement attendu. Utiliser `npm run frontend` pour l’interface. L’API est prévue en phase 3.

**La carte reste grise.** Les tuiles viennent de `tile.openstreetmap.org`. Sans réseau, ou si le serveur de tuiles refuse la requête, un message s’affiche. Les listes restent utilisables. La politique d’usage est sur <https://operations.osmfoundation.org/policies/tiles/>.

**Node.js trop ancien.** Si `node -v` est inférieur à 20, installer une version plus récente avant la phase 3. Le champ `engines` de `package.json` le signale ; npm peut afficher un avertissement sans bloquer.

**Un fichier `.env` apparaît dans `git status`.** Ne pas l’ajouter. Vérifier que `.gitignore` contient `.env`. Seul `.env.example` est versionné.
