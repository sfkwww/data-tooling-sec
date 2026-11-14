import { z } from 'zod';

const sum = (numbers: number[]): number => numbers.reduce((a, b) => a + b, 0);

/** Mirrors the backend's `summarySchema` (backend/src/sec.schema.ts). GET /filings/summary */
export const summarySchema = z.object({
  data: z.array(
    z.object({
      ticker: z.string(),
      /** Filings per form type over the last 12 months. */
      formCounts: z.record(z.string(), z.int()),
      /** Latest 10-K, or 20-F / 40-F for foreign companies. */
      latestAnnualReport: z
        .object({ form: z.enum(['10-K', '20-F', '40-F']), filingDate: z.string() })
        .nullable(),
    }),
  ),
});

export type Summary = z.infer<typeof summarySchema>;
export type CompanySummary = Summary['data'][number];

/** Forms shown as their own column; everything else is grouped into "Other". */
export const MAIN_FORMS = ['10-K', '10-Q', '8-K', '20-F', '6-K', '4'] as const;

export interface SummaryRow {
  ticker: string;
  latestAnnualReport: CompanySummary['latestAnnualReport'];
  /** Count per main form (0 if none). */
  mainForms: Record<(typeof MAIN_FORMS)[number], number>;
  /** Everything not in MAIN_FORMS. */
  other: number;
  total: number;
}

export function toSummaryRow({
  ticker,
  formCounts,
  latestAnnualReport,
}: CompanySummary): SummaryRow {
  const mainForms = Object.fromEntries(
    MAIN_FORMS.map((form) => [form, formCounts[form] ?? 0]),
  ) as SummaryRow['mainForms'];
  const total = sum(Object.values(formCounts));

  return {
    ticker,
    latestAnnualReport,
    mainForms,
    other: total - sum(Object.values(mainForms)),
    total,
  };
}

/** Default companies to compare, from the assignment. */
export const DEFAULT_TICKERS = ['AAPL', 'SPOT', 'JPM'];
