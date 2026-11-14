import { z } from 'zod';

/**
 * Note: the majority of FormType is AI generated, but from what I can tell it seems correct.
 *
 * Form types that can be filtered on. EDGAR has hundreds; this is the subset people care about.
 * Amendments are separate form types (`10-K/A`), so they're listed explicitly.
 */
enum FormType {
  // Periodic & current reports (US issuers)
  K10 = '10-K',
  K10_A = '10-K/A',
  Q10 = '10-Q',
  Q10_A = '10-Q/A',
  K8 = '8-K',
  K8_A = '8-K/A',
  K11 = '11-K', // employee benefit plan annual report

  // Foreign private issuers (e.g. Spotify) file these instead of 10-K / 10-Q / 8-K
  F20 = '20-F',
  F20_A = '20-F/A',
  F40 = '40-F', // Canadian issuers
  K6 = '6-K',

  // Proxy & shareholder materials
  DEF14A = 'DEF 14A',
  DEFA14A = 'DEFA14A',
  ARS = 'ARS', // annual report to shareholders

  // Insider transactions
  FORM3 = '3',
  FORM4 = '4',
  FORM5 = '5',
  FORM144 = '144',

  // Beneficial ownership (>5%). EDGAR renamed "SC 13D/G" to "SCHEDULE 13D/G" in Dec 2024;
  // both appear in the data.
  SCHEDULE13D = 'SCHEDULE 13D',
  SCHEDULE13D_A = 'SCHEDULE 13D/A',
  SCHEDULE13G = 'SCHEDULE 13G',
  SCHEDULE13G_A = 'SCHEDULE 13G/A',
  SC13D = 'SC 13D',
  SC13D_A = 'SC 13D/A',
  SC13G = 'SC 13G',
  SC13G_A = 'SC 13G/A',

  // Institutional holdings
  F13_HR = '13F-HR',

  // Registration statements & prospectuses
  S1 = 'S-1',
  S3 = 'S-3',
  S8 = 'S-8',
  F1 = 'F-1',
  B424_2 = '424B2', // bulk of JPMorgan's filings (structured notes)
  FWP = 'FWP', // free writing prospectus
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const filingsQuerySchema = z.object({
  // Allow form types not defined in the enum
  forms: z.array(z.enum(FormType).or(z.string())),
  sort: z.enum(SortOrder),
});

export type FilingsQuery = z.infer<typeof filingsQuerySchema>;

export const filingSchema = z.object({
  accessionNumber: z.string(),
  filingDate: z.string(),
  reportDate: z.string(),
  acceptanceDateTime: z.string(),
  act: z.string(),
  form: z.enum(FormType).or(z.string()),
  fileNumber: z.string(),
  filmNumber: z.string(),
  items: z.string(),
  core_type: z.string(),
  size: z.int(),
  isXBRL: z.int(),
  isInlineXBRL: z.int(),
  // null on most older filings
  isXBRLNumeric: z.int().nullable(),
  primaryDocument: z.string(),
  primaryDocDescription: z.string(),
});

export type Filing = z.infer<typeof filingSchema>;
