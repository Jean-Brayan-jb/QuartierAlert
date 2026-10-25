import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT doit être un entier compris entre 1 et 65535.');
  process.exitCode = 1;
} else {
  const server = createApp().listen(port, '127.0.0.1', () => {
    console.log(`API QuartierAlert : http://127.0.0.1:${port}/api/health`);
  });
  server.on('error', (error) => {
    console.error('Impossible de démarrer l’API QuartierAlert:', error.message);
    process.exitCode = 1;
  });
}
