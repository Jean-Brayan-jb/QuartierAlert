import { CATEGORY_IDS, LOCAL_STORAGE_KEY } from './constants.js';
import { DEMO_REPORTS } from './demo-data.js';

const DEMO_IMAGE = /^assets\/demo\/[a-z0-9-]+\.svg$/;

export function safeImagePath(path) {
  return typeof path === 'string' && DEMO_IMAGE.test(path) ? path : null;
}

export function hasCoordinates(report) {
  return Number.isFinite(report?.latitude) && Number.isFinite(report?.longitude);
}

export function isSafeLocalReport(value) {
  if (!value || typeof value !== 'object') return false;
  if (value.local !== true || value.demo !== true) return false;
  if (typeof value.id !== 'string' || !/^local-[0-9a-f-]{36}$/.test(value.id)) return false;
  if (typeof value.title !== 'string' || typeof value.description !== 'string') return false;
  if (typeof value.locationText !== 'string' || typeof value.createdAt !== 'string') return false;
  if (!CATEGORY_IDS.has(value.category) || value.status !== 'submitted') return false;
  if (value.imagePath != null) return false;
  const latNull = value.latitude === null;
  const lngNull = value.longitude === null;
  if (latNull !== lngNull) return false;
  if (!latNull && !hasCoordinates(value)) return false;
  if (!latNull && (value.latitude < -90 || value.latitude > 90 || value.longitude < -180 || value.longitude > 180)) {
    return false;
  }
  return true;
}

export function readLocalReports(storage) {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSafeLocalReport);
  } catch {
    return [];
  }
}

export function saveLocalReport(storage, report) {
  if (!storage || !isSafeLocalReport(report)) {
    throw new Error('Signalement local refusé.');
  }
  const current = readLocalReports(storage);
  current.push(report);
  storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
  return report;
}

export function mergeReports(demoReports, localReports) {
  const byId = new Map();
  for (const report of demoReports) byId.set(report.id, report);
  for (const report of localReports) byId.set(report.id, report);
  return [...byId.values()].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function filterReports(reports, { category = '', status = '', located = '' } = {}) {
  return reports.filter((report) => {
    if (category && report.category !== category) return false;
    if (status && report.status !== status) return false;
    const withCoordinates = hasCoordinates(report);
    if (located === 'with' && !withCoordinates) return false;
    if (located === 'without' && withCoordinates) return false;
    return true;
  });
}

export function loadReports({ storage, forceError = false } = {}) {
  if (forceError) {
    return Promise.reject(new Error('Les signalements de démonstration n’ont pas pu être chargés.'));
  }
  return Promise.resolve(mergeReports(DEMO_REPORTS, readLocalReports(storage)));
}

export function findReport(reports, id) {
  return reports.find((report) => report.id === id) ?? null;
}
