import { CATEGORIES } from './constants.js';

export function computeStats(reports) {
  const list = Array.isArray(reports) ? reports : [];
  const count = (status) => list.filter((report) => report.status === status).length;
  const submitted = count('submitted');
  const underReview = count('under_review');
  const inProgress = count('in_progress');
  const resolved = count('resolved');
  const rejected = count('rejected');
  const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category.id, 0]));

  for (const report of list) {
    if (Object.prototype.hasOwnProperty.call(byCategory, report.category)) {
      byCategory[report.category] += 1;
    }
  }

  return {
    total: list.length,
    open: submitted + underReview,
    inProgress,
    resolved,
    submitted,
    underReview,
    rejected,
    byCategory,
  };
}

export function countsByDay(reports) {
  const counts = new Map();
  for (const report of Array.isArray(reports) ? reports : []) {
    const day = String(report?.createdAt || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    counts.set(day, (counts.get(day) || 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([day, count]) => ({ day, count }));
}
