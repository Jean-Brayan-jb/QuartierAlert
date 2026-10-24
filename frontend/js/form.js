import { CATEGORIES } from './constants.js';
import { mountLayout } from './layout.js';
import { saveLocalReport } from './reports.js';
import { fillSelect } from './ui.js';
import { validatePhoto, validateReport } from './validation.js';

mountLayout({ active: 'nouveau' });

const form = document.querySelector('#report-form');
const summary = document.querySelector('#form-summary');
const confirmation = document.querySelector('#confirmation');
const submitButton = document.querySelector('#submit-report');
const photoInput = document.querySelector('#photo');
const preview = document.querySelector('#photo-preview');
const previewImage = document.querySelector('#photo-preview-img');
const geoButton = document.querySelector('#use-location');
const geoMessage = document.querySelector('#geo-message');
let previewUrl = '';
let submitting = false;

fillSelect(document.querySelector('#category'), CATEGORIES, 'Choisir une catégorie');
form.noValidate = true;

function fieldError(name) {
  return document.getElementById(`${name}-error`);
}

function clearErrors() {
  summary.hidden = true;
  summary.textContent = '';
  for (const element of form.querySelectorAll('[aria-invalid="true"]')) {
    element.removeAttribute('aria-invalid');
  }
  for (const element of form.querySelectorAll('.field-error')) {
    element.hidden = true;
    element.textContent = '';
  }
}

function showErrors(errors) {
  summary.hidden = false;
  summary.textContent = 'Le formulaire contient des erreurs. Corrigez les champs indiqués.';
  const order = ['title', 'description', 'category', 'photo', 'locationText', 'coordinates', 'latitude', 'longitude', 'accuracy'];
  let focused = false;
  for (const name of order) {
    if (!errors[name]) continue;
    const message = fieldError(name);
    if (message) {
      message.hidden = false;
      message.textContent = errors[name];
    }
    const field = form.elements[name] || (name === 'coordinates' ? form.elements.latitude : null);
    if (field) field.setAttribute('aria-invalid', 'true');
    if (!focused && field) {
      field.focus();
      focused = true;
    }
  }
}

function setGeoMessage(text) {
  geoMessage.hidden = !text;
  geoMessage.textContent = text;
}

photoInput.addEventListener('change', () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = '';
  const file = photoInput.files?.[0];
  const error = validatePhoto(file);
  const photoError = fieldError('photo');
  if (error) {
    photoError.hidden = false;
    photoError.textContent = error;
    photoInput.setAttribute('aria-invalid', 'true');
    preview.hidden = true;
    previewImage.removeAttribute('src');
    return;
  }
  photoError.hidden = true;
  photoError.textContent = '';
  photoInput.removeAttribute('aria-invalid');
  if (!file) {
    preview.hidden = true;
    previewImage.removeAttribute('src');
    return;
  }
  previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  preview.hidden = false;
});

geoButton.addEventListener('click', () => {
  setGeoMessage('');
  if (!navigator.geolocation) {
    setGeoMessage('La géolocalisation n’est pas disponible sur cet appareil. Saisissez le lieu à la main.');
    return;
  }
  geoButton.disabled = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.elements.latitude.value = position.coords.latitude.toFixed(5);
      form.elements.longitude.value = position.coords.longitude.toFixed(5);
      setGeoMessage('Position lue pour cette démonstration. Elle n’est pas envoyée à un serveur.');
      geoButton.disabled = false;
    },
    (error) => {
      const refused = error.code === 1;
      setGeoMessage(
        refused
          ? 'La position n’a pas été partagée. Vous pouvez saisir le lieu à la main.'
          : 'La position n’a pas pu être lue. Vous pouvez saisir le lieu à la main.',
      );
      geoButton.disabled = false;
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
  );
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (submitting) return;
  submitting = true;
  submitButton.disabled = true;
  clearErrors();

  const result = validateReport({
    title: form.elements.title.value,
    description: form.elements.description.value,
    category: form.elements.category.value,
    locationText: form.elements.locationText.value,
    latitude: form.elements.latitude.value,
    longitude: form.elements.longitude.value,
    accuracy: form.elements.accuracy.checked,
    photo: photoInput.files?.[0] ?? null,
  });

  if (!result.ok) {
    showErrors(result.errors);
    submitting = false;
    submitButton.disabled = false;
    return;
  }

  const hadPhoto = Boolean(photoInput.files?.length);
  const report = {
    id: `local-${crypto.randomUUID()}`,
    title: result.value.title,
    description: result.value.description,
    category: result.value.category,
    status: 'submitted',
    locationText: result.value.locationText,
    latitude: result.value.latitude,
    longitude: result.value.longitude,
    imagePath: null,
    createdAt: new Date().toISOString(),
    demo: true,
    local: true,
  };

  try {
    saveLocalReport(sessionStorage, report);
  } catch {
    summary.hidden = false;
    summary.textContent = 'Le brouillon n’a pas pu être conservé dans cet onglet.';
    submitting = false;
    submitButton.disabled = false;
    return;
  }

  confirmation.replaceChildren();
  const title = document.createElement('h2');
  title.textContent = 'Brouillon conservé dans cet onglet';
  const paragraph = document.createElement('p');
  paragraph.textContent =
    'Ce signalement n’a pas été envoyé à un serveur et disparaîtra à la fermeture de l’onglet. Aucune autorité n’a été contactée.';
  if (hadPhoto) {
    const photoNote = document.createElement('p');
    photoNote.textContent = 'La photo n’a pas été conservée.';
    confirmation.append(title, paragraph, photoNote);
  } else {
    confirmation.append(title, paragraph);
  }
  const link = document.createElement('a');
  link.className = 'button';
  link.href = `signalement.html?id=${encodeURIComponent(report.id)}`;
  link.textContent = 'Voir ce brouillon';
  const again = document.createElement('button');
  again.type = 'button';
  again.className = 'button button-secondary';
  again.textContent = 'Signaler un autre problème';
  again.addEventListener('click', () => {
    form.reset();
    fillSelect(document.querySelector('#category'), CATEGORIES, 'Choisir une catégorie');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    preview.hidden = true;
    previewImage.removeAttribute('src');
    clearErrors();
    setGeoMessage('');
    confirmation.hidden = true;
    confirmation.replaceChildren();
    form.hidden = false;
    submitting = false;
    submitButton.disabled = false;
    form.elements.title.focus();
  });
  confirmation.append(link, again);
  confirmation.hidden = false;
  form.hidden = true;
  confirmation.focus();
});
