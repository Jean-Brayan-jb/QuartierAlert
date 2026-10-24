export const CATEGORIES = [
  { id: 'dechets', label: 'Déchets' },
  { id: 'eau', label: 'Eau et assainissement' },
  { id: 'routes', label: 'Routes' },
  { id: 'eclairage', label: 'Éclairage public' },
  { id: 'environnement', label: 'Environnement' },
  { id: 'inondation', label: 'Inondation' },
  { id: 'autre', label: 'Autre' },
];

export const CATEGORY_IDS = new Set(CATEGORIES.map((category) => category.id));

export const STATUSES = [
  { id: 'submitted', label: 'Soumis' },
  { id: 'under_review', label: 'En examen' },
  { id: 'in_progress', label: 'En cours' },
  { id: 'resolved', label: 'Résolu' },
  { id: 'rejected', label: 'Rejeté' },
];

export const STATUS_IDS = new Set(STATUSES.map((status) => status.id));

export const STATUS_LABELS = Object.fromEntries(STATUSES.map((status) => [status.id, status.label]));

/** Centre cartographique de démonstration (Lomé). Ce n’est pas un incident. */
export const DEFAULT_CENTER = [6.1725, 1.222];
export const DEFAULT_ZOOM = 12;

export const TITLE_MIN = 8;
export const TITLE_MAX = 120;
export const DESCRIPTION_MIN = 30;
export const DESCRIPTION_MAX = 2000;
export const LOCATION_MAX = 180;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const LOCAL_STORAGE_KEY = 'quartieralert.localReports.v1';
