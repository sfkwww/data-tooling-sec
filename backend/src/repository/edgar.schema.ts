import { z } from 'zod';

/**
 * EDGAR's `cik_str` is actually a number (320193). We expose it as `cik`, zero-padded to
 * 10 digits ("0000320193"), the format data.sec.gov expects. sec.gov archive URLs use the
 * unpadded form: `Number(cik)`.
 */
const tickerSchema = z
  .object({
    cik_str: z.int(),
    ticker: z.string(),
    title: z.string(),
  })
  .transform(({ cik_str, ticker, title }) => ({
    cik: String(cik_str).padStart(10, '0'),
    ticker,
    title,
  }));

export const companyTickersSchema = z.record(z.coerce.number().int(), tickerSchema);

export type CompanyTickers = z.infer<typeof companyTickersSchema>;

/**
 * The format on this data is in columns for some reason so each index i in every array means that it's filing i. Plan is to transform this into object format instead in a mapper after parsing.
 *
 * Missing strings are "" except for isXBRLNumeric which is null.
 **/
const recentFilingsSchema = z.object({
  accessionNumber: z.array(z.string()),
  filingDate: z.array(z.string()),
  reportDate: z.array(z.string()),
  acceptanceDateTime: z.array(z.string()),
  act: z.array(z.string()),
  form: z.array(z.string()),
  fileNumber: z.array(z.string()),
  filmNumber: z.array(z.string()),
  items: z.array(z.string()),
  core_type: z.array(z.string()),
  size: z.array(z.int()),
  isXBRL: z.array(z.int()),
  isInlineXBRL: z.array(z.int()),
  isXBRLNumeric: z.array(z.int().nullable()),
  primaryDocument: z.array(z.string()),
  primaryDocDescription: z.array(z.string()),
});

const ARCHIVES_BASE_URL = 'https://www.sec.gov/Archives/edgar/data';

/**
 * Link to a filing's primary document on sec.gov, e.g.
 * https://www.sec.gov/Archives/edgar/data/320193/000032019326000026/aapl-20260926.htm
 * Archive paths use the unpadded CIK and the accession number without dashes.
 */
const toDocumentUrl = (cik: string, accessionNumber: string, primaryDocument: string) =>
  `${ARCHIVES_BASE_URL}/${String(Number(cik))}/${accessionNumber.replaceAll('-', '')}/${primaryDocument}`;

// We only use recent filings for now
export const submissionsSchema = z
  .object({
    /** The company's own zero-padded CIK, e.g. "0000320193". */
    cik: z.string(),
    filings: z.object({
      recent: recentFilingsSchema,
    }),
  })
  // Adds a `url` column next to the other columns, so the mapper can treat it like any field.
  .transform(({ cik, filings: { recent } }) => ({
    cik,
    filings: {
      recent: {
        ...recent,
        url: recent.accessionNumber.map((accessionNumber, i) =>
          toDocumentUrl(cik, accessionNumber, recent.primaryDocument[i] ?? ''),
        ),
      },
    },
  }));

export type RecentFilings = z.infer<typeof recentFilingsSchema>;
export type Submissions = z.infer<typeof submissionsSchema>;
