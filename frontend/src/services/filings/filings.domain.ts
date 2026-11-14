import { z } from 'zod';

/** Mirrors the backend's `filingSchema` (backend/src/sec.schema.ts). Missing strings are "". */
export const filingSchema = z.object({
  accessionNumber: z.string(),
  filingDate: z.string(),
  reportDate: z.string(),
  acceptanceDateTime: z.string(),
  act: z.string(),
  form: z.string(),
  fileNumber: z.string(),
  filmNumber: z.string(),
  items: z.string(),
  core_type: z.string(),
  size: z.int(),
  isXBRL: z.int(),
  isInlineXBRL: z.int(),
  isXBRLNumeric: z.int().nullable(),
  primaryDocument: z.string(),
  primaryDocDescription: z.string(),
});

/** GET /companies/:ticker/filings */
export const filingsResponseSchema = z.object({
  data: z.array(filingSchema),
});

export type Filing = z.infer<typeof filingSchema>;
