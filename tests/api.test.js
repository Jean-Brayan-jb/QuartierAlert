import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { createApp } from '../backend/src/app.js';
import { InMemoryReportsRepository } from '../backend/src/repositories/in-memory-reports.repository.js';
import { CATEGORIES } from '../frontend/js/constants.js';

const existingReport = {
  id: 'report-1',
  title: 'Fuite près du marché',
  description: 'De l’eau coule au bord de la chaussée depuis ce matin et gêne le passage.',
  category: 'eau',
  status: 'submitted',
  locationText: 'Rue fictive des Palmiers',
  latitude: 6.1,
  longitude: 1.2,
  imagePath: null,
  createdAt: '2026-10-24T08:30:00.000Z',
  demo: false,
  local: false,
};

function validReport(overrides = {}) {
  return {
    title: 'Fuite près du marché',
    description: 'De l’eau coule au bord de la chaussée depuis ce matin et gêne le passage.',
    category: 'eau',
    locationText: 'Rue fictive des Palmiers',
    ...overrides,
  };
}

async function withApi(callback, { reports = [], repository } = {}) {
  const app = createApp({
    reportsRepository: repository ?? new InMemoryReportsRepository(reports),
  });
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    await callback(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function postReport(baseUrl, body, headers = {}) {
  return fetch(`${baseUrl}/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

test('GET /api/health répond sans divulguer la configuration', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      success: true,
      message: 'QuartierAlert API is running',
      data: { status: 'ok' },
    });
    assert.doesNotMatch(JSON.stringify(body), /SUPABASE|GEMINI|KEY|PASSWORD|stack/i);
  });
});

test('GET /api/reports prend en charge une liste vide', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data.reports, []);
    assert.deepEqual(body.data.pagination, { limit: 20, offset: 0, total: 0, hasMore: false });
  });
});

test('GET /api/reports retourne les fiches du dépôt', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data.reports, [existingReport]);
    assert.deepEqual(body.data.pagination, { limit: 20, offset: 0, total: 1, hasMore: false });
  }, { reports: [existingReport] });
});

test('GET /api/reports expose les enregistrements du dépôt et respecte la pagination', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports?limit=1&offset=1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.data.reports.length, 1);
    assert.equal(body.data.pagination.total, 2);
    assert.equal(body.data.pagination.hasMore, false);
  }, {
    reports: [
      existingReport,
      { ...existingReport, id: 'report-2', createdAt: '2026-10-25T08:30:00.000Z' },
    ],
  });
});

test('GET /api/reports refuse une pagination invalide', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports?limit=101`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, 'INVALID_QUERY');
  });
});

test('GET /api/reports/:id retourne un signalement existant', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports/report-1`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, existingReport);
  }, { reports: [existingReport] });
});

test('GET /api/reports/:id retourne 404 pour un identifiant inconnu', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports/unknown`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.code, 'REPORT_NOT_FOUND');
  });
});

test('GET /api/reports/:id valide le format de l’identifiant', async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports/%3Cbad%3E`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, 'INVALID_REPORT_ID');
  });
});

test('POST /api/reports crée un signalement avec un statut sûr', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, validReport({
      title: '  Fuite près du marché  ',
      locationText: '  Rue fictive des Palmiers  ',
      latitude: 6.1,
      longitude: 1.2,
    }));
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Fuite près du marché');
    assert.equal(body.data.locationText, 'Rue fictive des Palmiers');
    assert.equal(body.data.status, 'submitted');
    assert.equal(body.data.latitude, 6.1);
    assert.equal(body.data.longitude, 1.2);
    assert.match(body.data.id, /^[0-9a-f-]{36}$/);
    assert.ok(Number.isFinite(Date.parse(body.data.createdAt)));
    assert.equal(body.data.imagePath, null);
    assert.equal(body.data.demo, false);

    const readResponse = await fetch(`${baseUrl}/api/reports/${body.data.id}`);
    const readBody = await readResponse.json();
    assert.equal(readResponse.status, 200);
    assert.deepEqual(readBody.data, body.data);
  });
});

test('POST /api/reports accepte les coordonnées absentes', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, validReport());
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.data.latitude, null);
    assert.equal(body.data.longitude, null);
  });
});

test('POST /api/reports rejette les champs obligatoires absents', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, { category: 'eau', locationText: 'Quartier fictif' });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, 'VALIDATION_ERROR');
    assert.ok(body.error.details.some((detail) => detail.field === 'title'));
    assert.ok(body.error.details.some((detail) => detail.field === 'description'));
  });
});

test('POST /api/reports respecte les longueurs maximales', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, validReport({
      title: `${'t'.repeat(121)}`,
      description: 'd'.repeat(2001),
      locationText: 'l'.repeat(181),
    }));
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.details.filter((detail) => detail.message.includes('caractères')).length, 3);
  });
});

test('POST /api/reports rejette une catégorie inconnue', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, validReport({ category: 'incendie' }));
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.error.details.some((detail) => detail.field === 'category'));
  });
});

test('POST /api/reports accepte les catégories exposées par le frontend', async () => {
  await withApi(async (baseUrl) => {
    for (const { id } of CATEGORIES) {
      const response = await postReport(baseUrl, validReport({ category: id }));
      assert.equal(response.status, 201, `La catégorie ${id} doit être acceptée.`);
    }
  });
});

test('POST /api/reports rejette les coordonnées hors limites ou non numériques', async () => {
  await withApi(async (baseUrl) => {
    const outOfRange = await postReport(baseUrl, validReport({ latitude: 91, longitude: 181 }));
    const outOfRangeBody = await outOfRange.json();
    assert.equal(outOfRange.status, 400);
    assert.ok(outOfRangeBody.error.details.some((detail) => detail.field === 'latitude'));
    assert.ok(outOfRangeBody.error.details.some((detail) => detail.field === 'longitude'));

    const nonNumeric = await postReport(baseUrl, validReport({ latitude: '6.1', longitude: '1.2' }));
    const nonNumericBody = await nonNumeric.json();
    assert.equal(nonNumeric.status, 400);
    assert.ok(nonNumericBody.error.details.some((detail) => detail.field === 'latitude'));
  });
});

test('POST /api/reports rejette les champs de statut, rôle et auteur fournis par le client', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, {
      ...validReport(),
      status: 'resolved',
      role: 'admin',
      authorId: 'another-user',
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.error.details.some((detail) => detail.field === 'status'));
    assert.ok(body.error.details.some((detail) => detail.field === 'role'));
    assert.ok(body.error.details.some((detail) => detail.field === 'authorId'));
  });
});

test('POST /api/reports retourne 400 pour un JSON invalide', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, '{"title":', {});
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.code, 'INVALID_JSON');
  });
});

test('POST /api/reports exige application/json', async () => {
  await withApi(async (baseUrl) => {
    const response = await postReport(baseUrl, 'title=test', { 'Content-Type': 'text/plain' });
    const body = await response.json();

    assert.equal(response.status, 415);
    assert.equal(body.error.code, 'UNSUPPORTED_MEDIA_TYPE');
  });
});

test('une erreur du dépôt retourne une erreur 500 sans détails internes', async () => {
  const repository = {
    list: async () => {
      throw new Error('internal storage exception');
    },
    findById: async () => null,
    create: async (report) => report,
  };

  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/reports`);
    const body = await response.json();
    const serialized = JSON.stringify(body);

    assert.equal(response.status, 500);
    assert.equal(body.error.code, 'INTERNAL_ERROR');
    assert.doesNotMatch(serialized, /password|database|stack/i);
  }, { repository });
});
