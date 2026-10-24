import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import { resolveFrontendFile } from '../scripts/serve-frontend.js';

const root = resolve('frontend');

test('sert un fichier de l’interface et refuse une sortie du dossier', () => {
  assert.equal(resolveFrontendFile(root, '/css/styles.css'), resolve(root, 'css/styles.css'));
  assert.equal(resolveFrontendFile(root, '/'), root);
  assert.equal(resolveFrontendFile(root, '/../package.json'), null);
  assert.equal(resolveFrontendFile(root, '/%2e%2e/%2e%2e/package.json'), null);
  assert.equal(resolveFrontendFile(root, '/%00index.html'), null);
});
