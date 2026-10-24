# Base de données - QuartierAlert

## Stack
Supabase PostgreSQL

## Éléments à modéliser (conceptuel)
- `reports`: id, titre, description, catégorie, statut, localisation (coordonnées ou texte), photos, auteur, timestamps
- `categories`: types de problèmes
- `statuses`: suivi d'évolution
- `ai_suggestions`: propositions IA liées aux signalements (à valider humainement)

Détails à affiner dans `database/schema.sql` et migrations.
