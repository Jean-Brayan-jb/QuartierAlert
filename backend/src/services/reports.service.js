import { randomUUID } from 'node:crypto';
import { AppError } from '../utils/app-error.js';

export class ReportsService {
  constructor(repository) {
    this.repository = repository;
  }

  list(pagination) {
    return this.repository.list(pagination);
  }

  async findById(id) {
    const report = await this.repository.findById(id);
    if (!report) {
      throw new AppError(404, 'REPORT_NOT_FOUND', 'Ce signalement est introuvable.');
    }
    return report;
  }

  create(input) {
    const now = new Date().toISOString();
    return this.repository.create({
      id: randomUUID(),
      ...input,
      status: 'submitted',
      imagePath: null,
      createdAt: now,
      demo: false,
      local: false,
    });
  }
}
