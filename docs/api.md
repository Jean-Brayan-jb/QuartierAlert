# API - QuartierAlert

## État
Documentation préliminaire. Endpoints à implémenter.

## Prévu
- `GET /health` - Santé du service (présent en version minimale)
- `POST /reports` - Créer un signalement
- `GET /reports` - Lister les signalements (filtres)
- `GET /reports/:id` - Détails d'un signalement
- `PUT/PATCH /reports/:id/status` - Mise à jour statut (selon rôles)

Toutes les clés sensibles (Gemini) restent côté serveur.
