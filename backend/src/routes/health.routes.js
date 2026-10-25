import { Router } from 'express';

const router = Router();

router.get('/health', (request, response) => {
  response.json({
    success: true,
    message: 'QuartierAlert API is running',
    data: { status: 'ok' },
  });
});

export default router;
