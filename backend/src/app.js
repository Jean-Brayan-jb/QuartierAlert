const express = require('express');

const app = express();

app.use(express.json());

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'QuartierAlert API', version: '0.1.0' });
});

module.exports = app;
