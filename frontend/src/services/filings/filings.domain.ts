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
  /** Primary document on sec.gov */
  url: z.url(),
});

/** GET /companies/:ticker/filings */
export const filingsPageSchema = z.object({
  data: z.array(filingSchema),
  pagination: z.object({
    page: z.int(),
    pageSize: z.int(),
    totalItems: z.int(),
    totalPages: z.int(),
  }),
});

/**
 * Query params for GET /companies/:ticker/filings; mirrors the backend's `filingsQuerySchema`.
 * `.default()` keeps params optional when navigating; `.catch()` falls back on invalid values
 * (e.g. a hand-edited URL).
 */
export const filingsQuerySchema = z.object({
  /** Form types to include; empty = all. */
  form: z.array(z.string()).default([]).catch([]),
  sort: z.enum(['asc', 'desc']).default('desc').catch('desc'),
  page: z.int().min(1).default(1).catch(1),
  pageSize: z.int().min(1).max(100).default(25).catch(25),
});

/** Common forms offered in the filter; any other form can still be typed in. */
export const COMMON_FORMS = ['10-K', '10-Q', '8-K', '20-F', '6-K', 'DEF 14A', '4', 'S-1'];

export type Filing = z.infer<typeof filingSchema>;
export type FilingsPage = z.infer<typeof filingsPageSchema>;
export type FilingsQuery = z.infer<typeof filingsQuerySchema>;
