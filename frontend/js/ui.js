import { CATEGORIES, STATUS_LABELS } from './constants.js';
import { safeImagePath } from './reports.js';

export function categoryLabel(id) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? 'Catégorie inconnue';
}

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? 'Statut inconnu';
}

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lome',
  }).format(date);
}

export function formatCoordinates(report) {
  if (!Number.isFinite(report?.latitude) || !Number.isFinite(report?.longitude)) {
    return 'Non fournies. Le lieu textuel suffit.';
  }
  return `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)} — indicatives, pas une adresse de domicile`;
}

export function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

export function demoBanner() {
  const paragraph = document.createElement('p');
  paragraph.className = 'demo-banner';
  paragraph.textContent =
    'Données fictives de démonstration. Elles ne décrivent pas un quartier réel et ne sont pas enregistrées sur un serveur.';
  return paragraph;
}

export function errorBox(message, onRetry) {
  const box = document.createElement('div');
  box.className = 'notice notice-error';
  box.setAttribute('role', 'alert');
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  box.append(paragraph);
  if (onRetry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-secondary';
    button.textContent = 'Réessayer';
    button.addEventListener('click', onRetry);
    box.append(button);
  }
  return box;
}

export function emptyState(title, text) {
  const box = document.createElement('div');
  box.className = 'empty';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  box.append(heading, paragraph);
  return box;
}

export function statusBadge(status) {
  const badge = document.createElement('span');
  badge.className = `badge badge-${STATUS_LABELS[status] ? status : 'unknown'}`;
  badge.textContent = statusLabel(status);
  return badge;
}

export function reportCard(report, base) {
  const article = document.createElement('article');
  article.className = 'card';
  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = `${base}pages/signalement.html?id=${encodeURIComponent(report.id)}`;

  const imagePath = safeImagePath(report.imagePath);
  if (imagePath) {
    const image = document.createElement('img');
    image.className = 'card-image';
    image.src = `${base}${imagePath}`;
    image.alt = 'Illustration de démonstration. Ce n’est pas une photo du lieu.';
    link.append(image);
  }

  const body = document.createElement('div');
  body.className = 'card-body';
  const meta = document.createElement('p');
  meta.className = 'card-meta';
  meta.append(document.createTextNode(`${categoryLabel(report.category)} · `), statusBadge(report.status));
  const title = document.createElement('h3');
  title.textContent = report.title;
  const place = document.createElement('p');
  place.className = 'card-place';
  place.textContent = report.locationText;
  const time = document.createElement('p');
  time.className = 'card-time';
  const timeElement = document.createElement('time');
  timeElement.dateTime = report.createdAt;
  timeElement.textContent = formatDate(report.createdAt);
  time.append(timeElement);
  const origin = document.createElement('p');
  origin.className = 'card-origin';
  origin.textContent = report.local
    ? 'Saisi dans cet onglet, non envoyé.'
    : 'Fiche fictive de démonstration.';
  body.append(meta, title, place, time, origin);
  link.append(body);
  article.append(link);
  return article;
}

const STAT_ITEMS = [
  { key: 'total', label: 'Total', hint: 'Tous statuts confondus' },
  { key: 'open', label: 'Ouverts', hint: 'Soumis ou en examen' },
  { key: 'inProgress', label: 'En cours', hint: 'En traitement' },
  { key: 'resolved', label: 'Résolus', hint: 'Statut résolu' },
];

export function renderStats(host, stats) {
  const grid = document.createElement('div');
  grid.className = 'stat-grid';
  for (const item of STAT_ITEMS) {
    const article = document.createElement('article');
    article.className = 'stat';
    const value = document.createElement('p');
    value.className = 'stat-value';
    value.textContent = String(stats[item.key] ?? 0);
    const label = document.createElement('h3');
    label.textContent = item.label;
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = item.hint;
    article.append(value, label, hint);
    grid.append(article);
  }
  const caption = document.createElement('p');
  caption.className = 'hint';
  caption.textContent =
    'Les signalements rejetés comptent dans le total, pas dans les autres indicateurs. Ces nombres sont calculés à partir des fiches chargées.';
  host.replaceChildren(grid, caption);
}

export function renderLegend(list) {
  list.replaceChildren();
  for (const category of CATEGORIES) {
    const item = document.createElement('li');
    const swatch = document.createElement('span');
    swatch.className = `swatch swatch-${category.id}`;
    swatch.setAttribute('aria-hidden', 'true');
    item.append(swatch, document.createTextNode(` ${category.label}`));
    list.append(item);
  }
}

export function fillSelect(select, options, placeholder) {
  const current = select.value;
  select.replaceChildren();
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = placeholder;
  select.append(blank);
  for (const option of options) {
    const element = document.createElement('option');
    element.value = option.id;
    element.textContent = option.label;
    select.append(element);
  }
  if ([...select.options].some((option) => option.value === current)) {
    select.value = current;
  }
}

function addDefinition(list, label, content) {
  const term = document.createElement('dt');
  term.textContent = label;
  const definition = document.createElement('dd');
  if (typeof content === 'string') definition.textContent = content;
  else definition.append(content);
  list.append(term, definition);
}

export function renderDetail(report, base) {
  const article = document.createElement('article');
  article.className = 'detail';

  const imagePath = safeImagePath(report.imagePath);
  if (imagePath) {
    const image = document.createElement('img');
    image.className = 'detail-image';
    image.src = `${base}${imagePath}`;
    image.alt = 'Illustration de démonstration. Ce n’est pas une photo du lieu.';
    article.append(image);
  }

  const meta = document.createElement('p');
  meta.className = 'card-meta';
  meta.append(document.createTextNode(`${categoryLabel(report.category)} · `), statusBadge(report.status));
  const title = document.createElement('h1');
  title.textContent = report.title;
  const description = document.createElement('p');
  description.className = 'detail-text';
  description.textContent = report.description;

  const facts = document.createElement('dl');
  facts.className = 'facts';
  addDefinition(facts, 'Lieu', report.locationText);
  addDefinition(facts, 'Coordonnées', formatCoordinates(report));
  addDefinition(facts, 'Déclaré le', formatDate(report.createdAt));
  if (report.resolvedAt) addDefinition(facts, 'Marqué résolu le', formatDate(report.resolvedAt));
  addDefinition(facts, 'Auteur', 'Non affiché. Cette démonstration ne publie pas d’identité.');

  const origin = document.createElement('p');
  origin.className = report.local ? 'notice notice-ok' : 'demo-banner';
  origin.textContent = report.local
    ? 'Ce brouillon existe seulement dans cet onglet. Il n’est pas enregistré et aucune autorité n’a été prévenue.'
    : 'Fiche fictive. Elle ne correspond pas à un incident réel, et elle n’a été transmise à personne.';

  article.append(meta, title, origin, description, facts);
  return article;
}
