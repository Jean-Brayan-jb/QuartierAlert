import { Router } from 'express';
import { createReportsController } from '../controllers/reports.controller.js';
import { AppError } from '../utils/app-error.js';

export function createReportsRouter(service) {
  const router = Router();
  const controller = createReportsController(service);

  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', (request, response, next) => {
    if (!request.is('application/json')) {
      next(new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Utilisez le type de contenu application/json.'));
      return;
    }
    next();
  }, controller.create);

  return router;
}
