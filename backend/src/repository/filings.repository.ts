import { memoize } from 'es-toolkit';
import {
  type CompanyTickers,
  companyTickersSchema,
  type Submissions,
  submissionsSchema,
} from './edgar.schema.js';

const TICKERS_URL = 'https://www.sec.gov/files/company_tickers.json';
const SUBMISSIONS_BASE_URL = 'https://data.sec.gov/submissions';

export const createFilingsRepository = (userAgent: string) => {
  const fetchJson = async (url: string): Promise<unknown> => {
    const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
    if (!res.ok) throw new Error(`EDGAR responded ${res.status} for ${url}`);
    return res.json();
  };

  // Fetched once per server start; the promise is cached, so concurrent calls share one request.
  // TODO: Expire daily and don't cache a failed fetch. This is used for now for simplicity
  const getCompanyTickers = memoize((): Promise<CompanyTickers> =>
    fetchJson(TICKERS_URL).then((data) => companyTickersSchema.parse(data)),
  );

  /** `cik` must be zero-padded to 10 digits. */
  function getSubmissions(cik: string): Promise<Submissions> {
    return fetchJson(`${SUBMISSIONS_BASE_URL}/CIK${cik}.json`).then(submissionsSchema.parse);
  }

  return {
    getCompanyTickers,
    getSubmissions,
  };
};

export type FilingsRepository = ReturnType<typeof createFilingsRepository>;
