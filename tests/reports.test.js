import assert from 'node:assert/strict';
import test from 'node:test';
import { CATEGORY_IDS, STATUS_IDS } from '../frontend/js/constants.js';
import { DEMO_REPORTS } from '../frontend/js/demo-data.js';
import {
  filterReports,
  isSafeLocalReport,
  loadReports,
  mergeReports,
  readLocalReports,
  safeImagePath,
  saveLocalReport,
} from '../frontend/js/reports.js';

test('les fiches de démonstration sont fictives, uniques et cohérentes', () => {
  const ids = new Set(DEMO_REPORTS.map((report) => report.id));
  assert.equal(ids.size, DEMO_REPORTS.length);
  assert.ok(DEMO_REPORTS.some((report) => report.latitude === null));
  for (const report of DEMO_REPORTS) {
    assert.equal(report.demo, true);
    assert.equal(report.local, false);
    assert.match(report.locationText, /ficti/i);
    assert.ok(report.description.length >= 30);
    assert.ok(CATEGORY_IDS.has(report.category));
    assert.ok(STATUS_IDS.has(report.status));
    assert.equal(safeImagePath(report.imagePath), report.imagePath);
  }
});

test('refuse une image qui n’est pas une illustration locale', () => {
  assert.equal(safeImagePath('assets/demo/eau.svg'), 'assets/demo/eau.svg');
  assert.equal(safeImagePath('https://example.test/photo.jpg'), null);
  assert.equal(safeImagePath('assets/demo/../secret.svg'), null);
});

test('ignore un stockage illisible et un brouillon qui changerait le statut', () => {
  assert.deepEqual(readLocalReports(null), []);
  assert.deepEqual(readLocalReports({ getItem() { return '{'; } }), []);
  assert.deepEqual(readLocalReports({ getItem() { throw new Error('bloqué'); } }), []);

  const storage = memoryStorage();
  storage.setItem('quartieralert.localReports.v1', JSON.stringify([
    localReport({ status: 'resolved' }),
    localReport({ id: 'local-00000000-0000-4000-8000-000000000001' }),
  ]));
  const kept = readLocalReports(storage);
  assert.equal(kept.length, 1);
  assert.equal(kept[0].status, 'submitted');
});

test('enregistre un brouillon puis le place avant les fiches plus anciennes', () => {
  const storage = memoryStorage();
  const report = localReport({ createdAt: '2026-10-24T18:00:00.000Z' });
  saveLocalReport(storage, report);
  assert.throws(() => saveLocalReport(storage, { ...report, status: 'resolved' }));
  const merged = mergeReports(DEMO_REPORTS, readLocalReports(storage));
  assert.equal(merged[0].id, report.id);
});

test('filtre par catégorie, statut et présence de coordonnées', () => {
  const eau = filterReports(DEMO_REPORTS, { category: 'eau' });
  assert.ok(eau.every((report) => report.category === 'eau'));
  const without = filterReports(DEMO_REPORTS, { located: 'without' });
  assert.equal(without.length, 1);
  assert.equal(without[0].id, 'demo-assainissement');
  const openEau = filterReports(DEMO_REPORTS, { category: 'eau', status: 'submitted' });
  assert.deepEqual(openEau.map((report) => report.id), ['demo-assainissement']);
});

test('signale une erreur de chargement sans inventer de fiches', async () => {
  await assert.rejects(() => loadReports({ forceError: true }), /démonstration/);
  const reports = await loadReports({ storage: memoryStorage() });
  assert.equal(reports.length, DEMO_REPORTS.length);
});

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  };
}

function localReport(overrides = {}) {
  return {
    id: 'local-11111111-1111-4111-8111-111111111111',
    title: 'Brouillon fictif de test',
    description: 'Description locale assez longue pour un brouillon de démonstration.',
    category: 'autre',
    status: 'submitted',
    locationText: 'Lieu fictif',
    latitude: null,
    longitude: null,
    imagePath: null,
    createdAt: '2026-10-24T12:00:00.000Z',
    demo: true,
    local: true,
    ...overrides,
  };
}

test('le contrôleur de brouillon reconnaît une fiche locale valide', () => {
  assert.equal(isSafeLocalReport(localReport()), true);
  assert.equal(isSafeLocalReport(localReport({ imagePath: 'https://example.test/a.png' })), false);
});
