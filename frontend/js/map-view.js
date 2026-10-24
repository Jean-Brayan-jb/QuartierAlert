import { DEFAULT_CENTER, DEFAULT_ZOOM } from './constants.js';
import { hasCoordinates } from './reports.js';
import { categoryLabel, emptyState, statusLabel } from './ui.js';

const MARKER_HTML = {
  dechets: '<span class="marker marker-dechets"></span>',
  eau: '<span class="marker marker-eau"></span>',
  routes: '<span class="marker marker-routes"></span>',
  eclairage: '<span class="marker marker-eclairage"></span>',
  environnement: '<span class="marker marker-environnement"></span>',
  inondation: '<span class="marker marker-inondation"></span>',
  autre: '<span class="marker marker-autre"></span>',
};

function popupElement(report, base) {
  const wrap = document.createElement('div');
  wrap.className = 'popup';
  const title = document.createElement('strong');
  title.textContent = report.title;
  const meta = document.createElement('p');
  meta.textContent = `${categoryLabel(report.category)} · ${statusLabel(report.status)}`;
  const link = document.createElement('a');
  link.href = `${base}pages/signalement.html?id=${encodeURIComponent(report.id)}`;
  link.textContent = 'Voir le détail';
  wrap.append(title, meta, link);
  return wrap;
}

export function mountMap(container, reports, { base = '', compact = false, notice } = {}) {
  container.replaceChildren();
  container.classList.toggle('map-compact', compact);

  if (typeof globalThis.L === 'undefined') {
    container.append(
      emptyState(
        'Carte indisponible',
        'La bibliothèque de carte n’a pas été chargée. La liste des signalements reste utilisable.',
      ),
    );
    return null;
  }

  const located = reports.filter(hasCoordinates);
  const map = globalThis.L.map(container, {
    scrollWheelZoom: !compact,
  });
  const tiles = globalThis.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  tiles.addTo(map);

  let announced = false;
  tiles.on('tileerror', () => {
    if (announced || !notice) return;
    announced = true;
    notice.hidden = false;
    notice.textContent =
      'Les tuiles n’ont pas pu être chargées. Les marqueurs et la liste restent disponibles. Le serveur public OpenStreetMap n’est pas un service garanti.';
  });

  if (located.length === 0) {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    if (notice) {
      notice.hidden = false;
      notice.textContent =
        'Aucun signalement géolocalisé pour cet affichage. La carte est centrée sur une zone indicative de démonstration, pas sur un incident.';
    }
  } else {
    const bounds = [];
    for (const report of located) {
      const marker = globalThis.L.marker([report.latitude, report.longitude], {
        icon: globalThis.L.divIcon({
          className: 'marker-wrap',
          html: MARKER_HTML[report.category] ?? MARKER_HTML.autre,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        }),
        keyboard: true,
        title: report.title,
        alt: report.title,
      });
      marker.bindPopup(popupElement(report, base));
      marker.addTo(map);
      bounds.push([report.latitude, report.longitude]);
    }
    if (bounds.length === 1) map.setView(bounds[0], 14);
    else map.fitBounds(bounds, { padding: [28, 28] });
  }

  requestAnimationFrame(() => map.invalidateSize());
  return map;
}
