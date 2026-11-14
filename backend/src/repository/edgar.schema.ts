import { z } from 'zod';

const tickerSchema = z.object({
  cik_str: z.int(),
  ticker: z.string(),
  title: z.string(),
});

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


// We only use recent filings for now
export const submissionsSchema = z.object({
  filings: z.object({
    recent: recentFilingsSchema,
  }),
});

export type RecentFilings = z.infer<typeof recentFilingsSchema>;
export type Submissions = z.infer<typeof submissionsSchema>;
