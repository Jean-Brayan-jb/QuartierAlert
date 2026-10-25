import { CATEGORIES, STATUSES } from './constants.js';
import { mountLayout } from './layout.js';
import { filterReports, loadReports } from './reports.js';
import { demoBanner, emptyState, errorBox, fillSelect, nextPaint, reportCard } from './ui.js';

mountLayout({ active: 'signalements' });

const base = document.body.dataset.base ?? '';
const bannerHost = document.querySelector('#demo-banner');
const form = document.querySelector('#filters');
const categorySelect = document.querySelector('#filter-category');
const statusSelect = document.querySelector('#filter-status');
const count = document.querySelector('#result-count');
const host = document.querySelector('#results');

bannerHost.replaceChildren(demoBanner());
fillSelect(categorySelect, CATEGORIES, 'Toutes les catégories');
fillSelect(statusSelect, STATUSES, 'Tous les statuts');

function countLabel(total) {
  const noun = total === 1 ? 'signalement affiché' : 'signalements affichés';
  return `${total} ${noun}. Données de démonstration.`;
}

function render(reports) {
  const filtered = filterReports(reports, {
    category: categorySelect.value,
    status: statusSelect.value,
  });
  count.textContent = countLabel(filtered.length);
    if (filtered.length === 0) {
      const empty = emptyState(
        'Aucun signalement',
        'Aucun élément ne correspond à ces filtres. Effacez un filtre ou créez un brouillon de démonstration.',
      );
      const link = document.createElement('a');
      link.className = 'button';
      link.href = 'nouveau.html';
      link.textContent = 'Signaler un problème';
      empty.append(link);
      host.replaceChildren(empty);
      return;
    }
  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.append(...filtered.map((report) => reportCard(report, base)));
  host.replaceChildren(grid);
}

async function showList() {
  const forceError = new URLSearchParams(location.search).get('erreur') === '1';
  try {
    await nextPaint();
    const reports = await loadReports({ storage: sessionStorage, forceError });
    render(reports);
    form.addEventListener('submit', (event) => event.preventDefault());
    form.addEventListener('change', () => render(reports));
    document.querySelector('#reset-filters').addEventListener('click', () => {
      categorySelect.value = '';
      statusSelect.value = '';
      render(reports);
    });
  } catch {
    count.textContent = '';
    host.replaceChildren(
      errorBox('Les signalements n’ont pas pu être chargés.', () => {
        location.assign('signalements.html');
      }),
    );
  }
}

showList();
