import express from 'express';
import healthRoutes from './routes/health.routes.js';
import { createReportsRouter } from './routes/reports.routes.js';
import { InMemoryReportsRepository } from './repositories/in-memory-reports.repository.js';
import { ReportsService } from './services/reports.service.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

export function createApp({ reportsRepository = new InMemoryReportsRepository() } = {}) {
  const app = express();
  const reportsService = new ReportsService(reportsRepository);

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb', strict: true }));
  app.use('/api', healthRoutes);
  app.use('/api/reports', createReportsRouter(reportsService));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
