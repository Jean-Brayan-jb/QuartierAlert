# Démarrage - QuartierAlert

## Prérequis
- Node.js >= 18.0.0 (à confirmer selon environnement)
- npm >= 9.0.0 (à confirmer selon environnement)
- Git

## Installation
```bash
git clone <url-du-depot>
cd QuartierAlert
npm install
cp .env.example .env  # compléter avec vos valeurs
npm start             # démarre le backend
```

## Frontend
Ouvrir `frontend/index.html` directement ou servir avec un serveur statique (ex. `npx serve frontend`).

## Tests
```bash
npm test
```

## Note
Les dépendances sont gérées à la racine pour ce prototype; si elles sont déplacées dans `backend/`, adapter ce document.
