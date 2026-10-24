import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CATEGORIES } from '../frontend/js/constants.js';

const pages = [
  'frontend/index.html',
  'frontend/pages/signalements.html',
  'frontend/pages/signalement.html',
  'frontend/pages/nouveau.html',
  'frontend/pages/carte.html',
  'frontend/pages/a-propos.html',
  'frontend/pages/connexion.html',
];

test('chaque page a une langue, un en-tête et un lien d’évitement', () => {
  for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    assert.match(html, /lang="fr"/);
    assert.match(html, /id="app-header"/);
    assert.match(html, /id="contenu"/);
    assert.match(html, /Aller au contenu/);
    assert.doesNotMatch(html, /GEMINI_API_KEY|service_role_key|AIza/);
    assert.doesNotMatch(html, /type="password"/);
  }
});

test('l’accueil contient le texte prévu et des liens réels', () => {
  const html = readFileSync('frontend/index.html', 'utf8');
  assert.match(html, /Ensemble, améliorons notre quartier\./);
  assert.match(html, /Signalez les problèmes de votre environnement, suivez leur évolution et contribuez à une communauté mieux informée\./);
  assert.match(html, /href="pages\/nouveau\.html"/);
  assert.match(html, /href="pages\/signalements\.html"/);
  assert.match(html, /href="pages\/carte\.html"/);
});

test('le formulaire déclare les champs et les catégories autorisées', () => {
  const html = readFileSync('frontend/pages/nouveau.html', 'utf8');
  for (const name of ['title', 'description', 'category', 'photo', 'locationText', 'latitude', 'longitude', 'accuracy']) {
    assert.match(html, new RegExp(`name="${name}"`));
  }
  for (const category of CATEGORIES) {
    assert.match(html, new RegExp(`value="${category.id}"`));
  }
  assert.match(html, /Coordonnées \(facultatif\)/);
});

test('la connexion ne simule pas une session', () => {
  const html = readFileSync('frontend/pages/connexion.html', 'utf8');
  assert.match(html, /n’est pas disponible/);
  assert.match(html, /Aucun mot de passe/);
});

test('les scripts visibles n’injectent pas de HTML brut', () => {
  for (const file of ['frontend/js/ui.js', 'frontend/js/layout.js', 'frontend/js/form.js', 'frontend/js/home.js']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /innerHTML/);
  }
  assert.doesNotMatch(readFileSync('frontend/js/map-view.js', 'utf8'), /\$\{report/);
});
