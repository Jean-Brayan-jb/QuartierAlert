import { mountLayout } from './layout.js';
import { findReport, loadReports } from './reports.js';
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
    host.replaceChildren(renderDetail(report, document.body.dataset.base ?? ''));
  } catch {
    host.replaceChildren(
      errorBox('Le détail n’a pas pu être affiché.', () => {
        location.assign(id ? `signalement.html?id=${encodeURIComponent(id)}` : 'signalements.html');
      }),
    );
  }
}

showDetail();
