import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchFilings } from './filings.service';

export const filingsKeys = {
  all: ['filings'] as const,
  byTicker: (ticker: string) => [...filingsKeys.all, ticker.toUpperCase()] as const,
};

/** Exported so route loaders can prefetch with `queryClient.ensureQueryData(...)`. */
export const filingsQueryOptions = (ticker: string) =>
  queryOptions({
    queryKey: filingsKeys.byTicker(ticker),
    queryFn: () => fetchFilings(ticker),
    staleTime: 5 * 60 * 1000,
  });

export function useFilings(ticker: string) {
  return useQuery(filingsQueryOptions(ticker));
}
