import { apiFetch } from '../../lib/api-client';
import { type FilingsPage, type FilingsQuery, filingsPageSchema } from './filings.domain';

export function fetchFilings(ticker: string, query: FilingsQuery): Promise<FilingsPage> {
  const params = new URLSearchParams({
    sort: query.sort,
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
  if (query.form.length > 0) params.set('form', query.form.join(','));

  return apiFetch(`/companies/${encodeURIComponent(ticker)}/filings?${params}`, filingsPageSchema);
}
