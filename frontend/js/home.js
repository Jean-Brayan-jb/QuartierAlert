import { mountLayout } from './layout.js';
import { loadReports } from './reports.js';
import { computeStats } from './stats.js';
import { demoBanner, emptyState, errorBox, nextPaint, renderStats, reportCard } from './ui.js';
import { mountMap } from './map-view.js';

mountLayout({ active: 'accueil' });

const base = document.body.dataset.base ?? '';
const bannerHost = document.querySelector('#demo-banner');
const statsHost = document.querySelector('#stats');
const recentHost = document.querySelector('#recent');
const mapHost = document.querySelector('#map');
const mapNotice = document.querySelector('#map-notice');

bannerHost.replaceChildren(demoBanner());

async function showHome() {
  const forceError = new URLSearchParams(location.search).get('erreur') === '1';
  try {
    await nextPaint();
    const reports = await loadReports({ storage: sessionStorage, forceError });
    renderStats(statsHost, computeStats(reports));
    const recent = reports.slice(0, 4);
    if (recent.length === 0) {
      recentHost.replaceChildren(
        emptyState('Aucun signalement', 'La liste est vide. Les prochains signalements de démonstration apparaîtront ici.'),
      );
    } else {
      const grid = document.createElement('div');
      grid.className = 'card-grid';
      grid.append(...recent.map((report) => reportCard(report, base)));
      recentHost.replaceChildren(grid);
    }
    mountMap(mapHost, reports, { base, compact: true, notice: mapNotice });
  } catch {
    const retry = () => {
      location.assign(`${base}index.html`);
    };
    statsHost.replaceChildren(errorBox('Les indicateurs n’ont pas pu être calculés.', retry));
    recentHost.replaceChildren(errorBox('Les signalements récents n’ont pas pu être affichés.', retry));
    mapHost.replaceChildren(errorBox('La carte n’a pas pu être préparée.', retry));
  }
}

showHome();
