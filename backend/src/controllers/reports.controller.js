import { parsePagination, validateReportId, validateReportInput } from '../validators/report.validator.js';
import { asyncHandler } from '../middleware/async-handler.js';

export function createReportsController(service) {
  return {
    list: asyncHandler(async (request, response) => {
      const pagination = parsePagination(request.query);
      const result = await service.list(pagination);
      response.json({
        success: true,
        data: {
          reports: result.reports,
          pagination: {
            ...pagination,
            total: result.total,
            hasMore: pagination.offset + result.reports.length < result.total,
          },
        },
      });
    }),

    get: asyncHandler(async (request, response) => {
      const id = validateReportId(request.params.id);
      const report = await service.findById(id);
      response.json({ success: true, data: report });
    }),

    create: asyncHandler(async (request, response) => {
      const reportInput = validateReportInput(request.body);
      const report = await service.create(reportInput);
      response.status(201).json({
        success: true,
        message: 'Signalement créé en mémoire. Il ne sera pas conservé après le redémarrage du serveur.',
        data: report,
      });
    }),
  };
}
