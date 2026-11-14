import { apiFetch } from '../../lib/api-client';
import { type Summary, summarySchema } from './summary.domain';

export function fetchSummary(tickers: string[]): Promise<Summary> {
  const params = new URLSearchParams({ tickers: tickers.join(',') });
  return apiFetch(`/filings/summary?${params}`, summarySchema);
}
