# Workflow d'équipe - QuartierAlert

## Règles
1. `main` contient uniquement du code validé
2. Branche par fonctionnalité/correctif
3. Noms de branche: `feat/...`, `fix/...`, `docs/...`, `test/...`, `refactor/...`, `chore/...`
4. Commits avec préfixes cohérents
5. PR avec description, tests, captures si UI
6. Revue par au moins un autre membre si possible
7. Résoudre conflits avant fusion
8. Aucun secret/.env réel sur GitHub

## Étapes
```bash
git checkout -b feat/nom-fonctionnalite
# développement
git add .
git commit -m "feat: description courte"
git push origin feat/nom-fonctionnalite
# ouvrir PR sur GitHub
```

## Bonnes pratiques
- Petites PRs focalisées
- Mettre à jour la doc si nécessaire
- Propositions IA à vérifier humainement
