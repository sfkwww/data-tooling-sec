import { orderBy } from 'es-toolkit';
import { submissionsToRecentFilings } from './filings.mapper.js';
import type { FilingsRepository } from './repository/filings.repository.js';
import type { FilingsPage, FilingsQuery } from './sec.schema.js';
import { notFound } from './utils/http-error.js';

export const createFilingsService = (repository: FilingsRepository) => ({
  getFilings: async (
    ticker: string,
    { form, sort, page, pageSize }: FilingsQuery,
  ): Promise<FilingsPage> => {
    const tickers = await repository.getCompanyTickers();
    const matchedCompany = Object.values(tickers).find(
      (company) => company.ticker === ticker.toUpperCase(),
    );
    if (!matchedCompany) throw notFound(`Unknown ticker: ${ticker}`);

    const submissions = await repository.getSubmissions(matchedCompany.cik);

    const filings = submissionsToRecentFilings(submissions);
    const filtered = form.length === 0 ? filings : filings.filter((f) => form.includes(f.form));
    const sorted = orderBy(filtered, ['filingDate'], [sort]);

    // Paginate last, so totals reflect the active filter. A page past the end is just empty.
    const start = (page - 1) * pageSize;
    return {
      data: sorted.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        totalItems: sorted.length,
        totalPages: Math.ceil(sorted.length / pageSize),
      },
    };
  },
});

export type FilingsService = ReturnType<typeof createFilingsService>;
