import { AppError } from '../utils/app-error.js';

export function notFoundHandler(request, response, next) {
  next(new AppError(404, 'NOT_FOUND', 'La ressource demandée est introuvable.'));
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error?.type === 'entity.parse.failed') {
    response.status(400).json({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Le corps de la requête contient un JSON invalide.' },
    });
    return;
  }
  if (error?.type === 'entity.too.large') {
    response.status(413).json({
      success: false,
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Le corps de la requête dépasse la taille autorisée.' },
    });
    return;
  }
  if (error?.type === 'encoding.unsupported' || error?.type === 'charset.unsupported') {
    response.status(415).json({
      success: false,
      error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Le format du corps de la requête n’est pas pris en charge.' },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.status).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details.length > 0 ? { details: error.details } : {}),
      },
    });
    return;
  }

  console.error('Erreur interne de l’API QuartierAlert:', error);
  response.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Une erreur interne est survenue.' },
  });
}
