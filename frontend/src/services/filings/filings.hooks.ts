import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import type { FilingsQuery } from './filings.domain';
import { fetchFilings } from './filings.service';

export const filingsKeys = {
  all: ['filings'] as const,
  list: (ticker: string, query: FilingsQuery) =>
    [...filingsKeys.all, ticker.toUpperCase(), query] as const,
};

/** Exported so route loaders can prefetch into the same cache entry. */
export const filingsQueryOptions = (ticker: string, query: FilingsQuery) =>
  queryOptions({
    queryKey: filingsKeys.list(ticker, query),
    queryFn: () => fetchFilings(ticker, query),
    staleTime: 5 * 60 * 1000,
    // Keep showing the current page while the next one loads, instead of flashing a spinner.
    placeholderData: keepPreviousData,
  });

export function useFilings(ticker: string, query: FilingsQuery) {
  return useQuery(filingsQueryOptions(ticker, query));
}
