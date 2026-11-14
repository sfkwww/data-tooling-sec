import { countBy, orderBy } from 'es-toolkit';
import { submissionsToRecentFilings } from './filings.mapper.js';
import type { FilingsRepository } from './repository/filings.repository.js';
import {
  type AnnualReport,
  type CompanySummary,
  type Filing,
  type FilingsPage,
  type FilingsQuery,
  FormType,
  type Summary,
  type SummaryQuery,
} from './sec.schema.js';
import { notFound } from './utils/http-error.js';

/** Same day one year ago, as YYYY-MM-DD (comparable with `filingDate` as a string). */
const oneYearAgo = (): string => {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() - 1);
  return date.toISOString().slice(0, 10);
};

/** `filing.form` is a plain string, so compare as strings rather than against the enum. */
const isForm = (filing: Filing, form: string): boolean => filing.form === form;

/** Latest 10-K, else latest 20-F/40-F (foreign companies). Expects filings newest first. */
const findLatestAnnualReport = (filings: Filing[]): AnnualReport | null => {
  const tenK = filings.find((f) => isForm(f, FormType.K10));
  if (tenK) return { form: FormType.K10, filingDate: tenK.filingDate };

  const foreign = filings.find((f) => isForm(f, FormType.F20) || isForm(f, FormType.F40));
  if (!foreign) return null;
  return {
    form: isForm(foreign, FormType.F20) ? FormType.F20 : FormType.F40,
    filingDate: foreign.filingDate,
  };
};

export const createFilingsService = (repository: FilingsRepository) => {
  const getCompanyFilings = async (ticker: string): Promise<Filing[]> => {
    const tickers = await repository.getCompanyTickers();
    const matchedCompany = Object.values(tickers).find(
      (company) => company.ticker === ticker.toUpperCase(),
    );
    if (!matchedCompany) throw notFound(`Unknown ticker: ${ticker}`);

    const submissions = await repository.getSubmissions(matchedCompany.cik);
    return submissionsToRecentFilings(submissions);
  };

  const getFilings = async (
    ticker: string,
    { form, sort, page, pageSize }: FilingsQuery,
  ): Promise<FilingsPage> => {
    const filings = await getCompanyFilings(ticker);
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
  };

  const getSummary = async ({ tickers }: SummaryQuery): Promise<Summary> => {
    const since = oneYearAgo();

    // EDGAR's `filings.recent` always covers at least the last year, so no extra requests.
    const data = await Promise.all(
      tickers.map(async (ticker): Promise<CompanySummary> => {
        const filings = orderBy(await getCompanyFilings(ticker), ['filingDate'], ['desc']);
        const lastYear = filings.filter((f) => f.filingDate >= since);
        return {
          ticker,
          formCounts: countBy(lastYear, (f) => f.form),
          latestAnnualReport: findLatestAnnualReport(filings),
        };
      }),
    );

    return { data };
  };

  return { getFilings, getSummary };
};

export type FilingsService = ReturnType<typeof createFilingsService>;
