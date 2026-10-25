import assert from 'node:assert/strict';
import test from 'node:test';
import { DEMO_REPORTS } from '../frontend/js/demo-data.js';
import { computeStats, countsByDay } from '../frontend/js/stats.js';

test('calcule des zéros quand la liste est vide', () => {
  const stats = computeStats([]);
  assert.deepEqual(stats, {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    submitted: 0,
    underReview: 0,
    rejected: 0,
    byCategory: {
      dechets: 0,
      eau: 0,
      routes: 0,
      eclairage: 0,
      environnement: 0,
      inondation: 0,
      autre: 0,
    },
  });
});

test('calcule les indicateurs de démonstration sans nombre figé dans la fonction', () => {
  const stats = computeStats(DEMO_REPORTS);
  assert.equal(stats.total, DEMO_REPORTS.length);
  assert.equal(stats.submitted, 2);
  assert.equal(stats.underReview, 1);
  assert.equal(stats.open, 3);
  assert.equal(stats.inProgress, 2);
  assert.equal(stats.resolved, 1);
  assert.equal(stats.rejected, 1);
  assert.equal(stats.byCategory.eau, 2);
  assert.equal(stats.byCategory.autre, 0);
});

test('regroupe les fiches fictives par jour, du plus ancien au plus récent', () => {
  const days = countsByDay(DEMO_REPORTS);
  assert.equal(days.length, DEMO_REPORTS.length);
  assert.deepEqual(days[0], { day: '2026-10-15', count: 1 });
  assert.deepEqual(days.at(-1), { day: '2026-10-24', count: 1 });
  assert.deepEqual(countsByDay([{ createdAt: 'pas une date' }]), []);
});
test('ne range pas un statut ou une catégorie inconnus dans les indicateurs nommés', () => {
  const stats = computeStats([{ status: 'urgent', category: 'securite' }]);
  assert.equal(stats.total, 1);
  assert.equal(stats.open, 0);
  assert.equal(stats.resolved, 0);
  assert.equal(stats.byCategory.dechets, 0);
});
