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

  // TODO: Cache the ticker file in memory
  function getCompanyTickers(): Promise<CompanyTickers> {
    return fetchJson(TICKERS_URL).then(companyTickersSchema.parse);
  }

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
