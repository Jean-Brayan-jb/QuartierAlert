# Installation

## Prérequis

- Git
- Node.js 20 ou plus (vérifié en phase 1 avec Node.js v26.11.1 et npm 12.2.0)
- npm

Supabase et une clé Gemini ne sont pas requis : aucune phase actuelle ne les appelle.

## Obtenir le dépôt

```bash
git clone <url-du-depot> QuartierAlert
cd QuartierAlert
cp .env.example .env
npm install
```

Laisser les valeurs Supabase et Gemini vides jusqu’à leur intégration dans les phases suivantes.

## Lancer l’interface

```bash
npm run frontend
```

Puis ouvrir `http://127.0.0.1:4173`. Pour un autre port : `FRONTEND_PORT=8080 npm run frontend`. Le fichier `.env` n’est pas chargé.

Ajouter `?erreur=1` à l’accueil, à la liste ou à la carte pour voir l’état d’erreur, puis utiliser Réessayer.

## Lancer l’API

Dans un second terminal :

```bash
npm start
```

Vérifier `http://127.0.0.1:3000/api/health`. Pour changer le port, définir `PORT` dans l’environnement.

## Tests

```bash
npm test
```

Les tests utilisent `node:test` et ne nécessitent pas de compte Supabase.

## Ce qui ne fonctionne pas encore

| Fonction | État |
| --- | --- |
| `npm run frontend` | Interface de démonstration, indépendante de l’API |
| `npm start` | API Express avec stockage temporaire en mémoire |
| `npm test` | Tests de l’interface, des utilitaires et des routes API |
| Ouvrir `frontend/index.html` via `file://` | Les modules JavaScript sont bloqués par le navigateur |
| Persistance après redémarrage | Non disponible avant l’intégration Supabase |

## Erreurs fréquentes

**Les signalements API disparaissent au redémarrage.** Comportement attendu du dépôt mémoire de phase 3. Une persistance Supabase est prévue en phase 4.

**La carte reste grise.** Les tuiles viennent de `tile.openstreetmap.org`. Sans réseau, ou si le serveur de tuiles refuse la requête, un message s’affiche. Les listes restent utilisables. La politique d’usage est sur <https://operations.osmfoundation.org/policies/tiles/>.

**Node.js trop ancien.** Si `node -v` est inférieur à 20, installer une version plus récente. Le champ `engines` de `package.json` le signale ; npm peut afficher un avertissement sans bloquer.

**Un fichier `.env` apparaît dans `git status`.** Ne pas l’ajouter. Vérifier que `.gitignore` contient `.env`. Seul `.env.example` est versionné.
