import { AppError } from '../utils/app-error.js';

const CATEGORIES = new Set([
  'dechets',
  'eau',
  'routes',
  'eclairage',
  'environnement',
  'inondation',
  'autre',
]);
const ALLOWED_FIELDS = new Set([
  'title',
  'description',
  'category',
  'locationText',
  'latitude',
  'longitude',
]);

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function addStringErrors(errors, input, field, { min, max }) {
  const value = input[field];
  if (typeof value !== 'string') {
    errors.push({ field, message: 'Ce champ doit être une chaîne de caractères.' });
    return '';
  }

  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    errors.push({
      field,
      message: `Ce champ doit contenir entre ${min} et ${max} caractères.`,
    });
  }
  return trimmed;
}

export function validateReportInput(input) {
  if (!isPlainObject(input)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Le corps doit être un objet JSON.', [
      { field: 'body', message: 'Un objet JSON est obligatoire.' },
    ]);
  }

  const errors = [];
  for (const field of Object.keys(input)) {
    if (!ALLOWED_FIELDS.has(field)) {
      errors.push({ field, message: 'Cette propriété n’est pas autorisée.' });
    }
  }

  const title = addStringErrors(errors, input, 'title', { min: 8, max: 120 });
  const description = addStringErrors(errors, input, 'description', { min: 30, max: 2000 });
  const category = addStringErrors(errors, input, 'category', { min: 1, max: 40 });
  const locationText = addStringErrors(errors, input, 'locationText', { min: 1, max: 180 });

  if (category && !CATEGORIES.has(category)) {
    errors.push({ field: 'category', message: 'Cette catégorie n’est pas autorisée.' });
  }

  const latitudeProvided = Object.hasOwn(input, 'latitude');
  const longitudeProvided = Object.hasOwn(input, 'longitude');
  let latitude = null;
  let longitude = null;

  if (latitudeProvided !== longitudeProvided) {
    errors.push({
      field: 'coordinates',
      message: 'La latitude et la longitude doivent être fournies ensemble.',
    });
  } else if (latitudeProvided) {
    const latNull = input.latitude === null;
    const lngNull = input.longitude === null;
    if (latNull && lngNull) {
      latitude = null;
      longitude = null;
    } else if (latNull || lngNull) {
      errors.push({
        field: 'coordinates',
        message: 'La latitude et la longitude doivent être fournies ensemble.',
      });
    } else {
      latitude = input.latitude;
      longitude = input.longitude;
      if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        errors.push({ field: 'latitude', message: 'La latitude doit être un nombre entre -90 et 90.' });
      }
      if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        errors.push({ field: 'longitude', message: 'La longitude doit être un nombre entre -180 et 180.' });
      }
    }
  }

  if (errors.length > 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'La requête contient des données invalides.', errors);
  }

  return { title, description, category, locationText, latitude, longitude };
}

export function validateReportId(id) {
  if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(id)) {
    throw new AppError(400, 'INVALID_REPORT_ID', 'L’identifiant du signalement est invalide.');
  }
  return id;
}

export function parsePagination(query) {
  const limit = parseQueryInteger(query.limit, 20, 1, 100, 'limit');
  const offset = parseQueryInteger(query.offset, 0, 0, Number.MAX_SAFE_INTEGER, 'offset');
  return { limit, offset };
}

function parseQueryInteger(value, fallback, min, max, field) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)$/.test(value)) {
    throw new AppError(400, 'INVALID_QUERY', `Le paramètre ${field} est invalide.`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new AppError(400, 'INVALID_QUERY', `Le paramètre ${field} est hors limites.`);
  }
  return parsed;
}
