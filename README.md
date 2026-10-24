# QuartierAlert

**Slogan :** « Un problème signalé, une communauté mobilisée. »

**Description courte :** Plateforme de signalement et de suivi des problèmes communautaires dans les quartiers, notamment au Togo. Elle permet aux habitants de publier, consulter et suivre l'évolution des incidents affectant le cadre de vie.

> **Capture d'écran :** Emplacement prévu — *non disponible pour le moment*.  
> **Démonstration :** Emplacement prévu (URL à définir) — *non disponible pour le moment*.

## A) Le problème
Il est souvent difficile pour les habitants de signaler efficacement un problème dans leur quartier (dépôts sauvages, fuites d'eau, voirie endommagée, lampadaires défectueux, assainissement, etc.) et de savoir s'il est pris en compte. Ces difficultés sont présentées ici comme des **problèmes à valider sur le terrain**, et non comme des statistiques déjà démontrées.

## B) Notre solution
QuartierAlert facilite la **création**, la **consultation**, la **catégorisation** et le **suivi** des signalements. Une assistance IA pourra proposer classification, résumé et rapprochement entre signalements similaires, mais **ses propositions devront rester vérifiables par un humain**.

## C) Objectifs
- **Prototype hackathon :** Structure claire, parcours de signalement minimal, base API, documentation prête pour l'équipe.
- **Fonctionnalités futures :** Authentification complète, tableau de bord avancé, intégration avec organismes compétents (si partenariat confirmé), modération renforcée.
- **À valider sur le terrain :** Pertinence des catégories, adoption, efficacité du suivi — nécessitent une validation réelle.

## D) Fonctionnalités
### Statut
- **Prévu** / **En développement** / **Disponible et testé**

### Ciblées pour la première version
| Fonctionnalité | Statut | Détails |
|---|---|---|
| Création d'un signalement (titre, description, catégorie) | Prévu | À implémenter |
| Ajout facultatif d'une photo | Prévu | Via Supabase Storage (à intégrer) |
| Localisation ou indication textuelle du lieu | Prévu | À implémenter |
| Consultation des signalements | Prévu | À implémenter |
| Filtrage par catégorie et statut | Prévu | À implémenter |
| Suivi de l'état d'un signalement | Prévu | À implémenter |
| Assistance IA (classification et résumé) | Prévu | Gemini côté serveur uniquement |
| Suggestions de rapprochement entre signalements similaires | Prévu | À valider humainement |
| Tableau de bord de suivi | Prévu | À implémenter |
| Interface responsive | Prévu | Base CSS responsive présente |

*Aucune fonctionnalité n'est marquée comme terminée sans preuve dans le code.*

## E) Démonstration
- **URL de démonstration :** À définir — *non disponible pour le moment*.

## F) Architecture technique
**Technologies et rôles :**
- **Frontend** : HTML5, CSS3, JavaScript natif — Interface utilisateur
- **Backend** : Node.js + Express — API REST
- **Base de données** : Supabase PostgreSQL — Persistance
- **Authentification** : Supabase Auth — À intégrer ultérieurement
- **Stockage photos** : Supabase Storage — À intégrer ultérieurement
- **IA** : Gemini API — Via le backend uniquement (clé jamais côté client)
- **Cartographie** : Leaflet — Avec source de tuiles adaptée au contexte
- **Tests** : Node.js test runner (léger)

**Trajet d'une requête :** Interface (frontend) → API backend (Express) → Service concerné (métier/IA) → Base de données (Supabase)

## G) Arborescence
```
QuartierAlert/
├── README.md, LICENSE, .gitignore, .editorconfig, .env.example, package.json
├── CONTRIBUTING.md, SECURITY.md, CHANGELOG.md
├── docs/ (architecture, setup, roadmap, api, database, team-workflow)
├── frontend/ (index.html, pages/, css/, js/, assets/)
├── backend/src/ (app.js, server.js, config/, routes/, controllers/, services/, middlewares/, validators/, utils/)
├── database/ (migrations/, seeds/, schema.sql)
├── tests/ (backend/, fixtures/)
├── .github/ (ISSUE_TEMPLATE/, PULL_REQUEST_TEMPLATE.md, workflows/ci.yml)
└── scripts/
```

## H) Prérequis
- **Node.js** : >= 18.0.0 *(à confirmer selon environnement)*
- **npm** : >= 9.0.0 *(à confirmer selon environnement)*
- **Git**

## I) Installation
```bash
# 1. Cloner le dépôt
git clone <url-du-depot>
cd QuartierAlert

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Compléter .env avec vos valeurs (aucun secret réel)

# 4. Démarrer le backend
npm start

# 5. Ouvrir/servir le frontend
# Ouvrir frontend/index.html dans le navigateur ou : npx serve frontend

# 6. Exécuter les tests
npm test
```

## J) Variables d'environnement
Voir `.env.example`. Variables prévues :
- `PORT` (défaut 3000)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (si nécessaire côté serveur)
- `SUPABASE_SERVICE_ROLE_KEY` (uniquement côté serveur si nécessaire)
- `GEMINI_API_KEY` (obligatoire si IA activée, côté serveur uniquement)
- `NODE_ENV`

**Aucun secret réel ne doit être présent dans Git.**

## K) Utilisation
Parcours utilisateur prévu (non opérationnel pour l'instant) :
1. Consulter les signalements sur la page liste/carte
2. Signaler un problème (formulaire) avec localisation
3. Suivre l'évolution du signalement
4. Possibilité de suggestions IA vérifiables par un humain

## L) Collaboration
Voir [CONTRIBUTING.md](CONTRIBUTING.md) et [docs/team-workflow.md](docs/team-workflow.md).

## M) Sécurité et confidentialité
- **Validation** : Entrées à valider côté serveur
- **Abus** : Protection à prévoir
- **Accès** : Règles à définir selon rôles
- **Clés API** : Uniquement côté serveur
- **Photos/PII** : Prudence sur collecte/stockage
- **Localisation** : Respect de la vie privée
- **Modération** : À prévoir
- **IA** : Vérification humaine obligatoire des propositions

## N) Roadmap
Voir [docs/roadmap.md](docs/roadmap.md) - Phases 1-6.

## O) Limites connues
- Prototype de hackathon, non prêt pour production
- Beaucoup de fonctionnalités marquées "prévu"
- Dépendances externes : Supabase, Gemini API (configuration requise)
- Auth/stockage/photos non implémentés
- Carte Leaflet non configurée avec source de tuiles définitive
- Licence non choisie

## P) Contribution, licence et contact
- **Contribution** : [CONTRIBUTING.md](CONTRIBUTING.md)
- **Licence** : *À définir* (voir [LICENSE](LICENSE))
- **Contact/Membres/Partenaires** : *Non renseignés* (à décider par l'équipe)
