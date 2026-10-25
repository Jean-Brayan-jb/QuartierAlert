import { mountLayout } from './layout.js';
import { findReport, hasCoordinates, loadReports } from './reports.js';
import { mountMap } from './map-view.js';
import { emptyState, errorBox, nextPaint, renderDetail } from './ui.js';

mountLayout({ active: 'signalements' });

const host = document.querySelector('#detail');

async function showDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  try {
    await nextPaint();
    if (params.get('erreur') === '1') {
      throw new Error('erreur demandée');
    }
    const reports = await loadReports({ storage: sessionStorage });
    const report = findReport(reports, id);
    if (!report) {
      host.replaceChildren(
        emptyState(
          'Signalement introuvable',
          'Cet identifiant ne correspond à aucune fiche de démonstration dans cet onglet.',
        ),
      );
      return;
    }
    const article = renderDetail(report, document.body.dataset.base ?? '');
    if (hasCoordinates(report)) {
      const heading = document.createElement('h2');
      heading.textContent = 'Sur la carte';
      const map = document.createElement('div');
      map.className = 'map map-compact';
      map.setAttribute('role', 'region');
      map.setAttribute('aria-label', 'Position approximative de ce signalement fictif');
      const notice = document.createElement('p');
      notice.className = 'hint';
      notice.hidden = true;
      article.append(heading, map, notice);
      host.replaceChildren(article);
      mountMap(map, [report], {
        base: document.body.dataset.base ?? '',
        compact: true,
        notice,
      });
    } else {
      const note = document.createElement('p');
      note.className = 'hint';
      note.textContent = 'Ce signalement n’a pas de coordonnées. Le lieu textuel reste consultable, et il n’apparaît pas sur la carte.';
      article.append(note);
      host.replaceChildren(article);
    }
  } catch {
    host.replaceChildren(
      errorBox('Le détail n’a pas pu être affiché.', () => {
        location.assign(id ? `signalement.html?id=${encodeURIComponent(id)}` : 'signalements.html');
      }),
    );
  }
}

showDetail();
