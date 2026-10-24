# Architecture - QuartierAlert

## Vue d'ensemble
- Frontend: HTML5, CSS3, JS natif (pages statiques/servies)
- Backend: Node.js + Express (API REST)
- DB: Supabase PostgreSQL
- Auth: Supabase Auth (à intégrer)
- Stockage: Supabase Storage (photos, à intégrer)
- IA: Gemini API via backend uniquement
- Carto: Leaflet

## Trajet d'une requête
Interface (frontend) → API backend (Express) → Service (logique métier/IA) → Base de données (Supabase)

## Principes
- Clé Gemini jamais exposée côté client
- Validation côté serveur
- Architecture simple pour hackathon
- Propositions IA vérifiables par un humain
