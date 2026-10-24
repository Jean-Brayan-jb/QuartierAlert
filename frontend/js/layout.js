const LINKS = [
  { id: 'accueil', file: 'index.html', label: 'Accueil' },
  { id: 'signalements', file: 'pages/signalements.html', label: 'Signalements' },
  { id: 'carte', file: 'pages/carte.html', label: 'Carte' },
  { id: 'nouveau', file: 'pages/nouveau.html', label: 'Nouveau signalement' },
  { id: 'a-propos', file: 'pages/a-propos.html', label: 'À propos' },
  { id: 'connexion', file: 'pages/connexion.html', label: 'Connexion' },
];

function hrefFor(base, file) {
  return `${base}${file}`;
}

export function mountLayout({ active }) {
  const base = document.body.dataset.base ?? '';
  const headerHost = document.getElementById('app-header');
  const footerHost = document.getElementById('app-footer');
  if (!headerHost || !footerHost) return;

  const header = document.createElement('header');
  header.className = 'site-header';

  const bar = document.createElement('div');
  bar.className = 'header-bar wrap';

  const brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = hrefFor(base, 'index.html');
  const mark = document.createElement('span');
  mark.className = 'brand-mark';
  mark.setAttribute('aria-hidden', 'true');
  brand.append(mark, document.createTextNode('QuartierAlert'));

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'navigation');
  toggle.textContent = 'Menu';

  const reportLink = document.createElement('a');
  reportLink.className = 'button button-light';
  reportLink.href = hrefFor(base, 'pages/nouveau.html');
  reportLink.textContent = 'Signaler un problème';

  const nav = document.createElement('nav');
  nav.id = 'navigation';
  nav.className = 'nav-links';
  nav.setAttribute('aria-label', 'Navigation principale');

  for (const link of LINKS) {
    const anchor = document.createElement('a');
    anchor.href = hrefFor(base, link.file);
    anchor.textContent = link.label;
    if (link.id === active) anchor.setAttribute('aria-current', 'page');
    nav.append(anchor);
  }

  bar.append(brand, toggle, reportLink);
  header.append(bar, nav);
  headerHost.replaceChildren(header);

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  const inner = document.createElement('div');
  inner.className = 'wrap';
  const slogan = document.createElement('p');
  slogan.textContent = 'Un problème signalé, une communauté mobilisée.';
  const limit = document.createElement('p');
  limit.textContent =
    'Démonstration. Un signalement n’est pas transmis automatiquement à une autorité. Aucun partenaire institutionnel n’est déclaré.';
  inner.append(slogan, limit);
  footer.append(inner);
  footerHost.replaceChildren(footer);
}
