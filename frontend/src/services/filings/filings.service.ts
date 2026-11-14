import { apiFetch } from '../../lib/api-client';
import { type Filing, filingsResponseSchema } from './filings.domain';

export async function fetchFilings(ticker: string): Promise<Filing[]> {
  const res = await apiFetch(
    `/companies/${encodeURIComponent(ticker)}/filings`,
    filingsResponseSchema,
  );
  return res.data;
}
