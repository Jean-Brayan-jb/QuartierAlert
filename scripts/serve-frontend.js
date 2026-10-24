import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../frontend/', import.meta.url)));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

export function resolveFrontendFile(rootDir, urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (pathname.includes('\0')) return null;
  const stripped = pathname.replace(/^\/+/, '');
  const candidate = resolve(rootDir, stripped);
  const rootResolved = resolve(rootDir);
  if (candidate !== rootResolved && !candidate.startsWith(`${rootResolved}${sep}`)) return null;
  return candidate;
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy':
      "default-src 'self'; img-src 'self' data: blob: https://tile.openstreetmap.org; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    'Cache-Control': 'no-cache',
  };
}

export function createFrontendServer() {
  return createServer(async (request, response) => {
    const headers = securityHeaders();
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { ...headers, Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Cette interface de démonstration n’accepte pas cette méthode.');
      return;
    }

    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const resolved = resolveFrontendFile(root, url.pathname);
    if (!resolved) {
      response.writeHead(400, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Chemin refusé.');
      return;
    }

    let filePath = resolved;
    try {
      const info = await stat(filePath);
      if (info.isDirectory()) filePath = resolve(filePath, 'index.html');
      const fileInfo = await stat(filePath);
      if (!fileInfo.isFile()) throw new Error('not a file');
    } catch {
      response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Page introuvable.');
      return;
    }

    const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
    response.writeHead(200, { ...headers, 'Content-Type': type });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  });
}

const launchedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (launchedDirectly) {
  const port = Number(process.env.FRONTEND_PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('FRONTEND_PORT doit être un port entier.');
    process.exit(1);
  }
  createFrontendServer().listen(port, '127.0.0.1', () => {
    console.log(`Interface QuartierAlert : http://127.0.0.1:${port}`);
  });
}
