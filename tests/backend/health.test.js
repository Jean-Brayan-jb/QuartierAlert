const test = require('node:test');
const assert = require('node:assert');
const app = require('../../backend/src/app');

test('app existe et est un objet/fonction express', () => {
  assert.ok(app);
});
