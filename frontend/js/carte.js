import { CATEGORIES, STATUSES } from './constants.js';
import { mountLayout } from './layout.js';
import { filterReports, loadReports } from './reports.js';
import { mountMap } from './map-view.js';
import { demoBanner, emptyState, errorBox, fillSelect, nextPaint, renderLegend, reportCard } from './ui.js';

mountLayout({ active: 'carte' });

const base = document.body.dataset.base ?? '';
const bannerHost = document.querySelector('#demo-banner');
const form = document.querySelector('#filters');
const categorySelect = document.querySelector('#filter-category');
const statusSelect = document.querySelector('#filter-status');
const mapHost = document.querySelector('#map');
const mapNotice = document.querySelector('#map-notice');
const locatedHost = document.querySelector('#located');
const unlocatedHost = document.querySelector('#unlocated');
let currentMap = null;

bannerHost.replaceChildren(demoBanner());
renderLegend(document.querySelector('#legend'));
fillSelect(categorySelect, CATEGORIES, 'Toutes les catégories');
fillSelect(statusSelect, STATUSES, 'Tous les statuts');

function renderGroup(host, reports, emptyTitle, emptyText) {
  if (reports.length === 0) {
    host.replaceChildren(emptyState(emptyTitle, emptyText));
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.append(...reports.map((report) => reportCard(report, base)));
  host.replaceChildren(grid);
}

function render(reports) {
  const filtered = filterReports(reports, {
    category: categorySelect.value,
    status: statusSelect.value,
  });
  const located = filterReports(filtered, { located: 'with' });
  const unlocated = filterReports(filtered, { located: 'without' });
  mapNotice.hidden = true;
  mapNotice.textContent = '';
  if (currentMap) {
    currentMap.remove();
    currentMap = null;
  }
  mapHost.className = 'map';
  currentMap = mountMap(mapHost, located, { base, notice: mapNotice });
  renderGroup(
    locatedHost,
    located,
    'Aucun point sur la carte',
    'Aucun signalement géolocalisé ne correspond à ces filtres.',
  );
  renderGroup(
    unlocatedHost,
    unlocated,
    'Aucun signalement sans coordonnées',
    'Les fiches de ce filtre ont des coordonnées, ou aucune fiche ne correspond.',
  );
}

async function showMap() {
  const forceError = new URLSearchParams(location.search).get('erreur') === '1';
  try {
    await nextPaint();
    const reports = await loadReports({ storage: sessionStorage, forceError });
    render(reports);
    form.addEventListener('submit', (event) => event.preventDefault());
    form.addEventListener('change', () => render(reports));
  } catch {
    mapHost.replaceChildren(errorBox('La carte n’a pas pu charger ses signalements.', () => location.assign('carte.html')));
    locatedHost.replaceChildren();
    unlocatedHost.replaceChildren();
  }
}

showMap();
