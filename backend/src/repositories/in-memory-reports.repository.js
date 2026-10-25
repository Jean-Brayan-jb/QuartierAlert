export class InMemoryReportsRepository {
  #reports = new Map();

  constructor(initialReports = []) {
    for (const report of initialReports) {
      this.#reports.set(report.id, { ...report });
    }
  }

  async list({ limit, offset }) {
    const reports = [...this.#reports.values()]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(offset, offset + limit)
      .map((report) => ({ ...report }));
    return { reports, total: this.#reports.size };
  }

  async findById(id) {
    const report = this.#reports.get(id);
    return report ? { ...report } : null;
  }

  async create(report) {
    const created = { ...report };
    this.#reports.set(created.id, created);
    return { ...created };
  }
}
