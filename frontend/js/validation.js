import {
  CATEGORY_IDS,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  LOCATION_MAX,
  PHOTO_EXTENSIONS,
  PHOTO_MAX_BYTES,
  PHOTO_TYPES,
  TITLE_MAX,
  TITLE_MIN,
} from './constants.js';

export function validatePhoto(file) {
  if (!file) return null;
  const name = String(file.name || '').toLowerCase();
  const extension = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
  const typeOk = PHOTO_TYPES.includes(file.type);
  const extensionOk = name === '' || PHOTO_EXTENSIONS.includes(extension);
  if (!typeOk || !extensionOk) {
    return 'Format accepté : JPEG, PNG ou WebP.';
  }
  if (typeof file.size !== 'number' || file.size > PHOTO_MAX_BYTES) {
    return 'La photo dépasse 5 Mo.';
  }
  return null;
}

function blank(value) {
  return value === '' || value === null || value === undefined;
}

export function validateReport(input) {
  const errors = {};
  const title = String(input?.title ?? '').trim();
  const description = String(input?.description ?? '').trim();
  const category = String(input?.category ?? '').trim();
  const locationText = String(input?.locationText ?? '').trim();
  const latitude = input?.latitude;
  const longitude = input?.longitude;

  if (title.length < TITLE_MIN) {
    errors.title = `Le titre doit contenir au moins ${TITLE_MIN} caractères.`;
  } else if (title.length > TITLE_MAX) {
    errors.title = `Le titre ne peut pas dépasser ${TITLE_MAX} caractères.`;
  }

  if (description.length < DESCRIPTION_MIN) {
    errors.description = `La description doit contenir au moins ${DESCRIPTION_MIN} caractères.`;
  } else if (description.length > DESCRIPTION_MAX) {
    errors.description = `La description ne peut pas dépasser ${DESCRIPTION_MAX} caractères.`;
  }

  if (!CATEGORY_IDS.has(category)) {
    errors.category = 'Choisissez une catégorie de la liste.';
  }

  if (!locationText) {
    errors.locationText = 'Indiquez un lieu, même approximatif. Les coordonnées ne sont pas obligatoires.';
  } else if (locationText.length > LOCATION_MAX) {
    errors.locationText = `Le lieu ne peut pas dépasser ${LOCATION_MAX} caractères.`;
  }

  const latBlank = blank(latitude);
  const lngBlank = blank(longitude);
  let latitudeValue = null;
  let longitudeValue = null;

  if (latBlank !== lngBlank) {
    errors.coordinates = 'Renseignez la latitude et la longitude, ou laissez les deux vides.';
  } else if (!latBlank) {
    latitudeValue = Number(latitude);
    longitudeValue = Number(longitude);
    if (!Number.isFinite(latitudeValue) || latitudeValue < -90 || latitudeValue > 90) {
      errors.latitude = 'La latitude doit être comprise entre −90 et 90.';
    }
    if (!Number.isFinite(longitudeValue) || longitudeValue < -180 || longitudeValue > 180) {
      errors.longitude = 'La longitude doit être comprise entre −180 et 180.';
    }
  }

  if (input?.accuracy !== true) {
    errors.accuracy = 'Confirmez que les informations sont exactes, à votre connaissance.';
  }

  const photoError = validatePhoto(input?.photo);
  if (photoError) errors.photo = photoError;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: {
      title,
      description,
      category,
      locationText,
      latitude: latitudeValue,
      longitude: longitudeValue,
    },
  };
}
