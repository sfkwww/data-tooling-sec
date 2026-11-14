import { orderBy } from 'es-toolkit';
import { submissionsToRecentFilings } from './filings.mapper.js';
import type { FilingsRepository } from './repository/filings.repository.js';
import type { Filing, FilingsQuery } from './sec.schema.js';
import { notFound } from './utils/http-error.js';

export const createFilingsService = (repository: FilingsRepository) => ({
  getFilings: async (ticker: string, { form, sort }: FilingsQuery): Promise<Filing[]> => {
    const tickers = await repository.getCompanyTickers();
    const matchedCompany = Object.values(tickers).find(
      (company) => company.ticker === ticker.toUpperCase(),
    );
    if (!matchedCompany) throw notFound(`Unknown ticker: ${ticker}`);

    const submissions = await repository.getSubmissions(matchedCompany.cik);

    const filings = submissionsToRecentFilings(submissions);
    const filtered = form.length === 0 ? filings : filings.filter((f) => form.includes(f.form));
    return orderBy(filtered, ['filingDate'], [sort]);
  },
});

export type FilingsService = ReturnType<typeof createFilingsService>;
