import { mountLayout } from './layout.js';
import { hasCoordinates, loadReports } from './reports.js';
import { computeStats } from './stats.js';
import { demoBanner, emptyState, errorBox, nextPaint, renderDistribution, renderStats, reportCard } from './ui.js';
import { mountMap } from './map-view.js';

mountLayout({ active: 'accueil' });

const base = document.body.dataset.base ?? '';
const bannerHost = document.querySelector('#demo-banner');
const statsHost = document.querySelector('#stats');
const breakdownHost = document.querySelector('#breakdown');
const recentHost = document.querySelector('#recent');
const mapHost = document.querySelector('#map');
const mapNotice = document.querySelector('#map-notice');
const mapMissing = document.querySelector('#map-missing');

bannerHost.replaceChildren(demoBanner());

async function showHome() {
  const forceError = new URLSearchParams(location.search).get('erreur') === '1';
  try {
    await nextPaint();
    const reports = await loadReports({ storage: sessionStorage, forceError });
    const stats = computeStats(reports);
    renderStats(statsHost, stats);
    renderDistribution(breakdownHost, stats, reports);
    const recent = reports.slice(0, 4);
    if (recent.length === 0) {
      const empty = emptyState('Aucun signalement', 'La liste est vide. Les prochains signalements de démonstration apparaîtront ici.');
      const link = document.createElement('a');
      link.className = 'button';
      link.href = `${base}pages/nouveau.html`;
      link.textContent = 'Signaler un problème';
      empty.append(link);
      recentHost.replaceChildren(empty);
    } else {
      const grid = document.createElement('div');
      grid.className = 'card-grid';
      grid.append(...recent.map((report) => reportCard(report, base)));
      recentHost.replaceChildren(grid);
    }
    const missing = reports.filter((report) => !hasCoordinates(report)).length;
    mapMissing.hidden = missing === 0;
    mapMissing.textContent = missing === 0
      ? ''
      : `${missing} signalement${missing > 1 ? 's' : ''} sans coordonnées ${missing > 1 ? 'restent' : 'reste'} dans la liste, pas sur cette carte.`;
    mountMap(mapHost, reports, { base, compact: true, notice: mapNotice });
  } catch {
    const retry = () => {
      location.assign(`${base}index.html`);
    };
    statsHost.replaceChildren(errorBox('Les indicateurs n’ont pas pu être calculés.', retry));
    breakdownHost.replaceChildren(errorBox('La répartition n’a pas pu être calculée.', retry));
    recentHost.replaceChildren(errorBox('Les signalements récents n’ont pas pu être affichés.', retry));
    mapHost.replaceChildren(errorBox('La carte n’a pas pu être préparée.', retry));
  }
}

showHome();
